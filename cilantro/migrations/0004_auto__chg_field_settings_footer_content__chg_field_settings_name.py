# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Changing field 'Settings.footer_content'
        db.alter_column('cilantro_settings', 'footer_content', self.gf('django.db.models.fields.TextField')(default=''))

        # Changing field 'Settings.name'
        db.alter_column('cilantro_settings', 'name', self.gf('django.db.models.fields.CharField')(default='', max_length=50))


    def backwards(self, orm):
        
        # Changing field 'Settings.footer_content'
        db.alter_column('cilantro_settings', 'footer_content', self.gf('django.db.models.fields.TextField')(null=True))

        # Changing field 'Settings.name'
        db.alter_column('cilantro_settings', 'name', self.gf('django.db.models.fields.CharField')(max_length=50, null=True))


    models = {
        'cilantro.settings': {
            'Meta': {'object_name': 'Settings'},
            'footer_content': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'google_analytics': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'cilantro_settings'", 'null': 'True', 'to': "orm['sites.Site']"}),
            'site_logo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'})
        },
        'sites.site': {
            'Meta': {'ordering': "('domain',)", 'object_name': 'Site', 'db_table': "'django_site'"},
            'domain': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        }
    }

    complete_apps = ['cilantro']
