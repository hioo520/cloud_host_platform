import type {
  CloudHost,
  InefficientHost,
  HostMetric,
  ChannelMetricSummary,
  ChannelMetricDetail,
  HostChangeRecord,
  DashboardStats,
  BusinessMetric,
  CustomMetric
} from '../types';

// 生成随机IP地址
const generateRandomIP = () => {
  return `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

// 生成随机时间
const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// 生成随机日期字符串
const generateRandomDateString = () => {
  const date = generateRandomDate(new Date(2025, 0, 1), new Date());
  return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
};

// 生成随机百分比
const generateRandomPercentage = (min = 0, max = 100) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 生成随机数值
const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 生成随机系统类型
const generateRandomSystem = () => {
  const systems = [
    'Windows Server 2008',
    'Windows Server 2012',
    'Windows Server 2016',
    'Windows Server 2019',
    'Ubuntu 18.04',
    'Ubuntu 20.04',
    'CentOS 7',
    'CentOS 8',
    'Red Hat Enterprise Linux 8'
  ];
  return systems[Math.floor(Math.random() * systems.length)];
};

// 生成随机厂商
const generateRandomVendor = () => {
  const vendors = ['阿里云', '腾讯云', '华为云', 'AWS', 'Azure'];
  return vendors[Math.floor(Math.random() * vendors.length)];
};

// 生成随机区域
const generateRandomRegion = () => {
  const regions = ['南京', '北京', '上海', '广州', '深圳', '杭州'];
  return regions[Math.floor(Math.random() * regions.length)];
};

// 生成随机部门
const generateRandomDepartment = () => {
  const departments = [
    'DSC - 南京技术 - PEVC',
    'DSC - 南京技术 - WDS',
    'DSC - 北京技术部',
    'DSC - 上海研发中心',
    'DSC - 广州运维部'
  ];
  return departments[Math.floor(Math.random() * departments.length)];
};

// 生成随机负责人
const generateRandomOwner = () => {
  const owners = ['孙伟', '李明', '王芳', '张强', '刘洋', '陈静', '杨军', '黄丽'];
  return owners[Math.floor(Math.random() * owners.length)];
};

// 生成随机通道名
const generateRandomChannel = () => {
  const channels = ['FHBSD', 'XYZAB', 'LMNOP', 'QRSTUV', 'EFGHIJ'];
  return channels[Math.floor(Math.random() * channels.length)];
};

// 生成随机业务名
const generateRandomBusiness = () => {
  const businesses = ['业务A', '业务B', '业务C', '业务D', '业务E'];
  return businesses[Math.floor(Math.random() * businesses.length)];
};

// 生成云主机数据
export const generateCloudHosts = (count: number): CloudHost[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `host_${index + 1}`,
    vendor: generateRandomVendor(),
    region: generateRandomRegion(),
    ip: generateRandomIP(),
    cpu: generateRandomNumber(1, 16),
    memory: generateRandomNumber(1, 64),
    disk: generateRandomNumber(20, 500),
    bandwidth: generateRandomNumber(1, 100),
    system: generateRandomSystem(),
    onlineTime: generateRandomDateString(),
    owner: generateRandomOwner(),
    department: generateRandomDepartment(),
    sharedDepartment: generateRandomDepartment(),
    enabledStatus: Math.random() > 0.1 ? 1 : 2, // 90% 启用，10% 逻辑删除
    managementStatus: Math.random() > 0.7 ? (Math.random() > 0.5 ? 2 : 3) : 1, // 70% 正常，20% 低利用率，10% 公共池
    deviceStatus: Math.random() > 0.8 ? (Math.random() > 0.5 ? 2 : 3) : 1 // 80% 正常，10% 指标缺失，10% 负载异常
  }));
};

// 生成低效云主机数据
export const generateInefficientHosts = (hosts: CloudHost[]): InefficientHost[] => {
  return hosts.map(host => ({
    ip: host.ip,
    sampleTime: generateRandomDateString(),
    cpuUsageWeekly: generateRandomPercentage(0, 30),
    memoryUsageWeekly: generateRandomPercentage(0, 30),
    diskUsageWeekly: generateRandomPercentage(80, 100),
    networkReadRateWeekly: parseFloat((Math.random() * 5).toFixed(2)),
    networkWriteRateWeekly: parseFloat((Math.random() * 30).toFixed(2)),
    cpuUsageMonthly: generateRandomPercentage(0, 30),
    memoryUsageMonthly: generateRandomPercentage(0, 30),
    diskUsageMonthly: generateRandomPercentage(80, 100),
    networkReadRateMonthly: parseFloat((Math.random() * 5).toFixed(2)),
    networkWriteRateMonthly: parseFloat((Math.random() * 30).toFixed(2))
  }));
};

// 生成云主机维度指标数据
export const generateHostMetrics = (hosts: CloudHost[]): HostMetric[] => {
  return hosts.map(host => {
    // 根据主机配置生成更合理的指标数据
    const baseCpuUsage = Math.min(95, Math.max(5, host.cpu * 3 + Math.random() * 20));
    const baseMemoryUsage = Math.min(95, Math.max(10, host.memory * 1.5 + Math.random() * 15));
    const baseDiskUsage = Math.min(98, Math.max(20, host.disk / 10 + Math.random() * 30));
    
    return {
      ip: host.ip,
      sampleTime: generateRandomDateString(),
      cpuUsage: Math.round(baseCpuUsage),
      memoryUsage: Math.round(baseMemoryUsage),
      diskUsage: Math.round(baseDiskUsage),
      networkReadRate: parseFloat((Math.random() * 100).toFixed(2)),
      networkWriteRate: parseFloat((Math.random() * 100).toFixed(2)),
      processCount: generateRandomNumber(50, 500),
      taskCount: generateRandomNumber(1000, 10000),
      runningProcesses: `process_${generateRandomNumber(1, 100)},process_${generateRandomNumber(101, 200)}`
    };
  });
};

// 生成通道维度指标汇总数据
export const generateChannelMetricSummaries = (count: number): ChannelMetricSummary[] => {
  return Array.from({ length: count }, (_, index) => {
    const taskCount = generateRandomNumber(500, 5000);
    const successCount = generateRandomNumber(taskCount * 0.7, taskCount * 0.95);
    const failureCount = generateRandomNumber(0, taskCount - successCount);
    const emptyCount = generateRandomNumber(0, taskCount * 0.1);
    const dedupCount = generateRandomNumber(0, taskCount * 0.05);
    
    return {
      id: `channel_${index + 1}`,
      channelName: generateRandomChannel(),
      taskType: Math.random() > 0.6 ? 'DATA' : (Math.random() > 0.5 ? 'DETAIL' : 'LIST'),
      sampleTime: generateRandomDateString(),
      taskCount,
      successCount,
      failureCount,
      emptyCount,
      dedupCount
    };
  });
};

// 生成通道维度指标详细数据
export const generateChannelMetricDetails = (
  summaries: ChannelMetricSummary[],
  hosts: CloudHost[]
): ChannelMetricDetail[] => {
  return summaries.flatMap(summary => {
    // 每个通道关联2-5个云主机
    const hostCount = generateRandomNumber(2, 5);
    const selectedHosts = hosts
      .sort(() => 0.5 - Math.random())
      .slice(0, hostCount);
    
    return selectedHosts.map(host => {
      // 根据主机和通道信息生成更合理的指标
      const baseTaskCount = generateRandomNumber(100, 1000);
      const successRate = 0.7 + Math.random() * 0.25; // 70%-95% 成功率
      const successCount = Math.round(baseTaskCount * successRate);
      const failureCount = generateRandomNumber(0, baseTaskCount - successCount);
      const emptyCount = generateRandomNumber(0, baseTaskCount * 0.1);
      const dedupCount = generateRandomNumber(0, baseTaskCount * 0.05);
      
      return {
        parentId: summary.id,
        businessName: generateRandomBusiness(),
        ip: host.ip,
        sampleTime: generateRandomDateString(),
        taskCount: baseTaskCount,
        successCount,
        failureCount,
        emptyCount,
        dedupCount
      };
    });
  });
};

// 生成云主机变更记录数据
export const generateHostChangeRecords = (hosts: CloudHost[]): HostChangeRecord[] => {
  return hosts
    .filter(host => Math.random() > 0.7) // 30% 的主机有变更记录
    .flatMap(host => {
      // 每个主机有1-3条变更记录
      const recordCount = generateRandomNumber(1, 3);
      return Array.from({ length: recordCount }, (_, index) => ({
        sampleTime: generateRandomDateString(),
        ip: host.ip,
        operationType: Math.random() > 0.5 ? 1 : 2, // 管理状态或设备状态
        operator: Math.random() > 0.8 ? '系统' : generateRandomOwner(),
        oldValue: `${generateRandomNumber(1, 3)}`,
        newValue: `${generateRandomNumber(1, 3)}`,
        remark: Math.random() > 0.8 ? 'SYSTEM("系统处理！")' : '手动调整'
      }));
    });
};

// 生成首页统计数据
export const generateDashboardStats = (hosts: CloudHost[]): DashboardStats => {
  const totalHosts = hosts.length;
  const publicPoolHosts = hosts.filter(host => host.managementStatus === 3).length;
  const windowsHosts = hosts.filter(host => host.system.toLowerCase().includes('windows')).length;
  const linuxHosts = hosts.filter(host => host.system.toLowerCase().includes('linux') || host.system.toLowerCase().includes('ubuntu') || host.system.toLowerCase().includes('centos')).length;
  
  // 计算平均资源使用率
  const cpuUsage = generateRandomPercentage(20, 80);
  const memoryUsage = generateRandomPercentage(30, 70);
  const diskUsage = generateRandomPercentage(40, 60);
  
  // 计算异常主机数
  const highCpuHosts = hosts.filter(host => Math.random() > 0.8).length;
  const highMemoryHosts = hosts.filter(host => Math.random() > 0.85).length;
  const highDiskHosts = hosts.filter(host => Math.random() > 0.9).length;
  const offlineHosts = hosts.filter(host => host.deviceStatus === 3).length;
  
  return {
    totalHosts,
    publicPoolHosts,
    windowsHosts,
    linuxHosts,
    cpuUsage,
    memoryUsage,
    diskUsage,
    highCpuHosts,
    highMemoryHosts,
    highDiskHosts,
    offlineHosts
  };
};

// 生成业务维度指标数据（基于通道详细数据）
export const generateBusinessMetrics = (
  channelDetails: ChannelMetricDetail[]
): BusinessMetric[] => {
  // 按业务名分组统计
  const businessMap: Record<string, BusinessMetric> = {};
  
  channelDetails.forEach(detail => {
    if (!businessMap[detail.businessName]) {
      businessMap[detail.businessName] = {
        businessName: detail.businessName,
        sampleTime: detail.sampleTime,
        taskCount: 0,
        successCount: 0,
        failureCount: 0,
        emptyCount: 0,
        dedupCount: 0,
        hostCount: 0
      };
    }
    
    const business = businessMap[detail.businessName];
    business.taskCount += detail.taskCount;
    business.successCount += detail.successCount;
    business.failureCount += detail.failureCount;
    business.emptyCount += detail.emptyCount;
    business.dedupCount += detail.dedupCount;
    business.hostCount += 1;
    
    // 更新最新的采样时间
    if (detail.sampleTime > business.sampleTime) {
      business.sampleTime = detail.sampleTime;
    }
  });
  
  // 转换为数组
  return Object.values(businessMap);
};

// 生成多维度筛选数据（组合主机、通道、业务维度数据）
export const generateCustomMetrics = (
  hosts: CloudHost[],
  hostMetrics: HostMetric[],
  channelSummaries: ChannelMetricSummary[],
  channelDetails: ChannelMetricDetail[]
): CustomMetric[] => {
  // 为每个主机生成多维度数据
  return hostMetrics.map(metric => {
    // 查找主机信息
    const host = hosts.find(h => h.ip === metric.ip);
    
    // 查找相关的通道数据
    const relatedChannels = channelDetails.filter(detail => detail.ip === metric.ip);
    
    // 查找相关的业务数据
    const relatedBusinesses = relatedChannels.map(detail => {
      const summary = channelSummaries.find(s => s.id === detail.parentId);
      const successRate = detail.taskCount > 0 ? (detail.successCount / detail.taskCount * 100).toFixed(2) + '%' : '0%';
      
      return {
        businessName: detail.businessName,
        channelName: summary?.channelName || '',
        taskCount: detail.taskCount,
        successCount: detail.successCount,
        failureCount: detail.failureCount,
        successRate: successRate
      };
    });
    
    return {
      ...metric,
      vendor: host?.vendor || '',
      region: host?.region || '',
      system: host?.system || '',
      department: host?.department || '',
      owner: host?.owner || '',
      channels: relatedBusinesses
    };
  });
};

// 生成所有Mock数据
export const generateMockData = (hostCount: number = 50, channelCount: number = 10) => {
  const cloudHosts = generateCloudHosts(hostCount);
  const inefficientHosts = generateInefficientHosts(cloudHosts);
  const hostMetrics = generateHostMetrics(cloudHosts);
  const channelMetricSummaries = generateChannelMetricSummaries(channelCount);
  const channelMetricDetails = generateChannelMetricDetails(channelMetricSummaries, cloudHosts);
  const hostChangeRecords = generateHostChangeRecords(cloudHosts);
  const dashboardStats = generateDashboardStats(cloudHosts);
  
  // 新增的多维度数据
  const businessMetrics = generateBusinessMetrics(channelMetricDetails);
  const customMetrics = generateCustomMetrics(
    cloudHosts,
    hostMetrics,
    channelMetricSummaries,
    channelMetricDetails
  );
  
  return {
    cloudHosts,
    inefficientHosts,
    hostMetrics,
    channelMetricSummaries,
    channelMetricDetails,
    hostChangeRecords,
    dashboardStats,
    businessMetrics, // 业务维度指标数据
    customMetrics    // 多维度筛选数据
  };
};

