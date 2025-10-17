/**
 * 路由入口文件
 */

import { Router } from 'express';
// 使用新的feature结构导入路由
import { authRoutes } from '../features/core/auth';
import { userRoutes } from '../features/core/user';
import { roleRoutes } from '../features/core/role';
import { permissionRoutes } from '../features/core/permission';
import { departmentRoutes } from '../features/core/department';
import { settingsRoutes } from '../features/business/settings';
import { dashboardRoutes } from '../features/business/dashboard';
import { fileRoutes } from '../features/business/file';
import { logRoutes } from '../features/communication/log';
import notificationRoutes from '../features/communication/notification/core/notification.routes';

const router = Router();

// API 路由
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/departments', departmentRoutes);
router.use('/settings', settingsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/uploads', fileRoutes);
router.use('/logs', logRoutes);

// 健康检查路由 - 必须在通知路由之前，避免被认证中间件影响
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

router.use('/', notificationRoutes);

export default router;