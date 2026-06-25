from django.urls import path

from users.views import UserRegisterView

urlpatterns = [
    path("api/auth/register/", UserRegisterView.as_view(), name="user_register"),
]
