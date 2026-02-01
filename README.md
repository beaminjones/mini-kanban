# Mini-Kanban

Aplicação web para gerenciamento de tarefas no estilo Kanban.

## Stack

- **Back-end:** Python, FastAPI, SQLAlchemy, PostgreSQL
- **Front-end:** React (Vite)
- **Banco de dados:** PostgreSQL

## Estrutura do Projeto

```
test-kanban/
├── backend/          # API REST FastAPI
│   ├── app/
│   │   ├── api/      # Rotas (controllers)
│   │   ├── models/   # Modelos SQLAlchemy
│   │   ├── repositories/
│   │   ├── schemas/  # Pydantic
│   │   └── services/ # Lógica de negócio
│   ├── tests/
│   └── requirements.txt
├── frontend/         # SPA React
└── README.md
```

## Pré-requisitos

- Python 3.11+
- Node.js 18+
- PostgreSQL
- npm ou yarn

## Configuração

### 1. Banco de dados PostgreSQL

Crie um banco de dados:

```bash
createdb kanban_db
```

### 2. Variáveis de ambiente (Back-end)

Copie o arquivo de exemplo e ajuste a URL do banco:

```bash
cd backend
cp .env.example .env
```

Edite `.env`:

```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/kanban_db
```

### 3. Instalar dependências e rodar o Back-end

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python scripts/init_db.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

A API ficará disponível em `http://localhost:8000`. Documentação Swagger: `http://localhost:8000/docs`.

### 4. Instalar dependências e rodar o Front-end

```bash
cd frontend
npm install
npm run dev
```

O frontend ficará em `http://localhost:5173` e usará o proxy para a API em `http://localhost:8000`.

### 5. Rodar os testes do Back-end

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
pytest
```

Os testes usam SQLite em memória (não precisam de PostgreSQL).

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/boards` | Cria quadro |
| GET | `/boards` | Lista quadros |
| GET | `/boards/{id}` | Retorna quadro com colunas e cartões |
| POST | `/boards/{id}/columns` | Cria coluna no quadro |
| POST | `/columns/{id}/cards` | Cria cartão na coluna |
| PUT | `/cards/{id}` | Atualiza cartão |
| DELETE | `/cards/{id}` | Exclui cartão |
| PATCH | `/cards/{id}/move` | Move cartão para outra coluna |

## Funcionalidades

- Criar e listar quadros
- Criar colunas em um quadro
- Criar, editar e excluir cartões (menu ⋮ em cada cartão)
- **Drag-and-drop** para mover cartões entre colunas
- Validação de domínio: cartão só pode ser movido para coluna do mesmo quadro
