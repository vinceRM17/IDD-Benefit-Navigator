# Testing Patterns

**Analysis Date:** 2026-02-11

## Test Framework

**Status:** No automated test framework configured

**Finding:** The codebase contains **zero test files** (`*test*.py`, `conftest.py`, `*.spec.py`) despite being a data pipeline with extractors, transformers, and loaders. No test configuration exists (`pytest.ini`, `setup.cfg`, `tox.ini`).

**Code Path:** Exploration of `/Users/vincecain/Projects/vet_org_directory` found:
- 30+ Python modules across extractors, transformers, loaders, utils
- Zero `test_*.py` or `*_test.py` files
- No `tests/` directory
- No pytest or unittest imports in any module

**Dependencies:** Testing libraries not listed in `requirements-pipeline.txt` or `requirements.txt`

## Testing Gap Analysis

**What Should Be Tested:**

1. **Extractors** (`extractors/*.py`):
   - `IrsBmfExtractor`: Filter logic for NTEE W-prefix, 501(c)(19), keyword matching
   - `PropublicaExtractor`: API response parsing, EIN enrichment, checkpoint resumption
   - `CharityNavExtractor`: GraphQL query construction, rating extraction
   - `VaVsoExtractor`: Web scraping robustness, VA accreditation parsing
   - `NrdExtractor`: Sitemap parsing, organization extraction
   - Base extractor pattern: checkpoint save/load, resume functionality

2. **Transformers** (`transformers/*.py`):
   - `Normalizer`: EIN formatting (XX-XXXXXXX), phone normalization, URL cleanup, state abbreviations, ZIP code validation
   - `WebEnricher`: Regex pattern matching for social media URLs, email extraction, domain parsing

3. **Loaders** (`loaders/*.py`):
   - `Deduplicator`: Three-tier dedup (EIN exact, fuzzy name+city, URL domain)
   - `Merger`: Multi-source merge with priority rules, field coalescing
   - `CsvWriter`: CSV writing, confidence scoring, summary reporting

4. **Utils** (`utils/*.py`):
   - `RateLimitedSession`: Rate limiting enforcement, disk cache operations, retry logic
   - `Checkpoint`: Save/load pickle files, resume detection

5. **Config** (`config/*.py`):
   - `Schema`: DataFrame coercion to schema, revenue bucketing
   - `Settings`: Path creation, env var loading

## Manual Testing Evidence

**Integration Testing via Pipeline:**
The codebase implements a **checkpoint-based manual testing approach**:

**Pipeline Stages** (`main.py::8 stages`):
```python
def stage1_irs_bmf(resume: bool = False):
    """Stage 1: Download and filter IRS BMF data."""
    extractor = IrsBmfExtractor()
    return extractor.run(resume=resume)
```

Each stage can be run independently:
```bash
python main.py                    # Full pipeline
python main.py --resume           # Resume from last checkpoint
python main.py --skip-enrichment  # Skip Stage 7
python main.py --stages 1,2,5     # Run only specific stages
```

**Checkpoint-Based Validation:**
- Each extractor automatically saves intermediate parquet files to `data/intermediate/[source].parquet`
- Pickle-based checkpoints enable resumption: `load_checkpoint()`, `save_checkpoint()`
- `CHECKPOINT_INTERVAL = 500` for long-running API calls
- Manual inspection of output CSV: `data/output/veteran_org_directory.csv` (80,784 orgs)

**Known Issues Logged During Execution:**
From `CLAUDE.md` documented gaps:
- "Contact info is sparse": 83 phones, 0 emails, 1 website
- "NODC extractor": GitHub CSV URLs have changed; needs URL updates
- "Charity Navigator": Requires free API key (not configured)
- "VA Facilities": Requires free API key (not configured)

These would be discovered during live pipeline runs, not unit tests.

## Where to Add Tests

**Recommended Test Structure:**

