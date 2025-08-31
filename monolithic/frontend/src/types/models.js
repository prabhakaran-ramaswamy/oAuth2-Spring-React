/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {string} category
 * @property {number} stock
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Customer
 * @property {number} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} phone
 * @property {string} address
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Order
 * @property {number} id
 * @property {number} customerId
 * @property {string} orderDate
 * @property {string} status
 * @property {number} totalAmount
 * @property {OrderItem[]} items
 */

/**
 * @typedef {Object} OrderItem
 * @property {number} id
 * @property {number} productId
 * @property {number} quantity
 * @property {number} unitPrice
 * @property {Product} [product]
 */

export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {T} data
 * @property {string} message
 * @property {boolean} success
 */

/**
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} imageUrl
 * @property {string} createdAt
 */

/**
 * @typedef {Object} CartItem
 * @property {number} id
 * @property {number} productId
 * @property {number} quantity
 * @property {Product} product
 * @property {number} subtotal
 */

/**
 * @typedef {Object} Cart
 * @property {number} id
 * @property {CartItem[]} items
 * @property {number} totalAmount
 * @property {number} totalItems
 */
