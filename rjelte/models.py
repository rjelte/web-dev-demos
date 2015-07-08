from django.db import models
from django.template.defaultfilters import slugify


# Create your models here.
class Quote(models.Model):
    shortName = models.CharField(max_length=25)
    text = models.CharField(max_length=512)

    def __unicode__(self):
        return self.shortName


class Experiment(models.Model):
    name = models.CharField(max_length=256)
    slug = models.SlugField()

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Experiment, self).save(*args, **kwargs)

    def __unicode__(self):
        return self.name
