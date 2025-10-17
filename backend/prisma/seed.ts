/**
 * 数据库种子数据
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始播种数据...');

  // 创建权限
  const permissions = await Promise.all([
    // 用户管理权限
    prisma.permission.upsert({
      where: { code: 'user:create' },
      update: {},
      create: {
        name: '创建用户',
        code: 'user:create',
        description: '创建用户',
        resource: 'user',
        action: 'create',
      },
    }),
    prisma.permission.upsert({
      where: { code: 'user:read' },
      update: {},
      create: {
        name: '查看用户',
        code: 'user:read',
        description: '查看用户',
        resource: 'user',
        action: 'read',
      },
    }),
    prisma.permission.upsert({
      where: { code: 'user:update' },
      update: {},
      create: {
        name: '更新用户',
        code: 'user:update',
        description: '更新用户',
        resource: 'user',
        action: 'update',
      },
    }),
    prisma.permission.upsert({
      where: { code: 'user:delete' },
      update: {},
      create: {
        name: '删除用户',
        code: 'user:delete',
        description: '删除用户',
        resource: 'user',
        action: 'delete',
      },
    }),

    // 角色管理权限
    prisma.permission.upsert({
      where: { code: 'role:create' },
      update: {},
      create: {
        name: '创建角色',
        code: 'role:create',
        description: '创建角色',
        resource: 'role',
        action: 'create',
      },
    }),
    prisma.permission.upsert({
      where: { code: 'role:read' },
      update: {},
      create: {
        name: '查看角色',
        code: 'role:read',
        description: '查看角色',
        resource: 'role',
        action: 'read',
      },
    }),
    prisma.permission.upsert({
      where: { code: 'role:update' },
      update: {},
      create: {
        name: '更新角色',
        code: 'role:update',
        description: '更新角色',
        resource: 'role',
        action: 'update',
      },
    }),
    prisma.permission.upsert({
      where: { code: 'role:delete' },
      update: {},
      create: {
        name: '删除角色',
        code: 'role:delete',
        description: '删除角色',
        resource: 'role',
        action: 'delete',
      },
    }),

    // 部门管理权限
    prisma.permission.upsert({
      where: { code: 'department:create' },
      update: {},
      create: {
        name: '创建部门',
        code: 'department:create',
        description: '创建部门',
        resource: 'department',
        action: 'create',
      },
    }),
    prisma.permission.upsert({
      where: { code: 'department:read' },
      update: {},
      create: {
        name: '查看部门',
        code: 'department:read',
        description: '查看部门',
        resource: 'department',
        action: 'read',
      },
    }),
    prisma.permission.upsert({
      where: { code: 'department:update' },
      update: {},
      create: {
        name: '更新部门',
        code: 'department:update',
        description: '更新部门',
        resource: 'department',
        action: 'update',
      },
    }),
    prisma.permission.upsert({
      where: { code: 'department:delete' },
      update: {},
      create: {
        name: '删除部门',
        code: 'department:delete',
        description: '删除部门',
        resource: 'department',
        action: 'delete',
      },
    }),

    // 权限管理权限
    prisma.permission.upsert({
      where: { code: 'permission:create' },
      update: {},
      create: {
        name: '创建权限',
        code: 'permission:create',
        description: '创建权限',
        resource: 'permission',
        action: 'create',
      },
    }),
    prisma.permission.upsert({
      where: { code: 'permission:read' },
      update: {},
      create: {
        name: '查看权限',
        code: 'permission:read',
        description: '查看权限',
        resource: 'permission',
        action: 'read',
      },
    }),
    prisma.permission.upsert({
      where: { code: 'permission:update' },
      update: {},
      create: {
        name: '更新权限',
        code: 'permission:update',
        description: '更新权限',
        resource: 'permission',
        action: 'update',
      },
    }),
    prisma.permission.upsert({
      where: { code: 'permission:delete' },
      update: {},
      create: {
        name: '删除权限',
        code: 'permission:delete',
        description: '删除权限',
        resource: 'permission',
        action: 'delete',
      },
    }),

    // 仪表板权限
    prisma.permission.upsert({
      where: { code: 'dashboard:read' },
      update: {},
      create: {
        name: '查看仪表板',
        code: 'dashboard:read',
        description: '查看仪表板',
        resource: 'dashboard',
        action: 'read',
      },
    }),

    // 系统管理权限
    prisma.permission.upsert({
      where: { code: 'system:admin' },
      update: {},
      create: {
        name: '系统管理',
        code: 'system:admin',
        description: '系统管理',
        resource: 'system',
        action: 'admin',
      },
    }),
  ]);

  console.log('✅ 权限创建完成');

  // 创建角色
  const adminRole = await prisma.role.upsert({
    where: { code: 'admin' },
    update: {},
    create: {
      name: '系统管理员',
      code: 'admin',
      description: '拥有系统所有权限的超级管理员',
    },
  });

  const hrManagerRole = await prisma.role.upsert({
    where: { code: 'hr_manager' },
    update: {},
    create: {
      name: 'HR管理员',
      code: 'hr_manager',
      description: '负责人力资源管理，包括用户、部门管理',
    },
  });

  const departmentManagerRole = await prisma.role.upsert({
    where: { code: 'dept_manager' },
    update: {},
    create: {
      name: '部门管理员',
      code: 'dept_manager',
      description: '负责部门管理和部门内用户管理',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { code: 'user' },
    update: {},
    create: {
      name: '普通用户',
      code: 'user',
      description: '普通员工，只能查看基础信息',
    },
  });

  console.log('✅ 角色创建完成');

  // 为系统管理员角色分配所有权限
  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  // 为HR管理员分配用户、部门、角色管理权限
  const hrPermissions = permissions.filter(p => 
    p.code.startsWith('user:') || 
    p.code.startsWith('department:') || 
    p.code.startsWith('role:') ||
    p.code === 'dashboard:read'
  );
  for (const permission of hrPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: hrManagerRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: hrManagerRole.id,
        permissionId: permission.id,
      },
    });
  }

  // 为部门管理员分配部门和用户查看权限
  const deptManagerPermissions = permissions.filter(p => 
    p.code === 'user:read' || 
    p.code === 'department:read' || 
    p.code === 'department:update' ||
    p.code === 'dashboard:read'
  );
  for (const permission of deptManagerPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: departmentManagerRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: departmentManagerRole.id,
        permissionId: permission.id,
      },
    });
  }

  // 为普通用户角色分配基础权限
  const userPermissions = permissions.filter(p => 
    p.code === 'user:read' || p.code === 'dashboard:read'
  );
  for (const permission of userPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: userRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: userRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log('✅ 角色权限分配完成');

  // 创建管理员用户
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@fennec.com',
      password: hashedPassword,
      isActive: true,
    },
  });

  // 为管理员用户分配管理员角色
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log('✅ 管理员用户创建完成');

  // 创建HR管理员用户
  const hrPassword = await bcrypt.hash('hr123', 12);
  
  const hrUser = await prisma.user.upsert({
    where: { username: 'hrmanager' },
    update: {},
    create: {
      username: 'hrmanager',
      email: 'hr@fennec.com',
      password: hrPassword,
      isActive: true,
    },
  });

  // 为HR管理员分配HR管理员角色
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: hrUser.id,
        roleId: hrManagerRole.id,
      },
    },
    update: {},
    create: {
      userId: hrUser.id,
      roleId: hrManagerRole.id,
    },
  });

  // 创建部门管理员用户
  const deptManagerPassword = await bcrypt.hash('dept123', 12);
  
  const deptManagerUser = await prisma.user.upsert({
    where: { username: 'deptmanager' },
    update: {},
    create: {
      username: 'deptmanager',
      email: 'deptmanager@fennec.com',
      password: deptManagerPassword,
      isActive: true,
    },
  });

  // 为部门管理员分配部门管理员角色
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: deptManagerUser.id,
        roleId: departmentManagerRole.id,
      },
    },
    update: {},
    create: {
      userId: deptManagerUser.id,
      roleId: departmentManagerRole.id,
    },
  });

  // 创建测试用户
  const testUserPassword = await bcrypt.hash('user123', 12);
  
  const testUser = await prisma.user.upsert({
    where: { username: 'testuser' },
    update: {},
    create: {
      username: 'testuser',
      email: 'test@fennec.com',
      password: testUserPassword,
      isActive: true,
    },
  });

  // 为测试用户分配普通用户角色
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: testUser.id,
        roleId: userRole.id,
      },
    },
    update: {},
    create: {
      userId: testUser.id,
      roleId: userRole.id,
    },
  });

  console.log('✅ 所有测试用户创建完成');

  // 创建部门数据
  const departments = [
    {
      name: '总经理办公室',
      code: 'CEO',
      description: '公司最高管理层',
      sort: 1,
    },
    {
      name: '技术部',
      code: 'TECH',
      description: '负责技术研发和产品开发',
      sort: 2,
    },
    {
      name: '市场部',
      code: 'MARKET',
      description: '负责市场推广和销售',
      sort: 3,
    },
    {
      name: '人事部',
      code: 'HR',
      description: '负责人力资源管理',
      sort: 4,
    },
    {
      name: '财务部',
      code: 'FINANCE',
      description: '负责财务管理和会计核算',
      sort: 5,
    },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { code: dept.code },
      update: {},
      create: dept,
    });
  }

  // 创建技术部子部门
  const techDept = await prisma.department.findUnique({
    where: { code: 'TECH' },
  });

  if (techDept) {
    const techSubDepts = [
      {
        name: '前端开发组',
        code: 'TECH_FE',
        description: '负责前端界面开发',
        parentId: techDept.id,
        sort: 1,
      },
      {
        name: '后端开发组',
        code: 'TECH_BE',
        description: '负责后端服务开发',
        parentId: techDept.id,
        sort: 2,
      },
      {
        name: '测试组',
        code: 'TECH_QA',
        description: '负责产品质量保证',
        parentId: techDept.id,
        sort: 3,
      },
    ];

    for (const subDept of techSubDepts) {
      await prisma.department.upsert({
        where: { code: subDept.code },
        update: {},
        create: subDept,
      });
    }
  }

  console.log('✅ 部门数据创建完成');

  console.log('🎉 数据播种完成！');
  console.log('');
  console.log('默认账户信息：');
  console.log('系统管理员: admin / admin123 (拥有所有权限)');
  console.log('HR管理员: hrmanager / hr123 (用户、部门、角色管理权限)');
  console.log('部门管理员: deptmanager / dept123 (部门查看和更新权限)');
  console.log('普通用户: testuser / user123 (基础查看权限)');
}

main()
  .catch((e) => {
    console.error('❌ 数据播种失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });