from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views import View

from dbbs_django_logger.logger import logger

from .models import Example
from .serializers import ExampleSerializer


class ExampleView(View):
    """
    View for managing example resources.
    """

    def get(self, _request, item_id):
        """
        Retrieves an example by its ID.
        :param _request: The HTTP request object.
        :param item_id: The ID of the example to retrieve.
        :return: JsonResponse with the example data.
        """

        logger.info("ExampleView GET request")

        example = get_object_or_404(Example, id=item_id)
        serializer = ExampleSerializer(example)
        return JsonResponse(serializer.data, safe=False)
