import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Tabs,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Progress
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, DesktopOutlined, PartitionOutlined, BarChartOutlined } from '@ant-design/icons';
import cloudHostService from '../../services/cloudHost';
import type { HostMetric, ChannelMetricSummary, ChannelMetricDetail } from '../../types';
import { formatPercentage } from '../../utils/format';

const { TabPane } = Tabs;

const Metrics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('host');
  const [hostMetrics, setHostMetrics] = useState<HostMetric[]>([]);
  const [channelSummaries, setChannelSummaries] = useState<ChannelMetricSummary[]>([]);
  const [channelDetails, setChannelDetails] = useState<ChannelMetricDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const { hostMetrics, channelSummaries, channelDetails, total } = await cloudHostService.getMultiDimensionMetrics({
        page: currentPage,
        pageSize,
        search: searchText
      });
      setHostMetrics(hostMetrics);
      setChannelSummaries(channelSummaries);
      setChannelDetails(channelDetails);
      setTotal(total);
    } catch (error) {
      console.error('获取指标数据失败:', error);
      message.error('获取指标数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [currentPage, pageSize, searchText]);

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchMetrics();
  };

  // 云主机维度指标列
  const hostMetricColumns: ColumnsType<HostMetric> = [
    {
      title: '云主机IP',
      dataIndex: 'ip',
      key: 'ip',
      fixed: 'left',
      width: 150,
    },
    {
      title: '采样时间',
      dataIndex: 'sampleTime',
      key: 'sampleTime',
      width: 120,
    },
    {
      title: 'CPU使用率',
      dataIndex: 'cpuUsage',
      key: 'cpuUsage',
      render: (value) => formatPercentage(value),
      sorter: (a, b) => a.cpuUsage - b.cpuUsage,
    },
    {
      title: '内存使用率',
      dataIndex: 'memoryUsage',
      key: 'memoryUsage',
      render: (value) => formatPercentage(value),
      sorter: (a, b) => a.memoryUsage - b.memoryUsage,
    },
    {
      title: '磁盘使用率',
      dataIndex: 'diskUsage',
      key: 'diskUsage',
      render: (value) => formatPercentage(value),
      sorter: (a, b) => a.diskUsage - b.diskUsage,
    },
    {
      title: '网络读入速率',
      dataIndex: 'networkReadRate',
      key: 'networkReadRate',
      render: (value) => `${value} MB/s`,
    },
    {
      title: '网络写入速率',
      dataIndex: 'networkWriteRate',
      key: 'networkWriteRate',
      render: (value) => `${value} MB/s`,
    },
    {
      title: '进程数',
      dataIndex: 'processCount',
      key: 'processCount',
    },
    {
      title: '任务数',
      dataIndex: 'taskCount',
      key: 'taskCount',
    },
  ];

  // 通道维度指标汇总列
  const channelSummaryColumns: ColumnsType<ChannelMetricSummary> = [
    {
      title: '通道名',
      dataIndex: 'channelName',
      key: 'channelName',
      fixed: 'left',
      width: 120,
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      key: 'taskType',
    },
    {
      title: '采样时间',
      dataIndex: 'sampleTime',
      key: 'sampleTime',
      width: 120,
    },
    {
      title: '任务数',
      dataIndex: 'taskCount',
      key: 'taskCount',
    },
    {
      title: '成功任务数',
      dataIndex: 'successCount',
      key: 'successCount',
    },
    {
      title: '失败任务数',
      dataIndex: 'failureCount',
      key: 'failureCount',
    },
    {
      title: '空任务数',
      dataIndex: 'emptyCount',
      key: 'emptyCount',
    },
    {
      title: '消重任务数',
      dataIndex: 'dedupCount',
      key: 'dedupCount',
    },
    {
      title: '成功率',
      key: 'successRate',
      render: (_, record) => {
        const rate = record.taskCount > 0 ? (record.successCount / record.taskCount) * 100 : 0;
        return formatPercentage(rate);
      },
    },
  ];

  // 通道维度指标详细列
  const channelDetailColumns: ColumnsType<ChannelMetricDetail> = [
    {
      title: '业务名',
      dataIndex: 'businessName',
      key: 'businessName',
      fixed: 'left',
      width: 120,
    },
    {
      title: '云主机IP',
      dataIndex: 'ip',
      key: 'ip',
      width: 150,
    },
    {
      title: '采样时间',
      dataIndex: 'sampleTime',
      key: 'sampleTime',
      width: 120,
    },
    {
      title: '任务数',
      dataIndex: 'taskCount',
      key: 'taskCount',
    },
    {
      title: '成功任务数',
      dataIndex: 'successCount',
      key: 'successCount',
    },
    {
      title: '失败任务数',
      dataIndex: 'failureCount',
      key: 'failureCount',
    },
    {
      title: '空任务数',
      dataIndex: 'emptyCount',
      key: 'emptyCount',
    },
    {
      title: '消重任务数',
      dataIndex: 'dedupCount',
      key: 'dedupCount',
    },
    {
      title: '成功率',
      key: 'successRate',
      render: (_, record) => {
        const rate = record.taskCount > 0 ? (record.successCount / record.taskCount) * 100 : 0;
        return formatPercentage(rate);
      },
    },
  ];

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: 16 
      }}>
        <Space>
          <Input
            placeholder="搜索IP"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          <Button type="primary" onClick={handleSearch}>
            搜索
          </Button>
        </Space>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        type="card"
      >
        <TabPane 
          tab={
            <span>
              <DesktopOutlined />
              云主机维度
            </span>
          } 
          key="host"
        >
          <Table
            columns={hostMetricColumns}
            dataSource={hostMetrics}
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize,
              total,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
            rowKey="ip"
          />
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <PartitionOutlined />
              通道维度
            </span>
          } 
          key="channel"
        >
          <Table
            columns={channelSummaryColumns}
            dataSource={channelSummaries}
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize,
              total: channelSummaries.length,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            onChange={handleTableChange}
            scroll={{ x: 1000 }}
            rowKey="id"
          />
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <BarChartOutlined />
              业务维度
            </span>
          } 
          key="business"
        >
          <Table
            columns={channelDetailColumns}
            dataSource={channelDetails}
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize,
              total: channelDetails.length,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
            rowKey={(record) => `${record.parentId}-${record.businessName}`}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Metrics;