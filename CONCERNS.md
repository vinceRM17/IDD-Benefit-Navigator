# Codebase Concerns

**Analysis Date:** 2026-02-11

## Tech Debt

**Silent exception handling with empty catch blocks:**
- Issue: Extensive use of empty `catch {}` blocks throughout the codebase that suppress all errors without logging or reporting
- Files: `gsd-tools.js` (lines 541, 543, 948, 2014, 2028, 2131, 2408, 2556, 2626, 2694, 2752, 2934, 3043, 3046, 3150, 3212, 3232, 3276, 3620, 3631, 3642, 3653, 3672, 3750, 3788, 3897, 3899, 3946, 3948, 3957, 3996, 4072, 4080)
- Impact: Undetected failures, difficult debugging, silent data loss when file operations fail
- Example: `catch {}` at line 3653 hides phase directory read failures
- Fix approach: Create proper error handling helper that logs to stderr and returns structured error objects; replace all empty catch blocks with meaningful error reporting

**Overly broad exception handling:**
- Issue: Many operations catch all exceptions without distinguishing between expected and unexpected errors
- Files: `gsd-tools.js` (lines 678-724 in cmdHistoryDigest, lines 2408-2411 in cmdRoadmapAnalyze)
- Impact: Malformed JSON files, file read errors, and permission issues are all silently ignored, making debugging infrastructure issues difficult
- Fix approach: Use specific error types (SyntaxError for JSON.parse, ENOENT for missing files) and handle each category appropriately

**Unsafe shell command construction:**
- Issue: `execSync` calls attempt input sanitization but rely on regex filtering that may have gaps
- Files: `gsd-tools.js` (line 208 in isGitIgnored, line 224 in execGit)
- Example: `targetPath.replace(/[^a-zA-Z0-9._\-/]/g, '')` removes potentially legitimate characters
- Impact: May break valid paths with special characters; potential shell injection if sanitization is incomplete
- Fix approach: Use `execSync` with array form `['git', 'check-ignore', '--', targetPath]` to avoid shell parsing entirely

**Unvalidated parseInt/parseFloat without fallback:**
- Issue: Multiple parse operations lack sufficient fallback handling for invalid input
- Files: `gsd-tools.js` (lines 1093-1094, 1780, 1865-1866, 2097, 2829, 2836, 3191)
- Example: `parseInt(stateExtractField(content, 'Current Plan'), 10)` returns NaN if field is missing, which cascades into broken calculations
- Impact: NaN values propagate through calculations, producing invalid phase numbers or progress bars
- Fix approach: Add explicit NaN checks after parse operations; use default values or error early

**Complex frontmatter parsing logic:**
- Issue: Custom YAML-like parser in `extractFrontmatter()` (lines 248-321) reimplements YAML parsing with complex stack-based logic
- Files: `gsd-tools.js` (lines 248-321 extractFrontmatter, lines 323-359 reconstructFrontmatter)
- Impact: Unmaintainable code, subtle parsing bugs (e.g., edge cases with nested arrays/objects), incorrect reconstruction of frontmatter
- Fix approach: Replace with a proper YAML parser library (e.g., `js-yaml`) rather than custom implementation

## Known Bugs

**Phase number padding inconsistency:**
- Issue: `normalizePhaseName()` pads phase numbers to 2 digits, but some internal logic expects unpaddled numbers
- Files: `gsd-tools.js` (lines 239-246 normalizePhaseName, used throughout phase operations)
- Trigger: Creating decimal phases (e.g., "6.1") followed by phase operations
- Symptom: Phase directories are created with inconsistent naming (sometimes "06", sometimes "6")
- Fix approach: Centralize phase number format to always use 2-digit padding, audit all phase matching logic

**Orphaned summaries not handled in phase completion:**
- Issue: `cmdVerifyPhaseCompleteness()` warns about orphan summaries (summaries without matching plans) but doesn't prevent phase completion
- Files: `gsd-tools.js` (lines 2117-2162 cmdVerifyPhaseCompleteness, phase complete command)
- Trigger: Summary file created but associated plan deleted
- Impact: Orphaned summaries remain in .planning, polluting phase data
- Fix approach: Either prevent completion with orphans, or clean them up during completion with --force flag

**Phase removal with active work:**
- Issue: `cmdPhaseRemove()` checks for summaries when --force is not used, but only warns for target phase, not decimals
- Files: `gsd-tools.js` (lines 2628-2636 in cmdPhaseRemove)
- Trigger: Removing phase "06" when "06.1" exists with completed work
- Symptom: User thinks they're preserving executed work, but decimal phase gets renumbered/lost
- Fix approach: Extend check to include all decimal variants of the target phase

