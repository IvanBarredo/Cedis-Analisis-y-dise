document.addEventListener('DOMContentLoaded', function() {
    createStyles();
    createHeader();
    createNavigation();
    createMainContainer();
    createFooter();
    initializeEventListeners();
    createPaymentModal();
});

let cart = [];

function createStyles() {
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
            background-color: #2c3e50;
            color: white;
            padding: 1rem;
            text-align: center;
        }
        nav {
            background-color: #34495e;
            padding: 0.5rem;
        }
        nav ul {
            display: flex;
            justify-content: center;
            list-style: none;
        }
        nav ul li {
            margin: 0 1rem;
        }
        nav ul li a {
            color: white;
            text-decoration: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        nav ul li a:hover {
            background-color: #3d566e;
        }
        .container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
        }
        .product-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 2rem;
        }
        .product-card {
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .product-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .product-info {
            padding: 1rem;
        }
        .product-title {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
        }
        .product-price {
            font-weight: bold;
            color: #e74c3c;
            margin-bottom: 1rem;
        }
        .add-to-cart {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
            transition: background-color 0.3s;
        }
        .add-to-cart:hover {
            background-color: #2980b9;
        }
        footer {
            background-color: #2c3e50;
            color: white;
            text-align: center;
            padding: 1rem;
            margin-top: 2rem;
        }
        .cart-container {
            background-color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid #eee;
        }
        .cart-item:last-child {
            border-bottom: none;
        }
        .cart-item-info {
            display: flex;
            align-items: center;
        }
        .cart-item-image {
            width: 50px;
            height: 50px;
            object-fit: cover;
            margin-right: 1rem;
            border-radius: 4px;
        }
        .cart-item-title {
            font-weight: bold;
        }
        .cart-item-price {
            color: #e74c3c;
        }
        .cart-item-quantity {
            display: flex;
            align-items: center;
        }
        .quantity-btn {
            background-color: #f0f0f0;
            border: none;
            width: 25px;
            height: 25px;
            border-radius: 4px;
            cursor: pointer;
        }
        .quantity-input {
            width: 40px;
            text-align: center;
            margin: 0 0.5rem;
        }
        .remove-item {
            color: #e74c3c;
            cursor: pointer;
            margin-left: 1rem;
        }
        .cart-total {
            text-align: right;
            font-size: 1.2rem;
            margin-top: 1rem;
            font-weight: bold;
        }
        .checkout-btn {
            background-color: #27ae60;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            margin-top: 1rem;
            width: 100%;
            transition: background-color 0.3s;
        }
        .checkout-btn:hover {
            background-color: #219653;
        }
        .checkout-btn:disabled {
            background-color: #95a5a6;
            cursor: not-allowed;
        }
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
            max-width: 600px;
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
            padding: 1rem;
        }
        .modal-footer {
            padding: 1rem;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: bold;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }
        .form-row {
            display: flex;
            gap: 1rem;
        }
        .form-col {
            flex: 1;
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
        .order-summary {
            margin: 1.5rem 0;
            padding: 1rem;
            background-color: #f9f9f9;
            border-radius: 4px;
        }
        .order-summary h3 {
            margin-bottom: 1rem;
            color: #2c3e50;
        }
        .cart-item-summary {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }
        .order-total {
            display: flex;
            justify-content: space-between;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #ddd;
            font-weight: bold;
            font-size: 1.1rem;
        }
        .confirmation .modal {
            text-align: center;
        }
        .confirmation-icon {
            font-size: 4rem;
            color: #27ae60;
            margin-bottom: 1rem;
        }
        .confirmation h2 {
            color: #27ae60;
            margin-bottom: 1rem;
        }
        .order-details {
            text-align: left;
            margin: 2rem 0;
            padding: 1rem;
            background-color: #f9f9f9;
            border-radius: 4px;
        }
        .order-details h3 {
            margin-bottom: 1rem;
            color: #2c3e50;
        }
        .order-details p {
            margin-bottom: 0.5rem;
        }
    `;
    document.head.appendChild(style);
}

function createHeader() {
    const header = document.createElement('header');
    header.innerHTML = `
        <h1>Tienda de Ropa Deportiva</h1>
        <p>Los mejores productos para tu entrenamiento</p>
    `;
    document.body.appendChild(header);
}

function createNavigation() {
    const nav = document.createElement('nav');
    nav.innerHTML = `
        <ul>
            <li><a href="#" class="nav-link" data-page="catalog">Catálogo</a></li>
            <li><a href="#" class="nav-link" data-page="cart">Carrito</a></li>
            <li><a href="#" class="nav-link" data-page="about">Sobre Nosotros</a></li>
            <li><a href="#" class="nav-link" data-page="contact">Contacto</a></li>
        </ul>
    `;
    document.body.appendChild(nav);
}

function createMainContainer() {
    const main = document.createElement('main');
    main.className = 'container';
    main.id = 'contentContainer';
    document.body.appendChild(main);
    createCatalogContent(main);
}

function createFooter() {
    const footer = document.createElement('footer');
    footer.innerHTML = `
        <p>&copy; 2023 Tienda de Ropa Deportiva. Todos los derechos reservados.</p>
    `;
    document.body.appendChild(footer);
}

function initializeEventListeners() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            const contentContainer = document.getElementById('contentContainer');
            contentContainer.innerHTML = '';
            switch(page) {
                case 'catalog':
                    createCatalogContent(contentContainer);
                    break;
                case 'cart':
                    createCartContent(contentContainer);
                    break;
                case 'about':
                    createAboutContent(contentContainer);
                    break;
                case 'contact':
                    createContactContent(contentContainer);
                    break;
            }
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
}

function createCatalogContent(container) {
    container.innerHTML = `
        <h2>Nuestros Productos</h2>
        <div class="product-grid" id="productGrid"></div>
    `;
    const products = [
        { id: 1, title: 'Playera Deportiva', price: 299.99, image: 'Imagenes/camiseta deportiva.webp' },
        { id: 2, title: 'Short deportivo', price: 249.99, image: 'Imagenes/pantalon corto.webp' },
        { id: 3, title: 'Tennis', price: 1499.99, image: 'Imagenes/tenis.jpg' },
        { id: 4, title: 'Sudadera deportiva', price: 599.99, image: 'Imagenes/sudadera deportiva.jpeg' },
        { id: 5, title: 'Calcetines Deportivos', price: 149.99, image: 'Imagenes/calcetines deportivos.avif' },
        { id: 6, title: 'Gorra Deportiva', price: 149.99, image: 'Imagenes/gorra.avif' },
    ];
    const productGrid = document.getElementById('productGrid');
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}" data-image="${product.image}">Añadir al Carrito</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productToAdd = {
                id: this.getAttribute('data-id'),
                title: this.getAttribute('data-title'),
                price: parseFloat(this.getAttribute('data-price')),
                image: this.getAttribute('data-image'),
                quantity: 1
            };
            addToCart(productToAdd);
        });
    });
}

function createCartContent(container) {
    container.innerHTML = `
        <h2>Tu Carrito de Compras</h2>
        <div class="cart-container" id="cartContainer">
            <p>Tu carrito está vacío</p>
        </div>
    `;
    updateCartUI();
}

function createAboutContent(container) {
    container.innerHTML = `
        <h2>Sobre Nosotros</h2>
        <p>Somos una tienda especializada en ropa y accesorios deportivos de alta calidad. Nuestro objetivo es proporcionar los mejores productos para que puedas alcanzar tus metas deportivas.</p>
        <p>Fundada en 2010, hemos crecido gracias a la confianza de nuestros clientes y a nuestro compromiso con la calidad.</p>
    `;
}

function createContactContent(container) {
    container.innerHTML = `
        <h2>Contacto</h2>
        <p>¿Tienes alguna pregunta? No dudes en contactarnos:</p>
        <ul>
            <li>Email: info@tiendaropadeportiva.com</li>
            <li>Teléfono: +1 234 567 890</li>
            <li>Dirección: Calle Deportiva 123, Ciudad</li>
        </ul>
    `;
}

function addToCart(product) {
    const existingCartItem = cart.find(item => item.id === product.id);
    if (existingCartItem) {
        existingCartItem.quantity += 1;
    } else {
        cart.push({...product});
    }
    updateCartUI();
    showNotification(`${product.title} añadido al carrito`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateQuantity(productId, newQuantity) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = parseInt(newQuantity) || 1;
        if (cartItem.quantity < 1) cartItem.quantity = 1;
    }
    updateCartUI();
}

function updateCartUI() {
    const cartContainer = document.getElementById('cartContainer');
    if (!cartContainer) return;
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Tu carrito está vacío</p>';
        return;
    }
    cartContainer.innerHTML = '';
    const cartList = document.createElement('div');
    cartList.className = 'cart-list';
    cart.forEach(cartItem => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <img src="${cartItem.image}" alt="${cartItem.title}" class="cart-item-image">
                <div>
                    <p class="cart-item-title">${cartItem.title}</p>
                    <p class="cart-item-price">$${cartItem.price.toFixed(2)}</p>
                </div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus" data-id="${cartItem.id}">-</button>
                <input type="number" class="quantity-input" value="${cartItem.quantity}" min="1" data-id="${cartItem.id}">
                <button class="quantity-btn plus" data-id="${cartItem.id}">+</button>
                <span class="remove-item" data-id="${cartItem.id}">Eliminar</span>
            </div>
        `;
        cartList.appendChild(cartItemElement);
    });
    cartContainer.appendChild(cartList);
    const cartTotal = document.createElement('div');
    cartTotal.className = 'cart-total';
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.innerHTML = `Total: $${totalAmount.toFixed(2)}`;
    cartContainer.appendChild(cartTotal);
    const checkoutButton = document.createElement('button');
    checkoutButton.className = 'checkout-btn';
    checkoutButton.id = 'checkoutBtn';
    checkoutButton.textContent = 'Finalizar Compra';
    checkoutButton.disabled = cart.length === 0;
    cartContainer.appendChild(checkoutButton);
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const cartItem = cart.find(item => item.id === productId);
            if (cartItem && cartItem.quantity > 1) {
                cartItem.quantity -= 1;
                updateCartUI();
            }
        });
    });
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const cartItem = cart.find(item => item.id === productId);
            if (cartItem) {
                cartItem.quantity += 1;
                updateCartUI();
            }
        });
    });
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.getAttribute('data-id');
            updateQuantity(productId, this.value);
        });
    });
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            removeFromCart(productId);
        });
    });
    if (document.getElementById('checkoutBtn')) {
        document.getElementById('checkoutBtn').addEventListener('click', showPaymentModal);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
}

function createPaymentModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'paymentModal';
    const modalContent = document.createElement('div');
    modalContent.className = 'modal';
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    const modalTitle = document.createElement('h2');
    modalTitle.className = 'modal-title';
    modalTitle.textContent = 'Finalizar Compra';
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
    const paymentForm = document.createElement('form');
    paymentForm.id = 'paymentForm';
    paymentForm.innerHTML = `
        <div class="form-group">
            <label for="customerName">Nombre Completo*</label>
            <input type="text" id="customerName" required placeholder="Ej. Juan Pérez">
        </div>
        <div class="form-group">
            <label for="customerEmail">Correo Electrónico*</label>
            <input type="email" id="customerEmail" required placeholder="email@ejemplo.com">
        </div>
        <div class="form-group">
            <label for="customerPhone">Teléfono*</label>
            <input type="tel" id="customerPhone" required placeholder="Ej. 5551234567">
        </div>
        <div class="form-group">
            <label for="customerAddress">Dirección de Envío*</label>
            <textarea id="customerAddress" rows="3" required placeholder="Calle, Número, Colonia, Ciudad, C.P."></textarea>
        </div>
        <div class="form-group">
            <label for="paymentMethod">Método de Pago*</label>
            <select id="paymentMethod" required>
                <option value="">Seleccione un método</option>
                <option value="transfer">Transferencia Bancaria</option>
                <option value="cash">Efectivo al recibir</option>
                <option value="card">Tarjeta (Crédito/Débito)</option>
            </select>
        </div>
        <div id="cardDetails" style="display:none;">
            <div class="form-group">
                <label for="cardNumber">Número de Tarjeta</label>
                <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456">
            </div>
            <div class="form-row">
                <div class="form-col">
                    <div class="form-group">
                        <label for="cardExpiry">Fecha de Expiración</label>
                        <input type="text" id="cardExpiry" placeholder="MM/AA">
                    </div>
                </div>
                <div class="form-col">
                    <div class="form-group">
                        <label for="cardCvv">CVV</label>
                        <input type="text" id="cardCvv" placeholder="123">
                    </div>
                </div>
            </div>
        </div>
        <div class="order-summary">
            <h3>Resumen de Pedido</h3>
            <div id="modalCartItems"></div>
            <div class="order-total">
                <span>Total:</span>
                <span id="modalCartTotal">$0.00</span>
            </div>
        </div>
        <div class="form-group">
            <label for="orderNotes">Notas adicionales</label>
            <textarea id="orderNotes" rows="2" placeholder="Instrucciones especiales para la entrega"></textarea>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="cancelPayment">Cancelar</button>
            <button type="submit" class="btn btn-primary">Confirmar Pedido</button>
        </div>
    `;
    const paymentMethodSelect = paymentForm.querySelector('#paymentMethod');
    paymentMethodSelect.addEventListener('change', (e) => {
        const cardDetailsSection = paymentForm.querySelector('#cardDetails');
        cardDetailsSection.style.display = e.target.value === 'card' ? 'block' : 'none';
    });
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        processOrder();
    });
    const cancelButton = paymentForm.querySelector('#cancelPayment');
    cancelButton.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    modalBody.appendChild(paymentForm);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function showPaymentModal() {
    const modal = document.getElementById('paymentModal');
    const modalCartItems = document.getElementById('modalCartItems');
    const modalCartTotal = document.getElementById('modalCartTotal');
    modalCartItems.innerHTML = '';
    if (cart.length === 0) {
        modalCartItems.innerHTML = '<p>No hay productos en el carrito</p>';
        return;
    }
    cart.forEach(cartItem => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item-summary';
        itemElement.innerHTML = `
            <span>${cartItem.title} x ${cartItem.quantity}</span>
            <span>$${(cartItem.price * cartItem.quantity).toFixed(2)}</span>
        `;
        modalCartItems.appendChild(itemElement);
    });
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    modalCartTotal.textContent = `$${totalAmount.toFixed(2)}`;
    modal.classList.add('active');
}

