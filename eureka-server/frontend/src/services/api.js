import axios from 'axios';

// Configure axios defaults for session management
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true;

// Use single API base URL from .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090/';

// Create axios instance for cart service with session support
const cartAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const productService = {
  getAll: () => axios.get(`${API_BASE_URL}products`),
  getById: (id) => axios.get(`${API_BASE_URL}products/${id}`),
  getByCategory: (categoryId) => axios.get(`${API_BASE_URL}products/category/${categoryId}`),
  create: (product) => axios.post(`${API_BASE_URL}products`, product),
  update: (id, product) => axios.put(`${API_BASE_URL}products/${id}`, product),
  delete: (id) => axios.delete(`${API_BASE_URL}products/${id}`),
};

export const customerService = {
  getAll: () => axios.get(`${API_BASE_URL}customers`),
  getById: (id) => axios.get(`${API_BASE_URL}customers/${id}`),
  create: (customer) => axios.post(`${API_BASE_URL}customers`, customer),
  update: (id, customer) => axios.put(`${API_BASE_URL}customers/${id}`, customer),
  delete: (id) => axios.delete(`${API_BASE_URL}customers/${id}`),
};

export const orderService = {
  getAll: () => axios.get(`${API_BASE_URL}orders`),
  getById: (id) => axios.get(`${API_BASE_URL}orders/${id}`),
  create: (order) => axios.post(`${API_BASE_URL}orders`, order),
  updateStatus: (id, status) => axios.patch(`${API_BASE_URL}orders/${id}/status`, { status }),
};

export const categoryService = {
  getAll: () => axios.get(`${API_BASE_URL}categories`),
  getById: (id) => axios.get(`${API_BASE_URL}categories/${id}`),
  create: (formData) => axios.post(`${API_BASE_URL}categories`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  update: (id, formData) => axios.put(`${API_BASE_URL}categories/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  delete: (id) => axios.delete(`${API_BASE_URL}categories/${id}`),
};

export const cartService = {
  getCart: () => {
    console.log('Getting cart...');
    return axios.get(`${API_BASE_URL}cart`, {
      withCredentials: true
    });
  },
  addItem: (productId, quantity) => {
    console.log('Adding item to cart...', productId, quantity);
    return axios.post(`${API_BASE_URL}cart/items`, 
      { productId, quantity }, 
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  },
  updateItem: (itemId, quantity) => cartAxios.put(`cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => cartAxios.delete(`cart/items/${itemId}`),
  clearCart: () => cartAxios.delete('cart'),
  getCartCount: () => {
    console.log('Getting cart count...');
    return axios.get(`${API_BASE_URL}cart/count`, {
      withCredentials: true
    });
  },
  updateQuantity: (productId, quantity) => cartAxios.post('cart/items', { productId, quantity }),
  removeFromCart: (productId) => cartAxios.delete(`cart/items/${productId}`),
};