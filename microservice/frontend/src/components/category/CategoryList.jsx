import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Form, Input, message, Popconfirm, Card, Row, Col, Upload, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SaveOutlined, CloseOutlined, UploadOutlined, TagsOutlined } from '@ant-design/icons';
import { categoryService } from '../../services/api.js';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [imageFileList, setImageFileList] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAll();
      // Backend returns array directly, not wrapped in data object
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      message.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    if (category.imageUrl) {
      setImageFileList([{
        uid: '-1',
        name: 'category-image',
        status: 'done',
        url: category.imageUrl,
      }]);
    }
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await categoryService.delete(id);
      message.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      message.error('Failed to delete category');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description || '');
      
      // Handle image upload if there's a new file
      if (imageFileList.length > 0 && imageFileList[0].originFileObj) {
        formData.append('file', imageFileList[0].originFileObj);
      }

      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
        message.success('Category updated successfully');
      } else {
        await categoryService.create(formData);
        message.success('Category created successfully');
      }
      setShowForm(false);
      setEditingCategory(null);
      setImageFileList([]);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      message.error('Failed to save category');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
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
    { title: 'Description', dataIndex: 'description', key: 'description' },
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
            <TagsOutlined style={{ color: '#1890ff' }} />
            Categories
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
            Add New Category
          </Button>
        }
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <Table 
          columns={columns} 
          dataSource={categories} 
          loading={loading}
          rowKey="id"
          size="small"
        />
      </Card>

      {/* Category Form Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PlusOutlined style={{ color: '#1890ff' }} />
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </div>
        }
        open={showForm}
        onCancel={handleCancel}
        footer={null}
        width={500}
        style={{ top: 50 }}
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
            label={<span style={{ fontWeight: 500 }}>Category Name</span>}
            rules={[
              { required: true, message: 'Please enter category name' },
              { min: 2, message: 'Category name must be at least 2 characters' },
              { max: 50, message: 'Category name cannot exceed 50 characters' }
            ]}
          >
            <Input 
              placeholder="Enter category name"
              style={{ borderRadius: 6 }}
            />
          </Form.Item>

          <Form.Item 
            name="description" 
            label={<span style={{ fontWeight: 500 }}>Description</span>}
            rules={[
              { max: 300, message: 'Description cannot exceed 300 characters' }
            ]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Enter category description"
              style={{ borderRadius: 6 }}
              showCount
              maxLength={300}
            />
          </Form.Item>

          <Form.Item 
            label={<span style={{ fontWeight: 500 }}>Category Image</span>}
            extra="Upload a category image (Max 2MB, JPG/PNG)"
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
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryList;
