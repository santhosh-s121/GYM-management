from django.db import models

class Member(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    plan = models.CharField(max_length=50, choices=[('Basic', 'Basic'), ('Gold', 'Gold'), ('Premium', 'Premium')])
    joined = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, default='Active', choices=[('Active', 'Active'), ('Inactive', 'Inactive')])
    age = models.IntegerField()
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')])
    fee = models.IntegerField(default=1200)
    paid = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Trainer(models.Model):
    name = models.CharField(max_length=100)
    specialty = models.CharField(max_length=100)
    experience = models.IntegerField()
    members = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    status = models.CharField(max_length=20, default='Active')
    salary = models.IntegerField()

    def __str__(self):
        return self.name

class Equipment(models.Model):
    name = models.CharField(max_length=100)
    count = models.IntegerField()
    condition = models.CharField(max_length=20, choices=[('Excellent', 'Excellent'), ('Good', 'Good'), ('Fair', 'Fair'), ('Poor', 'Poor')])
    lastService = models.DateField()
    nextService = models.DateField()

    def __str__(self):
        return self.name

from django.utils.timezone import now

class MemberAttendance(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    date = models.DateField(default=now)
    time = models.TimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=[('Present', 'Present'), ('Absent', 'Absent'), ('Late', 'Late')], default='Absent')

    class Meta:
        unique_together = ('member', 'date')

    def __str__(self):
        return f"{self.member.name} - {self.date} - {self.status}"
