document.addEventListener('DOMContentLoaded', function() {
    createAdminStyles();
    createAdminHeader();
    createAdminMainContainer();
    createAdminFooter();
    initializeAdminEventListeners();
    
    // Cargar órdenes al iniciar
    loadOrders();
});

// Variable global para almacenar las órdenes
let orders = [];

function createAdminStyles() {
    const style = document.createElement('style');
    style.textContent = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
        }
        
        body {
            background-color: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }
        
        header {
            background-color: #1a2a3a;
            color: white;
            padding: 1rem;
            text-align: center;
        }
        
        .container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
        }
        
        footer {
            background-color: #1a2a3a;
            color: white;
            text-align: center;
            padding: 1rem;
            margin-top: 2rem;
        }
        
        /* Estilos para panel de administración */
        .admin-title {
            margin-bottom: 1.5rem;
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 0.5rem;
        }
        
        .admin-card {
            background-color: white;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .search-bar {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .search-input {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }
        
        .filter-select {
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }
        
        .orders-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        
        .orders-table th,
        .orders-table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        
        .orders-table th {
            background-color: #f9f9f9;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .orders-table tr:hover {
            background-color: #f5f9ff;
        }
        
        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 50px;
            font-size: 0.85rem;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-pending {
            background-color: #ffeaa7;
            color: #d68910;
        }
        
        .status-processing {
            background-color: #81ecec;
            color: #0a6ebd;
        }
        
        .status-shipped {
            background-color: #a29bfe;
            color: #4834d4;
        }
        
        .status-delivered {
            background-color: #55efc4;
            color: #1b8a5a;
        }
        
        .status-received {
            background-color: #74b9ff;
            color: #0a6ebd;
        }
        
        .status-completed {
            background-color: #badc58;
            color: #388e3c;
        }
        
        .status-cancelled {
            background-color: #ff7675;
            color: #c0392b;
        }
        
        .action-btn {
            padding: 0.5rem 0.75rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            margin-right: 0.5rem;
            transition: background-color 0.3s, transform 0.1s;
        }
        
        .action-btn:hover {
            transform: translateY(-2px);
        }
        
        .btn-view {
            background-color: #3498db;
            color: white;
        }
        
        .btn-view:hover {
            background-color: #2980b9;
        }
        
        .btn-edit {
            background-color: #f39c12;
            color: white;
        }
        
        .btn-edit:hover {
            background-color: #d68910;
        }
        
        .pagination {
            display: flex;
            justify-content: center;
            margin-top: 2rem;
            gap: 0.5rem;
        }
        
        .pagination-btn {
            padding: 0.5rem 1rem;
            border: 1px solid #ddd;
            background-color: white;
            cursor: pointer;
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        
        .pagination-btn:hover {
            background-color: #f5f5f5;
        }
        
        .pagination-btn.active {
            background-color: #3498db;
            color: white;
            border-color: #3498db;
        }
        
        /* Modal para detalles y edición */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        
        .modal {
            background-color: white;
            border-radius: 8px;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            transform: translateY(-20px);
            transition: transform 0.3s ease;
        }
        
        .modal-overlay.active .modal {
            transform: translateY(0);
        }
        
        .modal-header {
            padding: 1rem;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #f9f9f9;
        }
        
        .modal-title {
            margin: 0;
            font-size: 1.5rem;
            color: #2c3e50;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #7f8c8d;
            padding: 0 0.5rem;
        }
        
        .modal-body {
            padding: 1.5rem;
        }
        
        .modal-footer {
            padding: 1rem;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            background-color: #f9f9f9;
        }
        
        .order-details-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .order-details-section {
            background-color: #f9f9f9;
            padding: 1rem;
            border-radius: 8px;
        }
        
        .order-details-section h3 {
            margin-bottom: 1rem;
            color: #2c3e50;
            border-bottom: 1px solid #ddd;
            padding-bottom: 0.5rem;
        }
        
        .order-details-field {
            margin-bottom: 0.5rem;
        }
        
        .order-details-label {
            font-weight: bold;
            color: #7f8c8d;
        }
        
        .order-items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
        }
        
        .order-items-table th,
        .order-items-table td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        
        .order-items-table th {
            background-color: #f5f5f5;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .order-status-section {
            background-color: #f9f9f9;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1.5rem;
        }
        
        .status-form {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .status-select {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }
        
        .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .btn-primary {
            background-color: #3498db;
            color: white;
        }
        
        .btn-primary:hover {
            background-color: #2980b9;
        }
        
        .btn-secondary {
            background-color: #95a5a6;
            color: white;
        }
        
        .btn-secondary:hover {
            background-color: #7f8c8d;
        }
        
        .btn-danger {
            background-color: #e74c3c;
            color: white;
        }
        
        .btn-danger:hover {
            background-color: #c0392b;
        }
        
        .status-history {
            margin-top: 1.5rem;
        }
        
        .status-history-item {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem 0;
            border-bottom: 1px solid #eee;
        }
        
        .status-history-date {
            color: #7f8c8d;
            font-size: 0.9rem;
        }
        
        /* Toast de notificación */
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background-color: #2ecc71;
            color: white;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1100;
            animation: slideIn 0.3s ease forwards;
        }
        
        .notification.error {
            background-color: #e74c3c;
        }
        
        .notification.fade-out {
            animation: fadeOut 0.5s ease forwards;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

function createAdminHeader() {
    const header = document.createElement('header');
    header.innerHTML = `
        <h1>Panel de Administración</h1>
        <p>Tienda de Ropa Deportiva</p>
    `;
    document.body.appendChild(header);
}

function createAdminMainContainer() {
    const main = document.createElement('main');
    main.className = 'container';
    main.id = 'contentContainer';
    document.body.appendChild(main);
    
    // Mostrar solo la página de pedidos
    createOrdersPage(main);
}

function createAdminFooter() {
    const footer = document.createElement('footer');
    footer.innerHTML = `
        <p>&copy; 2023 Tienda de Ropa Deportiva - Panel de Administración</p>
    `;
    document.body.appendChild(footer);
}

function initializeAdminEventListeners() {
    // Modal de gestión
    createOrderModal();
}

function createOrdersPage(container) {
    container.innerHTML = `
        <h2 class="admin-title">Gestión de Pedidos</h2>
        <div class="admin-card">
            <div class="search-bar">
                <input type="text" class="search-input" placeholder="Buscar por número de pedido, cliente, etc." id="orderSearch">
                <select class="filter-select" id="statusFilter">
                    <option value="">Todos los estados</option>
                    <option value="pending">Pendiente</option>
                    <option value="processing">En proceso</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregado</option>
                    <option value="received">Recibido</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                </select>
                <button class="btn btn-primary" id="searchOrdersBtn">Buscar</button>
            </div>
            
            <div id="ordersTableContainer">
                <p>Cargando pedidos...</p>
            </div>
            
            <div class="pagination" id="ordersPagination">
                <!-- Paginación generada dinámicamente -->
            </div>
        </div>
    `;
    
    // Inicializar eventos de búsqueda y filtrado
    document.getElementById('searchOrdersBtn').addEventListener('click', filterOrders);
    document.getElementById('orderSearch').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filterOrders();
        }
    });
    document.getElementById('statusFilter').addEventListener('change', filterOrders);
}

