import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  DatePicker, 
  message,
  Popconfirm
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons';
import cloudHostService from '../../services/cloudHost';
import type { HostChangeRecord, CloudHost } from '../../types';
import { getOperationTypeText } from '../../utils/format';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Changes: React.FC = () => {
  const [records, setRecords] = useState<HostChangeRecord[]>([]);
  const [hosts, setHosts] = useState<CloudHost[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const startTime = dateRange[0] ? dateRange[0].format('YYYY/MM/DD') : undefined;
      const endTime = dateRange[1] ? dateRange[1].format('YYYY/MM/DD') : undefined;
      
      const { data, total } = await cloudHostService.getHostChangeRecords({
        page: currentPage,
        pageSize,
        search: searchText,
        startTime,
        endTime
      });
      setRecords(data);
      setTotal(total);
    } catch (error) {
      console.error('获取变更记录失败:', error);
      message.error('获取变更记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [currentPage, pageSize, searchText, dateRange]);

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchRecords();
  };

  const handleReset = () => {
    setSearchText('');
    setDateRange([null, null]);
    setCurrentPage(1);
  };

  const handleRestoreStatus = async (ip: string) => {
    try {
      await cloudHostService.restoreLatestStatus(ip);
      message.success('状态恢复成功');
      fetchRecords();
    } catch (error) {
      console.error('状态恢复失败:', error);
      message.error('状态恢复失败');
    }
  };

  const columns: ColumnsType<HostChangeRecord> = [
    {
      title: '采样时间',
      dataIndex: 'sampleTime',
      key: 'sampleTime',
      width: 120,
    },
    {
      title: '云主机IP',
      dataIndex: 'ip',
      key: 'ip',
      width: 150,
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      render: (value) => getOperationTypeText(value),
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '原始值',
      dataIndex: 'oldValue',
      key: 'oldValue',
    },
    {
      title: '新值',
      dataIndex: 'newValue',
      key: 'newValue',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="确定要恢复到最新状态吗？"
            onConfirm={() => handleRestoreStatus(record.ip)}
            okText="确定"
            cancelText="取消"
          >
            <a>恢复状态</a>
          </Popconfirm>
        </Space>
      ),
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
            placeholder="搜索IP、操作人"
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
        dataSource={records}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
        rowKey={(record) => `${record.ip}-${record.sampleTime}`}
      />
    </div>
  );
};

export default Changes;