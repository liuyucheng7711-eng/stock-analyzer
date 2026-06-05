import React, { useState, useEffect } from 'react';
import { Button, Table, Spin, Input, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import api from '../services/api';

function StockList() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchStocks();
  }, []);

  useEffect(() => {
    if (searchText) {
      setFiltered(
        stocks.filter(
          (stock) =>
            stock.ts_code?.toLowerCase().includes(searchText.toLowerCase()) ||
            stock.name?.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } else {
      setFiltered(stocks);
    }
  }, [searchText, stocks]);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stocks/list');
      setStocks(response.data?.data || []);
      setFiltered(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'TS Code',
      dataIndex: 'ts_code',
      key: 'ts_code',
      width: 120,
      sorter: (a, b) => a.ts_code?.localeCompare(b.ts_code)
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 100
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      width: 150
    },
    {
      title: '地区',
      dataIndex: 'area',
      key: 'area',
      width: 100
    }
  ];

  return (
    <div>
      <h2>股票列表</h2>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12}>
          <Input.Search
            placeholder="搜索股票代码或名称"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            size="large"
          />
        </Col>
        <Col xs={24} sm={12}>
          <Button type="primary" onClick={fetchStocks} loading={loading} block>
            刷新列表
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Spin tip="加载中..." />
      ) : (
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="ts_code"
          size="small"
          pagination={{ pageSize: 50, showSizeChanger: true }}
        />
      )}
    </div>
  );
}

export default StockList;