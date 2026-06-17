import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';

// We need to mock next-auth completely before importing our route
vi.mock('next-auth', () => ({
  default: vi.fn(),
}));

vi.mock('next-auth/providers/credentials', () => ({
  default: vi.fn((config) => ({
    id: 'credentials',
    ...config,
  })),
}));

const mockDbSelect = vi.fn();
const mockDbFrom = vi.fn();
const mockDbWhere = vi.fn();
const mockDbLimit = vi.fn();
const mockSqlEnd = vi.fn();

vi.mock('drizzle-orm/postgres-js', () => ({
  drizzle: vi.fn(() => ({
    select: mockDbSelect.mockReturnThis(),
    from: mockDbFrom.mockReturnThis(),
    where: mockDbWhere.mockReturnThis(),
    limit: mockDbLimit,
  })),
}));

vi.mock('postgres', () => ({
  default: vi.fn(() => ({
    end: mockSqlEnd,
  })),
}));

vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
  },
}));

vi.mock('@/db/schema', () => ({
  users: {
    email: 'email',
  },
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn(),
}));

import { authOptions } from './route';

describe('Auth Route - authorize function', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let authorize: any;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.DATABASE_URL = 'postgres://fake:fake@localhost:5432/fake';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const credentialsProvider = authOptions.providers.find((p: any) => p.id === 'credentials');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorize = (credentialsProvider as any)?.authorize;
  });

  describe('Validation errors', () => {
    it('should throw an error if email is missing', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(authorize({ password: 'password123' }, {} as any)).rejects.toThrow('Email and password required');
    });

    it('should throw an error if password is missing', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(authorize({ email: 'test@example.com' }, {} as any)).rejects.toThrow('Email and password required');
    });

    it('should throw an error if credentials is null', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(authorize(null, {} as any)).rejects.toThrow('Email and password required');
    });
  });

  describe('Database and verification errors', () => {
    it('should throw an error if user is not found', async () => {
      mockDbLimit.mockResolvedValue([]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(authorize({ email: 'nonexistent@example.com', password: 'password123' }, {} as any))
        .rejects.toThrow('No user found with that email');

      expect(mockDbSelect).toHaveBeenCalled();
      expect(mockSqlEnd).toHaveBeenCalled();
    });

    it('should throw an error if password is invalid', async () => {
      mockDbLimit.mockResolvedValue([{
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        password: 'hashed_password'
      }]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (bcrypt.compare as any).mockResolvedValue(false);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(authorize({ email: 'test@example.com', password: 'wrongpassword' }, {} as any))
        .rejects.toThrow('Invalid password');

      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashed_password');
      expect(mockSqlEnd).toHaveBeenCalled();
    });

    it('should properly end sql connection even if query fails', async () => {
      mockDbLimit.mockRejectedValue(new Error('Database error'));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(authorize({ email: 'test@example.com', password: 'password123' }, {} as any))
        .rejects.toThrow('Database error');

      expect(mockSqlEnd).toHaveBeenCalled();
    });
  });

  describe('Successful authorization', () => {
    it('should return user object if credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        password: 'hashed_password'
      };

      mockDbLimit.mockResolvedValue([mockUser]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (bcrypt.compare as any).mockResolvedValue(true);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await authorize({ email: 'test@example.com', password: 'correctpassword' }, {} as any);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashed_password');
      expect(mockSqlEnd).toHaveBeenCalled();
    });
  });
});

describe('Auth Route - callbacks', () => {
  describe('jwt callback', () => {
    it('should add role and id to token if user is present', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const jwtCallback = authOptions.callbacks?.jwt as any;
      const user = { id: '1', role: 'admin' };
      const token = { name: 'test' };

      const result = await jwtCallback({ token, user });

      expect(result).toEqual({ name: 'test', id: '1', role: 'admin' });
    });

    it('should return token unchanged if user is not present', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const jwtCallback = authOptions.callbacks?.jwt as any;
      const token = { name: 'test', id: '2', role: 'user' };

      const result = await jwtCallback({ token });

      expect(result).toEqual({ name: 'test', id: '2', role: 'user' });
    });
  });

  describe('session callback', () => {
    it('should add role and id to session user from token', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sessionCallback = authOptions.callbacks?.session as any;
      const session = { user: { name: 'test' } };
      const token = { id: '1', role: 'admin' };

      const result = await sessionCallback({ session, token });

      expect(result.user).toEqual({ name: 'test', id: '1', role: 'admin' });
    });

    it('should return session unchanged if session user is not present', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sessionCallback = authOptions.callbacks?.session as any;
      const session = {};
      const token = { id: '1', role: 'admin' };

      const result = await sessionCallback({ session, token });

      expect(result).toEqual({});
    });
  });
});
