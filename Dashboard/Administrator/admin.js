/* Menú de hamburguesa */

const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
});

overlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
});

const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Sudaderas', 'Tazas', 'Playeras', 'Termos'],
      datasets: [{
        label: 'No. de ventas',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 5
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });

  // admin.js - Lógica del panel de administración

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const productForm = document.getElementById('productForm');
    const productsList = document.getElementById('productsList');
    const imageUpload = document.getElementById('imageUpload');
    
    // Cargar productos al iniciar
    loadProducts();

    // Manejar envío del formulario
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewProduct();
    });

    // Manejar subida de imagen
    imageUpload.addEventListener('change', function(e) {
        handleImageUpload(e.target.files[0]);
    });

    // Cargar productos existentes
    function loadProducts() {
        const products = productManager.getProducts();
        productsList.innerHTML = '';

        if (products.length === 0) {
            productsList.innerHTML = '<p class="no-products">No hay productos registrados.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = createProductCard(product);
            productsList.appendChild(productCard);
        });
    }

    // Crear tarjeta de producto
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = product.id;

        card.innerHTML = `
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p><strong>Categoría:</strong> ${product.category}</p>
            <p><strong>SKU:</strong> ${product.sku || 'No asignado'}</p>
            <p><strong>Stock:</strong> ${product.stock} unidades</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <div class="product-actions">
                <button class="btn btn-secondary edit-btn" data-id="${product.id}">Editar</button>
                <button class="btn btn-danger delete-btn" data-id="${product.id}">Eliminar</button>
            </div>
        `;

        // Agregar event listeners a los botones
        card.querySelector('.edit-btn').addEventListener('click', () => openEditModal(product.id));
        card.querySelector('.delete-btn').addEventListener('click', () => deleteProduct(product.id));

        return card;
    }

    // Agregar nuevo producto
    function addNewProduct() {
        const productData = {
            name: document.getElementById('productName').value.trim(),
            description: document.getElementById('productDescription').value.trim(),
            price: parseFloat(document.getElementById('productPrice').value),
            category: document.getElementById('productCategory').value,
            stock: parseInt(document.getElementById('productStock').value),
            image: document.getElementById('productImage').value.trim(),
            sku: document.getElementById('productSKU').value.trim()
        };

        // Validaciones básicas
        if (!productData.name || !productData.description || productData.price <= 0) {
            alert('Por favor, complete todos los campos obligatorios correctamente.');
            return;
        }

        // Validar SKU único
        if (productData.sku && !productManager.isSkuUnique(productData.sku)) {
            alert('El SKU ya está en uso. Por favor, use un SKU único.');
            return;
        }

        try {
            productManager.addProduct(productData);
            productForm.reset();
            loadProducts();
            alert('¡Producto agregado exitosamente!');
        } catch (error) {
            alert('Error al agregar el producto: ' + error.message);
        }
    }

    // Eliminar producto
    function deleteProduct(id) {
        if (confirm('¿Está seguro de que desea eliminar este producto?')) {
            const success = productManager.deleteProduct(id);
            if (success) {
                loadProducts();
                alert('Producto eliminado exitosamente.');
            }
        }
    }

    // Abrir modal para editar
    function openEditModal(id) {
        const product = productManager.getProductById(id);
        if (!product) return;

        // Crear formulario de edición dinámicamente
        const formHtml = `
            <div class="form-group">
                <label for="editName">Nombre</label>
                <input type="text" id="editName" value="${product.name}" required>
            </div>
            <div class="form-group">
                <label for="editDescription">Descripción</label>
                <textarea id="editDescription" rows="3" required>${product.description}</textarea>
            </div>
            <div class="form-group">
                <label for="editPrice">Precio</label>
                <input type="number" id="editPrice" value="${product.price}" step="0.01" required>
            </div>
            <div class="form-group">
                <label for="editStock">Stock</label>
                <input type="number" id="editStock" value="${product.stock}" required>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Actualizar</button>
                <button type="button" class="btn btn-secondary close-modal">Cancelar</button>
            </div>
        `;

        const modal = document.getElementById('editModal');
        const form = document.getElementById('editProductForm');
        form.innerHTML = formHtml;
        
        modal.style.display = 'block';

        // Manejar envío del formulario de edición
        form.onsubmit = function(e) {
            e.preventDefault();
            updateProduct(id);
        };

        // Cerrar modal
        document.querySelector('.close-modal').onclick = () => {
            modal.style.display = 'none';
        };

        window.onclick = function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    // Actualizar producto
    function updateProduct(id) {
        const updatedData = {
            name: document.getElementById('editName').value.trim(),
            description: document.getElementById('editDescription').value.trim(),
            price: parseFloat(document.getElementById('editPrice').value),
            stock: parseInt(document.getElementById('editStock').value)
        };

        const success = productManager.updateProduct(id, updatedData);
        if (success) {
            document.getElementById('editModal').style.display = 'none';
            loadProducts();
            alert('Producto actualizado exitosamente.');
        }
    }

    // Manejar subida de imagen (simulada)
    function handleImageUpload(file) {
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            alert('Por favor, seleccione un archivo de imagen válido.');
            return;
        }

        // En un entorno real, aquí subirías la imagen a un servidor
        // Por ahora, simulamos una URL local
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('productImage').value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});