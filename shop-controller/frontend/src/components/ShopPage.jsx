import React, { useState } from 'react';
import { Layout, Button, Badge, Typography, Space } from 'antd';
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import CategoryGrid from './CategoryGrid.jsx';
import ProductGrid from './ProductGrid.jsx';
import CartDrawer from './CartDrawer.jsx';
import { cartService } from '../services/api.js';

const { Content } = Layout;
const { Title } = Typography;

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartVisible, setCartVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const updateCartCount = async () => {
    try {
      const response = await cartService.getCartCount();
      setCartCount(response.data.data || 0);
    } catch (error) {
      console.error('Failed to fetch cart count');
    }
  };

  React.useEffect(() => {
    updateCartCount();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Space>
          {selectedCategory && (
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBackToCategories}
            >
              Back to Categories
            </Button>
          )}
          <Title level={1} style={{ margin: 0 }}>
            {selectedCategory ? selectedCategory.name : 'Shop'}
          </Title>
        </Space>
        
        <Badge count={cartCount} showZero>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            size="large"
            onClick={() => setCartVisible(true)}
          >
            Cart
          </Button>
        </Badge>
      </div>

      {selectedCategory ? (
        <ProductGrid 
          categoryId={selectedCategory.id} 
          onCartUpdate={updateCartCount}
        />
      ) : (
        <CategoryGrid onCategorySelect={handleCategorySelect} />
      )}

      <CartDrawer
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
        onCartUpdate={updateCartCount}
      />
    </div>
  );
};

export default ShopPage;
