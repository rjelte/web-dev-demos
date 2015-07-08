# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rjelte', '0002_auto_20150524_0000'),
    ]

    operations = [
        migrations.AddField(
            model_name='quote',
            name='shortName',
            field=models.CharField(default='Quote', max_length=25),
            preserve_default=False,
        ),
    ]
