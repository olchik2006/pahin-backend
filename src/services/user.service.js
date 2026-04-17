const userModel = require('../models/user.model');
const treeModel = require('../models/tree.model');
const certificateModel = require('../models/certificate.model');
const bcrypt = require('bcryptjs');

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
  const user = await userModel.findUserById(userId);
  if (!user) throw new Error('User not found');

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
  };
};

const updateMe = async (userId, { name, password, currentPassword }) => {
  const user = await userModel.findUserById(userId);
  if (!user) throw new Error('User not found');

  let newPassword = user.password;

  if (password !== undefined) {
    if (!currentPassword) {
      throw new Error('Current password is required');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error('Wrong current password');
    }

    newPassword = await bcrypt.hash(password, 10);
  }

  const updated = await userModel.updateUser(userId, {
    name: name !== undefined ? name : user.name,
    password: newPassword,
  });

  return {
    id: updated.id,
    name: updated.name,
    email: updated.email,
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
