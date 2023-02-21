
from django.urls import path, include
from rest_framework import routers

from expenses import views


router = routers.DefaultRouter()
router.register(r'expenses', views.ExpenseViewSet)
router.register(r'person', views.PersonViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('user/', views.CurrentUserView.as_view())
]
