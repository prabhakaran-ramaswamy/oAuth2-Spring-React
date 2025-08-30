import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Form, Input, InputNumber, message, Popconfirm, Card, Row, Col, Select, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SaveOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';
import { productService, categoryService } from '../services/api.js';

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
      setProducts(response.data.data);
    } catch (error) {
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data.data || []);
    } catch (error) {
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
        message.error('You can only upload image files!');
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
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (price) => `$${price}` },
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
      <Row gutter={[24, 24]}>
        {/* Product Form */}
        <Col span={showForm ? 8 : 0}>
          {showForm && (
            <Card 
              title={editingProduct ? 'Edit Product' : 'Add Product'}
              extra={
                <Button icon={<CloseOutlined />} onClick={handleCancel} />
              }
            >
              <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="description" label="Description">
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                  <Select placeholder="Select a category">
                    {categories.map(category => (
                      <Select.Option key={category.id} value={category.name}>
                        {category.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                  <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Product Image">
                  <Upload {...uploadProps} listType="picture">
                    <Button icon={<UploadOutlined />}>Upload Image</Button>
                  </Upload>
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                      {editingProduct ? 'Update' : 'Create'}
                    </Button>
                    <Button onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          )}
        </Col>

        {/* Product Table */}
        <Col span={showForm ? 16 : 24}>
          <Card
            title="Products"
            extra={
              !showForm && (
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => setShowForm(true)}
                >
                  Add Product
                </Button>
              )
            }
          >
            <Table 
              columns={columns} 
              dataSource={products} 
              loading={loading}
              rowKey="id"
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductList;
