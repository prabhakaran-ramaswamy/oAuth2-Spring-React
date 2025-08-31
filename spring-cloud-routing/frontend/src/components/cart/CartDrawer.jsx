import React, { useEffect, useState } from 'react';
import { Drawer, List, Button, InputNumber, Typography, Space, Divider, Empty, message, Modal, Form, Input } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { cartService, orderService } from '../../services/api.js';

const { Title, Text } = Typography;

const CartDrawer = ({ visible, onClose, onCartUpdate }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingItem, setUpdatingItem] = useState({});
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartService.getCart();
      setCart(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      message.error('Failed to fetch cart');
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchCart();
    }
  }, [visible]);

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setUpdatingItem(prev => ({ ...prev, [itemId]: true }));
    try {
      await cartService.updateItem(itemId, quantity);
      message.success('Item quantity updated');
      await fetchCart(); // Refresh cart after update
      if (onCartUpdate) {
        onCartUpdate(); // Update cart count in header
      }
    } catch (error) {
      message.error('Failed to update item quantity');
    } finally {
      setUpdatingItem(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId) => {
    setUpdatingItem(prev => ({ ...prev, [itemId]: true }));
    try {
      await cartService.removeItem(itemId);
      message.success('Item removed from cart');
      await fetchCart(); // Refresh cart after removal
      if (onCartUpdate) {
        onCartUpdate(); // Update cart count in header
      }
    } catch (error) {
      message.error('Failed to remove item');
    } finally {
      setUpdatingItem(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const clearCartHandler = async () => {
    try {
      await cartService.clearCart();
      message.success('Cart cleared');
      await fetchCart(); // Refresh cart after clearing
      if (onCartUpdate) {
        onCartUpdate(); // Update cart count in header
      }
    } catch (error) {
      message.error('Failed to clear cart');
    }
  };

  const proceedToCheckout = () => {
    setCheckoutModalVisible(true);
  };

  const handleCheckout = async (values) => {
    setCheckoutLoading(true);
    try {
      // Calculate total
      const total = cart.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0);
      
      // Create order object
      const orderData = {
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
        shippingAddress: values.shippingAddress,
        total: total,
        status: 'PENDING',
        orderDate: new Date().toISOString(),
        // Note: OrderItems would need to be handled separately or the backend modified
        // For now, we'll create the order and clear the cart
      };

      // Create the order
      await orderService.create(orderData);
      
      // Clear the cart after successful order
      await cartService.clearCart();
      
      message.success('Order placed successfully!');
      setCheckoutModalVisible(false);
      form.resetFields();
      await fetchCart(); // Refresh cart
      if (onCartUpdate) {
        onCartUpdate(); // Update cart count
      }
      onClose(); // Close the cart drawer
    } catch (error) {
      console.error('Checkout error:', error);
      message.error('Failed to place order. Please try again.');
    } finally {
      setCheckoutLoading(false);
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
      {cart && cart.length > 0 ? (
        <>
          <List
            dataSource={cart}
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
                      <Text strong>Subtotal: ₹{(item.product?.price * item.quantity).toFixed(2)}</Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
          <Divider />
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Title level={4}>Total: ₹{cart.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0).toFixed(2)}</Title>
            </div>
            <Button type="primary" size="large" block onClick={proceedToCheckout}>
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

      <Modal
        title="Checkout Details"
        open={checkoutModalVisible}
        onCancel={() => {
          setCheckoutModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCheckout}
        >
          <Form.Item
            name="customerName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            name="customerEmail"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter your email address" />
          </Form.Item>

          <Form.Item
            name="customerPhone"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please enter your phone number' },
              { pattern: /^[\+]?[0-9\s\-\(\)]{10,}$/, message: 'Please enter a valid phone number' }
            ]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item
            name="shippingAddress"
            label="Shipping Address"
            rules={[{ required: true, message: 'Please enter your shipping address' }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Enter your complete shipping address" 
            />
          </Form.Item>

          <div style={{ marginBottom: 16 }}>
            <Text strong>Order Summary:</Text>
            <br />
            <Text>Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}</Text>
            <br />
            <Text strong style={{ fontSize: '16px' }}>
              Total Amount: ₹{cart.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0).toFixed(2)}
            </Text>
          </div>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setCheckoutModalVisible(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={checkoutLoading}
              >
                Place Order
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Drawer>
  );
};

export default CartDrawer;
