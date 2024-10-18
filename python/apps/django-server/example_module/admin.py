from django.contrib import admin

from .models import Example


# Register your models here.
class ExampleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    list_display_links = ('id', 'name')
    search_fields = ('id', 'name')
    list_filter = ('name',)

    class Meta:
        model = Example


admin.site.register(Example, ExampleAdmin)
