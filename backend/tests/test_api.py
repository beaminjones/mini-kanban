import pytest
from fastapi.testclient import TestClient


def test_create_and_list_boards(client: TestClient):
    response = client.post("/boards", json={"name": "Project Alpha"})
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Project Alpha"
    assert "id" in data

    response = client.get("/boards")
    assert response.status_code == 200
    boards = response.json()
    assert len(boards) >= 1
    assert any(b["name"] == "Project Alpha" for b in boards)


def test_get_board_with_columns_and_cards(client: TestClient):
    board_resp = client.post("/boards", json={"name": "My Board"})
    board_id = board_resp.json()["id"]

    col_resp = client.post(f"/boards/{board_id}/columns", json={"name": "To Do"})
    column_id = col_resp.json()["id"]

    card_resp = client.post(f"/columns/{column_id}/cards", json={"title": "Develop API"})
    assert card_resp.status_code == 200

    response = client.get(f"/boards/{board_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "My Board"
    assert len(data["columns"]) == 1
    assert data["columns"][0]["name"] == "To Do"
    assert len(data["columns"][0]["cards"]) == 1
    assert data["columns"][0]["cards"][0]["title"] == "Develop API"


def test_get_board_not_found(client: TestClient):
    response = client.get("/boards/non-existent-id")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_create_board_validation_empty_name(client: TestClient):
    response = client.post("/boards", json={"name": ""})
    assert response.status_code == 422


def test_create_card_validation_empty_title(client: TestClient):
    board_resp = client.post("/boards", json={"name": "Board"})
    col_resp = client.post(
        f"/boards/{board_resp.json()['id']}/columns",
        json={"name": "To Do"}
    )
    response = client.post(
        f"/columns/{col_resp.json()['id']}/cards",
        json={"title": ""}
    )
    assert response.status_code == 422


def test_create_column_invalid_board(client: TestClient):
    response = client.post(
        "/boards/invalid-uuid/columns",
        json={"name": "To Do"}
    )
    assert response.status_code == 404


def test_create_update_delete_card(client: TestClient):
    board_resp = client.post("/boards", json={"name": "Board"})
    board_id = board_resp.json()["id"]
    col_resp = client.post(f"/boards/{board_id}/columns", json={"name": "In Progress"})
    column_id = col_resp.json()["id"]

    create_resp = client.post(
        f"/columns/{column_id}/cards",
        json={"title": "Task 1", "description": "Desc"}
    )
    assert create_resp.status_code == 200
    card_id = create_resp.json()["id"]

    update_resp = client.put(
        f"/cards/{card_id}",
        json={"title": "Updated Task", "description": "New desc"}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "Updated Task"

    delete_resp = client.delete(f"/cards/{card_id}")
    assert delete_resp.status_code == 204

    get_resp = client.get(f"/boards/{board_id}")
    assert len(get_resp.json()["columns"][0]["cards"]) == 0


def test_move_card(client: TestClient):
    board_resp = client.post("/boards", json={"name": "Board"})
    board_id = board_resp.json()["id"]

    col1_resp = client.post(f"/boards/{board_id}/columns", json={"name": "To Do"})
    col2_resp = client.post(f"/boards/{board_id}/columns", json={"name": "Done"})
    col1_id = col1_resp.json()["id"]
    col2_id = col2_resp.json()["id"]

    card_resp = client.post(
        f"/columns/{col1_id}/cards",
        json={"title": "Move me"}
    )
    card_id = card_resp.json()["id"]

    move_resp = client.patch(
        f"/cards/{card_id}/move",
        json={"newColumnId": col2_id}
    )
    assert move_resp.status_code == 200
    assert move_resp.json()["column_id"] == col2_id

    board_resp = client.get(f"/boards/{board_id}")
    cols = {c["id"]: c for c in board_resp.json()["columns"]}
    assert len(cols[col1_id]["cards"]) == 0
    assert len(cols[col2_id]["cards"]) == 1


def test_move_card_accepts_new_column_id_snake_case(client: TestClient):
    board_resp = client.post("/boards", json={"name": "Board"})
    board_id = board_resp.json()["id"]
    col1_resp = client.post(f"/boards/{board_id}/columns", json={"name": "A"})
    col2_resp = client.post(f"/boards/{board_id}/columns", json={"name": "B"})
    col1_id = col1_resp.json()["id"]
    col2_id = col2_resp.json()["id"]
    card_resp = client.post(f"/columns/{col1_id}/cards", json={"title": "Card"})
    card_id = card_resp.json()["id"]

    response = client.patch(
        f"/cards/{card_id}/move",
        json={"new_column_id": col2_id}
    )
    assert response.status_code == 200
    assert response.json()["column_id"] == col2_id


def test_move_card_to_column_of_different_board(client: TestClient):
    board1_resp = client.post("/boards", json={"name": "Board 1"})
    board2_resp = client.post("/boards", json={"name": "Board 2"})
    board1_id = board1_resp.json()["id"]
    board2_id = board2_resp.json()["id"]

    col1_resp = client.post(f"/boards/{board1_id}/columns", json={"name": "To Do"})
    col2_resp = client.post(f"/boards/{board2_id}/columns", json={"name": "Done"})
    col1_id = col1_resp.json()["id"]
    col2_id = col2_resp.json()["id"]

    card_resp = client.post(
        f"/columns/{col1_id}/cards",
        json={"title": "Card in Board 1"}
    )
    card_id = card_resp.json()["id"]

    response = client.patch(
        f"/cards/{card_id}/move",
        json={"newColumnId": col2_id}
    )
    assert response.status_code == 404

    board_resp = client.get(f"/boards/{board1_id}")
    assert len(board_resp.json()["columns"][0]["cards"]) == 1


def test_create_card_invalid_column(client: TestClient):
    response = client.post(
        "/columns/non-existent-id/cards",
        json={"title": "Task"}
    )
    assert response.status_code == 404


def test_update_card_not_found(client: TestClient):
    response = client.put(
        "/cards/non-existent-id",
        json={"title": "Updated"}
    )
    assert response.status_code == 404


def test_move_card_invalid_column(client: TestClient):
    board_resp = client.post("/boards", json={"name": "Board"})
    board_id = board_resp.json()["id"]
    col_resp = client.post(f"/boards/{board_id}/columns", json={"name": "To Do"})
    column_id = col_resp.json()["id"]

    card_resp = client.post(
        f"/columns/{column_id}/cards",
        json={"title": "Card"}
    )
    card_id = card_resp.json()["id"]

    response = client.patch(
        f"/cards/{card_id}/move",
        json={"new_column_id": "non-existent-column"}
    )
    assert response.status_code == 404
