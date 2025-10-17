/**
 * 基础控制器类
 * 提供通用的错误处理和响应格式化方法
 */

import { Request, Response } from 'express';
import { createSuccessResponse, createErrorResponse } from '@fennec/shared';

export abstract class BaseController {
  /**
   * 统一的成功响应处理
   */
  protected success<T>(res: Response, data: T, message?: string): void {
    res.json(createSuccessResponse(data, message));
  }

  /**
   * 统一的错误响应处理
   */
  protected error(res: Response, error: unknown, defaultMessage: string): void {
    console.error(defaultMessage, error);
    
    let statusCode = 500;
    let message = defaultMessage;
    
    if (error instanceof Error) {
      message = error.message || defaultMessage;
      // 可以根据错误类型设置不同的状态码
      if (error.name === 'ValidationError') {
        statusCode = 400;
      } else if (error.name === 'NotFoundError') {
        statusCode = 404;
      }
    }
    
    res.status(statusCode).json(createErrorResponse(message));
  }

  /**
   * 统一的异步控制器方法包装器
   */
  protected asyncHandler(
    fn: (req: Request, res: Response) => Promise<void>
  ) {
    return async (req: Request, res: Response): Promise<void> => {
      try {
        await fn(req, res);
      } catch (error) {
        this.error(res, error, '操作失败');
      }
    };
  }

  /**
   * 解析分页参数
   */
  protected parsePaginationParams(req: Request): {
    page: number;
    limit: number;
  } {
    const { page, limit } = req.query;
    return {
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
    };
  }

  /**
   * 解析布尔查询参数
   */
  protected parseBooleanParam(value: unknown): boolean | undefined {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  }

  /**
   * 获取用户ID
   */
  protected getUserId(req: Request): string {
    return String(req.user?.sub);
  }
}