// 云主机信息表
export interface CloudHost {
  id?: string;
  vendor: string; // 云主机厂商
  region: string; // 区域
  ip: string; // 云主机 IP
  cpu: number; // 处理器
  memory: number; // 内存
  disk: number; // 磁盘
  bandwidth: number; // 带宽
  system: string; // 系统
  onlineTime: string; // 上线时间
  owner: string; // 负责人
  department: string; // 使用部门
  sharedDepartment: string; // 共享部门
  enabledStatus: number; // 启用状态 1：启用，2：逻辑删除
  managementStatus: number; // 管理状态 1：正常，2：低利用率，3：可申请（公共池）
  deviceStatus: number; // 设备状态 1：正常，2：指标缺失，3：负载异常
}

// 低效云主机表
export interface InefficientHost {
  ip: string; // 云主机 IP
  sampleTime: string; // 采样时间
  cpuUsageWeekly: number; // CPU 使用率（周）
  memoryUsageWeekly: number; // 内存使用率（周）
  diskUsageWeekly: number; // 磁盘使用率（周）
  networkReadRateWeekly: number; // 网络读入速率（MB/s）（周）
  networkWriteRateWeekly: number; // 网络写入速率（MB/s）（周）
  cpuUsageMonthly: number; // CPU 使用率（月）
  memoryUsageMonthly: number; // 内存使用率（月）
  diskUsageMonthly: number; // 磁盘使用率（月）
  networkReadRateMonthly: number; // 网络读入速率（MB/s）（月）
  networkWriteRateMonthly: number; // 网络写入速率（MB/s）（月）
}

// 云主机维度指标表
export interface HostMetric {
  ip: string; // 云主机 IP
  sampleTime: string; // 采样时间
  cpuUsage: number; // CPU 使用率
  memoryUsage: number; // 内存使用率
  diskUsage: number; // 磁盘使用率
  networkReadRate: number; // 网络读入速率（MB/s）
  networkWriteRate: number; // 网络写入速率（MB/s）
  processCount: number; // 进程数
  taskCount: number; // 任务数
  runningProcesses: string; // 运行进程
}

// 通道维度指标汇总表
export interface ChannelMetricSummary {
  id: string; // ID
  channelName: string; // 通道名
  taskType: string; // 任务类型 LIST,DATA,DETAIL
  sampleTime: string; // 采样时间
  taskCount: number; // 任务数
  successCount: number; // 成功任务数
  failureCount: number; // 失败任务数
  emptyCount: number; // 空任务数
  dedupCount: number; // 消重任务数
}

// 通道维度指标详细表
export interface ChannelMetricDetail {
  parentId: string; // 是 "通道维度指标汇总表" ID
  businessName: string; // 业务名
  ip: string; // 云主机 IP
  sampleTime: string; // 采样时间
  taskCount: number; // 任务数
  successCount: number; // 成功任务数
  failureCount: number; // 失败任务数
  emptyCount: number; // 空任务数
  dedupCount: number; // 消重任务数
}

// 云主机变更记录表
export interface HostChangeRecord {
  sampleTime: string; // 采样时间
  ip: string; // 云主机 IP
  operationType: number; // 操作类型 1：管理状态，2：设备状态
  operator: string; // 操作人
  oldValue: string; // 原始值
  newValue: string; // 新值
  remark: string; // 备注
}

// 首页统计数据
export interface DashboardStats {
  totalHosts: number; // 云主机总数
  publicPoolHosts: number; // 云主机公共池
  windowsHosts: number; // Windows系统云主机数
  linuxHosts: number; // Linux系统云主机数
  cpuUsage: number; // CPU使用率
  memoryUsage: number; // 内存使用率
  diskUsage: number; // 磁盘使用率
  highCpuHosts: number; // CPU高负载数
  highMemoryHosts: number; // 内存高负载数
  highDiskHosts: number; // 磁盘高负载数
  offlineHosts: number; // 机器不在线数
}

// 业务维度指标表
export interface BusinessMetric {
  businessName: string; // 业务名
  sampleTime: string; // 采样时间
  taskCount: number; // 任务数
  successCount: number; // 成功任务数
  failureCount: number; // 失败任务数
  emptyCount: number; // 空任务数
  dedupCount: number; // 消重任务数
  hostCount: number; // 关联主机数
}

// 多维度筛选指标表
export interface CustomMetric extends HostMetric {
  vendor: string; // 云主机厂商
  region: string; // 区域
  system: string; // 系统
  department: string; // 使用部门
  owner: string; // 负责人
  channels: Array<{
    businessName: string;
    channelName: string;
    taskCount: number;
    successCount: number;
    failureCount: number;
    successRate: string;
  }>; // 关联的通道和业务信息
}