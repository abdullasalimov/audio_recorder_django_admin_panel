from django.contrib import admin
from polls.forms import WordMediaForm

from polls.models import Word, WordMedia

# Register your models here.


class WordMediaAcquaintanceInline(admin.options.InlineModelAdmin):
    '''show word models as inline in Level'''
    model = WordMedia
    extra = 0
    form = WordMediaForm
    template = "admin/edit_inline/tabular.html"


class WordAdmin(admin.ModelAdmin):
    """Word model admin"""
    list_display = ['id', 'word', 'description']
    inlines = [WordMediaAcquaintanceInline]

    class Meta:
        """Set model"""
        model = Word


admin.site.register(Word, WordAdmin)