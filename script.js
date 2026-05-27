const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRNCLNcBTHNKdxw6By1K5yNsyKIDMOno9SJboRJA3cV4liB02ZK38TeC5p5FfYYOjjblFUNgMdQX3zH/pub?gid=864297796&single=true&output=csv";

const metricProducts = document.getElementById("metric-products");
const metricStock = document.getElementById("metric-stock");
const lastUpdated = document.getElementById("last-updated");
const statusBadge = document.getElementById("status-badge");
const tableBody = document.getElementById("inventory-table-body");
const refreshButton = document.getElementById("refresh-button");
const chartContext = document.getElementById("stock-chart");

let stockChart;

function setStatus(message, variant) {
  statusBadge.textContent = message;
  statusBadge.style.background = variant === "error" ? "rgba(180, 53, 53, 0.14)" : "rgba(14, 124, 102, 0.12)";
  statusBadge.style.color = variant === "error" ? "#9f1d1d" : "#0a5c4c";
}

function parseRows(rows) {
  return rows
    .slice(8)
    .map((row) => ({
      codigo: String(row[0] ?? "").trim(),
      articulo: String(row[1] ?? "").trim(),
      entradas: Number.parseFloat(row[2]) || 0,
      salidas: Number.parseFloat(row[3]) || 0,
      stock: Number.parseFloat(row[4]) || 0,
    }))
    .filter((item) => item.codigo);
}

function renderMetrics(items) {
  const totalStock = items.reduce((sum, item) => sum + item.stock, 0);
  metricProducts.textContent = items.length;
  metricStock.textContent = totalStock.toLocaleString("es-ES");
}

function renderTable(items) {
  tableBody.innerHTML = items
    .map(
      (item) => `
        <tr>
          <td>${item.codigo}</td>
          <td>${item.articulo}</td>
          <td>${item.entradas}</td>
          <td>${item.salidas}</td>
          <td><span class="stock-pill">${item.stock}</span></td>
        </tr>
      `,
    )
    .join("");
}

function renderChart(items) {
  const topItems = [...items]
    .sort((left, right) => right.salidas - left.salidas)
    .slice(0, 7);

  const data = {
    labels: topItems.map((item) => item.articulo),
    datasets: [
      {
        label: "Salidas",
        data: topItems.map((item) => item.salidas),
        borderRadius: 10,
        maxBarThickness: 28,
        backgroundColor: [
          "#0e7c66",
          "#159779",
          "#1fb08d",
          "#53be74",
          "#88c95e",
          "#c8cf63",
          "#e8b64d",
          "#ef9745",
        ],
      },
    ],
  };

  if (stockChart) {
    stockChart.data = data;
    stockChart.update();
    return;
  }

  stockChart = new Chart(chartContext, {
    type: "bar",
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            maxRotation: 0,
            minRotation: 0,
          },
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function updateTimestamp() {
  lastUpdated.textContent = `Ultima actualizacion: ${new Date().toLocaleTimeString("es-ES")}`;
}

function fetchInventory() {
  setStatus("Sincronizando", "ok");

  Papa.parse(CSV_URL, {
    download: true,
    skipEmptyLines: false,
    complete: ({ data }) => {
      const items = parseRows(data);

      renderMetrics(items);
      renderTable(items);
      renderChart(items);
      updateTimestamp();
      setStatus("Conectado a Google Sheets", "ok");
    },
    error: () => {
      setStatus("Error de lectura", "error");
      lastUpdated.textContent = "No fue posible actualizar los datos desde Google Sheets";
    },
  });
}

refreshButton.addEventListener("click", fetchInventory);

fetchInventory();
