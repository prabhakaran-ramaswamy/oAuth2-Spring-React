import React, { useEffect } from 'react';
import { Drawer, List, Button, InputNumber, Typography, Space, Divider, Empty, message } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useAppDispatch, useCart, useUpdatingItem } from '../../store/hooks.js';
import { fetchCart, updateCartItem, removeFromCart, setUpdatingItem } from '../../store/cartSlice.js';

const { Title, Text } = Typography;

const CartDrawer = ({ visible, onClose }) => {
  const dispatch = useAppDispatch();
  const { items: cart, loading, error } = useCart();
  const updatingItem = useUpdatingItem();

  useEffect(() => {
    if (visible) {
      dispatch(fetchCart());
    }
  }, [visible, dispatch]);

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    dispatch(setUpdatingItem({ itemId, loading: true }));
    try {
      await dispatch(updateCartItem({ itemId, quantity })).unwrap();
      message.success('Item quantity updated');
    } catch (error) {
      message.error('Failed to update item quantity');
    } finally {
      dispatch(setUpdatingItem({ itemId, loading: false }));
    }
  };

  const removeItem = async (itemId) => {
    dispatch(setUpdatingItem({ itemId, loading: true }));
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
      message.success('Item removed from cart');
    } catch (error) {
      message.error('Failed to remove item');
    } finally {
      dispatch(setUpdatingItem({ itemId, loading: false }));
    }
  };

  const clearCartHandler = async () => {
    try {
      await dispatch(clearCart()).unwrap();
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
                    loading={updatingItem[item.id]}
                    onClick={() => removeItem(item.id)}
                  />
                ]}
              >
                <List.Item.Meta
                  title={item.product?.name}
                  description={
                    <Space direction="vertical" size="small">
                      <Text>₹{item.product?.price}</Text>
                      <InputNumber
                        min={1}
                        max={item.product?.stock}
                        value={item.quantity}
                        onChange={(value) => updateQuantity(item.id, value)}
                        loading={updatingItem[item.id]}
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
            <Button onClick={clearCartHandler} block>
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
