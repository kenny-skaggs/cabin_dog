
from django.urls import path, include
from rest_framework import routers, serializers, viewsets

from expenses import models


# Expense
class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Expense
        fields = '__all__'


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = models.Expense.objects.all()
    serializer_class = ExpenseSerializer


# Person
class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Person
        fields = '__all__'


class PersonViewSet(viewsets.ModelViewSet):
    queryset = models.Person.objects.all()
    serializer_class = PersonSerializer


router = routers.DefaultRouter()
router.register(r'expenses', ExpenseViewSet)
router.register(r'person', PersonViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
