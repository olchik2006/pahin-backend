/* eslint-env jest, node */

jest.mock('../../src/services/user.service', () => ({
  createUser: jest.fn(),
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  deleteUser: jest.fn(),
  getMe: jest.fn(),
  updateMe: jest.fn(),
  getMyTrees: jest.fn(),
  getMyCertificates: jest.fn(),
}));

const userService = require('../../src/services/user.service');
const AppError = require('../../src/utils/AppError');
const usersController = require('../../src/controllers/users.controller');

const VALID_UUID = 'f19c0bd7-486c-42a0-ba75-0e44242fad1a';

const flushPromises = () => new Promise(process.nextTick);

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('users.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    test('should create user and return 201', async () => {
      const req = {
        body: {
          name: 'Olia',
          email: 'olia@test.com',
          password: '123456',
        },
      };
      const res = mockResponse();
      const next = jest.fn();

      const user = { id: 1, name: 'Olia', email: 'olia@test.com' };
      userService.createUser.mockResolvedValue(user);

      await usersController.createUser(req, res, next);

      expect(userService.createUser).toHaveBeenCalledWith({
        name: 'Olia',
        email: 'olia@test.com',
        password: '123456',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { user },
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('getAllUsers', () => {
    test('should return all users', async () => {
      const req = {};
      const res = mockResponse();
      const next = jest.fn();

      const users = [{ id: 1 }, { id: 2 }];
      userService.getAllUsers.mockResolvedValue(users);

      await usersController.getAllUsers(req, res, next);

      expect(userService.getAllUsers).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { users },
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    test('should call next with AppError 400 for invalid uuid', async () => {
      const req = { params: { id: '123' } };
      const res = mockResponse();
      const next = jest.fn();

      await usersController.getUserById(req, res, next);
      await flushPromises();

      expect(userService.getUserById).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toBe('Invalid user ID format');
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    test('should call next with AppError 404 when user not found', async () => {
      const req = {
        params: { id: VALID_UUID },
      };
      const res = mockResponse();
      const next = jest.fn();

      userService.getUserById.mockResolvedValue(null);

      await usersController.getUserById(req, res, next);
      await flushPromises();

      expect(userService.getUserById).toHaveBeenCalledWith(VALID_UUID);
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toBe('User not found');
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });

    test('should return user when uuid is valid and user exists', async () => {
      const req = {
        params: { id: VALID_UUID },
      };
      const res = mockResponse();
      const next = jest.fn();

      const user = { id: VALID_UUID, name: 'Olia' };
      userService.getUserById.mockResolvedValue(user);

      await usersController.getUserById(req, res, next);

      expect(userService.getUserById).toHaveBeenCalledWith(VALID_UUID);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { user },
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    test('should call next with AppError 400 for invalid uuid', async () => {
      const req = { params: { id: 'bad-id' } };
      const res = mockResponse();
      const next = jest.fn();

      await usersController.deleteUser(req, res, next);
      await flushPromises();

      expect(userService.deleteUser).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toBe('Invalid user ID format');
      expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    test('should call next with AppError 404 when deleted user not found', async () => {
      const req = {
        params: { id: VALID_UUID },
      };
      const res = mockResponse();
      const next = jest.fn();

      userService.deleteUser.mockResolvedValue(null);

      await usersController.deleteUser(req, res, next);
      await flushPromises();

      expect(userService.deleteUser).toHaveBeenCalledWith(VALID_UUID);
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].message).toBe('User not found');
      expect(next.mock.calls[0][0].statusCode).toBe(404);
    });

    test('should return 204 when user is deleted', async () => {
      const req = {
        params: { id: VALID_UUID },
      };
      const res = mockResponse();
      const next = jest.fn();

      userService.deleteUser.mockResolvedValue({ id: VALID_UUID });

      await usersController.deleteUser(req, res, next);

      expect(userService.deleteUser).toHaveBeenCalledWith(VALID_UUID);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('getMe', () => {
    test('should return current user', async () => {
      const req = { user: { id: 7 } };
      const res = mockResponse();
      const next = jest.fn();

      const user = { id: 7, name: 'Olia' };
      userService.getMe.mockResolvedValue(user);

      await usersController.getMe(req, res, next);

      expect(userService.getMe).toHaveBeenCalledWith(7);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { user },
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('updateMe', () => {
    test('should update current user', async () => {
      const req = {
        user: { id: 7 },
        body: {
          name: 'New Olia',
          email: 'new@test.com',
          password: 'new-password',
          currentPassword: 'old-password',
        },
      };
      const res = mockResponse();
      const next = jest.fn();

      const user = { id: 7, name: 'New Olia', email: 'new@test.com' };
      userService.updateMe.mockResolvedValue(user);

      await usersController.updateMe(req, res, next);

      expect(userService.updateMe).toHaveBeenCalledWith(7, {
        name: 'New Olia',
        email: 'new@test.com',
        password: 'new-password',
        currentPassword: 'old-password',
      });
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { user },
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('getMyTrees', () => {
    test('should return trees for current user', async () => {
      const req = { user: { id: 7 } };
      const res = mockResponse();
      const next = jest.fn();

      const trees = [{ id: 1 }, { id: 2 }];
      userService.getMyTrees.mockResolvedValue(trees);

      await usersController.getMyTrees(req, res, next);

      expect(userService.getMyTrees).toHaveBeenCalledWith(7);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { trees },
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('getMyCertificates', () => {
    test('should return certificates for current user', async () => {
      const req = { user: { id: 7 } };
      const res = mockResponse();
      const next = jest.fn();

      const certificates = [{ id: 1 }, { id: 2 }];
      userService.getMyCertificates.mockResolvedValue(certificates);

      await usersController.getMyCertificates(req, res, next);

      expect(userService.getMyCertificates).toHaveBeenCalledWith(7);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { certificates },
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
