-- Migration: Update department position from enum to string
-- Date: 2024-12-16
-- Description: Convert DepartmentPosition enum to string type for SQLite compatibility

-- 由于 SQLite 不支持枚举类型，我们需要将 UserDepartment 表中的 position 字段
-- 从枚举类型转换为字符串类型，并更新现有数据

-- 1. 创建临时表，使用字符串类型的 position 字段
CREATE TABLE UserDepartment_new (
    id TEXT NOT NULL PRIMARY KEY,
    userId TEXT NOT NULL,
    departmentId TEXT NOT NULL,
    position TEXT NOT NULL DEFAULT 'employee',
    isMain BOOLEAN NOT NULL DEFAULT false,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT UserDepartment_userId_fkey FOREIGN KEY (userId) REFERENCES User (id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT UserDepartment_departmentId_fkey FOREIGN KEY (departmentId) REFERENCES Department (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 2. 复制现有数据到新表，将枚举值转换为对应的字符串值
-- 注意：如果原表中有数据，需要根据实际的枚举值进行映射
INSERT INTO UserDepartment_new (id, userId, departmentId, position, isMain, createdAt, updatedAt)
SELECT 
    id,
    userId,
    departmentId,
    CASE 
        WHEN position = 'MANAGER' THEN 'manager'
        WHEN position = 'DEPUTY_MANAGER' THEN 'deputy_manager'
        WHEN position = 'SUPERVISOR' THEN 'supervisor'
        WHEN position = 'TEAM_LEADER' THEN 'team_leader'
        WHEN position = 'SENIOR_EMPLOYEE' THEN 'senior_employee'
        WHEN position = 'EMPLOYEE' THEN 'employee'
        WHEN position = 'INTERN' THEN 'intern'
        WHEN position = 'CONSULTANT' THEN 'consultant'
        ELSE 'employee' -- 默认值
    END as position,
    isMain,
    createdAt,
    updatedAt
FROM UserDepartment
WHERE EXISTS (SELECT 1 FROM UserDepartment);

-- 3. 删除原表
DROP TABLE IF EXISTS UserDepartment;

-- 4. 重命名新表
ALTER TABLE UserDepartment_new RENAME TO UserDepartment;

-- 5. 重新创建索引
CREATE UNIQUE INDEX UserDepartment_userId_departmentId_key ON UserDepartment(userId, departmentId);
CREATE INDEX UserDepartment_userId_idx ON UserDepartment(userId);
CREATE INDEX UserDepartment_departmentId_idx ON UserDepartment(departmentId);
CREATE INDEX UserDepartment_position_idx ON UserDepartment(position);
CREATE INDEX UserDepartment_isMain_idx ON UserDepartment(isMain);

-- 6. 添加约束检查（SQLite 3.37+ 支持）
-- 确保 position 字段只能是预定义的值
-- 注意：这是可选的，因为我们在应用层也会进行验证
-- CREATE TABLE UserDepartment_check AS 
-- SELECT * FROM UserDepartment 
-- WHERE position IN ('manager', 'deputy_manager', 'supervisor', 'team_leader', 'senior_employee', 'employee', 'intern', 'consultant');

-- 迁移完成后的数据验证
-- 检查是否有无效的 position 值
SELECT 
    COUNT(*) as total_records,
    COUNT(CASE WHEN position NOT IN ('manager', 'deputy_manager', 'supervisor', 'team_leader', 'senior_employee', 'employee', 'intern', 'consultant') THEN 1 END) as invalid_positions
FROM UserDepartment;

-- 显示各职位的分布情况
SELECT 
    position,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM UserDepartment), 2) as percentage
FROM UserDepartment
GROUP BY position
ORDER BY count DESC;