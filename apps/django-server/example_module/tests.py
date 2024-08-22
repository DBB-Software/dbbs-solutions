from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from .models import Example
from .serializers import ExampleSerializer


class ExampleViewTests(TestCase):
    def setUp(self):
        self.example = Example.objects.create(name='Test Example')
        self.client = APIClient()

    def test_get_example_success(self):
        url = reverse('example_module:example-detail', kwargs={'item_id': self.example.id})
        response = self.client.get(url)
        serializer = ExampleSerializer(self.example)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), serializer.data)

    def test_get_example_not_found(self):
        url = reverse('example_module:example-detail', kwargs={'item_id': 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
