from django.contrib import admin

# Register your models here.
from .models import Quote, Experiment


admin.site.register(Quote)
admin.site.register(Experiment)