```
tests/
├── test_extractors/
│   ├── test_irs_bmf.py           # Filter logic, NTEE matching
│   ├── test_propublica.py        # API mocking, response parsing
│   ├── test_base_extractor.py    # Checkpoint save/load pattern
│   └── test_*.py                 # Other extractors
├── test_transformers/
│   ├── test_normalizer.py        # EIN, phone, URL, state normalization
│   └── test_enricher.py          # Social media pattern matching
├── test_loaders/
│   ├── test_deduplicator.py      # 3-tier dedup logic
│   ├── test_merger.py            # Source merge priority rules
│   └── test_csv_writer.py        # Output generation
├── test_utils/
│   ├── test_http_client.py       # Rate limiting, caching
│   └── test_checkpoint.py        # Save/load/resume
├── test_config/
│   ├── test_schema.py            # Schema coercion, validation
│   └── test_settings.py          # Path creation, env vars
├── fixtures/
│   ├── sample_irs_bmf.csv        # Test data files
│   └── sample_api_responses.json # Mock API responses
└── conftest.py                   # Shared pytest configuration
```

**Test Framework Recommendation:** `pytest` + `pytest-cov`

```bash
pip install pytest pytest-cov pytest-mock
pytest tests/ --cov=. --cov-report=html
```

## Testing Patterns to Implement

### Unit Tests for Normalizers

**File:** `tests/test_transformers/test_normalizer.py`

```python
import pytest
from transformers.normalizer import (
    normalize_ein, normalize_phone, normalize_url,
    normalize_state, normalize_zip
)

class TestNormalizeEin:
    def test_valid_ein(self):
        assert normalize_ein("123456789") == "12-3456789"
        assert normalize_ein("12-3456789") == "12-3456789"

    def test_invalid_ein(self):
        assert normalize_ein("123") is None
        assert normalize_ein("") is None
        assert normalize_ein(None) is None

    def test_ein_with_special_chars(self):
        assert normalize_ein("12-3456789") == "12-3456789"
        assert normalize_ein("12 3456789") == "12-3456789"

class TestNormalizePhone:
    def test_valid_us_phone(self):
        assert normalize_phone("2025551234") == "(202) 555-1234"
        assert normalize_phone("1-202-555-1234") == "(202) 555-1234"

    def test_invalid_phone(self):
        assert normalize_phone("123") is None
        assert normalize_phone(None) is None

class TestNormalizeUrl:
    def test_url_with_scheme(self):
        assert normalize_url("https://example.com") == "https://example.com"

    def test_url_without_scheme(self):
        assert normalize_url("example.com") == "https://example.com"

    def test_url_with_trailing_slash(self):
        result = normalize_url("https://example.com/")
        assert not result.endswith("/")

class TestNormalizeState:
    def test_two_letter_state(self):
        assert normalize_state("CA") == "CA"
        assert normalize_state("ca") == "CA"

    def test_full_state_name(self):
        assert normalize_state("California") == "CA"
        assert normalize_state("NEW YORK") == "NY"

    def test_invalid_state(self):
        assert normalize_state("ZZ") is None
```

### Unit Tests for Deduplicator

**File:** `tests/test_loaders/test_deduplicator.py`

```python
import pytest
import pandas as pd
from loaders.deduplicator import deduplicate, _tier1_exact_ein

class TestDeduplication:
    @pytest.fixture
    def sample_df(self):
        return pd.DataFrame({
            "ein": ["12-3456789", "12-3456789", "98-7654321", None],
            "org_name": ["Org A", "Org A", "Org B", "Org C"],
            "city": ["Austin", "Austin", "Dallas", "Houston"],
            "state": ["TX", "TX", "TX", "TX"],
            "data_sources": ["irs_bmf", "propublica", "irs_bmf", "irs_bmf"],
        })

    def test_tier1_exact_ein_dedup(self, sample_df):
        result = _tier1_exact_ein(sample_df)
        # Should merge the two 12-3456789 rows
        assert len(result) == 3
        assert result[result["ein"] == "12-3456789"].shape[0] == 1

    def test_full_dedup_maintains_data(self, sample_df):
        result = deduplicate(sample_df)
        # Should not lose complete records
        assert result["ein"].notna().sum() >= 2
```

### Integration Test for Pipeline Stages

**File:** `tests/test_pipeline_stages.py`

