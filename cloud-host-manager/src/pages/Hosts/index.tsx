import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Modal, 
  Form, 
  InputNumber, 
  Select, 
  message,
  Popconfirm
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import cloudHostService from '../../services/cloudHost';
import type { CloudHost } from '../../types';
import { 
  getManagementStatusText, 
  getDeviceStatusText, 
  getEnabledStatusText 
} from '../../utils/format';

const { Option } = Select;

const Hosts: React.FC = () => {
  const [hosts, setHosts] = useState<CloudHost[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingHost, setEditingHost] = useState<CloudHost | null>(null);
  const [form] = Form.useForm();

  const fetchHosts = async () => {
    try {
      setLoading(true);
      const { data, total } = await cloudHostService.getCloudHosts({
        page: currentPage,
        pageSize,
        search: searchText
      });
      setHosts(data);
      setTotal(total);
    } catch (error) {
      console.error('获取云主机列表失败:', error);
      message.error('获取云主机列表失败');
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

  const handleCreate = () => {
    setEditingHost(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: CloudHost) => {
    setEditingHost(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await cloudHostService.deleteCloudHost(id);
      message.success('删除成功');
      fetchHosts();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingHost) {
        // 更新
        await cloudHostService.updateCloudHost(editingHost.id!, values);
        message.success('更新成功');
      } else {
        // 创建
        await cloudHostService.createCloudHost(values);
        message.success('创建成功');
      }
      
      setIsModalVisible(false);
      fetchHosts();
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
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
      title: '启用状态',
      dataIndex: 'enabledStatus',
      key: 'enabledStatus',
      render: (value) => getEnabledStatusText(value),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>编辑</a>
          <Popconfirm
            title="确定要删除这个云主机吗？"
            onConfirm={() => handleDelete(record.id!)}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新增云主机
        </Button>
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

      <Modal
        title={editingHost ? "编辑云主机" : "新增云主机"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
        >
          <Form.Item
            name="vendor"
            label="厂商"
            rules={[{ required: true, message: '请输入厂商' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="region"
            label="区域"
            rules={[{ required: true, message: '请输入区域' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="ip"
            label="IP地址"
            rules={[{ required: true, message: '请输入IP地址' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="cpu"
            label="CPU(核)"
            rules={[{ required: true, message: '请输入CPU核数' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="memory"
            label="内存(GB)"
            rules={[{ required: true, message: '请输入内存大小' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="disk"
            label="磁盘(GB)"
            rules={[{ required: true, message: '请输入磁盘大小' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="bandwidth"
            label="带宽(Mbps)"
            rules={[{ required: true, message: '请输入带宽' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="system"
            label="系统"
            rules={[{ required: true, message: '请输入系统' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="onlineTime"
            label="上线时间"
            rules={[{ required: true, message: '请输入上线时间' }]}
          >
            <Input placeholder="格式: 2025/10/10" />
          </Form.Item>
          
          <Form.Item
            name="owner"
            label="负责人"
            rules={[{ required: true, message: '请输入负责人' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="department"
            label="使用部门"
            rules={[{ required: true, message: '请输入使用部门' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="sharedDepartment"
            label="共享部门"
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="managementStatus"
            label="管理状态"
            rules={[{ required: true, message: '请选择管理状态' }]}
          >
            <Select>
              <Option value={1}>正常</Option>
              <Option value={2}>低利用率</Option>
              <Option value={3}>可申请（公共池）</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="deviceStatus"
            label="设备状态"
            rules={[{ required: true, message: '请选择设备状态' }]}
          >
            <Select>
              <Option value={1}>正常</Option>
              <Option value={2}>指标缺失</Option>
              <Option value={3}>负载异常</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="enabledStatus"
            label="启用状态"
            rules={[{ required: true, message: '请选择启用状态' }]}
          >
            <Select>
              <Option value={1}>启用</Option>
              <Option value={2}>逻辑删除</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Hosts;