import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu, Typography, Button, Badge } from 'antd';
import { ShopOutlined, UserOutlined, ShoppingCartOutlined, AppstoreOutlined, TagsOutlined } from '@ant-design/icons';
import { cartService } from './services/api.js';
import ProductList from './components/product/ProductList.jsx';
import ProductBrowsePage from './components/product/ProductBrowsePage.jsx';
import CategoryList from './components/category/CategoryList.jsx';
import OrderList from './components/order/OrderList.jsx';
import CustomerList from './components/customer/CustomerList.jsx';
import CartDrawer from './components/cart/CartDrawer.jsx';
import ShopPage from './components/shop/ShopPage.jsx';

const { Header, Content } = Layout;
const { Title } = Typography;

const AppContent = () => {
  const [cartVisible, setCartVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const response = await cartService.getCartCount();
      console.log('Cart count API response:', response); // Debug log
      console.log('Cart count response.data:', response.data); // Debug log
      // Handle both direct number response and object with count property
      const count = typeof response.data === 'number' ? response.data : (response.data?.count || 0);
      console.log('Final cart count:', count); // Debug log
      setCartCount(count);
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    // Fetch initial cart count when app loads
    fetchCartCount();
  }, []);

  const menuItems = [
    {
      key: 'shop',
      icon: <AppstoreOutlined />,
      label: <Link to="/shop">Shop by Category</Link>,
    },
    {
      key: 'products',
      icon: <ShopOutlined />,
      label: <Link to="/products">Products</Link>,
    },
    {
      key: 'categories',
      icon: <TagsOutlined />,
      label: <Link to="/categories">Categories</Link>,
    },
    {
      key: 'customers',
      icon: <UserOutlined />,
      label: <Link to="/customers">Customers</Link>,
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: <Link to="/orders">Orders</Link>,
    },
  ];

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f0f2f5' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Title level={3} style={{ color: '#1890ff', margin: 0, cursor: 'pointer' }}>
              NLineX Shop
            </Title>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Badge count={cartCount} showZero>
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                size="large"
                onClick={() => setCartVisible(true)}
                style={{ 
                  borderRadius: 6,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                }}
              >
                Cart
              </Button>
            </Badge>
            <Menu
              theme="light"
              mode="horizontal"
              defaultSelectedKeys={['shop']}
              items={menuItems}
              style={{ backgroundColor: 'transparent', border: 'none' }}
            />
          </div>
        </Header>
        <Content style={{ padding: '24px', background: '#fff' }}>
          <Routes>
            <Route path="/" element={<ShopPage onCartUpdate={fetchCartCount} />} />
            <Route path="/shop" element={<ShopPage onCartUpdate={fetchCartCount} />} />
            <Route path="/products" element={<ProductList onCartUpdate={fetchCartCount} />} />
            <Route path="/browse-products/:categoryId" element={<ProductBrowsePage onCartUpdate={fetchCartCount} />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/orders" element={<OrderList />} />
          </Routes>
        </Content>
        <CartDrawer
          visible={cartVisible}
          onClose={() => setCartVisible(false)}
          onCartUpdate={fetchCartCount}
        />
      </Layout>
    </Router>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;