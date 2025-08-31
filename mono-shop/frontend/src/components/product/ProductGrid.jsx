import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Spin, message, Typography, InputNumber, Space, Tag } from 'antd';
import { ShoppingCartOutlined, EyeOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { productService, cartService } from '../../services/api.js';
import ProductImage from '../common/ProductImage.jsx';

const { Title, Text } = Typography;
const { Meta } = Card;

const ProductGrid = ({ categoryId, onCartUpdate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let response;
      if (categoryId) {
        // Use the specific endpoint for category filtering
        response = await productService.getByCategory(categoryId);
      } else {
        // Get all products if no category filter
        response = await productService.getAll();
      }
      
      const products = Array.isArray(response.data) ? response.data : [];
      setProducts(products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      message.error('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getQuantity = (productId) => quantities[productId] || 1;

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 5) { // Limit max quantity to 5
      setQuantities(prev => ({ ...prev, [productId]: newQuantity }));
    }
  };

  const increaseQuantity = (productId) => {
    const currentQuantity = getQuantity(productId);
    updateQuantity(productId, currentQuantity + 1);
  };

  const decreaseQuantity = (productId) => {
    const currentQuantity = getQuantity(productId);
    updateQuantity(productId, currentQuantity - 1);
  };

  const addToCartHandler = async (productId, quantity = null) => {
    const finalQuantity = quantity || getQuantity(productId);
    
    // Set loading state for this product
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    
    try {
      await cartService.addItem(productId, finalQuantity);
      message.success(`Added ${finalQuantity} item(s) to cart successfully`);
      // Reset quantity after successful add
      setQuantities(prev => ({ ...prev, [productId]: 1 }));
      // Update cart count in parent component
      if (onCartUpdate) {
        onCartUpdate();
      }
    } catch (error) {
      console.error('Cart error details:', error);
      message.error(`Failed to add product to cart: ${error.response?.data?.message || error.message}`);
    } finally {
      // Clear loading state for this product
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', textAlign: 'center', padding: '50px' }} />;
  }

  return (
    <div>
      <Title level={2}>Products</Title>
      {products.length === 0 && !loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '50px 0', 
          color: '#999',
          fontSize: '16px'
        }}>
          <EyeOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <div>No products found for this category</div>
          {categoryId && (
            <div style={{ marginTop: 8, fontSize: '14px' }}>
              Category ID: {categoryId}
            </div>
          )}
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Card
              hoverable
              cover={
                <ProductImage
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ height: 200 }}
                  fallbackIcon={<EyeOutlined />}
                  fallbackText="No Image Available"
                />
              }
              actions={[
                <div key="quantity-controls" style={{ padding: '8px 16px' }}>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <Button
                        size="small"
                        icon={<MinusOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          decreaseQuantity(product.id);
                        }}
                        disabled={getQuantity(product.id) <= 1}
                      />
                      <InputNumber
                        size="small"
                        min={1}
                        max={5}
                        value={getQuantity(product.id)}
                        onChange={(value) => updateQuantity(product.id, value)}
                        style={{ width: 60, textAlign: 'center' }}
                      />
                      <Button
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          increaseQuantity(product.id);
                        }}
                        disabled={getQuantity(product.id) >= 5}
                      />
                    </div>
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      loading={addingToCart[product.id]}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCartHandler(product.id);
                      }}
                      disabled={product.stock === 0}
                      block
                      size="small"
                    >
                      Add to Cart
                    </Button>
                  </Space>
                </div>
              ]}
            >
              <Meta 
                title={product.name} 
                description={
                  <div>
                    <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                      ₹{product.price}
                    </Text>
                    <br />
                    <Text type="secondary">{product.description}</Text>
                    <br />
                    <Space style={{ marginTop: 8 }}>
                      <Tag>{product.category?.name || product.category || 'No Category'}</Tag>
                    </Space>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
        </Row>
      )}
    </div>
  );
};

export default ProductGrid;
