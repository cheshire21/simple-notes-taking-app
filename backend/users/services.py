from users.models import User


def user_register(*, email: str, password: str) -> User:
    user = User(email=email)
    user.set_password(password)  # PBKDF2-SHA256 — raw password never stored
    user.full_clean()  # validates email format + uniqueness
    user.save()
    return user
