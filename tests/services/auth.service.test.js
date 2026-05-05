/* eslint-env jest, node */

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../src/config/database', () => ({
  pool: {
    query: jest.fn(),
  },
}));

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../../src/config/database');
const authService = require('../../src/services/auth.service');

describe('auth.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({
        rows: [
          {
            id: 'user-1',
            name: 'Olya',
            email: 'olya@example.com',
            created_at: '2026-05-05T10:00:00.000Z',
          },
        ],
      });

      bcrypt.hash.mockResolvedValue('hashed-password');
      jwt.sign.mockReturnValue('mock-token');

      const result = await authService.register({
        name: 'Olya',
        email: 'olya@example.com',
        password: 'password123',
      });

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toEqual({
        token: 'mock-token',
        user: {
          id: 'user-1',
          name: 'Olya',
          email: 'olya@example.com',
        },
      });
    });

    it('should throw error if required fields are missing', async () => {
      await expect(authService.register({ name: '', email: '', password: '' })).rejects.toThrow(
        'Name, email and password are required'
      );
    });

    it('should throw error if user already exists', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 'existing-user' }],
      });

      await expect(
        authService.register({
          name: 'Olya',
          email: 'olya@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('User already exists');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'user-1',
            name: 'Olya',
            email: 'olya@example.com',
            password: 'hashed-password',
          },
        ],
      });

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock-token');

      const result = await authService.login({
        email: 'olya@example.com',
        password: 'password123',
      });

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toEqual({
        token: 'mock-token',
        user: {
          id: 'user-1',
          name: 'Olya',
          email: 'olya@example.com',
        },
      });
    });

    it('should throw error if user is not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      await expect(
        authService.login({
          email: 'olya@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if password is invalid', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'user-1',
            name: 'Olya',
            email: 'olya@example.com',
            password: 'hashed-password',
          },
        ],
      });

      bcrypt.compare.mockResolvedValue(false);

      await expect(
        authService.login({
          email: 'olya@example.com',
          password: 'wrong-password',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
