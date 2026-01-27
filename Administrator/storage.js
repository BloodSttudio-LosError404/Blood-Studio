// storage.js - Gestión del localStorage

class ProductManager {
    constructor() {
        this.STORAGE_KEY = 'ecommerce_products';
        this.initializeProducts();
    }

    // Inicializar productos si no existen
    initializeProducts() {
        if (!this.getProducts()) {
            const initialProducts = [
                {
                    id: 1,
                    name: 'Laptop Gamer',
                    description: 'Laptop de alto rendimiento para gaming',
                    price: 1200.99,
                    category: 'Tazas',
                    stock: 15,
                    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302',
                    sku: 'LAP-001',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Camiseta Deportiva',
                    description: 'Camiseta transpirable para deporte',
                    price: 29.99,
                    category: 'Playeras',
                    stock: 50,
                    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
                    sku: 'CAM-001',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialProducts));
        }
    }

    // Obtener todos los productos
    getProducts() {
        const products = localStorage.getItem(this.STORAGE_KEY);
        return products ? JSON.parse(products) : [];
    }

    // Obtener un producto por ID
    getProductById(id) {
        const products = this.getProducts();
        return products.find(product => product.id === id);
    }

    // Agregar nuevo producto
    addProduct(productData) {
        const products = this.getProducts();
        
        // Generar ID único
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        
        const newProduct = {
            id: newId,
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        products.push(newProduct);
        this.saveProducts(products);
        return newProduct;
    }

    // Actualizar producto
    updateProduct(id, updatedData) {
        const products = this.getProducts();
        const index = products.findIndex(product => product.id === id);
        
        if (index !== -1) {
            products[index] = {
                ...products[index],
                ...updatedData,
                updatedAt: new Date().toISOString()
            };
            this.saveProducts(products);
            return products[index];
        }
        
        return null;
    }

    // Eliminar producto
    deleteProduct(id) {
        const products = this.getProducts();
        const filteredProducts = products.filter(product => product.id !== id);
        this.saveProducts(filteredProducts);
        return filteredProducts.length !== products.length;
    }

    // Guardar productos en localStorage
    saveProducts(products) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    }

    // Obtener siguiente ID disponible (para formulario)
    getNextId() {
        const products = this.getProducts();
        return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    }

    // Validar SKU único
    isSkuUnique(sku, excludeId = null) {
        const products = this.getProducts();
        return !products.some(product => 
            product.sku === sku && product.id !== excludeId
        );
    }
}

// Exportar instancia única
const productManager = new ProductManager();
/* export default productManager; */