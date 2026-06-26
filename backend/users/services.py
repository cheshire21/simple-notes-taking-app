from rest_framework_simplejwt.tokens import RefreshToken

from users.models import User


def user_register(*, email: str, password: str) -> User:
    user = User(email=email)
    user.set_password(password)  # PBKDF2-SHA256 — raw password never stored
    user.full_clean()  # validates email format + uniqueness
    user.save()
    return user


def user_logout(*, refresh_token: str) -> None:
    token = RefreshToken(refresh_token)
    token.blacklist()
