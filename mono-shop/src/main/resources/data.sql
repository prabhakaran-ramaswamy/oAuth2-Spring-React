-- Sample data for mono-shop application
-- Insert categories first (due to foreign key constraint)

INSERT INTO category (name, description, image_url) VALUES
('Electronics', 'Electronic devices and gadgets', 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500'),
('Clothing', 'Fashion and apparel for all ages', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500'),
('Books', 'Books, magazines, and educational materials', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'),
('Home & Garden', 'Home improvement and garden supplies', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500'),
('Sports', 'Sports equipment and fitness gear', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500'),
('Beauty', 'Cosmetics and personal care products', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500');

-- Insert products (assuming category IDs 1-6 from above inserts)

-- Electronics products
INSERT INTO product (name, price, category_id, description, image_url) VALUES
('iPhone 15 Pro', 999.99, 1, 'Latest Apple smartphone with advanced camera system', 'https://images.unsplash.com/photo-1592910147095-d5f5a5c3eb9e?w=500'),
('MacBook Air M2', 1199.99, 1, 'Lightweight laptop with Apple M2 chip', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'),
('Samsung 4K TV', 799.99, 1, '55-inch 4K Smart TV with HDR support', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500'),
('Sony Headphones', 299.99, 1, 'Wireless noise-canceling headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'),
('iPad Pro', 1099.99, 1, '12.9-inch tablet with M2 chip', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500'),

-- Clothing products
('Denim Jacket', 79.99, 2, 'Classic blue denim jacket for casual wear', 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=500'),
('Running Shoes', 129.99, 2, 'Comfortable athletic shoes for running', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'),
('Cotton T-Shirt', 24.99, 2, 'Soft cotton t-shirt in various colors', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'),
('Wool Sweater', 89.99, 2, 'Warm wool sweater for winter', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500'),
('Summer Dress', 59.99, 2, 'Light and breezy summer dress', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'),

-- Books products
('The Great Gatsby', 14.99, 3, 'Classic American novel by F. Scott Fitzgerald', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'),
('Programming Book', 49.99, 3, 'Learn modern web development techniques', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500'),
('Cookbook Collection', 34.99, 3, 'Collection of international recipes', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'),
('History Atlas', 39.99, 3, 'Comprehensive world history atlas', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500'),
('Science Magazine', 12.99, 3, 'Monthly science and technology magazine', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'),

-- Home & Garden products
('Coffee Maker', 149.99, 4, 'Programmable drip coffee maker', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500'),
('Garden Tools Set', 79.99, 4, 'Complete set of essential garden tools', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500'),
('Throw Pillows', 29.99, 4, 'Decorative pillows for living room', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500'),
('Kitchen Knives', 199.99, 4, 'Professional chef knife set', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500'),
('Table Lamp', 89.99, 4, 'Modern LED desk lamp with adjustable brightness', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'),

-- Sports products
('Yoga Mat', 39.99, 5, 'Non-slip yoga mat for exercise', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500'),
('Basketball', 29.99, 5, 'Official size basketball for outdoor play', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500'),
('Dumbbells Set', 199.99, 5, 'Adjustable weight dumbbells for home gym', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500'),
('Tennis Racket', 159.99, 5, 'Professional tennis racket with grip', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500'),
('Bicycle Helmet', 69.99, 5, 'Safety helmet for cycling', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'),

-- Beauty products
('Skincare Set', 89.99, 6, 'Complete skincare routine set', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500'),
('Makeup Palette', 49.99, 6, 'Professional eyeshadow palette', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500'),
('Hair Dryer', 79.99, 6, 'Professional ionic hair dryer', 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500'),
('Perfume', 129.99, 6, 'Luxury fragrance for special occasions', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500'),
('Face Mask Set', 24.99, 6, 'Hydrating face masks for all skin types', 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500');

-- Display inserted data count
SELECT 'Categories inserted:' as info, COUNT(*) as count FROM category
UNION ALL
SELECT 'Products inserted:' as info, COUNT(*) as count FROM product;