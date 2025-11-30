import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../middleware/error.middleware';
import {
  CreateUserInput,
  LoginInput,
  User,
  AuthTokens,
} from '../types/user.types';
import { ApiResponse } from '../types/response.types';

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, username, password }: CreateUserInput = req.body;

    // Check if email already exists
    const emailExists = await pool.query('SELECT sp_email_exists($1)', [
      email,
    ]);
    if (emailExists.rows[0].sp_email_exists) {
      throw new AppError('Email already registered', 409);
    }

    // Check if username already exists
    const usernameExists = await pool.query('SELECT sp_username_exists($1)', [
      username,
    ]);
    if (usernameExists.rows[0].sp_username_exists) {
      throw new AppError('Username already taken', 409);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user using stored procedure
    const result = await pool.query(
      'SELECT * FROM sp_create_user($1, $2, $3)',
      [email, username, passwordHash]
    );

    const user: User = result.rows[0];

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        user,
        tokens,
      },
      message: 'User registered successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password }: LoginInput = req.body;

    // Get user by email (includes password hash)
    const result = await pool.query('SELECT * FROM sp_get_user_by_email($1)', [
      email,
    ]);

    if (result.rows.length === 0) {
      throw new AppError('Invalid email or password', 401);
    }

    const userWithPassword = result.rows[0];

    // Verify password
    const isPasswordValid = await comparePassword(
      password,
      userWithPassword.password_hash
    );

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Remove password hash from response
    const { password_hash, ...user } = userWithPassword;

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        user,
        tokens,
      },
      message: 'Login successful',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      throw new AppError('Refresh token is required', 400);
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(token);

    // Get user to ensure they still exist
    const result = await pool.query('SELECT * FROM sp_get_user_by_id($1)', [
      decoded.userId,
    ]);

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    const user = result.rows[0];

    // Generate new tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    const response: ApiResponse<AuthTokens> = {
      success: true,
      data: tokens,
      message: 'Token refreshed successfully',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};
