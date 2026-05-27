# Dashboard Inventario

Aplicacion en Streamlit para visualizar el inventario publicado desde Google Sheets.

## Requisitos

- Python 3.11 o superior
- Docker Desktop opcional para ejecutar en contenedor

## Ejecucion local

1. Crear un entorno virtual si lo necesitas.
2. Instalar dependencias:

```bash
pip install -r requirements.txt
```

3. Iniciar la aplicacion:

```bash
streamlit run app.py
```

La aplicacion queda disponible en `http://localhost:8501`.

## Ejecucion con Docker

Construir la imagen:

```bash
docker build -t dashboard_inventario .
```

Ejecutar el contenedor:

```bash
docker run --rm -p 8501:8501 dashboard_inventario
```

## Ejecucion con Docker Compose

Levantar la aplicacion:

```bash
docker compose up --build
```

Detenerla:

```bash
docker compose down
```

## Estructura

- `app.py`: aplicacion principal de Streamlit
- `requirements.txt`: dependencias de Python
- `Dockerfile`: definicion de la imagen Docker
- `docker-compose.yml`: configuracion para levantar el contenedor con Docker Compose