import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, message, Typography } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../../services/api.js';
import ProductImage from '../common/ProductImage.jsx';

const { Title } = Typography;
const { Meta } = Card;

const CategoryGrid = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAll();
      console.log('Categories response in grid:', response.data); // Debug log
      // Backend returns array directly, not wrapped in data object
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      message.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', textAlign: 'center', padding: '50px' }} />;
  }

  return (
    <div>
      <Title level={2}>Shop by Category</Title>
      <Row gutter={[16, 16]}>
        {categories.map((category) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} key={category.id}>
            <Card
              hoverable
              cover={
                <ProductImage
                  src={category.imageUrl}
                  alt={category.name}
                  style={{ height: 200 }}
                  fallbackIcon={<ShopOutlined />}
                  fallbackText="No Image Available"
                />
              }
              onClick={() => navigate(`/browse-products/${category.id}`)}
            >
              <Meta 
                title={category.name} 
                description={category.description} 
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategoryGrid;
