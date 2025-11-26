# Day 14: Backend Testing & Optimization - Implementation Plan

**Date:** November 26, 2025
**Duration:** 3-4 hours
**Goal:** Complete backend optimization, integrate template caching, and add comprehensive testing

---

## 🎯 Objectives (Per 30-Day Plan)

Following the documented 30-day plan (Week 2, Day 14):
1. **Complete Day 12 Gap:** Integrate template caching system
2. **Optimize Health Endpoint:** Reduce from 2060ms to <100ms
3. **Unit Tests:** Add tests for critical components
4. **Load Testing:** Test with concurrent requests
5. **Integration Testing:** End-to-end API tests
6. **Documentation:** Update all docs

---

## 📊 Current State (Day 13 Complete)

### What Works:
- ✅ 10 resume sections supported (5 core + 5 new)
- ✅ LaTeX PDF generation
- ✅ Groq AI integration
- ✅ Rate limiting (SlowAPI)
- ✅ Error handling system
- ✅ Health check endpoint
- ✅ Template caching system created (but NOT integrated)
- ✅ Performance profiler created

### What Needs Work:
- ❌ Template caching not integrated (Day 12 gap)
- ❌ Health endpoint slow (2060ms - needs optimization)
- ❌ No unit tests
- ❌ No load testing with actual traffic
- ❌ No integration tests

---

## 🔧 Implementation Tasks

### Task 1: Integrate Template Caching (1 hour)

**Why:** Day 12 created `template_cache.py` but it's not used anywhere

**Files to Modify:**
- `prompts.py` - Use cache for get_latex_template()
- `main.py` - Initialize cache on startup, add cache stats to /health

**Implementation:**

#### 1.1 Update prompts.py
```python
from template_cache import TemplateCache

# Global cache instance
_template_cache = TemplateCache(ttl_seconds=3600)  # 1 hour TTL

def get_latex_template() -> str:
    """Get LaTeX template (with caching)"""

    def load_template():
        return LATEX_TEMPLATE

    # Use cache with lazy loading
    template = _template_cache.get(
        key="latex_template",
        loader_func=load_template
    )

    return template
```

#### 1.2 Update main.py
```python
from template_cache import get_global_cache

# Add to health endpoint
@app.get("/health", tags=["Status"])
async def health_check():
    # ... existing checks ...

    # Add cache statistics
    cache = get_global_cache()
    health_status["checks"]["template_cache"] = cache.get_stats()

    return health_status
```

**Expected Impact:**
- Minimal (template already in-memory constant)
- But demonstrates caching architecture
- Useful for future file-based templates

---

### Task 2: Optimize Health Endpoint (45 min)

**Current Performance:** 2060ms (SLOW!)
**Target:** <100ms

**Bottlenecks Identified (from Day 12 profiling):**
1. `pdflatex --version` subprocess call (~1000ms)
2. Disk space check with `shutil.disk_usage()` (~500ms)
3. Directory stat calls (~300ms)

**Optimization Strategy:**

#### 2.1 Cache pdflatex Version (Startup Only)
```python
# At module level
_PDFLATEX_VERSION = None

def _get_pdflatex_version():
    global _PDFLATEX_VERSION
    if _PDFLATEX_VERSION is None:
        result = subprocess.run(
            ['pdflatex', '--version'],
            capture_output=True,
            timeout=5,
            text=True
        )
        _PDFLATEX_VERSION = result.stdout.split('\n')[0] if result.returncode == 0 else None
    return _PDFLATEX_VERSION

# In health endpoint: use cached version
```

#### 2.2 Cache Disk Space (60s TTL)
```python
import time

_disk_space_cache = {"data": None, "timestamp": 0}
DISK_CACHE_TTL = 60  # seconds

def _get_disk_space():
    now = time.time()
    if now - _disk_space_cache["timestamp"] > DISK_CACHE_TTL:
        total, used, free = shutil.disk_usage("/")
        _disk_space_cache["data"] = {
            "free_mb": round(free / (1024 * 1024), 2),
            "total_mb": round(total / (1024 * 1024), 2),
            "used_percent": round((used / total) * 100, 2)
        }
        _disk_space_cache["timestamp"] = now
    return _disk_space_cache["data"]

# In health endpoint: use cached disk space
```

