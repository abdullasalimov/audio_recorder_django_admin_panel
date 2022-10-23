from django.urls import reverse
from django.forms import CheckboxInput
from django.forms.widgets import FileInput
from django.utils.translation import gettext_lazy as _

FILE_INPUT_CONTRADICTION = object()


class MediaFileInput(FileInput):
    class Media:
        js = (
            '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js',
            'js/recorder.js',
        )

    clear_checkbox_label = _("Clear")
    initial_text = _("Currently")
    input_text = _("Upload a file")
    template_name = "widgets/media_file_input.html"

    def __init__(self, url=None, *args, **kwargs):
        self.url = url
        super(MediaFileInput, self).__init__(*args, **kwargs)

    def build_attrs(self, *args, **kwargs):
        """Build HTML attributes for the widget."""
        attrs = super(MediaFileInput, self).build_attrs(*args, **kwargs)
        if self.url is not None:
            attrs['data-url'] = reverse(self.url)
            attrs['data-django-audio-recorder'] = True

            print("Atters: ", attrs)

        return attrs

    def clear_checkbox_name(self, name):
        """
        Given the name of the file input, return the name of the clear checkbox
        input.
        """
        return name + "-clear"

    def clear_checkbox_id(self, name):
        """
        Given the name of the clear checkbox input, return the HTML id for it.
        """
        return name + "_id"

    def start_record_button_id(self, name):
        """
        Given the name of the recrod button, return the HTML id for it
        """
        return name + "_record_start"

    def stop_record_button_id(self, name):
        """
        Given the name of the recrod button, return the HTML id for it
        """
        return name + "_record_stop"

    def status_record_button_id(self, name):
        """
        Given the name of the recrod button, return the HTML id for it
        """
        return name + "_record_status"

    def is_initial(self, value):
        """
        Return whether value is considered to be initial value.
        """
        return bool(value and getattr(value, "url", False))

    def format_value(self, value):
        """
        Return the file object if it has a defined url attribute.
        """
        if self.is_initial(value):
            return value

    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        checkbox_name = self.clear_checkbox_name(name)
        checkbox_id = self.clear_checkbox_id(checkbox_name)
        record_button_id = self.start_record_button_id(name)
        stop_record_button_id = self.stop_record_button_id(name)
        status_record_button_id = self.status_record_button_id(name)

        context["widget"].update(
            {
                "checkbox_name": checkbox_name,
                "checkbox_id": checkbox_id,
                "start_record_button_id": record_button_id,
                "stop_record_button_id": stop_record_button_id,
                "status_record_button_id": status_record_button_id,
                "is_initial": self.is_initial(value),
                "input_text": self.input_text,
                "initial_text": self.initial_text,
                "clear_checkbox_label": self.clear_checkbox_label,
            }
        )
        return context

    def value_from_datadict(self, data, files, name):
        upload = super().value_from_datadict(data, files, name)
        if not self.is_required and CheckboxInput().value_from_datadict(
            data, files, self.clear_checkbox_name(name)
        ):

            if upload:
                # If the user contradicts themselves (uploads a new file AND
                # checks the "clear" checkbox), we return a unique marker
                # object that FileField will turn into a ValidationError.
                return FILE_INPUT_CONTRADICTION
            # False signals to clear any existing value, as opposed to just None
            return False
        return upload

    def value_omitted_from_data(self, data, files, name):
        return (
            super().value_omitted_from_data(data, files, name)
            and self.clear_checkbox_name(name) not in data
        )
