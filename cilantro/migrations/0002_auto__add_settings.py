# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):

        # Adding model 'Settings'
        db.create_table('cilantro_settings', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('site', self.gf('django.db.models.fields.related.OneToOneField')(related_name='cilantro_settings', unique=True, to=orm['sites.Site'])),
            ('site_logo', self.gf('django.db.models.fields.files.ImageField')(max_length=100, null=True)),
            ('footer_content', self.gf('django.db.models.fields.TextField')(null=True)),
            ('google_analytics', self.gf('django.db.models.fields.CharField')(max_length=20, null=True)),
        ))
        db.send_create_signal('cilantro', ['Settings'])


    def backwards(self, orm):

        # Deleting model 'Settings'
        db.delete_table('cilantro_settings')


    models = {
        'cilantro.settings': {
            'Meta': {'object_name': 'Settings'},
            'footer_content': ('django.db.models.fields.TextField', [], {'null': 'True'}),
            'google_analytics': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'site': ('django.db.models.fields.related.OneToOneField', [], {'related_name': "'cilantro_settings'", 'unique': 'True', 'to': "orm['sites.Site']"}),
            'site_logo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True'})
        },
        'sites.site': {
            'Meta': {'ordering': "('domain',)", 'object_name': 'Site', 'db_table': "'django_site'"},
            'domain': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        }
    }

    complete_apps = ['cilantro']
