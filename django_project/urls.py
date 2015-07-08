from django.conf.urls import include, url
from django.contrib import admin

admin.site.site_header = 'Today I Learned'
admin.site.index_title = 'Welcome back, Richard'
admin.autodiscover()

urlpatterns = [
    url(r'^', include('rjelte.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
