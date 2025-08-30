import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Spin, message, Typography, InputNumber, Space, Tag } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { productService, cartService } from '../services/api.js';

const { Title, Text } = Typography;
const { Meta } = Card;

const ProductGrid = ({ categoryId, onCartUpdate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAll();
      let filteredProducts = response.data.data || [];
      
      if (categoryId) {
        filteredProducts = filteredProducts.filter(product => 
          product.category === categoryId || product.categoryId === categoryId
        );
      }
      
      setProducts(filteredProducts);
    } catch (error) {
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    try {
      await cartService.addItem(productId, quantity);
      message.success('Product added to cart successfully');
      if (onCartUpdate) onCartUpdate();
    } catch (error) {
      message.error('Failed to add product to cart');
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', textAlign: 'center', padding: '50px' }} />;
  }

  return (
    <div>
      <Title level={2}>Products</Title>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Card
              hoverable
              cover={
                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
                  {product.imageUrl ? (
                    <img 
                      alt={product.name} 
                      src={product.imageUrl} 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#ccc' }}>
                      <EyeOutlined style={{ fontSize: 48 }} />
                      <div>No Image</div>
                    </div>
                  )}
                </div>
              }
              actions={[
                <Button
                  key="add-to-cart"
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  loading={addingToCart[product.id]}
                  onClick={() => addToCart(product.id)}
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </Button>
              ]}
            >
              <Meta 
                title={product.name} 
                description={
                  <div>
                    <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                      ${product.price}
                    </Text>
                    <br />
                    <Text type="secondary">{product.description}</Text>
                    <br />
                    <Space style={{ marginTop: 8 }}>
                      <Tag color={product.stock > 0 ? 'green' : 'red'}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </Tag>
                      <Tag>{product.category}</Tag>
                    </Space>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductGrid;
