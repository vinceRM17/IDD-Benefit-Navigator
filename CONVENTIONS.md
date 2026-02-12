# Coding Conventions

**Analysis Date:** 2026-02-11

## Naming Patterns

**Files:**
- `snake_case.py` for modules and scripts: `irs_bmf.py`, `http_client.py`, `base_extractor.py`
- Descriptive names indicating purpose: `propublica.py` (for ProPublica API), `normalizer.py` (for data normalization)
- Extractor files named `[source]_extractor.py`: `charity_nav.py`, `va_vso.py`, `va_facilities.py`
- Supporting modules grouped in directories: `extractors/`, `transformers/`, `loaders/`, `utils/`, `config/`

**Classes:**
- `PascalCase` for class names: `BaseExtractor`, `RateLimitedSession`, `WebEnricher`, `IrsBmfExtractor`
- Suffix `-Extractor` for data extraction classes inheriting from `BaseExtractor`
- Abstract base classes marked with `(ABC)`: `class BaseExtractor(ABC)`

**Functions:**
- `snake_case` for all functions: `normalize_ein()`, `format_currency()`, `setup_logging()`, `_apply_veteran_filter()`
- Prefix `_` for private/internal functions: `_merge_rows()`, `_tier1_exact_ein()`, `_keyword_match()`
- Stage functions named `stage[N]_[description]()`: `stage1_irs_bmf()`, `stage2_api_enrichment()`
- Filter/transformation functions descriptively named: `_apply_veteran_filter()`, `_smart_merge_on_ein()`

**Variables:**
- `snake_case` for all variables: `ein_list`, `has_ein`, `with_ein`, `min_interval`
- Boolean prefixes where applicable: `has_checkpoint`, `is_funder_name`, `dupes`, `exclude_mask`
- Constants in `UPPER_SNAKE_CASE`: `COLUMN_NAMES`, `VETERAN_KEYWORDS`, `EXCLUDE_PATTERNS`, `DEFAULT_TIMEOUT`
- Collection variables pluralized: `frames`, `indices`, `names`, `sources`

**Types:**
- Type hints using modern Python 3.9+ syntax with `from __future__ import annotations`
- Union types: `str | None` instead of `Optional[str]`
- Generic types: `list[str]`, `dict[str, pd.DataFrame]`
- Return type hints on all functions: `-> pd.DataFrame`, `-> str | None`, `-> bool`
- Parameter type hints consistently used

## Code Style

**Formatting:**
- No explicit formatter enforced (no `.prettierrc`, `black`, or `flake8` config files)
- PEP 8 style observed implicitly
- 4-space indentation (Python standard)
- Line length appears unconstrained (see `app.py` with ~300+ char lines for dataframe operations)
- Imports organized by stdlib, third-party, local: stdlib first, then `pandas`, `requests`, then internal imports
- Module docstrings at file start before any imports

**Linting:**
- No linting configuration detected (no `.pylintrc`, `setup.cfg`, or `pyproject.toml`)
- Code follows PEP 8 conventions informally
- Type hints present throughout as de facto quality control

## Import Organization

**Order:**
1. Docstring at top of file
2. `from __future__ import annotations` (when type hints needed)
3. Stdlib imports: `import logging`, `from pathlib import Path`, `from datetime import date`
4. Third-party imports: `import pandas as pd`, `import requests`, `from bs4 import BeautifulSoup`
5. Local imports: `from config.settings import ...`, `from utils.http_client import RateLimitedSession`

**Path Aliases:**
- Relative imports used from project root level: `from config.settings import ...`, `from extractors.base_extractor import BaseExtractor`
- `PROJECT_ROOT = Path(__file__).resolve().parent.parent` used for dynamic path resolution in `config/settings.py`
- Config module imports centralized in single line: `from config.settings import IRS_BMF_BASE_URL, IRS_BMF_FILES, RAW_DIR`

**Example from `extractors/irs_bmf.py`:**
```python
import logging
import re

import pandas as pd

from config.ntee_codes import EXCLUDE_PATTERNS, VETERAN_KEYWORDS
from config.settings import IRS_BMF_BASE_URL, IRS_BMF_FILES, RAW_DIR
from extractors.base_extractor import BaseExtractor
from utils.http_client import RateLimitedSession
```

## Error Handling

**Patterns:**
- Broad exception catching with specific exception types: `except (pickle.UnpicklingError, EOFError, OSError) as e`
- Exceptions logged with context before passing: `logger.exception(f"Pipeline failed: {e}")`
- Graceful fallback on missing data: `df["data_sources"].fillna("")` instead of raising
- Try-except for file operations and network calls primarily
- No explicit error raising observed; errors logged and execution continues or exits

**Example from `utils/checkpoint.py`:**
```python
try:
    with open(path, "rb") as f:
        data = pickle.load(f)
    logger.info(f"Checkpoint loaded: {name}")
    return data
except (pickle.UnpicklingError, EOFError, OSError) as e:
    logger.error(f"Failed to load checkpoint: {e}")
    return None
```

