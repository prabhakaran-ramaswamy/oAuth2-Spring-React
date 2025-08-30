import React, { useState, useEffect } from 'react';
import { Drawer, List, Button, InputNumber, Typography, Space, Divider, Empty, message } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { cartService } from '../services/api.js';

const { Title, Text } = Typography;

const CartDrawer = ({ visible, onClose, onCartUpdate }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    if (visible) {
      fetchCart();
    }
  }, [visible]);

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

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setUpdating(prev => ({ ...prev, [itemId]: true }));
    try {
      await cartService.updateItem(itemId, quantity);
      await fetchCart();
      if (onCartUpdate) onCartUpdate();
    } catch (error) {
      message.error('Failed to update item quantity');
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId) => {
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    try {
      await cartService.removeItem(itemId);
      await fetchCart();
      if (onCartUpdate) onCartUpdate();
      message.success('Item removed from cart');
    } catch (error) {
      message.error('Failed to remove item');
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
      if (onCartUpdate) onCartUpdate();
      message.success('Cart cleared');
    } catch (error) {
      message.error('Failed to clear cart');
    }
  };

  return (
    <Drawer
      title="Shopping Cart"
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
    >
      {cart && cart.items && cart.items.length > 0 ? (
        <>
          <List
            dataSource={cart.items}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                actions={[
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    size="small"
                    loading={updating[item.id]}
                    onClick={() => removeItem(item.id)}
                  />
                ]}
              >
                <List.Item.Meta
                  title={item.product?.name}
                  description={
                    <Space direction="vertical" size="small">
                      <Text>${item.product?.price}</Text>
                      <InputNumber
                        min={1}
                        max={item.product?.stock}
                        value={item.quantity}
                        onChange={(value) => updateQuantity(item.id, value)}
                        loading={updating[item.id]}
                        size="small"
                      />
                      <Text strong>Subtotal: ${item.subtotal}</Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
          <Divider />
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>Total Items: {cart.totalItems}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Title level={4}>Total: ${cart.totalAmount}</Title>
            </div>
            <Button type="primary" size="large" block>
              Proceed to Checkout
            </Button>
            <Button onClick={clearCart} block>
              Clear Cart
            </Button>
          </Space>
        </>
      ) : (
        <Empty
          image={<ShoppingCartOutlined style={{ fontSize: 64, color: '#ccc' }} />}
          description="Your cart is empty"
        />
      )}
    </Drawer>
  );
};

export default CartDrawer;
