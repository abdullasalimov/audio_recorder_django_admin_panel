from django import forms
from django.utils.translation import gettext_lazy as _

from .models import MEDIA_TYPE
from .widgets.widgets import MediaFileInput

# Word Media Form
class WordMediaForm(forms.ModelForm):
    """ If field type is field then add recorder to """
    media_type = forms.ChoiceField(choices=MEDIA_TYPE)
    path_to_file = forms.FileField(
        widget=MediaFileInput)