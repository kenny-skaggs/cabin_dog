
from django.contrib.auth.models import User
from django.urls import path, include
from rest_framework import generics, permissions, response, routers, serializers, viewsets
from rest_framework.authtoken.models import Token
import uuid

from expenses import models


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Expense
        fields = '__all__'


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = models.Expense.objects.all()
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(pay_space__allowed_users__id=self.request.user.id)


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Person
        fields = '__all__'


class PersonViewSet(viewsets.ModelViewSet):
    queryset = models.Person.objects.all()
    serializer_class = PersonSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(pay_spaces__allowed_users__id=self.request.user.id)


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    
    def create(self, request):
        new_user = User.objects.create(username=uuid.uuid4())
        new_pay_space = models.PaySpace.objects.create()
        new_pay_space.allowed_users.add(new_user)
        new_pay_space.save()

        token = Token.objects.create(user=new_user)
        return response.Response(token.key)


router = routers.DefaultRouter()
router.register(r'expenses', ExpenseViewSet)
router.register(r'person', PersonViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register')
]
