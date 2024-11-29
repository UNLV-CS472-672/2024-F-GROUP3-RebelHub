from django.apps import AppConfig


class PicturesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Pictures'

    def ready(self):
        import Pictures.signals
