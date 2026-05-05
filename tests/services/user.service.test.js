/* eslint-env jest, node */

jest.mock('../../src/models/user.model', () => ({
  createUser: jest.fn(),
  getAllUsers: jest.fn(),
  findUserById: jest.fn(),
  findUserByIdSafe: jest.fn(),
  findUserByEmail: jest.fn(),
  deleteUser: jest.fn(),
  updateUser: jest.fn(),
  updateUserById: jest.fn(),
}));

jest.mock('../../src/models/tree.model', () => ({
  getTreesByUserId: jest.fn(),
}));

jest.mock('../../src/models/certificate.model', () => ({
  getCertificatesByUserId: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const userModel = require('../../src/models/user.model');
const treeModel = require('../../src/models/tree.model');
const certificateModel = require('../../src/models/certificate.model');
const bcrypt = require('bcryptjs');
const AppError = require('../../src/utils/AppError');
const userService = require('../../src/services/user.service');

describe('user.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    test('should call userModel.createUser and return result', async () => {
      const input = { name: 'Olia', email: 'olia@test.com' };
      const created = { id: 1, ...input };

      userModel.createUser.mockResolvedValue(created);

      const result = await userService.createUser(input);

      expect(userModel.createUser).toHaveBeenCalledWith(input);
      expect(result).toEqual(created);
    });
  });

  describe('getAllUsers', () => {
    test('should return all users', async () => {
      const users = [{ id: 1 }, { id: 2 }];

      userModel.getAllUsers.mockResolvedValue(users);

      const result = await userService.getAllUsers();

      expect(userModel.getAllUsers).toHaveBeenCalledTimes(1);
      expect(result).toEqual(users);
    });
  });

  describe('getUserById', () => {
    test('should return user by id', async () => {
      const user = { id: 5, name: 'Test' };

      userModel.findUserById.mockResolvedValue(user);

      const result = await userService.getUserById(5);

      expect(userModel.findUserById).toHaveBeenCalledWith(5);
      expect(result).toEqual(user);
    });
  });

  describe('getUserByEmail', () => {
    test('should return user by email', async () => {
      const user = { id: 7, email: 'mail@test.com' };

      userModel.findUserByEmail.mockResolvedValue(user);

      const result = await userService.getUserByEmail('mail@test.com');

      expect(userModel.findUserByEmail).toHaveBeenCalledWith('mail@test.com');
      expect(result).toEqual(user);
    });
  });

  describe('deleteUser', () => {
    test('should delete user by id', async () => {
      const deleted = { id: 3 };

      userModel.deleteUser.mockResolvedValue(deleted);

      const result = await userService.deleteUser(3);

      expect(userModel.deleteUser).toHaveBeenCalledWith(3);
      expect(result).toEqual(deleted);
    });
  });

  describe('updateUser', () => {
    test('should update user by id', async () => {
      const data = { name: 'New Name' };
      const updated = { id: 4, ...data };

      userModel.updateUser.mockResolvedValue(updated);

      const result = await userService.updateUser(4, data);

      expect(userModel.updateUser).toHaveBeenCalledWith(4, data);
      expect(result).toEqual(updated);
    });
  });

  describe('getMe', () => {
    test('should return safe user when found', async () => {
      const user = { id: 10, name: 'Safe User' };

      userModel.findUserByIdSafe.mockResolvedValue(user);

      const result = await userService.getMe(10);

      expect(userModel.findUserByIdSafe).toHaveBeenCalledWith(10);
      expect(result).toEqual(user);
    });

    test('should throw AppError 404 when user not found', async () => {
      userModel.findUserByIdSafe.mockResolvedValue(null);

      await expect(userService.getMe(10)).rejects.toThrow(AppError);
      await expect(userService.getMe(10)).rejects.toThrow('Користувача не знайдено');
    });
  });

  describe('updateMe', () => {
    test('should throw AppError 404 when user not found', async () => {
      userModel.findUserById.mockResolvedValue(null);

      await expect(userService.updateMe(1, { name: 'New Name' })).rejects.toThrow(
        'Користувача не знайдено'
      );

      expect(userModel.findUserById).toHaveBeenCalledWith(1);
    });

    test('should throw AppError 400 when password provided without currentPassword', async () => {
      userModel.findUserById.mockResolvedValue({
        id: 1,
        name: 'Olia',
        email: 'olia@test.com',
        password: 'hashed-old',
      });

      await expect(userService.updateMe(1, { password: 'new-password' })).rejects.toThrow(
        'Потрібно вказати поточний пароль'
      );
    });

    test('should throw AppError 401 when current password is invalid', async () => {
      userModel.findUserById.mockResolvedValue({
        id: 1,
        name: 'Olia',
        email: 'olia@test.com',
        password: 'hashed-old',
      });

      bcrypt.compare.mockResolvedValue(false);

      await expect(
        userService.updateMe(1, {
          password: 'new-password',
          currentPassword: 'wrong-password',
        })
      ).rejects.toThrow('Невірний поточний пароль');

      expect(bcrypt.compare).toHaveBeenCalledWith('wrong-password', 'hashed-old');
    });

    test('should update name only when password and email are not provided', async () => {
      userModel.findUserById.mockResolvedValue({
        id: 1,
        name: 'Old Name',
        email: 'old@test.com',
        password: 'hashed-old',
      });

      userModel.updateUser.mockResolvedValue({
        id: 1,
        name: 'New Name',
        created_at: '2026-05-01T10:00:00.000Z',
      });

      const result = await userService.updateMe(1, { name: 'New Name' });

      expect(userModel.updateUserById).not.toHaveBeenCalled();
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();

      expect(userModel.updateUser).toHaveBeenCalledWith(1, {
        name: 'New Name',
        password: 'hashed-old',
      });

      expect(result).toEqual({
        id: 1,
        name: 'New Name',
        email: 'old@test.com',
        createdAt: '2026-05-01T10:00:00.000Z',
      });
    });

    test('should update email and password when valid data provided', async () => {
      userModel.findUserById.mockResolvedValue({
        id: 1,
        name: 'Olia',
        email: 'old@test.com',
        password: 'hashed-old',
      });

      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue('hashed-new');

      userModel.updateUserById.mockResolvedValue({
        id: 1,
        email: 'new@test.com',
      });

      userModel.updateUser.mockResolvedValue({
        id: 1,
        name: 'Updated Olia',
        created_at: '2026-05-02T12:00:00.000Z',
      });

      const result = await userService.updateMe(1, {
        name: 'Updated Olia',
        email: 'new@test.com',
        password: 'new-password',
        currentPassword: 'old-password',
      });

      expect(bcrypt.compare).toHaveBeenCalledWith('old-password', 'hashed-old');
      expect(bcrypt.hash).toHaveBeenCalledWith('new-password', 10);

      expect(userModel.updateUserById).toHaveBeenCalledWith(1, {
        email: 'new@test.com',
      });

      expect(userModel.updateUser).toHaveBeenCalledWith(1, {
        name: 'Updated Olia',
        password: 'hashed-new',
      });

      expect(result).toEqual({
        id: 1,
        name: 'Updated Olia',
        email: 'new@test.com',
        createdAt: '2026-05-02T12:00:00.000Z',
      });
    });
  });

  describe('getMyTrees', () => {
    test('should return trees for user', async () => {
      const trees = [{ id: 1 }, { id: 2 }];

      treeModel.getTreesByUserId.mockResolvedValue(trees);

      const result = await userService.getMyTrees(8);

      expect(treeModel.getTreesByUserId).toHaveBeenCalledWith(8);
      expect(result).toEqual(trees);
    });
  });

  describe('getMyCertificates', () => {
    test('should return certificates for user', async () => {
      const certificates = [{ id: 11 }, { id: 12 }];

      certificateModel.getCertificatesByUserId.mockResolvedValue(certificates);

      const result = await userService.getMyCertificates(8);

      expect(certificateModel.getCertificatesByUserId).toHaveBeenCalledWith(8);
      expect(result).toEqual(certificates);
    });
  });
});