**Example from `main.py`:**
```python
try:
    # Pipeline execution
except KeyboardInterrupt:
    logger.warning("Pipeline interrupted by user. Progress has been checkpointed.")
    sys.exit(1)
except Exception as e:
    logger.exception(f"Pipeline failed: {e}")
    sys.exit(1)
```

## Logging

**Framework:** Built-in `logging` module with `logger = logging.getLogger(__name__)`

**Configuration:**
- Centralized setup in `main.py::setup_logging()`:
  - Format: `"%(asctime)s | %(name)-20s | %(levelname)-7s | %(message)s"`
  - Date format: `"%Y-%m-%d %H:%M:%S"`
  - Level set from `LOG_LEVEL` env var (default `"INFO"`)
  - Handlers: `StreamHandler` (stdout) + `FileHandler` (to `pipeline.log`)
- Each module creates logger: `logger = logging.getLogger(__name__)`
- Per-extractor loggers: `logging.getLogger(f"extractor.{self.name}")`

**Patterns:**
- Stage headers with separator lines: `logger.info("=" * 60)` and `logger.info("STAGE 1: IRS BMF Download + Filter")`
- Count logging throughout pipeline: `logger.info(f"Extracted {len(raw):,} raw records from {self.name}")`
- Progress indicators: `logger.info(f"After {name} merge: {len(result):,} records")`
- Warning for recoverable issues: `logger.warning("Pipeline interrupted by user.")`
- Error context: `logger.error(f"Failed to load checkpoint: {e}")`

**Example from `extractors/base_extractor.py`:**
```python
logger = logging.getLogger(__name__)

class BaseExtractor(ABC):
    def __init__(self):
        self.logger = logging.getLogger(f"extractor.{self.name}")

    def run(self, resume: bool = False) -> pd.DataFrame:
        self.logger.info(f"Starting extraction: {self.name}")
        # ... execution
        self.logger.info(f"Completed {self.name}: {len(df):,} records → {parquet_path}")
```

## Comments

**When to Comment:**
- Module docstrings describe purpose, not implementation details
- Complex business logic documented: `"""Three-tier deduplication: EIN exact → fuzzy name+city → URL domain."""`
- Algorithm choices explained: `"""Merge a group of duplicate rows, keeping the most complete fields."""`
- Tier descriptions in multi-step processes: `# Tier 1: NTEE W-prefix` followed by code
- Sparse use of inline comments; code clarity preferred
- `"""..."""` for docstrings; `#` for inline notes

**Docstring Pattern:**
- Function docstrings describe what function does, args, return type
- Example from `loaders/merger.py::merge_all()`:
```python
def merge_all(
    base: pd.DataFrame,
    ein_sources: dict[str, pd.DataFrame],
    non_ein_sources: dict[str, pd.DataFrame],
) -> pd.DataFrame:
    """Merge all sources into a single DataFrame.

    Args:
        base: IRS BMF base DataFrame (has EINs)
        ein_sources: Dict of source_name → DataFrame for EIN-joinable sources
        non_ein_sources: Dict of source_name → DataFrame for sources without EINs
    """
```

**JSDoc/TSDoc:** Not applicable (Python project, not JavaScript/TypeScript)

## Function Design

**Size:**
- Functions typically 20-50 lines
- Small helper functions (normalize_*) 10-20 lines
- Larger orchestration functions (stage functions) 10-20 lines that delegate to smaller functions
- No excessively long functions observed

**Parameters:**
- Type hints on all parameters
- 2-4 parameters typical; boolean flags rare
- Keyword-only arguments used in some cases: `rate_limit: float = 2.0, retries: int = DEFAULT_RETRIES`
- DataFrames always first parameter for transformation functions

**Return Values:**
- Single return value typical: `-> pd.DataFrame`, `-> str | None`, `-> bool`
- No tuple unpacking required for return values
- None return acceptable for optional operations
- Explicit None return for missing data: `return None` instead of `return df.empty`

## Module Design

**Exports:**
- No `__all__` exports defined
- All public functions exported automatically
- Private functions prefixed with `_` convention respected
- Base classes in separate modules: `base_extractor.py` contains only `BaseExtractor`

**Barrel Files:**
- `__init__.py` files present but empty or minimal in `extractors/`, `transformers/`, `loaders/`, `utils/`, `config/`
- No re-exports; each module imported directly by full path
- Example import: `from extractors.irs_bmf import IrsBmfExtractor` (not `from extractors import IrsBmfExtractor`)

**Module Organization:**
- Single responsibility per module
- Extraction modules group one data source: `irs_bmf.py`, `propublica.py`
- Transformation modules group related operations: `normalizer.py`, `enricher.py`
- Loading modules handle output stages: `deduplicator.py`, `merger.py`, `csv_writer.py`
- Utilities for cross-cutting concerns: `checkpoint.py`, `http_client.py`
- Config modules hold settings and schemas: `settings.py`, `schema.py`, `ntee_codes.py`

---

*Convention analysis: 2026-02-11*
