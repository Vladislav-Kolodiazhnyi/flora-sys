const app = {
    data: {
        products: [],
        cart: [],
        orders: [],
        currentFilter: 'all',
        searchQuery: '',
        sortOption: 'default',
        isAdmin: false,
        pendingView: null,
        defaultImg: 'https://images.unsplash.com/photo-1490750967868-58cb75069ed6?auto=format&fit=crop&w=500&q=60'
    },

    init() {
        console.log('App Initializing...');

        if (sessionStorage.getItem('flora_admin') === 'true') {
            this.data.isAdmin = true;
            this.updateAuthUI();
        }

        this.loadData();

        this.renderProducts();
        this.updateCartUI();
    },

    loadData() {
        try {
            const storedProducts = localStorage.getItem('flora_products');
            if (storedProducts) {
                this.data.products = JSON.parse(storedProducts);
            } else {
                this.data.products = [
                    { id: 1, name: "101 Червона Троянда", price: 3500, category: "Троянди", img: "https://images.unsplash.com/photo-1548094967-e25a127d1f6d?auto=format&fit=crop&w=1000&q=60" },
                    { id: 2, name: "Ніжність ранку", price: 850, category: "Троянди", img: "https://images.unsplash.com/photo-1680823558034-6e07a1a13424?auto=format&fit=crop&w=1000&q=60" },
                    { id: 3, name: "Королівський оксамит", price: 1200, category: "Троянди", img: "https://images.unsplash.com/photo-1622382885375-5d20f707d21a?auto=format&fit=crop&w=1000&q=60" },
                    { id: 4, name: "Персиковий сад", price: 900, category: "Троянди", img: "https://images.unsplash.com/photo-1559113143-aa2c8b90ef20?auto=format&fit=crop&w=1000&q=60" },

                    { id: 5, name: "Весняний мікс", price: 650, category: "Тюльпани", img: "https://images.unsplash.com/photo-1679944587532-12ae548a133e?auto=format&fit=crop&w=1000&q=60" },
                    { id: 6, name: "Жовті тюльпани", price: 600, category: "Тюльпани", img: "https://images.unsplash.com/photo-1650298306610-1d8e8d58ad4a?auto=format&fit=crop&w=1000&q=60" },
                    { id: 7, name: "Фіолетовий настрій", price: 700, category: "Тюльпани", img: "https://images.unsplash.com/photo-1595980253829-564229c3098a?auto=format&fit=crop&w=1000&q=60" },

                    { id: 8, name: "Польовий букет", price: 500, category: "Композиції", img: "https://images.unsplash.com/photo-1705526967333-c20a93163484?auto=format&fit=crop&w=1000&q=60" },
                    { id: 9, name: "Коробка щастя", price: 1100, category: "Композиції", img: "https://images.unsplash.com/photo-1759420319818-1a2c8684a584?auto=format&fit=crop&w=1000&q=60" },
                    { id: 10, name: "Осіння рапсодія", price: 850, category: "Композиції", img: "https://images.unsplash.com/photo-1696312867297-3f222935fbfe?auto=format&fit=crop&w=1000&q=60" },
                    { id: 11, name: "Соняшники & Іриси", price: 650, category: "Композиції", img: "https://images.unsplash.com/photo-1521463405500-2bbe81bb2645?auto=format&fit=crop&w=1000&q=60" },

                    { id: 12, name: "Біла орхідея (Вазон)", price: 950, category: "Інше", img: "https://images.unsplash.com/photo-1648065610742-81105a176fa8?auto=format&fit=crop&w=1000&q=60" },
                    { id: 13, name: "Лавандовий сухоцвіт", price: 450, category: "Інше", img: "https://images.unsplash.com/photo-1635692004956-9b7f9d6acbc1?auto=format&fit=crop&w=1000&q=60" },
                    { id: 14, name: "Гортензія Блу", price: 950, category: "Інше", img: "https://images.unsplash.com/photo-1721118965653-8964ffb28528?auto=format&fit=crop&w=1000&q=60" },
                    { id: 15, name: "Протея Імперіал", price: 1500, category: "Інше", img: "https://images.unsplash.com/photo-1726394871214-fc40e8a896f7?auto=format&fit=crop&w=1000&q=60" },
                ];
                this.saveProducts();
            }
        } catch (e) {
            console.error("Error loading products", e);
            this.data.products = [];
        }

        try {
            const storedOrders = localStorage.getItem('flora_orders');
            if (storedOrders) this.data.orders = JSON.parse(storedOrders);
        } catch (e) {
            console.error("Error loading orders", e);
            this.data.orders = [];
        }
    },

    switchView(viewName) {
        ['shop', 'delivery', 'admin'].forEach(v => {
            document.getElementById(`view-${v}`).classList.add('hidden');
            const btn = document.getElementById(`btn-${v}`);
            btn.classList.remove('active-nav-btn');
        });

        document.getElementById(`view-${viewName}`).classList.remove('hidden');
        document.getElementById(`btn-${viewName}`).classList.add('active-nav-btn');

        if (viewName === 'delivery') this.renderOrdersTable();
        if (viewName === 'admin') this.renderAdminTable();
    },

    checkAuth(viewName) {
        if (this.data.isAdmin) {
            this.switchView(viewName);
        } else {
            this.data.pendingView = viewName;
            document.getElementById('login-modal').classList.remove('hidden');
            document.getElementById('login-password').value = '';
            setTimeout(() => document.getElementById('login-password').focus(), 100);
        }
    },

    performLogin() {
        const pass = document.getElementById('login-password').value;
        if (pass === 'admin') {
            this.data.isAdmin = true;
            sessionStorage.setItem('flora_admin', 'true');
            document.getElementById('login-modal').classList.add('hidden');
            this.showToast('Вхід виконано успішно', 'success');
            this.updateAuthUI();
            
            if (this.data.pendingView) {
                this.switchView(this.data.pendingView);
                this.data.pendingView = null;
            }
        } else {
            this.showToast('Невірний пароль!', 'error');
            document.getElementById('login-password').classList.add('border-red-500');
        }
    },

    logout() {
        this.data.isAdmin = false;
        sessionStorage.removeItem('flora_admin');
        this.updateAuthUI();
        this.switchView('shop');
        this.showToast('Ви вийшли з системи');
    },

    updateAuthUI() {
        const btn = document.getElementById('btn-logout');
        this.data.isAdmin ? btn.classList.remove('hidden') : btn.classList.add('hidden');
    },

    updateSearch(val) {
        this.data.searchQuery = val.toLowerCase();
        this.renderProducts();
    },

    updateSort(val) {
        this.data.sortOption = val;
        this.renderProducts();
    },

    filterProducts(category) {
        this.data.currentFilter = category;

        document.querySelectorAll('.filter-btn').forEach(btn => {
            const btnText = btn.innerText;
            const isMatch = (category === 'all' && btnText === 'Всі') || btnText === category;
            
            if (isMatch) btn.classList.add('active-filter');
            else btn.classList.remove('active-filter');
        });
        
        this.renderProducts();
    },

    renderProducts() {
        const grid = document.getElementById('products-grid');
        const emptyMsg = document.getElementById('empty-shop-msg');

        let result = this.data.products.filter(p => {
            const matchesCat = this.data.currentFilter === 'all' || p.category === this.data.currentFilter;
            const matchesSearch = p.name.toLowerCase().includes(this.data.searchQuery);
            return matchesCat && matchesSearch;
        });

        if (this.data.sortOption === 'price-asc') result.sort((a, b) => a.price - b.price);
        if (this.data.sortOption === 'price-desc') result.sort((a, b) => b.price - a.price);
        if (this.data.sortOption === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name));

        if (result.length === 0) {
            grid.innerHTML = '';
            emptyMsg.classList.remove('hidden');
            return;
        }
        emptyMsg.classList.add('hidden');

        grid.innerHTML = result.map(product => `
            <div class="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-gray-100 overflow-hidden flex flex-col group">
                <div class="h-56 overflow-hidden relative bg-gray-100">
                    <img src="${product.img}" onerror="this.src='${this.data.defaultImg}'" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    <span class="absolute top-3 left-3 bg-white/95 px-3 py-1 text-xs font-bold rounded-full text-gray-600 shadow-sm">${product.category}</span>
                </div>
                <div class="p-5 flex-1 flex flex-col">
                    <h3 class="font-bold text-lg text-gray-800 mb-1 leading-tight">${product.name}</h3>
                    <div class="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                        <span class="text-xl font-bold text-pink-600">${product.price} ₴</span>
                        <button onclick="app.addToCart(${product.id})" class="bg-gray-900 text-white w-10 h-10 rounded-full hover:bg-pink-600 transition flex items-center justify-center shadow-lg transform active:scale-90">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    addToCart(id) {
        const product = this.data.products.find(p => p.id === id);
        this.data.cart.push(product);
        this.updateCartUI();
        this.showToast('Товар додано в кошик');
    },

    toggleCart() {
        document.getElementById('cart-modal').classList.toggle('hidden');
    },

    removeFromCart(index) {
        this.data.cart.splice(index, 1);
        this.updateCartUI();
    },

    updateCartUI() {
        const badge = document.getElementById('cart-count');
        const totalEl = document.getElementById('cart-total');
        const container = document.getElementById('cart-items');

        badge.innerText = this.data.cart.length;
        badge.classList.toggle('hidden', this.data.cart.length === 0);
        
        const total = this.data.cart.reduce((sum, item) => sum + item.price, 0);
        totalEl.innerText = total + " ₴";

        if (this.data.cart.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-gray-400">
                    <i class="fa-solid fa-basket-shopping text-4xl mb-2"></i>
                    <p>Кошик порожній</p>
                </div>`;
            return;
        }

        container.innerHTML = this.data.cart.map((item, index) => `
            <div class="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div class="flex items-center gap-3">
                    <img src="${item.img}" onerror="this.src='${this.data.defaultImg}'" class="w-12 h-12 rounded-lg object-cover">
                    <div>
                        <p class="font-bold text-sm text-gray-800">${item.name}</p>
                        <p class="text-pink-500 text-xs font-bold">${item.price} ₴</p>
                    </div>
                </div>
                <button onclick="app.removeFromCart(${index})" class="text-gray-400 hover:text-red-500 p-2 transition">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `).join('');
    },

    checkout() {
        const name = document.getElementById('cust-name').value;
        const addr = document.getElementById('cust-addr').value;

        if (this.data.cart.length === 0) return this.showToast("Кошик порожній!", 'error');
        if (!name || !addr) return this.showToast("Заповніть ім'я та адресу", 'error');

        const newOrder = {
            id: Date.now().toString().slice(-6),
            customer: name,
            address: addr,
            items: [...this.data.cart],
            total: this.data.cart.reduce((sum, item) => sum + item.price, 0),
            status: 'new',
            date: new Date().toLocaleString('uk-UA')
        };

        this.data.orders.unshift(newOrder);
        localStorage.setItem('flora_orders', JSON.stringify(this.data.orders));

        this.data.cart = [];
        document.getElementById('cust-name').value = '';
        document.getElementById('cust-addr').value = '';
        
        this.updateCartUI();
        this.toggleCart();
        this.showToast(`Замовлення #${newOrder.id} успішно створено!`);
    },

    renderOrdersTable() {
        const tbody = document.getElementById('orders-table-body');
        const noData = document.getElementById('no-orders-msg');

        if (this.data.orders.length === 0) {
            tbody.innerHTML = '';
            noData.classList.remove('hidden');
            return;
        }
        noData.classList.add('hidden');

        const statusLabels = {
            'new': { text: 'Нове', class: 'bg-blue-100 text-blue-700' },
            'processing': { text: 'В роботі', class: 'bg-yellow-100 text-yellow-700' },
            'shipping': { text: 'Доставка', class: 'bg-purple-100 text-purple-700' },
            'delivered': { text: 'Виконано', class: 'bg-green-100 text-green-700' }
        };

        tbody.innerHTML = this.data.orders.map(order => {
            const st = statusLabels[order.status] || statusLabels['new'];
            return `
                <tr class="hover:bg-gray-50 transition border-b border-gray-50">
                    <td class="p-4 font-mono text-gray-500 text-xs">#${order.id}</td>
                    <td class="p-4">
                        <div class="font-bold text-gray-800">${order.customer}</div>
                        <div class="text-xs text-gray-500 max-w-[150px] truncate" title="${order.address}">${order.address}</div>
                    </td>
                    <td class="p-4 font-bold text-gray-700">${order.total} ₴</td>
                    <td class="p-4 text-xs text-gray-500">${order.date.split(',')[1] || order.date}</td>
                    <td class="p-4">
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${st.class}">${st.text}</span>
                    </td>
                    <td class="p-4 text-center">
                        <button onclick="app.showOrderDetails('${order.id}')" class="text-gray-400 hover:text-blue-500 transition">
                            <i class="fa-solid fa-eye text-lg"></i>
                        </button>
                    </td>
                    <td class="p-4 text-right">
                        <select onchange="app.updateStatus('${order.id}', this.value)" class="text-xs border border-gray-200 rounded p-1.5 bg-white outline-none focus:border-pink-500 cursor-pointer">
                            <option value="" disabled selected>Дія</option>
                            <option value="processing">В роботі</option>
                            <option value="shipping">Доставка</option>
                            <option value="delivered">Виконано</option>
                            <option value="delete" class="text-red-500 font-bold">Видалити</option>
                        </select>
                    </td>
                </tr>
            `;
        }).join('');
    },

    updateStatus(id, status) {
        if (status === 'delete') {
            if (confirm('Видалити замовлення з історії?')) {
                this.data.orders = this.data.orders.filter(o => o.id !== id);
            }
        } else {
            const order = this.data.orders.find(o => o.id === id);
            if (order) order.status = status;
        }
        localStorage.setItem('flora_orders', JSON.stringify(this.data.orders));
        this.renderOrdersTable();
        if(status !== 'delete') this.showToast('Статус оновлено');
    },

    showOrderDetails(id) {
        const order = this.data.orders.find(o => o.id === id);
        if (!order) return;

        const content = document.getElementById('modal-content');
        content.innerHTML = `
            <div class="mb-4 text-sm text-gray-600 border-b pb-4">
                <p><strong>Замовлення:</strong> #${order.id}</p>
                <p><strong>Клієнт:</strong> ${order.customer}</p>
                <p><strong>Адреса:</strong> ${order.address}</p>
            </div>
            <h4 class="font-bold text-gray-800 mb-2 text-sm uppercase">Товари:</h4>
            <div class="bg-gray-50 rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto text-sm mb-4">
                ${order.items.map(item => `
                    <div class="flex justify-between border-b border-gray-200 last:border-0 pb-2 mb-2 last:pb-0 last:mb-0">
                        <span>${item.name}</span>
                        <span class="font-bold">${item.price} ₴</span>
                    </div>
                `).join('')}
            </div>
            <div class="flex justify-end pt-2">
                <div class="text-xl font-bold text-gray-800">Всього: <span class="text-pink-600">${order.total} ₴</span></div>
            </div>
        `;
        document.getElementById('order-details-modal').classList.remove('hidden');
    },

    renderAdminTable() {
        const tbody = document.getElementById('admin-products-list');
        tbody.innerHTML = this.data.products.map(p => `
            <tr class="hover:bg-gray-50 border-b border-gray-50">
                <td class="p-3"><img src="${p.img}" onerror="this.src='${this.data.defaultImg}'" class="w-8 h-8 rounded object-cover"></td>
                <td class="p-3 font-medium">${p.name} <div class="text-[10px] text-gray-500 uppercase">${p.category}</div></td>
                <td class="p-3">${p.price} ₴</td>
                <td class="p-3 text-right">
                    <button onclick="app.deleteProduct(${p.id})" class="text-red-400 hover:text-red-600 px-2"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    },

    addNewProduct() {
        const name = document.getElementById('new-prod-name').value;
        const price = document.getElementById('new-prod-price').value;
        const cat = document.getElementById('new-prod-cat').value;
        let img = document.getElementById('new-prod-img').value;

        if (!img) img = this.data.defaultImg;

        this.data.products.push({
            id: Date.now(),
            name,
            price: parseInt(price),
            category: cat,
            img
        });

        this.saveProducts();
        document.getElementById('add-product-form').reset();
        this.renderAdminTable();
        this.showToast('Товар додано в каталог');
    },

    deleteProduct(id) {
        if (confirm('Видалити цей товар з каталогу?')) {
            this.data.products = this.data.products.filter(p => p.id !== id);
            this.saveProducts();
            this.renderAdminTable();
        }
    },

    saveProducts() {
        localStorage.setItem('flora_products', JSON.stringify(this.data.products));
    },

    refreshData() {
        this.loadData();
        this.renderOrdersTable();
        this.showToast('Дані оновлено');
    },

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        
        const colors = type === 'success' ? 'bg-green-500' : 'bg-red-500';
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';

        toast.className = `flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-white transform transition-all duration-300 translate-x-full ${colors}`;
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span class="font-medium text-sm">${message}</span>`;

        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full');
        });

        setTimeout(() => {
            toast.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});