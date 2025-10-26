import React, { useState } from 'react';
import { Layout, Menu, theme, Button, Avatar } from 'antd';
import {
  DashboardOutlined,
  DesktopOutlined,
  FileSyncOutlined,
  AlertOutlined,
  PartitionOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Link, useLocation, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 根据当前路径确定选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/' || path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/hosts')) return 'hosts';
    if (path.startsWith('/changes')) return 'changes';
    if (path.startsWith('/inefficient')) return 'inefficient';
    if (path.startsWith('/public-pool')) return 'public-pool';
    if (path.startsWith('/metrics')) return 'metrics';
    return 'dashboard';
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">首页概览</Link>,
    },
    {
      key: 'hosts',
      icon: <DesktopOutlined />,
      label: <Link to="/hosts">云主机管理</Link>,
    },
    {
      key: 'changes',
      icon: <FileSyncOutlined />,
      label: <Link to="/changes">变更管理</Link>,
    },
    {
      key: 'inefficient',
      icon: <AlertOutlined />,
      label: <Link to="/inefficient">低效主机</Link>,
    },
    {
      key: 'public-pool',
      icon: <PartitionOutlined />,
      label: <Link to="/public-pool">公共池管理</Link>,
    },
    {
      key: 'metrics',
      icon: <BarChartOutlined />,
      label: <Link to="/metrics">多维度指标</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={220}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical" style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white',
          fontSize: 18,
          fontWeight: 'bold'
        }}>
          {collapsed ? '云主机' : '云主机管理平台'}
        </div>
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 0 : 0, transition: 'margin-left 0.2s' }}>
        <Header style={{ 
          padding: 0, 
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '16px',
          paddingRight: '16px'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar style={{ backgroundColor: '#1890ff' }} icon="U" />
            <span style={{ marginLeft: 8 }}>管理员</span>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;