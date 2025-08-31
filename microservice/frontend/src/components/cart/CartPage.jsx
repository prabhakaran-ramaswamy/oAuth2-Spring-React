import React, { useState, useEffect } from 'react';
import { Card, List, Button, InputNumber, Typography, Space, Divider, Empty, message, Row, Col, Statistic } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, ShopOutlined, ClearOutlined } from '@ant-design/icons';
import { cartService } from '../../services/api.js';

const { Title, Text } = Typography;

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartService.getCart();
      setCart(response.data.data);
    } catch (error) {
      message.error('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }
      await cartService.updateQuantity(productId, quantity);
      await fetchCart();
      message.success('Cart updated');
    } catch (error) {
      message.error('Failed to update cart');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartService.removeFromCart(productId);
      await fetchCart();
      message.success('Item removed from cart');
    } catch (error) {
      message.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      await fetchCart();
      message.success('Cart cleared');
    } catch (error) {
      message.error('Failed to clear cart');
    }
  };

  const proceedToCheckout = () => {
    message.info('Checkout functionality coming soon!');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <ShoppingCartOutlined style={{ fontSize: 48, color: '#ccc' }} />
        <div style={{ marginTop: 16 }}>Loading cart...</div>
      </div>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Row gutter={24}>
        <Col span={16}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShoppingCartOutlined style={{ color: '#1890ff' }} />
                Shopping Cart ({cart?.items?.length || 0} items)
              </div>
            }
            extra={
              !isEmpty && (
                <Button 
                  danger 
                  icon={<ClearOutlined />} 
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              )
            }
          >
            {isEmpty ? (
              <Empty
                image={<ShoppingCartOutlined style={{ fontSize: 64, color: '#ccc' }} />}
                description={
                  <div>
                    <Text>Your cart is empty</Text>
                    <br />
                    <Button 
                      type="primary" 
                      icon={<ShopOutlined />} 
                      style={{ marginTop: 16 }}
                      href="/shop"
                    >
                      Start Shopping
                    </Button>
                  </div>
                }
              />
            ) : (
              <List
                dataSource={cart.items}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <InputNumber
                        min={1}
                        value={item.quantity}
                        onChange={(value) => updateQuantity(item.product.id, value)}
                        style={{ width: 80 }}
                      />,
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeFromCart(item.product.id)}
                      />
                    ]}
                    style={{ padding: '16px 0' }}
                  >
                    <List.Item.Meta
                      avatar={
                        <div style={{ 
                          width: 64, 
                          height: 64, 
                          backgroundColor: '#f5f5f5', 
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {item.product.imageUrl ? (
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                            />
                          ) : (
                            <ShopOutlined style={{ fontSize: 24, color: '#ccc' }} />
                          )}
                        </div>
                      }
                      title={
                        <div>
                          <Text strong>{item.product.name}</Text>
                          <br />
                          <Text type="secondary">{item.product.category}</Text>
                        </div>
                      }
                      description={
                        <div>
                          <Text>₹{item.product.price} each</Text>
                          <br />
                          <Text strong>Subtotal: ₹{(item.product.price * item.quantity).toFixed(2)}</Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Order Summary">
            {isEmpty ? (
              <Text type="secondary">No items in cart</Text>
            ) : (
              <div>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Subtotal:</Text>
                    <Text>₹{cart.totalAmount?.toFixed(2) || '0.00'}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Shipping:</Text>
                    <Text>Free</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Tax:</Text>
                    <Text>₹{((cart.totalAmount || 0) * 0.1).toFixed(2)}</Text>
                  </div>
                  <Divider />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong style={{ fontSize: 16 }}>Total:</Text>
                    <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                      ₹{((cart.totalAmount || 0) * 1.1).toFixed(2)}
                    </Text>
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    style={{ width: '100%', marginTop: 16 }}
                    onClick={proceedToCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </Space>
              </div>
            )}
          </Card>

          <Card title="Order Information" style={{ marginTop: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Statistic 
                title="Items in Cart" 
                value={cart?.items?.length || 0} 
                prefix={<ShoppingCartOutlined />}
              />
              <Statistic 
                title="Total Quantity" 
                value={cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
              />
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
