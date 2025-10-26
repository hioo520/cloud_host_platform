import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Progress, Spin } from 'antd';
import { 
  DesktopOutlined, 
  PartitionOutlined, 
  WindowsOutlined, 
  LinuxOutlined,
  AlertOutlined,
  CloudServerOutlined
} from '@ant-design/icons';
import cloudHostService from '../../services/cloudHost';
import type { DashboardStats } from '../../types';
import { formatPercentage } from '../../utils/format';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await cloudHostService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('获取统计数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!stats) {
    return <div>加载失败</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>云主机资源概览</h2>
      
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="云主机总数"
              value={stats.totalHosts}
              prefix={<DesktopOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="公共池主机"
              value={stats.publicPoolHosts}
              prefix={<PartitionOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Windows主机"
              value={stats.windowsHosts}
              prefix={<WindowsOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Linux主机"
              value={stats.linuxHosts}
              prefix={<LinuxOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card title="CPU使用率">
            <Progress 
              type="circle" 
              percent={stats.cpuUsage} 
              format={percent => formatPercentage(percent || 0)}
              strokeColor={stats.cpuUsage > 80 ? '#ff4d4f' : stats.cpuUsage > 60 ? '#faad14' : '#52c41a'}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="内存使用率">
            <Progress 
              type="circle" 
              percent={stats.memoryUsage} 
              format={percent => formatPercentage(percent || 0)}
              strokeColor={stats.memoryUsage > 80 ? '#ff4d4f' : stats.memoryUsage > 60 ? '#faad14' : '#52c41a'}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="磁盘使用率">
            <Progress 
              type="circle" 
              percent={stats.diskUsage} 
              format={percent => formatPercentage(percent || 0)}
              strokeColor={stats.diskUsage > 80 ? '#ff4d4f' : stats.diskUsage > 60 ? '#faad14' : '#52c41a'}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="CPU高负载主机"
              value={stats.highCpuHosts}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="内存高负载主机"
              value={stats.highMemoryHosts}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="磁盘高负载主机"
              value={stats.highDiskHosts}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="离线主机"
              value={stats.offlineHosts}
              prefix={<CloudServerOutlined />}
              valueStyle={{ color: '#ff7a45' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;