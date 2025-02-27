from uuid import uuid4


def test_get_example_success(client):
    """
    Check the test endpoint successfully.

    :param client: client for application.
    """
    id = uuid4()
    response = client.get(f"/api/v1/examples/{id}")
    response_body = response.get_json()

    assert response.status_code == 200, "Status code is 200"
    assert response_body["id"] == str(id), "ID is presented in response body"


def test_get_example_incorrect_id(client):
    """
    Check the test endpoint incorrect id.

    :param client: client for application.
    """
    id = 123
    response = client.get(f"/api/v1/examples/{id}")

    assert response.status_code == 422, "Invalid UUID format"
    assert response.json["error"] == "Invalid UUID format."