async function processOrder() {
    const paymentForm = document.getElementById('paymentForm');
    const submitButton = paymentForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Procesando...';
    try {
        const orderData = {
            customer: {
                name: document.getElementById('customerName').value,
                email: document.getElementById('customerEmail').value,
                phone: document.getElementById('customerPhone').value,
                address: document.getElementById('customerAddress').value
            },
            paymentMethod: document.getElementById('paymentMethod').value,
            items: [...cart],
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            notes: document.getElementById('orderNotes').value,
            date: new Date().toISOString()
        };
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Error al procesar el pedido');
        }
        showOrderConfirmation(orderData);
    } catch (err) {
        console.error('Error al procesar pedido:', err);
        showNotification('Error al procesar el pedido: ' + err.message);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

function showOrderConfirmation(orderData) {
    const modal = document.getElementById('paymentModal');
    modal.innerHTML = '';
    modal.className = 'modal-overlay active confirmation';
    const modalContent = document.createElement('div');
    modalContent.className = 'modal';
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalBody.innerHTML = `
        <div class="confirmation-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <h2>¡Pedido Confirmado!</h2>
        <p>Gracias por tu compra, ${orderData.customer.name}.</p>
        <p>Hemos enviado los detalles a: <strong>${orderData.customer.email}</strong></p>
        <div class="order-details">
            <h3>Resumen del Pedido</h3>
            <p><strong>Número de Pedido:</strong> ${'ORD-' + Date.now().toString().slice(-6)}</p>
            <p><strong>Fecha:</strong> ${new Date(orderData.date).toLocaleDateString()}</p>
            <p><strong>Total:</strong> $${orderData.total.toFixed(2)}</p>
            <p><strong>Método de Pago:</strong> ${getPaymentMethodName(orderData.paymentMethod)}</p>
        </div>
        <button id="closeConfirmation" class="btn btn-primary">Aceptar</button>
    `;
    const closeButton = modalBody.querySelector('#closeConfirmation');
    closeButton.addEventListener('click', () => {
        cart = [];
        updateCartUI();
        modal.classList.remove('active');
        const contentContainer = document.getElementById('contentContainer');
        createCatalogContent(contentContainer);
    });
    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);
}

function getPaymentMethodName(method) {
    const methods = {
        'transfer': 'Transferencia Bancaria',
        'cash': 'Efectivo al recibir',
        'card': 'Tarjeta de Crédito/Débito'
    };
    return methods[method] || method;
}
