# Standards for Logout User

The following standards apply to this work.

---

## backend/services-selectors

All write operations live in services. All read operations live in selectors. Views contain zero logic.

**Naming:** `noun_verb` — `user_logout`, `note_create`, `note_update`

**Services:** Plain functions, keyword-only args (`*`), return model instance (or None for side-effect-only operations).

**Views (thin):** authenticate → deserialize → call service → serialize → respond. No ORM queries. No business logic.

---

## backend/serializers-views

**Serializer split:** Never reuse serializers for reading and writing.
- Input: `serializers.Serializer` — validation only
- Output: `serializers.ModelSerializer` — responses only (not needed for 204)

**Views:** Always `APIView`. Always declare `permission_classes` explicitly on every view.

**Status codes (use constants, never raw integers):**
- `HTTP_204_NO_CONTENT` — DELETE or action with no response body
- `HTTP_400_BAD_REQUEST` — validation error
- `HTTP_401_UNAUTHORIZED` — unauthenticated

---

## backend/testing

**Structure:** One test class per view. Method names read as sentences.

**4 required categories:**
1. Auth — unauthenticated → 401
2. Ownership — wrong user → 404 (not applicable for logout)
3. Validation — missing/invalid fields → 400
4. Happy path — correct input → expected status

**Tools:** `APITestCase` + `force_authenticate` (not tokens). Factories over fixtures. Never mock the ORM.

**Getting a real refresh token in tests:**
```python
from rest_framework_simplejwt.tokens import RefreshToken
refresh = RefreshToken.for_user(user)
refresh_token = str(refresh)
```
