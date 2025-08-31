import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Form, Input, InputNumber, message, Popconfirm, Card, Row, Col, Select, Upload, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SaveOutlined, CloseOutlined, UploadOutlined, ShopOutlined } from '@ant-design/icons';
import { productService, categoryService } from '../../services/api.js';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFileList, setImageFileList] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAll();
      // Backend returns array directly, not wrapped in data object
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      // Backend returns array directly, not wrapped in data object
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      message.error('Failed to fetch categories');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    if (product.imageUrl) {
      setImageFileList([{
        uid: '-1',
        name: 'product-image',
        status: 'done',
        url: product.imageUrl,
      }]);
    }
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await productService.delete(id);
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  const handleSubmit = async (values) => {
    try {
      // Handle image upload if there's a new file
      if (imageFileList.length > 0 && imageFileList[0].originFileObj) {
        const formData = new FormData();
        formData.append('image', imageFileList[0].originFileObj);
        // Add image upload logic here
        // const imageResponse = await uploadService.uploadImage(formData);
        // values.imageUrl = imageResponse.data.url;
      }

      if (editingProduct) {
        await productService.update(editingProduct.id, values);
        message.success('Product updated successfully');
      } else {
        await productService.create(values);
        message.success('Product created successfully');
      }
      setShowForm(false);
      setEditingProduct(null);
      setImageFileList([]);
      form.resetFields();
      fetchProducts();
    } catch (error) {
      message.error('Failed to save product');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setImageFileList([]);
    form.resetFields();
  };

  const uploadProps = {
    fileList: imageFileList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Please upload only image files (JPG, PNG, GIF)!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return false;
      }
      return false; // Prevent auto upload
    },
    onChange: ({ fileList }) => {
      setImageFileList(fileList.slice(-1)); // Keep only the last file
    },
    onRemove: () => {
      setImageFileList([]);
    },
    onPreview: (file) => {
      if (file.url || file.preview) {
        window.open(file.url || file.preview, '_blank');
      }
    },
    maxCount: 1,
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (price) => `₹${price}` },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Are you sure?" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShopOutlined style={{ color: '#1890ff' }} />
            Products
          </div>
        }
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setShowForm(true)}
            size="large"
            style={{ 
              borderRadius: 6,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
            }}
          >
            Add New Product
          </Button>
        }
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <Table 
          columns={columns} 
          dataSource={products} 
          loading={loading}
          rowKey="id"
          size="small"
        />
      </Card>

      {/* Product Form Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PlusOutlined style={{ color: '#1890ff' }} />
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </div>
        }
        open={showForm}
        onCancel={handleCancel}
        footer={null}
        width={600}
        style={{ top: 20 }}
      >
        <Form 
          form={form} 
          onFinish={handleSubmit} 
          layout="vertical"
          size="large"
          style={{ marginTop: 16 }}
        >
          <Form.Item 
            name="name" 
            label={<span style={{ fontWeight: 500 }}>Product Name</span>}
            rules={[
              { required: true, message: 'Please enter product name' },
              { min: 2, message: 'Product name must be at least 2 characters' },
              { max: 100, message: 'Product name cannot exceed 100 characters' }
            ]}
          >
            <Input 
              placeholder="Enter product name"
              style={{ borderRadius: 6 }}
            />
          </Form.Item>

          <Form.Item 
            name="description" 
            label={<span style={{ fontWeight: 500 }}>Description</span>}
            rules={[
              { max: 500, message: 'Description cannot exceed 500 characters' }
            ]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Enter product description"
              style={{ borderRadius: 6 }}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item 
            name="category" 
            label={<span style={{ fontWeight: 500 }}>Category</span>}
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select 
              placeholder="Select a category"
              style={{ borderRadius: 6 }}
              size="large"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {categories.map(category => (
                <Select.Option key={category.id} value={category.name}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="price" 
                label={<span style={{ fontWeight: 500 }}>Price (₹)</span>}
                rules={[
                  { required: true, message: 'Please enter price' },
                  { type: 'number', min: 0.01, message: 'Price must be greater than 0' }
                ]}
              >
                <InputNumber 
                  min={0} 
                  step={1} 
                  style={{ width: '100%', borderRadius: 6 }} 
                  placeholder="0"
                  formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/₹\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="stock" 
                label={<span style={{ fontWeight: 500 }}>Stock Quantity</span>}
                rules={[
                  { required: true, message: 'Please enter stock quantity' },
                  { type: 'number', min: 0, message: 'Stock cannot be negative' }
                ]}
              >
                <InputNumber 
                  min={0} 
                  style={{ width: '100%', borderRadius: 6 }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            label={<span style={{ fontWeight: 500 }}>Product Image</span>}
            extra="Upload a product image (Max 2MB, JPG/PNG)"
          >
            <Upload 
              {...uploadProps} 
              listType="picture-card"
              style={{ width: '100%' }}
            >
              {imageFileList.length === 0 && (
                <div style={{ textAlign: 'center' }}>
                  <UploadOutlined style={{ fontSize: 24, color: '#999' }} />
                  <div style={{ marginTop: 8, color: '#666' }}>Upload Image</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginTop: 32, marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button 
                onClick={handleCancel}
                size="large"
                style={{ minWidth: 80 }}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
                size="large"
                style={{ minWidth: 120, borderRadius: 6 }}
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductList;
