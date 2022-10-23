from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.


class Word (models.Model):
    """
    Word models inherited from timestamped model
    """

    word = models.CharField(max_length=200, verbose_name=_("foreign"))
    description = models.CharField(
        max_length=200, verbose_name=_("native"), default="")


# Media Type
AUDIO = 'AUDIO'
VIDEO = 'VIDEO'
IMAGE = 'IMAGE'
MEDIA_TYPE = (
    (AUDIO, 'Audio'),
    (VIDEO, 'Video'),
    (IMAGE, 'Image'),
)


class WordMedia(models.Model):
    """
    Word media models
    """
    media_type = models.CharField(
        choices=MEDIA_TYPE, default=IMAGE, max_length=200)
    word = models.ForeignKey(
        Word, related_name="medias", on_delete=models.CASCADE)
    path_to_file = models.FileField(upload_to='word/', blank=True)

    def __str__(self):
        return str(self.media_type)