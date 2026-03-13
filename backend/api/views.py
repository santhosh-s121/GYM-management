from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Member, Trainer, Equipment, MemberAttendance
from .serializers import MemberSerializer, TrainerSerializer, EquipmentSerializer, MemberAttendanceSerializer

class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all().order_by('-joined')
    serializer_class = MemberSerializer

class TrainerViewSet(viewsets.ModelViewSet):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer

class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer

class MemberAttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = MemberAttendanceSerializer

    def get_queryset(self):
        queryset = MemberAttendance.objects.all().order_by('-date')
        date = self.request.query_params.get('date', None)
        if date is not None:
            queryset = queryset.filter(date=date)
        return queryset

    @action(detail=False, methods=['post'])
    def bulk_save(self, request):
        records = request.data.get('records', [])
        date_str = request.data.get('date')
        if not date_str or not records:
             return Response({'status': 'error', 'message': 'Missing records or date'}, status=400)
             
        for record in records:
            member_id = record.get('member')
            status = record.get('status', 'Absent')
            MemberAttendance.objects.update_or_create(
                member_id=member_id, date=date_str,
                defaults={'status': status}
            )
        return Response({'status': 'success'})