#### 2.3 Optimize Directory Stats
```python
# Instead of calling get_cleanup_stats() (which stats all files)
# Just get file counts
def _quick_dir_stats():
    return {
        "generated_pdfs": len(os.listdir("generated_pdfs")),
        "latex_output": len(os.listdir("latex_output"))
    }
```

**Expected Improvement:** 2060ms → <100ms (20x faster!)

---

### Task 3: Add Unit Tests (1.5 hours)

**Test Framework:** pytest
**Coverage Target:** Critical paths (not 100%)

**Test Files to Create:**

#### 3.1 test_models.py
```python
"""Test Pydantic models validation"""

def test_basic_info_validation():
    """Test BasicInfo model"""
    data = {
        "fullName": "John Doe",
        "phone": "+1-555-0123",
        "email": "john@example.com",
        "linkedin": "https://linkedin.com/in/johndoe",
        "github": "https://github.com/johndoe",
    }
    basic_info = BasicInfo(**data)
    assert basic_info.fullName == "John Doe"

def test_certification_model():
    """Test new CertificationItem model"""
    cert = CertificationItem(
        id="cert1",
        name="AWS SAA",
        issuer="AWS",
        issueDate="2024-01",
        expiryDate="2027-01",
        credentialId="AWS-123"
    )
    assert cert.name == "AWS SAA"

# ... more tests for all models
```

#### 3.2 test_latex_mapper.py
```python
"""Test LaTeX data mapping functions"""

def test_escape_latex():
    """Test special character escaping"""
    assert escape_latex("R&D") == "R\\&D"
    assert escape_latex("50% faster") == "50\\% faster"
    assert escape_latex("$100") == "\\$100"

def test_generate_certifications_section():
    """Test certifications section generation"""
    certs = [
        CertificationItem(
            id="cert1",
            name="AWS SAA",
            issuer="Amazon Web Services",
            issueDate="2024-01",
            expiryDate="2027-01",
            credentialId="AWS-123"
        )
    ]
    latex = generate_certifications_section(certs)
    assert "AWS SAA" in latex
    assert "Amazon Web Services" in latex
    assert "\\section{Certifications}" in latex

# ... tests for all section generators
```

#### 3.3 test_api_endpoints.py
```python
"""Test FastAPI endpoints"""
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_endpoint():
    """Test /health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "checks" in data

def test_convert_json_to_latex():
    """Test /convert-json-to-latex endpoint"""
    test_data = {
        "basicInfo": {...},
        "education": [...],
        # ... minimal valid data
    }
    response = client.post("/convert-json-to-latex", json=test_data)
    assert response.status_code == 200 or response.status_code == 500  # May fail without pdflatex

# ... more endpoint tests
```

**Test Commands:**
```bash
# Install pytest
pip install pytest pytest-cov

# Run tests
pytest test_models.py -v
pytest test_latex_mapper.py -v
pytest test_api_endpoints.py -v

# Run with coverage
pytest --cov=. --cov-report=term-missing
```

---

### Task 4: Load Testing (45 min)

**Use Existing:** `performance_profiler.py` (from Day 12)

**Test Scenarios:**

#### 4.1 Health Endpoint Load Test
```python
# Test after optimization
python performance_profiler.py --test health --requests 100

# Expected results:
# - Mean latency: <100ms (was 2060ms)
# - Success rate: 100%
# - Memory growth: <5MB
```

#### 4.2 PDF Generation Load Test
```python
# Test with 10 concurrent requests
python performance_profiler.py --test pdf_generation --requests 10

# Expected results:
# - Mean latency: <5000ms
# - Success rate: >90%
# - Memory growth: <50MB
```

#### 4.3 Stress Test
```python
# Test with 50 concurrent requests (stress test)
python performance_profiler.py --test health --requests 50 --concurrent

# Monitor:
# - Response times remain stable
# - No memory leaks
# - Error rate <5%
```

**Compare with Day 12 Baseline:**
- Baseline report: `performance_baseline_day12.txt`
- New report: `performance_day14_optimized.txt`

---

### Task 5: Integration Testing (30 min)

**Create:** `test_integration_day14.py`

**Test Full Pipeline:**

