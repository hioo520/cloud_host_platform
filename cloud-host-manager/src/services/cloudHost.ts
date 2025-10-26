import type {
  CloudHost,
  InefficientHost,
  HostMetric,
  ChannelMetricSummary,
  ChannelMetricDetail,
  HostChangeRecord,
  DashboardStats
} from '../types';
import { generateMockData } from '../mocks';

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 云主机管理服务
class CloudHostService {
  // 获取首页统计数据
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(300);
    const mockData = generateMockData();
    return mockData.dashboardStats;
  }

  // 获取云主机列表
  async getCloudHosts(params: {
    page?: number;
    pageSize?: number;
    search?: string;
  } = {}): Promise<{ data: CloudHost[]; total: number }> {
    await delay(500);
    const mockData = generateMockData();
    const { page = 1, pageSize = 10, search = '' } = params;
    
    let filteredData = mockData.cloudHosts;
    
    // 搜索过滤
    if (search) {
      filteredData = filteredData.filter(host => 
        host.ip.includes(search) ||
        host.vendor.includes(search) ||
        host.region.includes(search) ||
        host.system.includes(search) ||
        host.owner.includes(search) ||
        host.department.includes(search)
      );
    }
    
    // 分页处理
    const total = filteredData.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filteredData.slice(start, end);
    
    return { data, total };
  }

  // 获取云主机详情
  async getCloudHostById(id: string): Promise<CloudHost | undefined> {
    await delay(300);
    const mockData = generateMockData();
    return mockData.cloudHosts.find(host => host.id === id);
  }

  // 创建云主机
  async createCloudHost(host: Omit<CloudHost, 'id'>): Promise<CloudHost> {
    await delay(300);
    // 在实际应用中，这里会调用后端API
    return {
      ...host,
      id: `host_${Date.now()}`
    };
  }

  // 更新云主机
  async updateCloudHost(id: string, host: Partial<CloudHost>): Promise<CloudHost | undefined> {
    await delay(300);
    // 在实际应用中，这里会调用后端API
    const mockData = generateMockData();
    const existingHost = mockData.cloudHosts.find(h => h.id === id);
    if (existingHost) {
      return { ...existingHost, ...host };
    }
    return undefined;
  }

  // 删除云主机
  async deleteCloudHost(id: string): Promise<boolean> {
    await delay(300);
    // 在实际应用中，这里会调用后端API
    return true;
  }

  // 获取低效云主机列表
  async getInefficientHosts(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    startTime?: string;
    endTime?: string;
  } = {}): Promise<{ data: InefficientHost[]; total: number }> {
    await delay(500);
    const mockData = generateMockData();
    const { page = 1, pageSize = 10, search = '' } = params;
    
    let filteredData = mockData.inefficientHosts;
    
    // 搜索过滤
    if (search) {
      filteredData = filteredData.filter(host => 
        host.ip.includes(search)
      );
    }
    
    // 分页处理
    const total = filteredData.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filteredData.slice(start, end);
    
    return { data, total };
  }

  // 获取云主机变更记录
  async getHostChangeRecords(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    startTime?: string;
    endTime?: string;
  } = {}): Promise<{ data: HostChangeRecord[]; total: number }> {
    await delay(500);
    const mockData = generateMockData();
    const { page = 1, pageSize = 10, search = '', startTime, endTime } = params;
    
    let filteredData = mockData.hostChangeRecords;
    
    // 搜索过滤
    if (search) {
      filteredData = filteredData.filter(record => 
        record.ip.includes(search) ||
        record.operator.includes(search)
      );
    }
    
    // 时间范围过滤
    if (startTime || endTime) {
      filteredData = filteredData.filter(record => {
        const recordTime = new Date(record.sampleTime);
        const start = startTime ? new Date(startTime) : new Date(0);
        const end = endTime ? new Date(endTime) : new Date();
        return recordTime >= start && recordTime <= end;
      });
    }
    
    // 分页处理
    const total = filteredData.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filteredData.slice(start, end);
    
    return { data, total };
  }

  // 获取公共池云主机
  async getPublicPoolHosts(params: {
    page?: number;
    pageSize?: number;
    search?: string;
  } = {}): Promise<{ data: CloudHost[]; total: number }> {
    await delay(500);
    const mockData = generateMockData();
    const { page = 1, pageSize = 10, search = '' } = params;
    
    // 只获取管理状态为"可申请（公共池）"的主机
    let filteredData = mockData.cloudHosts.filter(host => host.managementStatus === 3);
    
    // 搜索过滤
    if (search) {
      filteredData = filteredData.filter(host => 
        host.ip.includes(search) ||
        host.vendor.includes(search) ||
        host.region.includes(search) ||
        host.system.includes(search) ||
        host.owner.includes(search) ||
        host.department.includes(search)
      );
    }
    
    // 分页处理
    const total = filteredData.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filteredData.slice(start, end);
    
    return { data, total };
  }

  // 获取多维度指标数据
  async getMultiDimensionMetrics(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    hostIps?: string[]; // 支持按主机IP筛选
  } = {}): Promise<{
    hostMetrics: HostMetric[];
    channelSummaries: ChannelMetricSummary[];
    channelDetails: ChannelMetricDetail[];
    total: number;
  }> {
    await delay(800);
    const mockData = generateMockData();
    const { page = 1, pageSize = 10, search = '', hostIps: filterHostIps } = params;
    
    let filteredHostMetrics = mockData.hostMetrics;
    
    // 按主机IP筛选
    if (filterHostIps && filterHostIps.length > 0) {
      filteredHostMetrics = filteredHostMetrics.filter(metric => 
        filterHostIps.includes(metric.ip)
      );
    }
    
    // 搜索过滤
    if (search) {
      filteredHostMetrics = filteredHostMetrics.filter(metric => 
        metric.ip.includes(search)
      );
    }
    
    // 分页处理
    const total = filteredHostMetrics.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedHostMetrics = filteredHostMetrics.slice(start, end);
    
    // 获取关联的通道数据
    const metricHostIps = paginatedHostMetrics.map(metric => metric.ip);
    const channelDetails = mockData.channelMetricDetails.filter(detail => 
      metricHostIps.includes(detail.ip)
    );
    
    const parentIds = [...new Set(channelDetails.map(detail => detail.parentId))];
    const channelSummaries = mockData.channelMetricSummaries.filter(summary => 
      parentIds.includes(summary.id)
    );
    
    return {
      hostMetrics: paginatedHostMetrics,
      channelSummaries,
      channelDetails,
      total
    };
  }

  // 恢复最新状态
  async restoreLatestStatus(ip: string): Promise<boolean> {
    await delay(300);
    // 在实际应用中，这里会调用后端API来恢复主机的最新状态
    return true;
  }
}

export default new CloudHostService();