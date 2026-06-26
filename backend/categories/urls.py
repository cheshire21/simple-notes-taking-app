from django.urls import path

from categories.views import CategoryListCreateView

urlpatterns = [
    path("api/categories/", CategoryListCreateView.as_view(), name="category_list_create"),
]
