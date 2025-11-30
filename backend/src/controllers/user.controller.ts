import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import { hashPassword } from '../utils/password';
import { AppError } from '../middleware/error.middleware';
import { User, UpdateUserInput } from '../types/user.types';
import { ApiResponse, PaginatedResponse } from '../types/response.types';

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query('SELECT * FROM sp_get_all_users($1, $2)', [
      limit,
      offset,
    ]);

    const users = result.rows;
    const total = users.length > 0 ? parseInt(users[0].total_count) : 0;
    const totalPages = Math.ceil(total / limit);

    // Remove total_count from each user object
    const cleanedUsers = users.map(
      ({ total_count: _total_count, ...user }) => user
    );

    const response: PaginatedResponse<User> = {
      success: true,
      data: cleanedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM sp_get_user_by_id($1)', [
      id,
    ]);

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    const response: ApiResponse<User> = {
      success: true,
      data: result.rows[0],
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { email, username, password }: UpdateUserInput = req.body;

    // Hash password if provided
    const passwordHash = password ? await hashPassword(password) : null;

    const result = await pool.query(
      'SELECT * FROM sp_update_user($1, $2, $3, $4)',
      [id, email || null, username || null, passwordHash]
    );

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    const response: ApiResponse<User> = {
      success: true,
      data: result.rows[0],
      message: 'User updated successfully',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT sp_delete_user($1)', [id]);
    const deleted = result.rows[0].sp_delete_user;

    if (!deleted) {
      throw new AppError('User not found', 404);
    }

    const response: ApiResponse = {
      success: true,
      message: 'User deleted successfully',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const result = await pool.query('SELECT * FROM sp_get_user_by_id($1)', [
      req.user.userId,
    ]);

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    const response: ApiResponse<User> = {
      success: true,
      data: result.rows[0],
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};
