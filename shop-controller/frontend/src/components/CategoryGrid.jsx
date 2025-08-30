import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, message, Typography } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import { categoryService } from '../services/api.js';

const { Title } = Typography;
const { Meta } = Card;

const CategoryGrid = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAll();
      setCategories(response.data.data || []);
    } catch (error) {
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
                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
                  {category.imageUrl ? (
                    <img 
                      alt={category.name} 
                      src={category.imageUrl} 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <ShopOutlined style={{ fontSize: 48, color: '#ccc' }} />
                  )}
                </div>
              }
              onClick={() => onCategorySelect && onCategorySelect(category)}
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
