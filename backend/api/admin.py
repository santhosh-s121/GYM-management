from django.contrib import admin
from .models import Member, Trainer, Equipment, MemberAttendance

class MemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'plan', 'joined', 'status', 'paid')
    search_fields = ('name', 'email', 'phone')
    list_filter = ('plan', 'status', 'paid')

class TrainerAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialty', 'experience', 'members', 'status')
    search_fields = ('name', 'specialty')
    list_filter = ('status',)

class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'count', 'condition', 'lastService', 'nextService')
    search_fields = ('name',)
    list_filter = ('condition',)

class MemberAttendanceAdmin(admin.ModelAdmin):
    list_display = ('member', 'date', 'status', 'time')
    list_filter = ('date', 'status')

admin.site.register(Member, MemberAdmin)
admin.site.register(Trainer, TrainerAdmin)
admin.site.register(Equipment, EquipmentAdmin)
admin.site.register(MemberAttendance, MemberAttendanceAdmin)
