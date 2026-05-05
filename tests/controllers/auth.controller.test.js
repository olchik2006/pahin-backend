/* eslint-env jest, node */

jest.mock('../../src/services/auth.service', () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

const authService = require('../../src/services/auth.service');
const authController = require('../../src/controllers/auth.controller');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('auth.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    test('should register user and return 201', async () => {
      const req = {
        body: {
          name: 'Olia',
          email: 'olia@test.com',
          password: '123456',
        },
      };
      const res = mockResponse();

      const data = {
        token: 'jwt-token',
        user: {
          id: 1,
          name: 'Olia',
          email: 'olia@test.com',
        },
      };

      authService.register.mockResolvedValue(data);

      await authController.register(req, res);

      expect(authService.register).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(data);
    });

    test('should return 409 when user already exists', async () => {
      const req = {
        body: {
          name: 'Olia',
          email: 'olia@test.com',
          password: '123456',
        },
      };
      const res = mockResponse();

      authService.register.mockRejectedValue(new Error('User already exists'));

      await authController.register(req, res);

      expect(authService.register).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User already exists',
      });
    });

    test('should return 400 for other register errors', async () => {
      const req = {
        body: {
          name: '',
          email: '',
          password: '',
        },
      };
      const res = mockResponse();

      authService.register.mockRejectedValue(new Error('Name, email and password are required'));

      await authController.register(req, res);

      expect(authService.register).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Name, email and password are required',
      });
    });
  });

  describe('login', () => {
    test('should login user and return 200', async () => {
      const req = {
        body: {
          email: 'olia@test.com',
          password: '123456',
        },
      };
      const res = mockResponse();

      const data = {
        token: 'jwt-token',
        user: {
          id: 1,
          name: 'Olia',
          email: 'olia@test.com',
        },
      };

      authService.login.mockResolvedValue(data);

      await authController.login(req, res);

      expect(authService.login).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(data);
    });

    test('should return 401 when login fails', async () => {
      const req = {
        body: {
          email: 'olia@test.com',
          password: 'wrong-password',
        },
      };
      const res = mockResponse();

      authService.login.mockRejectedValue(new Error('Invalid credentials'));

      await authController.login(req, res);

      expect(authService.login).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
    });
  });

  describe('logout', () => {
    test('should return 200 and success message', () => {
      const req = {};
      const res = mockResponse();

      authController.logout(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logged out successfully',
      });
    });
  });
});
