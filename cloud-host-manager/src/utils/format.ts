// 格式化百分比
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// 格式化存储大小
export const formatStorage = (value: number, unit: string = 'GB'): string => {
  return `${value} ${unit}`;
};

// 格式化带宽
export const formatBandwidth = (value: number): string => {
  return `${value} Mbps`;
};

// 格式化日期
export const formatDate = (dateString: string): string => {
  return dateString.replace(/\//g, '-');
};

// 获取管理状态文本
export const getManagementStatusText = (status: number): string => {
  switch (status) {
    case 1: return '正常';
    case 2: return '低利用率';
    case 3: return '可申请（公共池）';
    default: return '未知';
  }
};

// 获取设备状态文本
export const getDeviceStatusText = (status: number): string => {
  switch (status) {
    case 1: return '正常';
    case 2: return '指标缺失';
    case 3: return '负载异常';
    default: return '未知';
  }
};

// 获取启用状态文本
export const getEnabledStatusText = (status: number): string => {
  switch (status) {
    case 1: return '启用';
    case 2: return '逻辑删除';
    default: return '未知';
  }
};

// 获取操作类型文本
export const getOperationTypeText = (type: number): string => {
  switch (type) {
    case 1: return '管理状态';
    case 2: return '设备状态';
    default: return '未知';
  }
};