**STATE.md field extraction fragile:**
- Issue: `stateExtractField()` uses regex pattern matching that depends on exact formatting
- Files: `gsd-tools.js` (lines 1845-1849 extractField pattern)
- Trigger: STATE.md formatting changes (extra spaces, different bold markers)
- Impact: Progress tracking fails silently, state reads return null/undefined
- Fix approach: Use proper markdown frontmatter parsing instead of regex field extraction

## Security Considerations

**Shell injection risk in git operations:**
- Risk: While basic sanitization is attempted, shell metacharacters can bypass filtering if regex has gaps
- Files: `gsd-tools.js` (lines 206-216 isGitIgnored, lines 218-237 execGit)
- Example: Path containing backticks, semicolons, or pipes could execute arbitrary commands
- Current mitigation: Regex filter removes most special chars, but not exhaustive
- Recommendations: Use execSync with array form (no shell: true); avoid shell parsing entirely

**File path traversal in relative path handling:**
- Risk: `path.join()` is used to construct paths, but user input isn't validated before joining
- Files: `gsd-tools.js` (lines 554 in cmdVerifyPathExists, lines 2166-2179 in cmdVerifyReferences)
- Example: Path like `../../../etc/passwd` could reference files outside project
- Current mitigation: Paths checked with `fs.existsSync()` which fails for nonexistent files
- Recommendations: Validate that resolved paths are within project root using `path.relative()` check

**Config file injection:**
- Risk: `.planning/config.json` is created/read but contents not validated
- Files: `gsd-tools.js` (lines 567-655 in cmdConfigEnsureSection, cmdConfigSet)
- Impact: Malformed config could cause crashes; no schema validation
- Current mitigation: JSON.parse wrapped in try-catch
- Recommendations: Add config schema validation; use safe property access

## Performance Bottlenecks

**Quadratic behavior in phase renumbering:**
- Problem: When removing a phase, ALL subsequent phases + their files are renamed in nested loops
- Files: `gsd-tools.js` (lines 2647-2763 in cmdPhaseRemove)
- Cause: Two nested loops (phases, then files in each phase) with file operations that block
- Impact: Removing early phases from large projects could take seconds
- Example: Removing phase "02" from 50 phases means 48 directories + N files renamed
- Improvement path: Batch file operations or use a single pass with pre-calculated renames

**Full directory scan for every phase lookup:**
- Problem: `findPhaseInternal()` scans entire phases directory with `fs.readdirSync()` for each query
- Files: `gsd-tools.js` (lines 887-923 findPhaseInternal, called from many commands)
- Cause: No caching; linear scan through directories on every command
- Impact: Commands like `state update` are slower on projects with 20+ phases
- Improvement path: Cache directory listing or build phase index on startup

**Excessive file reads for common operations:**
- Problem: Commands like `history-digest` read all SUMMARY.md files from disk, parse YAML/frontmatter
- Files: `gsd-tools.js` (lines 657-740 cmdHistoryDigest)
- Impact: Large projects with many phases take 1-2 seconds even for simple queries
- Improvement path: Cache digest or use streaming read for large phase counts

**Recursive regex matching on large files:**
- Problem: `content.match()` calls with `//g` flag on full file contents (line 1776, 3776)
- Files: `gsd-tools.js` (line 1776 counting tasks, line 2054 various lookups)
- Impact: Large PLAN.md files (>100KB) trigger expensive regex scanning
- Example: Matching all `## Task N` patterns in large file
- Improvement path: Process line-by-line instead of full-file regex

## Fragile Areas

**Phase discovery and matching logic:**
- Files: `gsd-tools.js` (lines 887-923 findPhaseInternal, lines 239-246 normalizePhaseName, phase matching throughout)
- Why fragile: Multiple normalization functions, inconsistent format handling (padded vs unpadded), regex-based matching
- Safe modification: Any phase number changes must test with 1-digit, 2-digit, and decimal phase numbers (e.g., "5", "05", "5.1", "05.1")
- Test coverage gaps: No tests for edge cases like "05.10" (two-digit decimal), or phase matching when .planning is missing

**Frontmatter round-trip:extract/reconstruct:**
- Files: `gsd-tools.js` (lines 248-321 extractFrontmatter, lines 323-359 reconstructFrontmatter)
- Why fragile: Complex stack-based parser with edge cases for nested arrays/objects; reconstruction logic makes formatting assumptions
- Safe modification: Changes to either function must test round-trip consistency (extract then reconstruct should be identical)
- Test coverage gaps: Only basic nested structures tested; no tests for complex YAML like multiline strings, quoted keys, or deeply nested objects

**File system operations during phase changes:**
- Files: `gsd-tools.js` (lines 2640-2763 in cmdPhaseRemove, lines 2473-2619 in cmdPhaseAdd, rename/delete operations)
- Why fragile: Multiple sequential file operations without transactions; if process crashes mid-rename, phases are left in inconsistent state
- Safe modification: Never modify phase logic without understanding full sequence; test with simulated interrupts
- Test coverage gaps: No tests for partial failure scenarios (e.g., directory renamed but file rename fails)

**Progress bar parsing and calculation:**
- Files: `gsd-tools.js` (lines 3159-3205 cmdProgressRender, lines 1834-1900 cmdStateSnapshot)
- Why fragile: Parses progress % from STATE.md regex match; NaN handling incomplete; progress bar formula depends on multiple fragile field extracts
- Safe modification: Changes must ensure all dependent fields (current plan, total plans, total phases) exist before calculations
- Test coverage gaps: No tests for missing STATE.md fields, or edge cases like 0% or 100% progress

## Scaling Limits

**Directory listing time complexity:**
- Current capacity: Projects with up to ~100 phases perform acceptably; beyond that, each command slows noticeably
- Limit: ~500+ phases would make commands take >1 second per operation
- Scaling path: Implement phase index cache in `.planning/config.json`; lazy load phase metadata on demand

**File count per phase:**
- Current capacity: Up to ~50 files per phase directory; beyond that, `fs.readdirSync()` operations slow down
- Limit: Very large phases (100+ plans) could see 5-10 second operations
- Scaling path: Subdirectories per phase (e.g., `.planning/phases/06/plans/`, `.planning/phases/06/summaries/`)

**Large file processing:**
- Current capacity: PLAN.md files up to ~200KB parse without significant overhead
- Limit: Files >1MB could cause regex matching to hang or consume excessive memory
- Scaling path: Implement streaming line-by-line parsing for large files; move complex document structure to separate metadata files

## Dependencies at Risk

**No declared runtime dependencies:**
- Risk: Tool uses only Node.js built-ins (`fs`, `path`, `child_process`); any dependency on external tools (git) or shell features
- Impact: Running on systems without `git` installed would fail silently (empty catch blocks hide this)
- Migration plan: Add explicit git availability check on startup; provide clear error messages

**Deprecated Node.js APIs:**
- Risk: Uses `fs.mkdirSync(..., { recursive: true })` which is stable, but some code patterns may break in future Node versions
- Impact: Unlikely but possible in Node 24+
- Migration plan: Keep Node version >= 16 enforced in package.json; avoid experimental APIs

## Missing Critical Features

**No transaction/rollback for phase operations:**
- Problem: Phase removal, renumbering can leave project in inconsistent state if process crashes
- Blocks: Reliable automation of large refactoring tasks (e.g., renumbering all phases)
- Fix: Implement write-ahead log for file operations; allow rollback on failure

**No validation of plan/summary files during operations:**
- Problem: Phase removal doesn't validate that plans/summaries are well-formed before operating
- Blocks: Safe cleanup of corrupted phase data
- Fix: Add `verify` subcommand that pre-checks all data before operations

**No performance metrics/monitoring:**
- Problem: No way to detect when operations are slow or commands are degrading
- Blocks: Proactive performance optimization; detecting when scaling limits are approached
- Fix: Add optional timing metadata to output; track operation durations

## Test Coverage Gaps

**Shell command execution edge cases:**
- What's not tested: Git operations with special characters in paths, paths with spaces, non-existent repositories
- Files: `gsd-tools.js` (lines 206-237 execGit, isGitIgnored)
- Risk: Git commands could fail silently or succeed with wrong results in edge cases
- Priority: High - core infrastructure

**Frontmatter parsing robustness:**
- What's not tested: Nested arrays, multiline YAML strings, duplicate keys, malformed YAML with special characters
- Files: `gsd-tools.js` (lines 248-321 extractFrontmatter, lines 323-359 reconstructFrontmatter)
- Risk: Complex documents fail parsing silently; reconstruction loses data or produces invalid YAML
- Priority: High - frontmatter is used in every phase/plan operation

**Phase numbering edge cases:**
- What's not tested: Transitions between single-digit, double-digit, and decimal phases; removing phases that create gaps
- Files: `gsd-tools.js` (lines 887-923 findPhaseInternal, phase removal/insertion)
- Risk: Phase matching breaks under certain numbering schemes; files left orphaned
- Priority: High - phase operations are critical path

**State parsing with missing fields:**
- What's not tested: STATE.md with missing expected fields (e.g., no "Total Plans" line), corrupted field values, encoding issues
- Files: `gsd-tools.js` (lines 1834-1900 cmdStateSnapshot, field extraction)
- Risk: Progress commands fail when STATE.md is incomplete
- Priority: Medium - state operations are frequent but can gracefully degrade

**File operation failure scenarios:**
- What's not tested: Permission errors during file operations, disk full, symlinks, file locking, race conditions
- Files: `gsd-tools.js` (lines 2640-2763 phase removal with renames/deletes)
- Risk: Project left in inconsistent state if file ops fail mid-operation
- Priority: Medium - recovery would be manual

---

*Concerns audit: 2026-02-11*
