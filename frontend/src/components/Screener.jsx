import React, { useState } from 'react';
import { Button, Table, Spin, Tabs, Input, InputNumber, Row, Col, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import api from '../services/api';
import '../App.css';

function Screener() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('limit-up');
  const [threshold, setThreshold] = useState(3);

  const fetchLimitUp = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stocks/limit-up');
      setData(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching limit-up:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnder20 = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stocks/under-20');
      setData(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching under-20:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTripleVolume = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/screener/triple-volume?threshold=${threshold}`);
      setData(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching triple volume:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHighTurnover = async () => {
    try {
      setLoading(true);
      const response = await api.get('/screener/high-turnover');
      setData(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching high turnover:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setData([]);
  };

  const columns = [
    {
      title: 'TS Code',
      dataIndex: 'ts_code',
      key: 'ts_code',
      width: 120
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 100
    },
    {
      title: '价格/数值',
      dataIndex: ['close', 'volume_ratio', 'turnover_rate'],
      key: 'value',
      width: 120
    }
  ];

  return (
    <div>
      <h2>股票筛选</h2>
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={[
          {
            key: 'limit-up',
            label: '涨停板',
            children: (
              <Card>
                <Button type="primary" onClick={fetchLimitUp} loading={loading}>
                  查询涨停板
                </Button>
                {data.length > 0 && (
                  <Table columns={columns} dataSource={data} style={{ marginTop: 16 }} size="small" />
                )}
              </Card>
            )
          },
          {
            key: 'under-20',
            label: '20元以下',
            children: (
              <Card>
                <Button type="primary" onClick={fetchUnder20} loading={loading}>
                  查询20元以下股票
                </Button>
                {data.length > 0 && (
                  <Table columns={columns} dataSource={data} style={{ marginTop: 16 }} size="small" />
                )}
              </Card>
            )
          },
          {
            key: 'triple-volume',
            label: '3倍量股票',
            children: (
              <Card>
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={8}>
                    <InputNumber
                      min={1}
                      max={10}
                      value={threshold}
                      onChange={setThreshold}
                      placeholder="输入倍数"
                    />
                  </Col>
                  <Col span={16}>
                    <Button type="primary" onClick={fetchTripleVolume} loading={loading}>
                      查询 {threshold}倍量股票
                    </Button>
                  </Col>
                </Row>
                {data.length > 0 && (
                  <Table columns={columns} dataSource={data} size="small" />
                )}
              </Card>
            )
          },
          {
            key: 'high-turnover',
            label: '高换手率',
            children: (
              <Card>
                <Button type="primary" onClick={fetchHighTurnover} loading={loading}>
                  查询高换手率股票
                </Button>
                {data.length > 0 && (
                  <Table columns={columns} dataSource={data} style={{ marginTop: 16 }} size="small" />
                )}
              </Card>
            )
          }
        ]}
      />
    </div>
  );
}

export default Screener;