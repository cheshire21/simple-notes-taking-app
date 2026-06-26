from django.urls import path

from users.views import UserLogoutView, UserRegisterView

urlpatterns = [
    path("api/auth/register/", UserRegisterView.as_view(), name="user_register"),
    path("api/auth/logout/", UserLogoutView.as_view(), name="user_logout"),
]
