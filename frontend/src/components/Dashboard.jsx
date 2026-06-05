import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import api from '../services/api';
import '../App.css';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [limitUp, under20] = await Promise.all([
        api.get('/stocks/limit-up'),
        api.get('/stocks/under-20')
      ]);

      setStats({
        limitUpCount: limitUp.data?.data?.length || 0,
        under20Count: under20.data?.data?.length || 0,
        timestamp: new Date().toLocaleString('zh-CN')
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin tip="加载中..." />;
  }

  return (
    <div>
      <h2>仪表盘</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="涨停板股票"
              value={stats?.limitUpCount || 0}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="20元以下股票"
              value={stats?.under20Count || 0}
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="数据更新时间"
              value={stats?.timestamp || '--'}
              valueStyle={{ fontSize: '14px' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <h3>概览</h3>
        <p>欢迎使用股票分析平台！</p>
        <ul>
          <li>📊 实时涨停板监控</li>
          <li>💰 低价股筛选</li>
          <li>🔥 板块强度分析</li>
          <li>💵 资金流向追踪</li>
          <li>📈 技术指标分析</li>
        </ul>
      </Card>
    </div>
  );
}

export default Dashboard;