from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MemberViewSet, TrainerViewSet, EquipmentViewSet, MemberAttendanceViewSet

router = DefaultRouter()
router.register(r'members', MemberViewSet)
router.register(r'trainers', TrainerViewSet)
router.register(r'equipment', EquipmentViewSet)
router.register(r'attendance', MemberAttendanceViewSet, basename='attendance')

urlpatterns = [
    path('', include(router.urls)),
]
