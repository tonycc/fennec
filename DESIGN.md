# Fennec 后台管理系统框架设计文档

## 1. 项目概述

Fennec 是一个基于现代技术栈的企业级后台管理系统框架，采用 Monorepo 架构，提供完整的前后端解决方案。

### 1.1 核心设计原则

1. **单一真相来源**：通过 `shared` 包统一前后端的类型定义和接口契约
2. **模块边界清晰**：采用 Feature-folder 架构，按业务领域组织代码
3. **安全默认开启**：内置安全中间件、CORS 白名单、请求限流等
4. **可测试与可替换**：依赖注入设计，便于单元测试和组件替换
5. **渐进式演进**：从 MVP 到企业级的清晰升级路径

### 1.2 架构特点

- **Monorepo 管理**：统一依赖管理和构建流程
- **类型安全**：端到端 TypeScript 支持
- **现代化 UI**：基于 React 19 + Ant Design 5.x
- **高性能**：Vite 构建 + Express 服务
- **企业级安全**：完整的认证授权体系

## 2. 技术栈详解

### 2.1 Monorepo 管理

**工具选择**：npm workspaces
- **配置文件**：根目录 `package.json`
- **工作空间**：`frontend`、`backend`、`shared`

### 2.2 后端技术栈

#### 核心框架
- **Node.js** + **TypeScript**：现代 JavaScript 运行时
- **Express.js**：轻量级 Web 框架
- **Prisma ORM**：类型安全的数据库访问层

#### 数据库
- **开发环境**：SQLite（快速启动，零配置）
- **生产环境**：PostgreSQL/MySQL（通过 Prisma 无缝切换）

#### 认证与安全
- **JWT**：无状态认证机制
- **bcryptjs**：密码哈希
- **helmet**：安全头部中间件
- **cors**：跨域资源共享控制
- **express-rate-limit**：API 限流
- **express-validator**：请求参数验证

#### 日志与监控
- **winston**：结构化日志记录
- **morgan**：HTTP 请求日志

#### 开发工具
- **tsx**：TypeScript 执行器
- **eslint**：代码质量检查
- **supertest**：API 测试

### 2.3 前端技术栈

#### 核心框架
- **React 19**：最新版本的 React 框架
- **TypeScript**：类型安全的 JavaScript 超集
- **Vite**：快速的构建工具

#### UI 组件库
- **Ant Design 5.x**：企业级 UI 设计语言
- **@ant-design/pro-components**：高级业务组件
- **@ant-design/pro-layout**：专业布局组件
- **@ant-design/icons**：图标库

#### 路由与状态管理
- **React Router v6**：声明式路由
- **TanStack Query**：服务端状态管理和数据获取

#### HTTP 客户端
- **axios**：Promise 基础的 HTTP 库

#### 开发工具
- **ESLint**：代码质量检查
- **TypeScript ESLint**：TypeScript 专用规则

## 3. 项目结构设计

### 3.1 整体目录结构

```
fennec/
├── package.json                 # 根目录配置，workspaces 管理
├── DESIGN.md                   # 设计文档
├── README.md                   # 项目说明
├── .gitignore                  # Git 忽略文件
├── .eslintrc.js               # ESLint 配置
├── tsconfig.json              # TypeScript 基础配置
│
├── shared/                     # 共享代码包
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── types/             # 共享类型定义
│   │   ├── interfaces/        # API 接口定义
│   │   ├── constants/         # 常量定义
│   │   ├── utils/            # 共享工具函数
│   │   └── index.ts          # 导出入口
│   └── dist/                  # 编译输出
│
├── backend/                    # 后端服务
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/               # Prisma 配置
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── app.ts            # Express 应用入口
│   │   ├── server.ts         # 服务器启动文件
│   │   ├── config/           # 配置文件
│   │   ├── middleware/       # 中间件
│   │   ├── features/         # 业务功能模块
│   │   │   ├── auth/        # 认证模块
│   │   │   ├── users/       # 用户管理
│   │   │   └── dashboard/   # 仪表板
│   │   ├── shared/          # 后端共享代码
│   │   │   ├── database/    # 数据库连接
│   │   │   ├── logger/      # 日志配置
│   │   │   └── validators/  # 验证器
│   │   └── types/           # 后端类型定义
│   ├── tests/               # 测试文件
│   └── dist/                # 编译输出
│
└── frontend/                   # 前端应用
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts         # Vite 配置
    ├── index.html             # HTML 模板
    ├── public/                # 静态资源
    ├── src/
    │   ├── main.tsx          # 应用入口
    │   ├── App.tsx           # 根组件
    │   ├── features/         # 业务功能模块
    │   │   ├── auth/        # 认证相关
    │   │   ├── dashboard/   # 仪表板
    │   │   └── users/       # 用户管理
    │   ├── shared/          # 前端共享代码
    │   │   ├── components/  # 公共组件
    │   │   ├── hooks/       # 自定义 Hooks
    │   │   ├── services/    # API 服务
    │   │   ├── utils/       # 工具函数
    │   │   └── constants/   # 常量
    │   ├── assets/          # 静态资源
    │   └── types/           # 前端类型定义
    └── dist/                # 构建输出
```