async function loadOrders() {
    try {
        const response = await fetch('http://localhost:3000/api/pedidos');
        if (!response.ok) {
            throw new Error('Error al cargar los pedidos');
        }
        orders = await response.json();
        renderOrdersTable(orders);
    } catch (err) {
        showNotification('Error al cargar los pedidos: ' + err.message, true);
        const ordersTableContainer = document.getElementById('ordersTableContainer');
        if (ordersTableContainer) {
            ordersTableContainer.innerHTML = `<p>Error al cargar los pedidos. Intente nuevamente más tarde.</p>`;
        }
    }
}

function filterOrders() {
    const searchTerm = (document.getElementById('orderSearch').value || '').toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    let filteredOrders = [...orders];
    if (searchTerm) {
        filteredOrders = filteredOrders.filter(order => {
            const customerName = order.customer?.name || '';
            const customerEmail = order.customer?.email || '';
            return String(order.id).toLowerCase().includes(searchTerm) ||
                   customerName.toLowerCase().includes(searchTerm) ||
                   customerEmail.toLowerCase().includes(searchTerm);
        });
    }
    if (statusFilter) {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }
    renderOrdersTable(filteredOrders);
}

function renderOrdersTable(ordersToRender) {
    const ordersTableContainer = document.getElementById('ordersTableContainer');
    if (!ordersTableContainer) return;
    if (ordersToRender.length === 0) {
        ordersTableContainer.innerHTML = '<p>No hay pedidos para mostrar</p>';
        return;
    }
    const tableHTML = `
        <table class="orders-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${ordersToRender.map(order => {
                    let total = order.total;
                    if (typeof total === 'string') {
                        total = parseFloat(total.replace(',', '.'));
                    }
                    if (isNaN(total)) {
                        total = 0;
                    }
                    const customerName = order.customer?.name || 'N/A';
                    return `
                    <tr>
                        <td>${order.id}</td>
                        <td>${new Date(order.date).toLocaleDateString()}</td>
                        <td>${customerName}</td>
                        <td>$${total.toFixed(2)}</td>
                        <td><span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span></td>
                        <td>
                            <button class="action-btn btn-view" data-id="${order.id}">Ver</button>
                            <button class="action-btn btn-edit" data-id="${order.id}">Editar</button>
                        </td>
                    </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    ordersTableContainer.innerHTML = tableHTML;
    const viewButtons = ordersTableContainer.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const orderId = button.getAttribute('data-id');
            openOrderModal(orderId, false);
        });
    });
    const editButtons = ordersTableContainer.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const orderId = button.getAttribute('data-id');
            openOrderModal(orderId, true);
        });
    });
}

function createOrderModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'orderModal';
    const modalContent = document.createElement('div');
    modalContent.className = 'modal';
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    const modalTitle = document.createElement('h2');
    modalTitle.className = 'modal-title';
    modalTitle.id = 'orderModalTitle';
    modalTitle.textContent = 'Detalles del Pedido';
    const modalClose = document.createElement('button');
    modalClose.className = 'modal-close';
    modalClose.innerHTML = '&times;';
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(modalClose);
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalBody.id = 'orderModalBody';
    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    modalFooter.id = 'orderModalFooter';
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContent.appendChild(modalFooter);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function openOrderModal(orderId, isEdit = false) {
    const modal = document.getElementById('orderModal');
    const modalTitle = document.getElementById('orderModalTitle');
    const modalBody = document.getElementById('orderModalBody');
    const modalFooter = document.getElementById('orderModalFooter');
    const order = orders.find(o => String(o.id) === String(orderId));
    if (!order) {
        showNotification('Pedido no encontrado', true);
        return;
    }
    modalTitle.textContent = isEdit ? 'Editar Pedido #' + order.id : 'Detalles del Pedido #' + order.id;
    modalBody.innerHTML = `
        <div class="order-details-grid">
            <div class="order-details-section">
                <h3>Información del Cliente</h3>
                <div class="order-details-field">
                    <span class="order-details-label">Nombre:</span>
                    <span>${order.customer.name}</span>
                </div>
                <div class="order-details-field">
                    <span class="order-details-label">Email:</span>
                    <span>${order.customer.email}</span>
                </div>
                <div class="order-details-field">
                    <span class="order-details-label">Teléfono:</span>
                    <span>${order.customer.phone}</span>
                </div>
            </div>
            <div class="order-details-section">
                <h3>Información del Pedido</h3>
                <div class="order-details-field">
                    <span class="order-details-label">Número de Pedido:</span>
                    <span>${order.id}</span>
                </div>
                <div class="order-details-field">
                    <span class="order-details-label">Fecha:</span>
                    <span>${new Date(order.date).toLocaleString()}</span>
                </div>
                <div class="order-details-field">
                    <span class="order-details-label">Estado:</span>
                    <span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span>
                </div>
                <div class="order-details-field">
                    <span class="order-details-label">Método de Pago:</span>
                    <span>${getPaymentMethodName(order.paymentMethod)}</span>
                </div>
            </div>
        </div>
        <div class="order-details-section">
            <h3>Dirección de Envío</h3>
            <p>${order.customer.address}</p>
        </div>
        <div class="order-details-section">
            <h3>Productos</h3>
            <table class="order-items-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio Unitario</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td>${item.title}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>${item.quantity}</td>
                            <td>$${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                        <td><strong>$${typeof order.total === 'string' ? parseFloat(order.total.replace(',', '.')).toFixed(2) : order.total.toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>
        </div>
        ${order.notes ? `
            <div class="order-details-section">
                <h3>Notas</h3>
                <p>${order.notes}</p>
            </div>
        ` : ''}
        ${isEdit ? `
            <div class="order-status-section">
                <h3>Actualizar Estado</h3>
                <form id="updateStatusForm" class="status-form">
<select id="newStatus" class="status-select">
    <option value="pending" ${order.status === 'pending' || order.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
    <option value="processing" ${order.status === 'processing' || order.status === 'En Proceso' ? 'selected' : ''}>En Proceso</option>
    <option value="shipped" ${order.status === 'shipped' || order.status === 'Enviado' ? 'selected' : ''}>Enviado</option>
    <option value="delivered" ${order.status === 'delivered' || order.status === 'Entregado' ? 'selected' : ''}>Entregado</option>
    <option value="received" ${order.status === 'received' || order.status === 'Recibido' ? 'selected' : ''}>Recibido</option>
    <option value="completed" ${order.status === 'completed' || order.status === 'Completado' ? 'selected' : ''}>Completado</option>
    <option value="cancelled" ${order.status === 'cancelled' || order.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
</select>
                    <button type="submit" class="btn btn-primary">Actualizar Estado</button>
                </form>
                <div class="status-history">
                    <h3>Historial de Estados</h3>
                    ${order.statusHistory ? order.statusHistory.map(status => `
                        <div class="status-history-item">
                            <span class="status-badge status-${status.status}">${getStatusLabel(status.status)}</span>
                            <span class="status-history-date">${new Date(status.date).toLocaleString()}</span>
                        </div>
                    `).join('') : '<p>No hay historial de estados disponible</p>'}
                </div>
            </div>
        ` : ''}
    `;
    modalFooter.innerHTML = isEdit ? `
        <button class="btn btn-secondary" id="closeOrderModal">Cancelar</button>
        <button class="btn btn-danger" id="deleteOrderBtn">Eliminar Pedido</button>
    ` : `
        <button class="btn btn-secondary" id="closeOrderModal">Cerrar</button>
        <button class="btn btn-primary" id="editOrderBtn">Editar Pedido</button>
    `;
    document.getElementById('closeOrderModal').addEventListener('click', function() {
        document.getElementById('orderModal').classList.remove('active');
    });
    if (isEdit) {
        document.getElementById('updateStatusForm')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const newStatus = document.getElementById('newStatus').value;
            updateOrderStatus(order.id, newStatus);
        });
        document.getElementById('deleteOrderBtn').addEventListener('click', function() {
            if (confirm('¿Está seguro de que desea eliminar este pedido? Esta acción no se puede deshacer.')) {
                deleteOrder(order.id);
            }
        });
    } else {
        document.getElementById('editOrderBtn').addEventListener('click', function() {
            document.getElementById('orderModal').classList.remove('active');
            setTimeout(() => {
                openOrderModal(order.id, true);
            }, 300);
        });
    }
    modal.classList.add('active');
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const statusMap = {
            'Pendiente': 'Pendiente',
            'En proceso': 'En Proceso',
            'Enviado': 'Enviado',
            'Entregado': 'Entregado',
            'Recibido': 'Recibido',
            'Completado': 'Completado',
            'Cancelado': 'Cancelado'
        };
        const spanishStatus = statusMap[newStatus] || newStatus;
        showNotification(`Actualizando estado del pedido #${orderId}...`);
        const response = await fetch(`http://localhost:3000/api/pedidos/${orderId}/estado`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: spanishStatus })
        });
        if (!response.ok) {
            throw new Error('Error al actualizar el estado del pedido');
        }
        const updatedOrder = await response.json();
        const orderIndex = orders.findIndex(o => o.id == orderId);
        if (orderIndex !== -1) {
            orders[orderIndex].status = newStatus;
            if (!orders[orderIndex].statusHistory) {
                orders[orderIndex].statusHistory = [];
            }
            orders[orderIndex].statusHistory.push({
                status: newStatus,
                date: new Date().toISOString()
            });
            renderOrdersTable(orders);
            document.getElementById('orderModal').classList.remove('active');
            showNotification(`El estado del pedido #${orderId} ha sido actualizado a ${getStatusLabel(newStatus)}`);
            setTimeout(() => {
                openOrderModal(orderId, true);
            }, 500);
        }
    } catch (err) {
        showNotification('Error al actualizar el estado del pedido: ' + err.message, true);
    }
}

