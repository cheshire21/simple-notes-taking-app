# Plan: SIM-41 — Test & Factory: List Categories

## Scope
Create `test_selectors.py` for `category_list`. View GET tests already exist in `test_views.py`.

## Files
| File | Action |
|------|--------|
| `backend/categories/tests/test_selectors.py` | New |

## Done criteria
- `ruff check . --exclude .venv` passes
- Selector test uses CategoryFactory + UserFactory
- Auth boundary test in test_views.py (401)
- Ownership test in both test_selectors.py and test_views.py
- Tests use APITestCase + force_authenticate (view) / TestCase (selector)
