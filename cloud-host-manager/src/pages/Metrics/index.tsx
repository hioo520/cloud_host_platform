import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Tabs,
  message,
  Card,
  Row,
  Col,
  Tree,
  DatePicker,
  Dropdown,
  Menu,
  Checkbox
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import { 
  SearchOutlined, 
  DownloadOutlined, 
  DownOutlined,
  DesktopOutlined, 
  PartitionOutlined, 
  BarChartOutlined 
} from '@ant-design/icons';
import cloudHostService from '../../services/cloudHost';
import type { HostMetric, ChannelMetricSummary, ChannelMetricDetail, CloudHost } from '../../types';
import { formatPercentage } from '../../utils/format';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const Metrics: React.FC = () => {
  // 主机维度指标选项
  const hostMetricOptions = [
    { label: 'CPU使用率', value: 'cpuUsage' },
    { label: '内存使用率', value: 'memoryUsage' },
    { label: '磁盘使用率', value: 'diskUsage' },
    { label: '网络读入速率', value: 'networkReadRate' },
    { label: '网络写入速率', value: 'networkWriteRate' },
    { label: '进程数', value: 'processCount' },
    { label: '任务数', value: 'taskCount' },
  ];

  // 通道维度指标选项
  const channelMetricOptions = [
    { label: '任务数', value: 'taskCount' },
    { label: '成功任务数', value: 'successCount' },
    { label: '失败任务数', value: 'failureCount' },
    { label: '空任务数', value: 'emptyCount' },
    { label: '消重任务数', value: 'dedupCount' },
    { label: '成功率', value: 'successRate' },
  ];

  // 业务维度指标选项
  const businessMetricOptions = [
    { label: '任务数', value: 'taskCount' },
    { label: '成功任务数', value: 'successCount' },
    { label: '失败任务数', value: 'failureCount' },
    { label: '空任务数', value: 'emptyCount' },
    { label: '消重任务数', value: 'dedupCount' },
    { label: '成功率', value: 'successRate' },
  ];

  const [activeTab, setActiveTab] = useState('host');
  const [hostMetrics, setHostMetrics] = useState<HostMetric[]>([]);
  const [channelSummaries, setChannelSummaries] = useState<ChannelMetricSummary[]>([]);
  const [channelDetails, setChannelDetails] = useState<ChannelMetricDetail[]>([]);
  const [allHosts, setAllHosts] = useState<CloudHost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 筛选条件
  const [selectedHostMetricKeys, setSelectedHostMetricKeys] = useState<string[]>(['cpuUsage', 'memoryUsage', 'diskUsage']);
  const [selectedChannelMetricKeys, setSelectedChannelMetricKeys] = useState<string[]>(['taskCount', 'successCount', 'failureCount']);
  const [selectedBusinessMetricKeys, setSelectedBusinessMetricKeys] = useState<string[]>(['taskCount', 'successCount']);
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[string, string]>(['', '']);
  const [searchText, setSearchText] = useState('');
  
  // 多维度筛选专用状态
  const [customSelectedMetrics, setCustomSelectedMetrics] = useState<string[]>([]);
  const [customSelectedHosts, setCustomSelectedHosts] = useState<string[]>([]);
  
  // 获取所有主机数据用于筛选
  const fetchAllHosts = async () => {
    try {
      // 重新生成mock数据
      const mockData = (await import('../../mocks')).generateMockData();
      setAllHosts(mockData.cloudHosts);
      
      // 默认选择前5个主机
      const firstHosts = mockData.cloudHosts.slice(0, 5).map(host => host.ip);
      setSelectedHosts(firstHosts);
      setCustomSelectedHosts(firstHosts);
    } catch (error) {
      console.error('获取主机数据失败:', error);
    }
  };

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const { hostMetrics, channelSummaries, channelDetails } = await cloudHostService.getMultiDimensionMetrics({
        page: 1,
        pageSize: 1000,
        hostIps: selectedHosts,
        search: searchText
      });
      
      setHostMetrics(hostMetrics);
      setChannelSummaries(channelSummaries);
      setChannelDetails(channelDetails);
    } catch (error) {
      console.error('获取指标数据失败:', error);
      message.error('获取指标数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllHosts();
  }, []);

  useEffect(() => {
    if (selectedHosts.length > 0 && activeTab !== 'custom') {
      fetchMetrics();
    }
  }, [selectedHosts, selectedHostMetricKeys, selectedChannelMetricKeys, selectedBusinessMetricKeys, dateRange, searchText, activeTab]);

  // 生成主机维度指标树节点
  const generateHostMetricTreeData = (): DataNode[] => [
    {
      title: '主机维度指标',
      key: 'host-metrics',
      children: hostMetricOptions.map(option => ({
        title: option.label,
        key: `host-${option.value}`,
        isLeaf: true,
      }))
    }
  ];

  // 生成通道维度指标树节点
  const generateChannelMetricTreeData = (): DataNode[] => [
    {
      title: '通道维度指标',
      key: 'channel-metrics',
      children: channelMetricOptions.map(option => ({
        title: option.label,
        key: `channel-${option.value}`,
        isLeaf: true,
      }))
    }
  ];

  // 生成业务维度指标树节点
  const generateBusinessMetricTreeData = (): DataNode[] => [
    {
      title: '业务维度指标',
      key: 'business-metrics',
      children: businessMetricOptions.map(option => ({
        title: option.label,
        key: `business-${option.value}`,
        isLeaf: true,
      }))
    }
  ];

  // 生成主机树节点数据（按厂商和地域分组）
  const generateHostTreeData = (): DataNode[] => {
    // 按厂商分组
    const vendorGroups: Record<string, CloudHost[]> = {};
    allHosts.forEach(host => {
      if (!vendorGroups[host.vendor]) {
        vendorGroups[host.vendor] = [];
      }
      vendorGroups[host.vendor].push(host);
    });

    return Object.keys(vendorGroups).map(vendor => ({
      title: vendor,
      key: `vendor-${vendor}`,
      children: vendorGroups[vendor].map(host => ({
        title: `${host.ip} (${host.region})`,
        key: host.ip,
        isLeaf: true,
      }))
    }));
  };

  // 处理指标选择变化
  const handleMetricTreeCheck = (checkedKeys: any, info: any) => {
    const hostKeys = checkedKeys.filter((key: string) => key.startsWith('host-')).map((key: string) => key.replace('host-', ''));
    const channelKeys = checkedKeys.filter((key: string) => key.startsWith('channel-')).map((key: string) => key.replace('channel-', ''));
    const businessKeys = checkedKeys.filter((key: string) => key.startsWith('business-')).map((key: string) => key.replace('business-', ''));
    
    setSelectedHostMetricKeys(hostKeys);
    setSelectedChannelMetricKeys(channelKeys);
    setSelectedBusinessMetricKeys(businessKeys);
  };

  // 处理主机选择变化
  const handleHostTreeCheck = (checkedKeys: any, info: any) => {
    // 只保留主机IP，过滤掉厂商节点
    const hostKeys = checkedKeys.filter((key: string) => !key.startsWith('vendor-'));
    setSelectedHosts(hostKeys);
  };

  // 处理多维度筛选中的指标选择变化
  const handleCustomMetricTreeCheck = (checkedKeys: any, info: any) => {
    setCustomSelectedMetrics(checkedKeys);
  };

  // 处理多维度筛选中的主机选择变化
  const handleCustomHostTreeCheck = (checkedKeys: any, info: any) => {
    // 只保留主机IP，过滤掉厂商节点
    const hostKeys = checkedKeys.filter((key: string) => !key.startsWith('vendor-'));
    setCustomSelectedHosts(hostKeys);
  };

  // 生成主机维度指标列
  const generateHostMetricColumns = (): ColumnsType<HostMetric> => {
    const columns: ColumnsType<HostMetric> = [
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
      }
    ];

    // 添加选择的指标列
    selectedHostMetricKeys.forEach(key => {
      const option = hostMetricOptions.find(opt => opt.value === key);
      if (option) {
        switch (key) {
          case 'cpuUsage':
          case 'memoryUsage':
          case 'diskUsage':
            columns.push({
              title: option.label,
              dataIndex: key,
              key,
              render: (value) => formatPercentage(value),
              sorter: (a, b) => a[key] - b[key],
            });
            break;
          case 'networkReadRate':
          case 'networkWriteRate':
            columns.push({
              title: option.label,
              dataIndex: key,
              key,
              render: (value) => `${value} MB/s`,
            });
            break;
          default:
            columns.push({
              title: option.label,
              dataIndex: key,
              key,
            });
        }
      }
    });

    return columns;
  };

  // 生成通道维度指标列
  const generateChannelSummaryColumns = (): ColumnsType<ChannelMetricSummary> => {
    const columns: ColumnsType<ChannelMetricSummary> = [
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
      }
    ];

    // 添加选择的指标列
    selectedChannelMetricKeys.forEach(key => {
      const option = channelMetricOptions.find(opt => opt.value === key);
      if (option) {
        if (key === 'successRate') {
          columns.push({
            title: option.label,
            key: 'successRate',
            render: (_, record) => {
              const rate = record.taskCount > 0 ? (record.successCount / record.taskCount) * 100 : 0;
              return formatPercentage(rate);
            },
          });
        } else {
          columns.push({
            title: option.label,
            dataIndex: key,
            key,
          });
        }
      }
    });

    return columns;
  };

  // 生成业务维度指标列
  const generateChannelDetailColumns = (): ColumnsType<ChannelMetricDetail> => {
    const columns: ColumnsType<ChannelMetricDetail> = [
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
      }
    ];

    // 添加选择的指标列
    selectedBusinessMetricKeys.forEach(key => {
      const option = businessMetricOptions.find(opt => opt.value === key);
      if (option) {
        if (key === 'successRate') {
          columns.push({
            title: option.label,
            key: 'successRate',
            render: (_, record) => {
              const rate = record.taskCount > 0 ? (record.successCount / record.taskCount) * 100 : 0;
              return formatPercentage(rate);
            },
          });
        } else {
          columns.push({
            title: option.label,
            dataIndex: key,
            key,
          });
        }
      }
    });

    return columns;
  };

  // 生成自定义筛选的列（多维度筛选Tab专用）
  const generateCustomMetricColumns = (): ColumnsType<any> => {
    const columns: ColumnsType<any> = [
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
      }
    ];

    // 根据选择的指标动态生成列
    customSelectedMetrics.forEach(key => {
      // 主机维度指标
      if (key.startsWith('host-')) {
        const metricKey = key.replace('host-', '');
        const option = hostMetricOptions.find(opt => opt.value === metricKey);
        if (option) {
          switch (metricKey) {
            case 'cpuUsage':
            case 'memoryUsage':
            case 'diskUsage':
              columns.push({
                title: option.label,
                dataIndex: metricKey,
                key: metricKey,
                render: (value) => formatPercentage(value),
              });
              break;
            case 'networkReadRate':
            case 'networkWriteRate':
              columns.push({
                title: option.label,
                dataIndex: metricKey,
                key: metricKey,
                render: (value) => `${value} MB/s`,
              });
              break;
            default:
              columns.push({
                title: option.label,
                dataIndex: metricKey,
                key: metricKey,
              });
          }
        }
      }
      // 通道维度指标
      else if (key.startsWith('channel-')) {
        const metricKey = key.replace('channel-', '');
        const option = channelMetricOptions.find(opt => opt.value === metricKey);
        if (option) {
          if (metricKey === 'successRate') {
            columns.push({
              title: option.label,
              key: 'channel-successRate',
              render: (_, record) => {
                const rate = record.taskCount > 0 ? (record.successCount / record.taskCount) * 100 : 0;
                return formatPercentage(rate);
              },
            });
          } else {
            columns.push({
              title: option.label,
              dataIndex: metricKey,
              key: `channel-${metricKey}`,
            });
          }
        }
      }
      // 业务维度指标
      else if (key.startsWith('business-')) {
        const metricKey = key.replace('business-', '');
        const option = businessMetricOptions.find(opt => opt.value === metricKey);
        if (option) {
          if (metricKey === 'successRate') {
            columns.push({
              title: option.label,
              key: 'business-successRate',
              render: (_, record) => {
                const rate = record.taskCount > 0 ? (record.successCount / record.taskCount) * 100 : 0;
                return formatPercentage(rate);
              },
            });
          } else {
            columns.push({
              title: option.label,
              dataIndex: metricKey,
              key: `business-${metricKey}`,
            });
          }
        }
      }
    });

    return columns;
  };

  // 获取自定义筛选的数据
  const getCustomFilteredData = () => {
    // 这里应该根据选择的主机和指标进行数据过滤
    // 简化实现，返回主机指标数据
    return hostMetrics.filter(metric => customSelectedHosts.includes(metric.ip));
  };

  // 下载数据
  const handleDownload = () => {
    message.success('数据下载功能已触发');
    // 实际项目中这里会实现具体的下载逻辑
  };

  // 下载菜单
  const downloadMenu = (
    <Menu>
      <Menu.Item key="1" onClick={handleDownload}>导出当前页</Menu.Item>
      <Menu.Item key="2" onClick={handleDownload}>导出全部数据</Menu.Item>
    </Menu>
  );

  // 处理搜索
  const handleSearch = () => {
    fetchMetrics();
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部时间范围和查询按钮区域 */}
      <div style={{ marginBottom: 16 }}>
        <Card size="small">
          <Row gutter={16} align="middle">
            <Col span={6}>
              <RangePicker 
                style={{ width: '100%' }} 
                placeholder={['开始时间', '结束时间']}
                onChange={(dates, dateStrings) => setDateRange([dateStrings[0] || '', dateStrings[1] || ''])}
              />
            </Col>
            <Col span={4}>
              <Input
                placeholder="搜索IP"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={handleSearch}>查询</Button>
            </Col>
            <Col span={10} style={{ textAlign: 'right' }}>
              <Dropdown overlay={downloadMenu}>
                <Button icon={<DownloadOutlined />}>
                  下载数据 <DownOutlined />
                </Button>
              </Dropdown>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Tabs区域 */}
      <div style={{ flex: 1 }}>
        <Card size="small" title="指标数据展示" style={{ height: '100%' }}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane 
              tab={
                <span>
                  <DesktopOutlined />
                  主机维度 ({hostMetrics.length})
                </span>
              } 
              key="host"
            >
              <Table
                columns={generateHostMetricColumns()}
                dataSource={hostMetrics}
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
                scroll={{ x: 1000 }}
                rowKey="ip"
              />
            </TabPane>
            <TabPane 
              tab={
                <span>
                  <PartitionOutlined />
                  通道维度 ({channelSummaries.length})
                </span>
              } 
              key="channel"
            >
              <Table
                columns={generateChannelSummaryColumns()}
                dataSource={channelSummaries}
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
                scroll={{ x: 800 }}
                rowKey="id"
              />
            </TabPane>
            <TabPane 
              tab={
                <span>
                  <BarChartOutlined />
                  业务维度 ({channelDetails.length})
                </span>
              } 
              key="business"
            >
              <Table
                columns={generateChannelDetailColumns()}
                dataSource={channelDetails}
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
                scroll={{ x: 1000 }}
                rowKey={(record) => `${record.parentId}-${record.businessName}`}
              />
            </TabPane>
            {/* 新增的多维度筛选Tab */}
            <TabPane 
              tab="多维度筛选" 
              key="custom"
            >
              {/* 上左右分栏结构 */}
              <div style={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
                {/* 左侧筛选区域 */}
                <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 16, paddingRight: 8 }}>
                  {/* 指标筛选区 */}
                  <Card size="small" title="指标筛选" style={{ flex: 1 }}>
                    <Tree
                      checkable
                      defaultExpandAll
                      treeData={[
                        ...generateHostMetricTreeData(),
                        ...generateChannelMetricTreeData(),
                        ...generateBusinessMetricTreeData()
                      ]}
                      onCheck={handleCustomMetricTreeCheck}
                      checkedKeys={customSelectedMetrics}
                      height={300}
                    />
                  </Card>
                  
                  {/* 主机筛选区 */}
                  <Card size="small" title="主机筛选" style={{ flex: 1 }}>
                    <Tree
                      checkable
                      defaultExpandAll
                      treeData={generateHostTreeData()}
                      onCheck={handleCustomHostTreeCheck}
                      checkedKeys={customSelectedHosts}
                      height={300}
                    />
                  </Card>
                </div>
                
                {/* 右侧展示区域 */}
                <div style={{ width: '50%', paddingLeft: 8 }}>
                  <Card size="small" title="筛选结果" style={{ height: '100%' }}>
                    <Table
                      columns={generateCustomMetricColumns()}
                      dataSource={getCustomFilteredData()}
                      loading={loading}
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                      }}
                      scroll={{ x: 800 }}
                      rowKey="ip"
                    />
                  </Card>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Metrics;