import React, { useMemo, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import ProLayout from '@ant-design/pro-layout';
import { PageContainer } from '@ant-design/pro-components';
import type { MenuDataItem } from '@ant-design/pro-layout';
import { Avatar, Dropdown, Space } from 'antd';
import { useMessage, usePermissions } from '../../hooks';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  FileOutlined,
  FileTextOutlined,
  BellOutlined,
  ApartmentOutlined,
  ControlOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../../features/auth';
import { NotificationButton } from '../../../features/notification-management';
import TabBar from '../TabBar';

// 懒加载页面组件（统一指向各 feature 模块中的页面组件）
const Dashboard = React.lazy(() => import('../../../features/dashboard/components/Dashboard'));
const UserManagement = React.lazy(() => import('../../../features/user-management/components/UserManagement'));
const RoleManagement = React.lazy(() => import('../../../features/role-management/components/RoleManagement'));
const PermissionManagement = React.lazy(() => import('../../../features/permission-management/components/PermissionManagement'));
const FileManager = React.lazy(() => import('../../../features/file-management/components/FileManager'));
const LogManagement = React.lazy(() => import('../../../features/log-management/pages/LogManagement'));
const Settings = React.lazy(() => import('../../../features/system-settings/components/Settings'));
const NotificationManagement = React.lazy(() => import('../../../features/notification-management/pages/NotificationManagement'));
const DepartmentManagement = React.lazy(() => import('../../../features/department-management/components/DepartmentManagement'));

// 扩展菜单项类型，添加权限配置
interface MenuItemWithPermissions extends MenuDataItem {
  permissions?: string[]; // 访问此菜单所需的权限
  adminOnly?: boolean; // 是否仅管理员可见
}

// 菜单配置（带权限）
const allMenuData: MenuItemWithPermissions[] = [
  {
    path: '/dashboard',
    name: '仪表板',
    icon: <DashboardOutlined />,
    permissions: ['dashboard:read'],
  },
  {
    path: '/system',
    name: '系统管理',
    icon: <ControlOutlined />,
    children: [
      {
        path: '/users',
        name: '用户管理',
        icon: <UserOutlined />,
        permissions: ['user:read', 'user:create', 'user:update', 'user:delete'],
      },
      {
        path: '/departments',
        name: '部门管理',
        icon: <ApartmentOutlined />,
        permissions: ['department:read', 'department:create', 'department:update', 'department:delete'],
      },
      {
        path: '/roles',
        name: '角色管理',
        icon: <TeamOutlined />,
        permissions: ['role:read', 'role:create', 'role:update', 'role:delete'],
      },
      {
        path: '/permissions',
        name: '权限管理',
        icon: <SafetyCertificateOutlined />,
        permissions: ['permission:read', 'permission:create', 'permission:update', 'permission:delete'],
       
      },
      {
        path: '/settings',
        name: '系统设置',
        icon: <SettingOutlined />,
        permissions: ['system:admin'],
      },
    ],
  },
  {
    path: '/notifications',
    name: '通知管理',
    icon: <BellOutlined />,
    
  },
  {
    path: '/files',
    name: '文件管理',
    icon: <FileOutlined />,
    
  },
  {
    path: '/logs',
    name: '日志管理',
    icon: <FileTextOutlined />,
    
  },
];

const DashboardLayout: React.FC = () => {
  const message = useMessage();
  const { user: currentUser, logout, isLoading: loading } = useAuth();
  const { hasAnyPermission, isAdmin } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 菜单展开状态管理
  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    // 根据当前路径自动展开相应的菜单
    const currentPath = location.pathname;
    const openKeys: string[] = [];
    
    // 如果当前路径是系统管理下的子页面，自动展开系统管理菜单
    if (['/users', '/departments', '/roles', '/permissions', '/settings'].includes(currentPath)) {
      openKeys.push('/system');
    }
    
    return openKeys;
   });

  // 监听路径变化，动态更新菜单展开状态
  useEffect(() => {
    const currentPath = location.pathname;
    const newOpenKeys: string[] = [];
    
    // 如果当前路径是系统管理下的子页面，确保系统管理菜单展开
    if (['/users', '/departments', '/roles', '/permissions', '/settings'].includes(currentPath)) {
      newOpenKeys.push('/system');
    }
    
    setOpenKeys(newOpenKeys);
  }, [location.pathname]);

  // 根据用户权限过滤菜单
  const menuData = useMemo(() => {
    const filterMenuItems = (items: MenuItemWithPermissions[]): MenuItemWithPermissions[] => {
      return items.filter(item => {
        // 如果菜单项标记为仅管理员可见，检查是否为管理员
        if (item.adminOnly && !isAdmin) {
          return false;
        }

        // 如果菜单项有权限要求，检查用户是否具有任意一个权限
        if (item.permissions && item.permissions.length > 0) {
          if (!hasAnyPermission(item.permissions)) {
            return false;
          }
        }

        // 如果有子菜单，递归过滤子菜单
        if (item.children && item.children.length > 0) {
          const filteredChildren = filterMenuItems(item.children as MenuItemWithPermissions[]);
          // 如果过滤后没有子菜单，则隐藏父菜单
          if (filteredChildren.length === 0) {
            return false;
          }
          // 更新子菜单
          item.children = filteredChildren;
        }

        return true;
      });
    };

    return filterMenuItems(allMenuData);
  }, [hasAnyPermission, isAdmin]);

  const handleLogout = async () => {
    try {
      await logout();
      message.success('退出登录成功');
      navigate('/login');
    } catch {
      message.error('退出登录失败');
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '个人设置',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        加载中...
      </div>
    );
  }

  return (
    <ProLayout
      title="Fennec 管理系统"
      logo={false}
      layout="mix"
      navTheme="light"
      fixedHeader
      fixSiderbar
      colorWeak={false}
      menu={{
        defaultOpenAll: false,
        ignoreFlatMenu: false,
        autoClose: false,
      }}
      onMenuHeaderClick={() => {
        // 菜单头部点击事件
      }}
      menuProps={{
        mode: 'inline',
        openKeys,
        onOpenChange: setOpenKeys,
        inlineCollapsed: false,
      }}
      location={{
        pathname: location.pathname,
      }}
      route={{
        routes: menuData,
      }}
      menuItemRender={(item, dom) => (
        <div onClick={() => {
          navigate(item.path || '/');
        }}>
          {dom}
        </div>
      )}
      headerContentRender={() => (
       <TabBar menuData={menuData} />
      )}
      actionsRender={() => [
        <NotificationButton key="notify" />,
        <Dropdown
          key="user"
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          arrow
        >
          <Space style={{ cursor: 'pointer' }}>
            <Avatar 
              size="small" 
              icon={<UserOutlined />}
              src={currentUser?.avatar}
            />
            <span>{currentUser?.username}</span>
          </Space>
        </Dropdown>
      ]}
    >
      <PageContainer 
        header={{ title: false }}
        breadcrumb={{ items: [] }}
        className="no-content-padding"
      >
        <div style={{ padding: '5px 0',}}>
          <React.Suspense fallback={<div>加载中...</div>}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/departments" element={<DepartmentManagement />} />
              <Route path="/roles" element={<RoleManagement />} />
              <Route path="/permissions" element={<PermissionManagement />} />
              <Route path="/notifications" element={<NotificationManagement />} />
              <Route path="/files" element={<FileManager />} />
              <Route path="/logs" element={<LogManagement />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </React.Suspense>
        </div>
      </PageContainer>
    </ProLayout>
  );
};

export default DashboardLayout;