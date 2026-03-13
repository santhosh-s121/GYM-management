from rest_framework import serializers
from .models import Member, Trainer, Equipment, MemberAttendance

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'

class TrainerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = '__all__'

class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = '__all__'

class MemberAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberAttendance
        fields = '__all__'
