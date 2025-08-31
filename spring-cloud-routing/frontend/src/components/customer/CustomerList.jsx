import React, { useState, useEffect } from 'react';
import { Table, Card, Spin, message, Typography, Empty } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { customerService } from '../../services/api.js';

const { Title } = Typography;

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerService.getAll();
      setCustomers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      message.error('Failed to fetch customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Customer ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Registration Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Customers</Title>
      <Card>
        {customers.length === 0 ? (
          <Empty
            image={<UserOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
            description="No customer records available to show"
            style={{ padding: '40px 0' }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={customers}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} customers`,
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default CustomerList;
