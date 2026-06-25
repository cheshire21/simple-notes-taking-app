# References for Users App Setup

## Similar Implementations

### core/settings/base.py

- **Location:** `backend/core/settings/base.py`
- **Relevance:** INSTALLED_APPS to extend, simplejwt already configured
- **Key patterns:** Add "users" and "rest_framework_simplejwt.token_blacklist" to existing list; set AUTH_USER_MODEL after

### core/urls.py

- **Location:** `backend/core/urls.py`
- **Relevance:** Token endpoints already wired (TokenObtainPairView, TokenRefreshView)
- **Key patterns:** No URL changes needed for this ticket
