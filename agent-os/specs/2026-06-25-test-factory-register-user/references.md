# References for Test & Factory: Register User

## UserFactory

- **Location:** `backend/users/tests/factories.py`
- **Relevance:** Base factory — reused by all future test files via `SubFactory(UserFactory)`

## Test files

- **Location:** `backend/users/tests/test_services.py`, `backend/users/tests/test_views.py`
- **Relevance:** Pattern to follow for all future service and view tests in this project

## SIM-28 implementation

- **Location:** `backend/users/services.py`, `backend/users/views.py`, `backend/users/serializers.py`
- **Relevance:** The code under test — service raises `ValidationError` on bad input, view returns `{ access, refresh }` on 201
