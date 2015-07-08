from django.http import HttpResponse
from django.shortcuts import render
from django.template import RequestContext, loader

from .models import Quote


# Create your views here.
def home(request):
    quote = Quote.objects.order_by('?').first()
    context = {
        'quote': quote,
        }
    return render(request, 'rjelte/home.html', context)


def experiment(request, slug):
    context = {
        'exp': id,
        }
    return render(request, 'rjelte/experiment.html', context)
