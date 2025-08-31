import axios from 'axios';

// Configure axios defaults for session management
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true;

// Service endpoints configuration
const SERVICE_ENDPOINTS = {
  PRODUCT_SERVICE: 'http://localhost:9095',
  CUSTOMER_SERVICE: 'http://localhost:9093', 
  ORDER_SERVICE: 'http://localhost:9094',
  CART_SERVICE: 'http://localhost:9091',
  CATEGORY_SERVICE: 'http://localhost:9092'
};

// Create axios instance for cart service with session support
const cartAxios = axios.create({
  baseURL: SERVICE_ENDPOINTS.CART_SERVICE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const productService = {
  getAll: () => axios.get(`${SERVICE_ENDPOINTS.PRODUCT_SERVICE}/products`),
  getById: (id) => axios.get(`${SERVICE_ENDPOINTS.PRODUCT_SERVICE}/products/${id}`),
  getByCategory: (categoryId) => axios.get(`${SERVICE_ENDPOINTS.PRODUCT_SERVICE}/products/category/${categoryId}`),
  create: (product) => axios.post(`${SERVICE_ENDPOINTS.PRODUCT_SERVICE}/products`, product),
  update: (id, product) => axios.put(`${SERVICE_ENDPOINTS.PRODUCT_SERVICE}/products/${id}`, product),
  delete: (id) => axios.delete(`${SERVICE_ENDPOINTS.PRODUCT_SERVICE}/products/${id}`),
};

export const customerService = {
  getAll: () => axios.get(`${SERVICE_ENDPOINTS.CUSTOMER_SERVICE}/customers`),
  getById: (id) => axios.get(`${SERVICE_ENDPOINTS.CUSTOMER_SERVICE}/customers/${id}`),
  create: (customer) => axios.post(`${SERVICE_ENDPOINTS.CUSTOMER_SERVICE}/customers`, customer),
  update: (id, customer) => axios.put(`${SERVICE_ENDPOINTS.CUSTOMER_SERVICE}/customers/${id}`, customer),
  delete: (id) => axios.delete(`${SERVICE_ENDPOINTS.CUSTOMER_SERVICE}/customers/${id}`),
};

export const orderService = {
  getAll: () => axios.get(`${SERVICE_ENDPOINTS.ORDER_SERVICE}/orders`),
  getById: (id) => axios.get(`${SERVICE_ENDPOINTS.ORDER_SERVICE}/orders/${id}`),
  create: (order) => axios.post(`${SERVICE_ENDPOINTS.ORDER_SERVICE}/orders`, order),
  updateStatus: (id, status) => axios.patch(`${SERVICE_ENDPOINTS.ORDER_SERVICE}/orders/${id}/status`, { status }),
};

export const categoryService = {
  getAll: () => axios.get(`${SERVICE_ENDPOINTS.CATEGORY_SERVICE}/categories`),
  getById: (id) => axios.get(`${SERVICE_ENDPOINTS.CATEGORY_SERVICE}/categories/${id}`),
  create: (formData) => axios.post(`${SERVICE_ENDPOINTS.CATEGORY_SERVICE}/categories`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  update: (id, formData) => axios.put(`${SERVICE_ENDPOINTS.CATEGORY_SERVICE}/categories/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  delete: (id) => axios.delete(`${SERVICE_ENDPOINTS.CATEGORY_SERVICE}/categories/${id}`),
};

export const cartService = {
  getCart: () => {
    console.log('Getting cart...');
    return axios.get(`${SERVICE_ENDPOINTS.CART_SERVICE}/cart`, {
      withCredentials: true
    });
  },
  addItem: (productId, quantity) => {
    console.log('Adding item to cart...', productId, quantity);
    return axios.post(`${SERVICE_ENDPOINTS.CART_SERVICE}/cart/items`, 
      { productId, quantity }, 
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  },
  updateItem: (itemId, quantity) => cartAxios.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => cartAxios.delete(`/cart/items/${itemId}`),
  clearCart: () => cartAxios.delete('/cart'),
  getCartCount: () => {
    console.log('Getting cart count...');
    return axios.get(`${SERVICE_ENDPOINTS.CART_SERVICE}/cart/count`, {
      withCredentials: true
    });
  },
  updateQuantity: (productId, quantity) => cartAxios.post('/cart/items', { productId, quantity }),
  removeFromCart: (productId) => cartAxios.delete(`/cart/items/${productId}`),
};