```python
import pytest
import tempfile
from pathlib import Path
from main import stage1_irs_bmf, stage8_output
from config.schema import empty_dataframe

class TestPipelineStages:
    def test_stage1_returns_dataframe(self):
        """Stage 1 should return a DataFrame with extracted orgs."""
        result = stage1_irs_bmf()
        assert isinstance(result, pd.DataFrame)
        assert len(result) > 0
        assert "ein" in result.columns
        assert "org_name" in result.columns

    def test_stage1_filters_veteran_orgs(self):
        """Stage 1 should filter to veteran orgs only."""
        result = stage1_irs_bmf()
        # Check that filtering was applied (count < full IRS BMF)
        # (Full IRS BMF has ~2M orgs; veteran subset should be 80K+)
        assert 50000 < len(result) < 200000

    def test_stage8_output_creates_csv(self, tmp_path):
        """Stage 8 should create a valid CSV file."""
        with tempfile.TemporaryDirectory() as tmpdir:
            df = empty_dataframe()
            # Mock with sample data
            csv_path = stage8_output(df)
            assert csv_path.exists()
            assert csv_path.suffix == ".csv"
```

### Mocking External APIs

**File:** `tests/test_extractors/test_propublica.py`

```python
import pytest
from unittest.mock import Mock, patch, MagicMock
from extractors.propublica import PropublicaExtractor
import pandas as pd

class TestPropublicaExtractor:
    @patch('utils.http_client.RateLimitedSession.get')
    def test_extract_parses_api_response(self, mock_get):
        """Test that ProPublica responses are parsed correctly."""
        # Mock API response
        mock_response = Mock()
        mock_response.json.return_value = {
            "organization": {
                "ein": "123456789",
                "name": "Test Org",
                "revenue": 1000000,
            }
        }
        mock_get.return_value = mock_response

        extractor = PropublicaExtractor(ein_list=["123456789"])
        result = extractor.extract()

        assert isinstance(result, pd.DataFrame)
        assert "ein" in result.columns
        assert result["ein"].iloc[0] == "123456789"

    def test_extractor_checkpoint_resume(self):
        """Test that extractor can resume from checkpoint."""
        extractor = PropublicaExtractor(ein_list=["12-3456789"])
        # First run saves checkpoint
        result1 = extractor.run(resume=False)
        # Second run should load from checkpoint
        result2 = extractor.run(resume=True)
        assert result1.equals(result2)
```

### Fixtures for Shared Test Data

**File:** `tests/conftest.py`

```python
import pytest
import pandas as pd
from config.schema import empty_dataframe

@pytest.fixture
def sample_org_data():
    """Sample organization data for tests."""
    return pd.DataFrame({
        "ein": ["45-4138378", "12-3456789"],
        "org_name": ["Active Heroes", "Test Org"],
        "city": ["Shepherdsville", "Austin"],
        "state": ["KY", "TX"],
        "total_revenue": [100000.0, 500000.0],
        "org_type": ["501(c)(3)", "501(c)(19)"],
        "ntee_code": ["P20", "W30"],
    })

@pytest.fixture
def empty_org_dataframe():
    """Empty DataFrame matching schema."""
    return empty_dataframe()

@pytest.fixture
def api_response_samples():
    """Sample API responses for mocking."""
    return {
        "propublica": {
            "organization": {
                "ein": "123456789",
                "name": "Sample Org",
                "tax_payer_name": "Sample Organization Inc",
            }
        },
        "charity_navigator": {
            "data": {
                "rating": 4.0,
                "score": 90,
            }
        }
    }
```

## Coverage Gaps

**High Priority (Core Logic):**
- Extractor filter logic (IRS NTEE, 501(c)(19), keywords) — currently verified only by live pipeline output
- Deduplication three-tier logic — no unit test for fuzzy match threshold (85.0)
- Merger priority rules — no test for field coalescing strategy

**Medium Priority (Data Integrity):**
- Normalizer edge cases (special characters, encoding, null handling)
- Schema coercion to required types (numeric, date fields)
- Checkpoint save/load integrity (pickle format preservation)

**Low Priority (Infrastructure):**
- Rate limiting timing enforcement
- Disk cache hit/miss behavior
- Logging output format

## Recommended Next Steps

1. **Create test structure:** Set up `tests/` directory with conftest.py
2. **Start with normalizers:** Write unit tests for `normalize_*.py` functions (lowest risk, highest coverage)
3. **Mock external APIs:** Use `pytest-mock` to avoid real API calls during testing
4. **Add integration tests:** Test stages individually with sample data, not live pipeline
5. **Set coverage target:** Aim for 70%+ coverage on core logic modules (extractors, transformers, loaders)
6. **CI/CD integration:** Add test run to GitHub Actions (if using GitHub repo)

---

*Testing analysis: 2026-02-11*
