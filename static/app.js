const ordersBody = document.querySelector("#orders-body");
const searchInput = document.querySelector("#search-input");
const statusFilter = document.querySelector("#status-filter");
const notice = document.querySelector("#notice");
const orderDialog = document.querySelector("#order-dialog");
const orderForm = document.querySelector("#order-form");
const formError = document.querySelector("#form-error");
const submitButton = document.querySelector("#submit-button");

let orders = [];

const statusLabels = {
  preparing: "Preparing",
  picked_up: "Picked up",
  in_transit: "In transit",
  delivered: "Delivered",
};

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character]);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date);
}

function renderSummary() {
  const counts = orders.reduce((result, order) => {
    result[order.order_status] = (result[order.order_status] || 0) + 1;
    return result;
  }, {});
  document.querySelector("#total-count").textContent = orders.length;
  document.querySelector("#preparing-count").textContent = counts.preparing || 0;
  document.querySelector("#transit-count").textContent =
    (counts.picked_up || 0) + (counts.in_transit || 0);
  document.querySelector("#delivered-count").textContent = counts.delivered || 0;
}

function renderOrders() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;
  const visibleOrders = orders.filter((order) => {
    const matchesStatus = !selectedStatus || order.order_status === selectedStatus;
    const searchable = [order.customer_name, order.delivery_address, order.items]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return matchesStatus && searchable.includes(query);
  });

  if (!visibleOrders.length) {
    ordersBody.innerHTML = `<tr><td class="table-message" colspan="6">${
      orders.length ? "No orders match these filters." : "No orders yet. Add the first one to get started."
    }</td></tr>`;
  } else {
    ordersBody.innerHTML = visibleOrders.map((order) => {
      const status = statusLabels[order.order_status] || "Unknown";
      return `<tr>
        <td><span class="order-id">#${escapeHtml(order.id)}</span></td>
        <td class="customer-cell"><strong>${escapeHtml(order.customer_name)}</strong><span>Customer</span></td>
        <td class="meal-cell">${escapeHtml(order.items)}</td>
        <td class="address-cell">${escapeHtml(order.delivery_address)}</td>
        <td><span class="status-pill status-${escapeHtml(order.order_status)}">${escapeHtml(status)}</span></td>
        <td class="placed-cell">${escapeHtml(formatDate(order.created_at))}</td>
      </tr>`;
    }).join("");
  }

  document.querySelector("#panel-footer").textContent =
    `Showing ${visibleOrders.length} of ${orders.length} recent orders`;
}

async function loadOrders() {
  notice.hidden = true;
  ordersBody.innerHTML = '<tr><td class="table-message" colspan="6">Loading orders…</td></tr>';
  try {
    const response = await fetch("/orders/?limit=100");
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    orders = await response.json();
    renderSummary();
    renderOrders();
  } catch (error) {
    ordersBody.innerHTML = '<tr><td class="table-message" colspan="6">Orders could not be loaded.</td></tr>';
    notice.textContent = `${error.message}. Check your connection and try again.`;
    notice.hidden = false;
  }
}

document.querySelector("#today-label").textContent = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
}).format(new Date());

document.querySelector("#new-order-button").addEventListener("click", () => {
  formError.hidden = true;
  orderDialog.showModal();
  orderForm.elements.customer_name.focus();
});
document.querySelector("#close-dialog-button").addEventListener("click", () => orderDialog.close());
document.querySelector("#cancel-button").addEventListener("click", () => orderDialog.close());
document.querySelector("#refresh-button").addEventListener("click", loadOrders);
searchInput.addEventListener("input", renderOrders);
statusFilter.addEventListener("change", renderOrders);

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.hidden = true;
  submitButton.disabled = true;
  submitButton.textContent = "Creating…";
  const formData = new FormData(orderForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/orders/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || `Order could not be created (${response.status})`);
    }
    orderForm.reset();
    orderDialog.close();
    await loadOrders();
  } catch (error) {
    formError.textContent = error.message;
    formError.hidden = false;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Create order";
  }
});

loadOrders();
