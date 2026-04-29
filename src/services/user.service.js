const userModel = require('../models/user.model');
const treeModel = require('../models/tree.model');
const certificateModel = require('../models/certificate.model');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');

const createUser = async (data) => {
  return await userModel.createUser(data);
};

const getAllUsers = async () => {
  return await userModel.getAllUsers();
};

const getUserById = async (id) => {
  return await userModel.findUserById(id);
};

const getUserByEmail = async (email) => {
  return await userModel.findUserByEmail(email);
};

const deleteUser = async (id) => {
  return await userModel.deleteUser(id);
};

const updateUser = async (id, data) => {
  return await userModel.updateUser(id, data);
};

const getMe = async (userId) => {
  const user = await userModel.findUserByIdSafe(userId);
  if (!user) throw new AppError('Користувача не знайдено', 404);
  return user;
};

const updateMe = async (userId, { name, email, password, currentPassword }) => {
  const user = await userModel.findUserById(userId);
  if (!user) throw new AppError('Користувача не знайдено', 404);

  let newPassword = user.password;

  if (password !== undefined) {
    if (!currentPassword) {
      throw new AppError('Потрібно вказати поточний пароль', 400);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new AppError('Невірний поточний пароль', 401);
    }

    newPassword = await bcrypt.hash(password, 10);
  }

  if (email !== undefined) {
    await userModel.updateUserById(userId, { email });
  }

  const updated = await userModel.updateUser(userId, {
    name: name !== undefined ? name : user.name,
    password: newPassword,
  });

  return {
    id: updated.id,
    name: updated.name,
    email: email !== undefined ? email : user.email,
    createdAt: updated.created_at,
  };
};

const getMyTrees = async (userId) => {
  return await treeModel.getTreesByUserId(userId);
};

const getMyCertificates = async (userId) => {
  return await certificateModel.getCertificatesByUserId(userId);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  deleteUser,
  updateUser,
  getMe,
  updateMe,
  getMyTrees,
  getMyCertificates,
};
