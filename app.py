import streamlit as st
import pandas as pd
import altair as alt

# Configuración visual
st.set_page_config(page_title="Dashboard Inventario", layout="wide")

# TU ENLACE CSV (Asegúrate de que sea el de Google Sheets con output=csv)
LINK_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRNCLNcBTHNKdxw6By1K5yNsyKIDMOno9SJboRJA3cV4liB02ZK38TeC5p5FfYYOjjblFUNgMdQX3zH/pub?gid=864297796&single=true&output=csv"

def cargar_inventario():
    # skip rows=7 para saltar las filas vacías de arriba
    # usecols=[0,1,2,3,4] para tomar solo Código, Artículos, Entradas, Salidas y Stock
    df = pd.read_csv(LINK_CSV, skiprows=7, usecols=[0,1,2,3,4])
    
    # Limpiamos nombres de columnas (por si traen espacios)
    df.columns = ['CODIGO', 'ARTICULOS', 'ENTRADAS', 'SALIDAS', 'STOCK']
    
    # Quitamos filas que no tengan código (filas vacías al final)
    df = df.dropna(subset=['CODIGO'])
    
    # Convertimos Stock a número
    df['STOCK'] = pd.to_numeric(df['STOCK'], errors='coerce').fillna(0)
    return df

# --- DISEÑO DEL DASHBOARD ---
st.title("📊 Control de Inventario")
st.button("Actualizar")
st.caption("Actualizacion manual desde Google Sheets")
st.markdown("---")

try:
    datos = cargar_inventario()

    # 1. Títulos Estáticos (Métricas)
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Total Productos", len(datos))
    with col2:
        total_stock = int(datos['STOCK'].sum())
        st.metric("Total Unidades en Stock", total_stock)
    with col3:
        st.metric("Estado del Sistema", "Conectado a Google Sheets ✅")

    st.markdown("---")

    # 2. Visualización
    col_tabla, col_grafico = st.columns([1, 1])

    with col_tabla:
        st.subheader("📋 Detalle de Inventario")
        # Mostramos la tabla limpia (sin las columnas extra que no querías)
        st.dataframe(datos, use_container_width=True, hide_index=True)

    with col_grafico:
        st.subheader("📈 Gráfico de Stock")
        top_stock = (
            datos[['ARTICULOS', 'STOCK']]
            .sort_values('STOCK', ascending=False)
            .head(8)
        )

        chart = (
            alt.Chart(top_stock)
            .mark_bar(size=18, cornerRadiusTopRight=4, cornerRadiusBottomRight=4)
            .encode(
                x=alt.X('STOCK:Q', title='Unidades en Stock'),
                y=alt.Y('ARTICULOS:N', sort='-x', title='Articulo'),
                tooltip=['ARTICULOS:N', 'STOCK:Q']
            )
            .properties(width=460, height=300)
        )
        st.altair_chart(chart, use_container_width=True)

except Exception as e:
    st.error("Error al leer los datos. Revisa que el enlace CSV sea el correcto.")
    st.info("Tip: Asegúrate de que en Google Sheets la palabra 'CODIGO' esté en la fila 8.")