### 3.2 Feature-folder 架构

每个业务模块采用统一的文件组织结构：

```
features/auth/
├── components/              # 模块专用组件
├── hooks/                  # 模块专用 Hooks
├── services/               # API 服务
├── types/                  # 类型定义
├── utils/                  # 工具函数
└── index.ts               # 模块导出
```

## 4. 核心功能设计

### 4.1 认证授权系统

#### 4.1.1 JWT 认证流程
1. 用户登录 → 验证凭据 → 生成 JWT Token
2. 前端存储 Token → 请求携带 Token → 后端验证
3. Token 刷新机制 → 自动续期

#### 4.1.2 权限控制
- **RBAC 模型**：角色基础访问控制
- **路由守卫**：前端路由权限验证
- **API 权限**：后端接口权限验证

### 4.2 数据库设计

#### 4.2.1 核心表结构
```sql
-- 用户表
users (id, username, email, password_hash, role_id, created_at, updated_at)

-- 角色表
roles (id, name, description, permissions, created_at, updated_at)

-- 会话表
sessions (id, user_id, token, expires_at, created_at)
```

### 4.3 API 设计规范

#### 4.3.1 RESTful API
- **GET** `/api/users` - 获取用户列表
- **POST** `/api/users` - 创建用户
- **PUT** `/api/users/:id` - 更新用户
- **DELETE** `/api/users/:id` - 删除用户

#### 4.3.2 响应格式
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}
```

## 5. 安全设计

### 5.1 安全中间件配置
- **Helmet**：设置安全 HTTP 头
- **CORS**：配置跨域白名单
- **Rate Limiting**：API 请求频率限制
- **Input Validation**：请求参数验证

### 5.2 数据安全
- **密码加密**：bcryptjs 哈希存储
- **SQL 注入防护**：Prisma ORM 参数化查询
- **XSS 防护**：输入输出过滤

## 6. 开发规范

### 6.1 代码规范
- **ESLint**：代码质量检查
- **Prettier**：代码格式化
- **TypeScript**：严格类型检查

### 6.2 Git 规范
- **Conventional Commits**：规范化提交信息
- **分支策略**：feature/bugfix/hotfix 分支管理

### 6.3 测试策略
- **单元测试**：Jest + Testing Library
- **集成测试**：Supertest API 测试
- **E2E 测试**：Playwright（可选）

## 7. 部署方案

### 7.1 开发环境
- **前端**：Vite Dev Server (http://localhost:5173)
- **后端**：Express Server (http://localhost:3000)
- **数据库**：SQLite 本地文件

### 7.2 生产环境
- **前端**：静态文件部署（Nginx/CDN）
- **后端**：Node.js 服务（PM2/Docker）
- **数据库**：PostgreSQL/MySQL
- **反向代理**：Nginx

## 8. 性能优化

### 8.1 前端优化
- **代码分割**：React.lazy + Suspense
- **缓存策略**：TanStack Query 缓存
- **打包优化**：Vite 构建优化

### 8.2 后端优化
- **数据库优化**：索引设计 + 查询优化
- **缓存策略**：Redis 缓存（可选）
- **连接池**：数据库连接池管理

## 9. 监控与日志

### 9.1 日志系统
- **结构化日志**：Winston 日志记录
- **日志级别**：error/warn/info/debug
- **日志轮转**：按时间/大小轮转

### 9.2 监控指标
- **性能监控**：响应时间、吞吐量
- **错误监控**：异常捕获和报告
- **业务监控**：用户行为分析

## 10. 扩展规划

### 10.1 功能扩展
- **多租户支持**：SaaS 模式扩展
- **微服务架构**：服务拆分和治理
- **消息队列**：异步任务处理

### 10.2 技术升级
- **数据库迁移**：支持多种数据库
- **容器化部署**：Docker + Kubernetes
- **CI/CD 流水线**：自动化部署

---

本设计文档将作为项目开发的指导文档，所有开发工作将严格按照此文档执行。