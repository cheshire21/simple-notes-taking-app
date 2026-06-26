# References for List Notes BE

## category_list selector
- **Location:** `backend/categories/selectors.py`
- **Relevance:** Exact pattern to mirror for note_list
- **Key patterns:** filter by user, return QuerySet

## CategoryListCreateView GET
- **Location:** `backend/categories/views.py`
- **Relevance:** GET handler pattern
- **Key patterns:** call selector, serialize many=True, return Response

## Selector tests
- **Location:** `backend/categories/tests/test_selectors.py`
- **Relevance:** Test structure for selector isolation tests
