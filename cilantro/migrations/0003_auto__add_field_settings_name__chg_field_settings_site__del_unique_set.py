# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Removing unique constraint on 'Settings', fields ['site']
        db.delete_unique('cilantro_settings', ['site_id'])

        # Adding field 'Settings.name'
        db.add_column('cilantro_settings', 'name', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True), keep_default=False)

        # Changing field 'Settings.site'
        db.alter_column('cilantro_settings', 'site_id', self.gf('django.db.models.fields.related.ForeignKey')(null=True, to=orm['sites.Site']))


    def backwards(self, orm):
        
        # Deleting field 'Settings.name'
        db.delete_column('cilantro_settings', 'name')

        # User chose to not deal with backwards NULL issues for 'Settings.site'
        raise RuntimeError("Cannot reverse this migration. 'Settings.site' and its values cannot be restored.")

        # Adding unique constraint on 'Settings', fields ['site']
        db.create_unique('cilantro_settings', ['site_id'])


    models = {
        'cilantro.settings': {
            'Meta': {'object_name': 'Settings'},
            'footer_content': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'google_analytics': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
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