async function deleteOrder(orderId) {
    try {
        const response = await fetch(`http://localhost:3000/api/pedidos/${orderId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar el pedido');
        }
        orders = orders.filter(o => o.id != orderId);
        renderOrdersTable(orders);
        document.getElementById('orderModal').classList.remove('active');
        showNotification(`El pedido #${orderId} ha sido eliminado correctamente`);
    } catch (err) {
        showNotification('Error al eliminar el pedido: ' + err.message, true);
    }
}

function showNotification(message, isError = false) {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    });
    const notification = document.createElement('div');
    notification.className = isError ? 'notification error' : 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

function getStatusLabel(status) {
    const statusLabels = {
        'Pendiente': 'Pendiente',
        'Procesando': 'En Proceso',
        'Enviado': 'Enviado',
        'Entregado': 'Entregado',
        'Recibido': 'Recibido',
        'Completado': 'Completado',
        'Cancelado': 'Cancelado',
    };
    const reverseMap = {
        'Pendiente': 'Pendiente',
        'En Proceso': 'En proceso',
        'Enviado': 'Enviado',
        'Entregado': 'Entregado',
        'Recibido': 'Recibido',
        'Completado': 'Completado',
        'Cancelado': 'Cancelado'
    };
    return statusLabels[status] || reverseMap[status] || status;
}

function getPaymentMethodName(method) {
    const paymentMethods = {
        'credit_card': 'Tarjeta de Crédito',
        'debit_card': 'Tarjeta de Débito',
        'paypal': 'PayPal',
        'bank_transfer': 'Transferencia Bancaria',
        'cash_on_delivery': 'Contra Reembolso'
    };
    return paymentMethods[method] || method;
}
