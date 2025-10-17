import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Statistic, Spin, message, Progress } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  SafetyCertificateOutlined, 
  LoginOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { dashboardService, type DashboardStats, type SystemStatus } from '../../services/dashboard.service';
import { usePermissions } from '../../../../shared/hooks';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const { isAdmin } = usePermissions();

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // 普通用户只加载统计数据，管理员加载所有数据
      if (isAdmin) {
        const [statsData, statusData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getSystemStatus(),
        ]);
        setStats(statsData);
        setSystemStatus(statusData);
      } else {
        const statsData = await dashboardService.getStats();
        setStats(statsData);
        setSystemStatus(null); // 普通用户不显示系统状态
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      message.error('加载仪表板数据失败');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return (
      <div style={{ padding: 0, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 0 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={stats?.totalUsers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="角色总数"
              value={stats?.totalRoles || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="权限总数"
              value={stats?.totalPermissions || 0}
              prefix={<SafetyCertificateOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="今日登录"
              value={stats?.todayLogins || 0}
              prefix={<LoginOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={stats?.activeUsers || 0}
              prefix={<UserAddOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        {isAdmin && (
          <Col xs={24} sm={12} md={12}>
            <Card title="系统状态">
              <Row gutter={16}>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <Progress
                      type="circle"
                      percent={systemStatus?.cpuUsage || 0}
                      size={80}
                      strokeColor="#52c41a"
                    />
                    <div style={{ marginTop: 8 }}>CPU 使用率</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <Progress
                      type="circle"
                      percent={systemStatus?.memoryUsage || 0}
                      size={80}
                      strokeColor="#1890ff"
                    />
                    <div style={{ marginTop: 8 }}>内存使用率</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <Progress
                      type="circle"
                      percent={systemStatus?.diskUsage || 0}
                      size={80}
                      strokeColor="#722ed1"
                    />
                    <div style={{ marginTop: 8 }}>磁盘使用率</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        )}
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="欢迎使用 Fennec 管理系统">
            <p>这是一个基于 React 19 + TypeScript + Ant Design 构建的现代化管理系统。</p>
            <p>系统提供了完整的用户、角色、权限管理功能。</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;