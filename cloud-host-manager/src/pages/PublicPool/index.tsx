import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import cloudHostService from '../../services/cloudHost';
import type { CloudHost } from '../../types';
import { 
  getManagementStatusText, 
  getDeviceStatusText, 
  getEnabledStatusText 
} from '../../utils/format';

const PublicPool: React.FC = () => {
  const [hosts, setHosts] = useState<CloudHost[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');

  const fetchHosts = async () => {
    try {
      setLoading(true);
      const { data, total } = await cloudHostService.getPublicPoolHosts({
        page: currentPage,
        pageSize,
        search: searchText
      });
      setHosts(data);
      setTotal(total);
    } catch (error) {
      console.error('获取公共池主机失败:', error);
      message.error('获取公共池主机失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHosts();
  }, [currentPage, pageSize, searchText]);

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchHosts();
  };

  const handleApply = async (id: string) => {
    try {
      // 在实际应用中，这里会调用申请主机的API
      message.success('申请成功');
      fetchHosts();
    } catch (error) {
      console.error('申请失败:', error);
      message.error('申请失败');
    }
  };

  const columns: ColumnsType<CloudHost> = [
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      fixed: 'left',
      width: 150,
    },
    {
      title: '厂商',
      dataIndex: 'vendor',
      key: 'vendor',
    },
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: 'CPU(核)',
      dataIndex: 'cpu',
      key: 'cpu',
    },
    {
      title: '内存(GB)',
      dataIndex: 'memory',
      key: 'memory',
    },
    {
      title: '磁盘(GB)',
      dataIndex: 'disk',
      key: 'disk',
    },
    {
      title: '带宽(Mbps)',
      dataIndex: 'bandwidth',
      key: 'bandwidth',
    },
    {
      title: '系统',
      dataIndex: 'system',
      key: 'system',
    },
    {
      title: '上线时间',
      dataIndex: 'onlineTime',
      key: 'onlineTime',
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: '使用部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '管理状态',
      dataIndex: 'managementStatus',
      key: 'managementStatus',
      render: (value) => getManagementStatusText(value),
    },
    {
      title: '设备状态',
      dataIndex: 'deviceStatus',
      key: 'deviceStatus',
      render: (value) => getDeviceStatusText(value),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" size="small" onClick={() => handleApply(record.id!)}>
            申请使用
          </Button>
        </Space>
      ),
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
            placeholder="搜索IP、厂商、区域、系统、负责人、部门"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            prefix={<SearchOutlined />}
          />
          <Button type="primary" onClick={handleSearch}>
            搜索
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
        rowKey="id"
      />
    </div>
  );
};

export default PublicPool;