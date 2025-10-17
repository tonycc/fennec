/**
 * 部门职位数据迁移脚本
 * 将 DepartmentPosition 枚举转换为字符串类型
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function runMigration() {
  console.log('开始执行部门职位数据迁移...');
  
  try {
    // 读取 SQL 迁移文件
    const migrationPath = path.join(__dirname, '../prisma/migrations/20241216_update_department_position_to_string.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // 分割 SQL 语句（以分号分隔）
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`准备执行 ${statements.length} 条 SQL 语句...`);
    
    // 在事务中执行迁移
    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        console.log(`执行语句 ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
        
        try {
          await tx.$executeRawUnsafe(statement);
          console.log(`✓ 语句 ${i + 1} 执行成功`);
        } catch (error) {
          console.error(`✗ 语句 ${i + 1} 执行失败:`, error);
          throw error;
        }
      }
    });
    
    console.log('✓ 数据迁移完成！');
    
    // 验证迁移结果
    console.log('\n验证迁移结果...');
    await validateMigration();
    
  } catch (error) {
    console.error('✗ 数据迁移失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function validateMigration() {
  try {
    // 检查表结构
    const tableInfo = await prisma.$queryRaw`
      PRAGMA table_info(UserDepartment);
    ` as any[];
    
    console.log('UserDepartment 表结构:');
    tableInfo.forEach(column => {
      console.log(`  ${column.name}: ${column.type} ${column.notnull ? 'NOT NULL' : ''} ${column.dflt_value ? `DEFAULT ${column.dflt_value}` : ''}`);
    });
    
    // 检查数据统计
    const stats = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as total_records,
        COUNT(CASE WHEN position NOT IN ('manager', 'deputy_manager', 'supervisor', 'team_leader', 'senior_employee', 'employee', 'intern', 'consultant') THEN 1 END) as invalid_positions
      FROM UserDepartment;
    ` as any[];
    
    console.log('\n数据统计:');
    console.log(`  总记录数: ${stats[0].total_records}`);
    console.log(`  无效职位数: ${stats[0].invalid_positions}`);
    
    if (stats[0].invalid_positions > 0) {
      console.warn('⚠️  发现无效的职位数据，请检查！');
    }
    
    // 显示职位分布
    const distribution = await prisma.$queryRaw`
      SELECT 
        position,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM UserDepartment), 2) as percentage
      FROM UserDepartment
      GROUP BY position
      ORDER BY count DESC;
    ` as any[];
    
    if (distribution.length > 0) {
      console.log('\n职位分布:');
      distribution.forEach(item => {
        console.log(`  ${item.position}: ${item.count} (${item.percentage}%)`);
      });
    } else {
      console.log('\n当前没有用户部门数据');
    }
    
    console.log('\n✓ 迁移验证完成！');
    
  } catch (error) {
    console.error('✗ 迁移验证失败:', error);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  runMigration();
}

export { runMigration, validateMigration };