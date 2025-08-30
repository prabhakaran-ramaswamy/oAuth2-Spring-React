import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import { ShopOutlined, UserOutlined, ShoppingCartOutlined, AppstoreOutlined, ProfileOutlined } from '@ant-design/icons';
import ProductList from './components/ProductList.jsx';
import ShopPage from './components/ShopPage.jsx';

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const menuItems = [
    {
      key: 'shop',
      icon: <AppstoreOutlined />,
      label: <Link to="/shop">Shop</Link>,
    },
    {
      key: 'products',
      icon: <ShopOutlined />,
      label: <Link to="/products">Manage</Link>,
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
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: <Link to="/profile">Profile</Link>,
    },
  ];

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f0f2f5' }}>
          <Title level={3} style={{ color: '#1890ff', margin: 0 }}>
            NLineX Shop
          </Title>
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={['shop']}
            items={menuItems}
            style={{ backgroundColor: 'transparent', border: 'none' }}
          />
        </Header>
        <Content style={{ padding: '24px', background: '#fff' }}>
          <Routes>
            <Route path="/" element={<ShopPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/customers" element={<div>Customers Management (Coming Soon)</div>} />
            <Route path="/orders" element={<div>Orders Management (Coming Soon)</div>} />
            <Route path="/profile" element={<div>Profile Management (Coming Soon)</div>} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;