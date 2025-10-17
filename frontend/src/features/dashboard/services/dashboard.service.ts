/**
 * 仪表板数据服务
 */

import apiClient from '../../../shared/services/api';

// 仪表板统计数据接口
export interface DashboardStats {
  totalUsers: number;
  totalRoles: number;
  totalPermissions: number;
  todayLogins: number;
  activeUsers: number;
}

// 用户活动数据接口
export interface UserActivity {
  date: string;
  loginCount: number;
  registerCount: number;
}

// 系统状态接口
export interface SystemStatus {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: number;
}

class DashboardService {
  /**
   * 获取仪表板统计数据
   */
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get('/dashboard/stats');
    return response.data.data;
  }

  /**
   * 获取用户活动数据（最近7天）
   */
  async getUserActivity(): Promise<UserActivity[]> {
    const response = await apiClient.get('/dashboard/user-activity');
    return response.data.data;
  }

  /**
   * 获取系统状态
   */
  async getSystemStatus(): Promise<SystemStatus> {
    const response = await apiClient.get('/dashboard/system-status');
    return response.data.data;
  }
}

export const dashboardService = new DashboardService();