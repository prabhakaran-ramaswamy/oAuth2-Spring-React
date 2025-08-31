import React, { useState } from 'react';
import { Layout, Button, Typography, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CategoryGrid from '../category/CategoryGrid.jsx';
import ProductGrid from '../product/ProductGrid.jsx';

const { Content } = Layout;
const { Title } = Typography;

const ShopPage = ({ onCartUpdate }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 24 }}>
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
            {selectedCategory ? selectedCategory.name : ''}
          </Title>
        </Space>
      </div>

      {selectedCategory ? (
        <ProductGrid 
          categoryId={selectedCategory.id} 
          onCartUpdate={onCartUpdate}
        />
      ) : (
        <CategoryGrid onCategorySelect={handleCategorySelect} />
      )}
    </div>
  );
};

export default ShopPage;
