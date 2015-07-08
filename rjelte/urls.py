from django.conf.urls import url, include
from rest_framework import routers, serializers, viewsets

from . import views
from models import Quote


class QuoteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Quote
        fields = ('text','shortName')


class QuoteViewSet(viewsets.ModelViewSet):
    # queryset = Quote.objects.order_by('?').first()
    serializer_class = QuoteSerializer

    def get_queryset(self):
        return Quote.objects.all()
        # return Quote.objects.order_by('?').first()


router = routers.DefaultRouter()
router.register(r'quotes', QuoteViewSet, 'quote')

urlpatterns = [
    url(r'^api/', include(router.urls)),
    url(r'^$', views.home, name='home'),
    url(r'^experiment/(?P<slug>[a-zA-Z0-9_\-]+)/$', views.experiment,
        name='experiment'),
]
