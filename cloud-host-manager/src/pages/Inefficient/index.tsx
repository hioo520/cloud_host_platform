import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  DatePicker,
  message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import cloudHostService from '../../services/cloudHost';
import type { InefficientHost } from '../../types';
import { formatPercentage } from '../../utils/format';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Inefficient: React.FC = () => {
  const [hosts, setHosts] = useState<InefficientHost[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  const fetchHosts = async () => {
    try {
      setLoading(true);
      const startTime = dateRange[0] ? dateRange[0].format('YYYY/MM/DD') : undefined;
      const endTime = dateRange[1] ? dateRange[1].format('YYYY/MM/DD') : undefined;
      
      const { data, total } = await cloudHostService.getInefficientHosts({
        page: currentPage,
        pageSize,
        search: searchText,
        startTime,
        endTime
      });
      setHosts(data);
      setTotal(total);
    } catch (error) {
      console.error('获取低效主机失败:', error);
      message.error('获取低效主机失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHosts();
  }, [currentPage, pageSize, searchText, dateRange]);

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchHosts();
  };

  const handleReset = () => {
    setSearchText('');
    setDateRange([null, null]);
    setCurrentPage(1);
  };

  const columns: ColumnsType<InefficientHost> = [
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
      title: 'CPU使用率(周)',
      dataIndex: 'cpuUsageWeekly',
      key: 'cpuUsageWeekly',
      render: (value) => formatPercentage(value),
      sorter: (a, b) => a.cpuUsageWeekly - b.cpuUsageWeekly,
    },
    {
      title: '内存使用率(周)',
      dataIndex: 'memoryUsageWeekly',
      key: 'memoryUsageWeekly',
      render: (value) => formatPercentage(value),
      sorter: (a, b) => a.memoryUsageWeekly - b.memoryUsageWeekly,
    },
    {
      title: '磁盘使用率(周)',
      dataIndex: 'diskUsageWeekly',
      key: 'diskUsageWeekly',
      render: (value) => formatPercentage(value),
      sorter: (a, b) => a.diskUsageWeekly - b.diskUsageWeekly,
    },
    {
      title: '网络读入速率(周)',
      dataIndex: 'networkReadRateWeekly',
      key: 'networkReadRateWeekly',
      render: (value) => `${value} MB/s`,
    },
    {
      title: '网络写入速率(周)',
      dataIndex: 'networkWriteRateWeekly',
      key: 'networkWriteRateWeekly',
      render: (value) => `${value} MB/s`,
    },
    {
      title: 'CPU使用率(月)',
      dataIndex: 'cpuUsageMonthly',
      key: 'cpuUsageMonthly',
      render: (value) => formatPercentage(value),
      sorter: (a, b) => a.cpuUsageMonthly - b.cpuUsageMonthly,
    },
    {
      title: '内存使用率(月)',
      dataIndex: 'memoryUsageMonthly',
      key: 'memoryUsageMonthly',
      render: (value) => formatPercentage(value),
      sorter: (a, b) => a.memoryUsageMonthly - b.memoryUsageMonthly,
    },
    {
      title: '磁盘使用率(月)',
      dataIndex: 'diskUsageMonthly',
      key: 'diskUsageMonthly',
      render: (value) => formatPercentage(value),
      sorter: (a, b) => a.diskUsageMonthly - b.diskUsageMonthly,
    },
  ];

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: 16,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <Space wrap>
          <Input
            placeholder="搜索IP"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates || [null, null])}
            placeholder={['开始时间', '结束时间']}
          />
          <Button type="primary" onClick={handleSearch}>
            搜索
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={hosts}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1500 }}
        rowKey="ip"
      />
    </div>
  );
};

export default Inefficient;