# Dashboard Inventario

Aplicacion de inventario conectada a Google Sheets.

El proyecto incluye dos formas de publicacion:

- Streamlit para ejecutar Python localmente o en un servicio compatible.
- GitHub Pages con una pagina estatica que consulta Google Sheets directamente desde el navegador con actualizacion manual desde el boton `Actualizar`.

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

## Publicar en GitHub Pages

Este repositorio ya incluye `index.html`, `styles.css` y `script.js` para funcionar como pagina web estatica en GitHub Pages.

Pasos:

1. Abre el repositorio en GitHub.
2. Ve a `Settings` > `Pages`.
3. En `Build and deployment`, selecciona `Deploy from a branch`.
4. Elige la rama `main` y la carpeta `/root`.
5. Guarda los cambios.

GitHub publicara la pagina en una URL similar a:

```text
https://ricardoramos25.github.io/dashboard_inventario/
```

La pagina obtiene los datos desde Google Sheets y se actualiza cuando presionas el boton `Actualizar`, por lo que los cambios nuevos del sheet se reflejan sin volver a subir codigo.

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
- `index.html`: pagina principal para GitHub Pages
- `styles.css`: estilos de la pagina web estatica
- `script.js`: lectura del CSV de Google Sheets y actualizacion manual con boton
- `requirements.txt`: dependencias de Python
- `Dockerfile`: definicion de la imagen Docker
- `docker-compose.yml`: configuracion para levantar el contenedor con Docker Compose