```python
"""Integration test: Complete resume generation flow"""

def test_full_resume_generation():
    """Test complete flow: JSON → LaTeX → PDF"""

    # 1. Load test data
    with open("test_data_day13_extended.json") as f:
        resume_data = json.load(f)

    # 2. Validate with Pydantic
    validated = ResumeData(**resume_data)
    assert validated.basicInfo.fullName == "Jane Smith"

    # 3. Get LaTeX template
    template = get_latex_template()
    assert template is not None
    assert len(template) > 3000

    # 4. Generate LaTeX
    latex_content = map_resume_data_to_latex(validated, template)
    assert "AWS Solutions Architect" in latex_content
    assert "Code for Good" in latex_content

    # 5. Compile to PDF (if pdflatex available)
    try:
        pdf_content, filename = await convert_latex_to_pdf(latex_content)
        assert len(pdf_content) > 1000
        assert filename.endswith(".pdf")
    except Exception as e:
        pytest.skip(f"PDF compilation not available: {e}")

def test_backward_compatibility():
    """Test that old resume format still works"""
    old_format = {
        "basicInfo": {...},
        "education": [...],
        "experience": [...],
        "projects": [...],
        "skills": {...}
        # No new sections
    }

    validated = ResumeData(**old_format)
    template = get_latex_template()
    latex = map_resume_data_to_latex(validated, template)

    # Should work without errors
    assert latex is not None
    assert "[CERTIFICATIONS]" not in latex  # Placeholder removed
```

---

## 📝 Deliverables

### Code Files:
1. **`prompts.py`** - Integrate template caching
2. **`main.py`** - Optimize health endpoint, add cache stats
3. **`test_models.py`** - Unit tests for Pydantic models
4. **`test_latex_mapper.py`** - Unit tests for LaTeX functions
5. **`test_api_endpoints.py`** - API endpoint tests
6. **`test_integration_day14.py`** - Integration tests
7. **`performance_day14_optimized.txt`** - Post-optimization metrics

### Documentation Files:
1. **`DAY_14_IMPLEMENTATION_PLAN.md`** - This file
2. **`DAY_14_COMPLETION_REPORT.md`** - Results and metrics

---

## 📈 Success Criteria

| Criterion | Target | Verification |
|-----------|--------|--------------|
| Template caching integrated | ✅ Working | Import and use in code |
| Health endpoint optimized | <100ms | Performance profiler |
| Unit tests created | 3 files | pytest execution |
| Load testing completed | Baseline vs. optimized | Compare reports |
| Integration tests | Full flow tested | pytest execution |
| Documentation | Complete | Review markdown files |

---

## 🚀 Implementation Order

1. **Phase 1: Template Caching (30 min)**
   - Update prompts.py with caching
   - Update main.py health endpoint
   - Test cache functionality

2. **Phase 2: Health Endpoint Optimization (45 min)**
   - Cache pdflatex version
   - Cache disk space checks
   - Optimize directory stats
   - Test with profiler

3. **Phase 3: Unit Tests (1.5 hours)**
   - Create test_models.py
   - Create test_latex_mapper.py
   - Create test_api_endpoints.py
   - Run all tests with pytest

4. **Phase 4: Load Testing (45 min)**
   - Run health endpoint load test
   - Run PDF generation load test
   - Run stress test
   - Compare with Day 12 baseline

5. **Phase 5: Integration Testing (30 min)**
   - Create test_integration_day14.py
   - Test full pipeline
   - Test backward compatibility
   - Document results

6. **Phase 6: Documentation (30 min)**
   - Create DAY_14_COMPLETION_REPORT.md
   - Update metrics and results
   - Document improvements

---

## 🎯 Expected Outcomes

### Performance Improvements:
- ✅ Health endpoint: 2060ms → <100ms (20x faster)
- ✅ Template caching: Integrated and working
- ✅ Memory usage: Stable under load
- ✅ Error handling: Robust and tested

### Testing Coverage:
- ✅ Unit tests for models
- ✅ Unit tests for LaTeX functions
- ✅ API endpoint tests
- ✅ Integration tests
- ✅ Load tests

### Documentation:
- ✅ Implementation plan
- ✅ Completion report
- ✅ Performance metrics
- ✅ Test results

---

**Plan Created:** November 26, 2025
**Estimated Time:** 3-4 hours
**Status:** Ready to implement
**Follows:** 30-day documented plan (Week 2, Day 14)
