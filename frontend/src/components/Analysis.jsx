import React, { useState } from 'react';
import { Input, Button, Card, Row, Col, Spin, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import api from '../services/api';
import '../App.css';

function Analysis() {
  const [stockCode, setStockCode] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState(null);

  const fetchCapitalFlow = async () => {
    if (!stockCode) return;
    try {
      setLoading(true);
      const response = await api.get(`/analysis/capital-flow/${stockCode}`);
      setData(response.data?.data || []);
      setActiveAnalysis('capital-flow');
    } catch (error) {
      console.error('Error fetching capital flow:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTurnoverRate = async () => {
    if (!stockCode) return;
    try {
      setLoading(true);
      const response = await api.get(`/analysis/turnover-rate/${stockCode}`);
      setData(response.data?.data || []);
      setActiveAnalysis('turnover-rate');
    } catch (error) {
      console.error('Error fetching turnover rate:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVolumeRatio = async () => {
    if (!stockCode) return;
    try {
      setLoading(true);
      const response = await api.get(`/analysis/volume-ratio/${stockCode}`);
      setData([response.data?.data] || []);
      setActiveAnalysis('volume-ratio');
    } catch (error) {
      console.error('Error fetching volume ratio:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>数据分析</h2>
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Input
              placeholder="输入股票代码 (如: 600000.SH)"
              value={stockCode}
              onChange={(e) => setStockCode(e.target.value)}
              size="large"
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col>
            <Button type="primary" onClick={fetchCapitalFlow} loading={loading}>
              资金流向
            </Button>
          </Col>
          <Col>
            <Button onClick={fetchTurnoverRate} loading={loading}>
              换手率
            </Button>
          </Col>
          <Col>
            <Button onClick={fetchVolumeRatio} loading={loading}>
              量比
            </Button>
          </Col>
        </Row>
      </Card>

      {loading && <Spin tip="加载中..." />}

      {data && data.length > 0 && activeAnalysis === 'capital-flow' && (
        <Card title="资金流向分析">
          <Table
            columns={[
              { title: '日期', dataIndex: 'trade_date', key: 'trade_date' },
              { title: '买入金额(小)', dataIndex: 'buy_sm_amount', key: 'buy_sm_amount' },
              { title: '卖出金额(小)', dataIndex: 'sell_sm_amount', key: 'sell_sm_amount' }
            ]}
            dataSource={data}
            size="small"
          />
        </Card>
      )}

      {data && data.length > 0 && activeAnalysis === 'turnover-rate' && (
        <Card title="换手率分析">
          <Table
            columns={[
              { title: '日期', dataIndex: 'trade_date', key: 'trade_date' },
              { title: '换手率(%)', dataIndex: 'turnover_rate', key: 'turnover_rate' },
              { title: '成交量', dataIndex: 'vol', key: 'vol' }
            ]}
            dataSource={data}
            size="small"
          />
        </Card>
      )}

      {data && data.length > 0 && activeAnalysis === 'volume-ratio' && (
        <Card title="量比分析">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <p><strong>股票代码:</strong> {data[0]?.ts_code}</p>
              <p><strong>今日成交量:</strong> {data[0]?.today_vol}</p>
              <p><strong>平均成交量:</strong> {data[0]?.avg_vol}</p>
              <p><strong>量比:</strong> {(data[0]?.volume_ratio || 0).toFixed(2)}</p>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
}

export default Analysis;