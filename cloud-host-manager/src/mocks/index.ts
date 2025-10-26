import type {
  CloudHost,
  InefficientHost,
  HostMetric,
  ChannelMetricSummary,
  ChannelMetricDetail,
  HostChangeRecord,
  DashboardStats
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
  return hosts.map(host => ({
    ip: host.ip,
    sampleTime: generateRandomDateString(),
    cpuUsage: generateRandomPercentage(),
    memoryUsage: generateRandomPercentage(),
    diskUsage: generateRandomPercentage(),
    networkReadRate: parseFloat((Math.random() * 100).toFixed(2)),
    networkWriteRate: parseFloat((Math.random() * 100).toFixed(2)),
    processCount: generateRandomNumber(50, 500),
    taskCount: generateRandomNumber(1000, 10000),
    runningProcesses: `process_${generateRandomNumber(1, 100)},process_${generateRandomNumber(101, 200)}`
  }));
};

// 生成通道维度指标汇总数据
export const generateChannelMetricSummaries = (count: number): ChannelMetricSummary[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `channel_${index + 1}`,
    channelName: generateRandomChannel(),
    taskType: Math.random() > 0.6 ? 'DATA' : (Math.random() > 0.5 ? 'DETAIL' : 'LIST'),
    sampleTime: generateRandomDateString(),
    taskCount: generateRandomNumber(500, 5000),
    successCount: generateRandomNumber(200, 4000),
    failureCount: generateRandomNumber(0, 500),
    emptyCount: generateRandomNumber(0, 300),
    dedupCount: generateRandomNumber(0, 200)
  }));
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
    
    return selectedHosts.map(host => ({
      parentId: summary.id,
      businessName: generateRandomBusiness(),
      ip: host.ip,
      sampleTime: generateRandomDateString(),
      taskCount: generateRandomNumber(100, 1000),
      successCount: generateRandomNumber(50, 800),
      failureCount: generateRandomNumber(0, 100),
      emptyCount: generateRandomNumber(0, 50),
      dedupCount: generateRandomNumber(0, 30)
    }));
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

// 生成所有Mock数据
export const generateMockData = (hostCount: number = 50, channelCount: number = 10) => {
  const cloudHosts = generateCloudHosts(hostCount);
  const inefficientHosts = generateInefficientHosts(cloudHosts);
  const hostMetrics = generateHostMetrics(cloudHosts);
  const channelMetricSummaries = generateChannelMetricSummaries(channelCount);
  const channelMetricDetails = generateChannelMetricDetails(channelMetricSummaries, cloudHosts);
  const hostChangeRecords = generateHostChangeRecords(cloudHosts);
  const dashboardStats = generateDashboardStats(cloudHosts);
  
  return {
    cloudHosts,
    inefficientHosts,
    hostMetrics,
    channelMetricSummaries,
    channelMetricDetails,
    hostChangeRecords,
    dashboardStats
  };
};