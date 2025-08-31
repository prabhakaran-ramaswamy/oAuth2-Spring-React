import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ProductGrid from '../product/ProductGrid.jsx';
import { categoryService } from '../../services/api.js';

const { Title } = Typography;

const ProductBrowsePage = ({ onCartUpdate }) => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [loadingCategory, setLoadingCategory] = useState(false);

  useEffect(() => {
    if (categoryId) {
      fetchCategoryName();
    }
  }, [categoryId]);

  const fetchCategoryName = async () => {
    setLoadingCategory(true);
    try {
      const response = await categoryService.getById(categoryId);
      // Handle both Optional<Category> response and direct Category response
      const category = response.data;
      if (category && category.name) {
        setCategoryName(category.name);
      } else {
        setCategoryName('Category');
      }
    } catch (error) {
      console.error('Failed to fetch category:', error);
      setCategoryName('Category');
    } finally {
      setLoadingCategory(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/shop')}
          size="large"
        >
          Back to Categories
        </Button>
        {loadingCategory ? (
          <Spin size="small" />
        ) : categoryName && (
          <Title level={2} style={{ margin: 0 }}>
            {categoryName} Products
          </Title>
        )}
      </div>
      <ProductGrid 
        categoryId={categoryId ? parseInt(categoryId) : null} 
        onCartUpdate={onCartUpdate}
      />
    </div>
  );
};

export default ProductBrowsePage;
