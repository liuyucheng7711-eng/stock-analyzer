import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  FilterOutlined,
  BarChartOutlined,
  FundOutlined,
  ClockCircleOutlined,
  CheckSquareOutlined
} from '@ant-design/icons';
import Dashboard from './components/Dashboard';
import Screener from './components/Screener';
import Analysis from './components/Analysis';
import StockList from './components/StockList';
import DigitalClock from './components/DigitalClock';
import TodoList from './components/TodoList';
import './App.css';

const { Header, Content, Sider } = Layout;

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard />;
      case 'screener':
        return <Screener />;
      case 'analysis':
        return <Analysis />;
      case 'stocks':
        return <StockList />;
      case 'clock':
        return <DigitalClock />;
      case 'todo':
        return <TodoList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark" width={250}>
        <div className="logo">
          <h2>📈 Stock Analyzer</h2>
        </div>
        <Menu
          theme="dark"
          selectedKeys={[activeMenu]}
          onClick={(e) => setActiveMenu(e.key)}
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: '仪表盘'
            },
            {
              key: 'screener',
              icon: <FilterOutlined />,
              label: '股票筛选'
            },
            {
              key: 'analysis',
              icon: <BarChartOutlined />,
              label: '数据分析'
            },
            {
              key: 'stocks',
              icon: <FundOutlined />,
              label: '股票列表'
            },
            {
              key: 'clock',
              icon: <ClockCircleOutlined />,
              label: '数字时钟'
            },
            {
              key: 'todo',
              icon: <CheckSquareOutlined />,
              label: '待办清单'
            }
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', paddingLeft: '24px', borderBottom: '1px solid #f0f0f0' }}>
          <h3 style={{ margin: 0 }}>Stock Analysis Platform</h3>
        </Header>
        <Content style={{ margin: '24px', padding: '24px', background: '#f5f5f5', minHeight: 280 }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;