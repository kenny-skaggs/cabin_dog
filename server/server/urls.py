
from django.urls import path, include
from rest_framework import routers

from expenses import views


router = routers.DefaultRouter()
router.register(r'expenses', views.ExpenseViewSet)
router.register(r'person', views.PersonViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('add/person/', views.AddPersonView.as_view()),
    path('add/device/', views.AddDeviceView.as_view()),
    path('user/', views.CurrentUserView.as_view()),
    path('calculation/', views.CalculationView.as_view()),
    path('payment/', views.PaymentView.as_view())
]
