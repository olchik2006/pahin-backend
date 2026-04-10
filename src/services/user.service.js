const userModel = require('../models/user.model');

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

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  deleteUser,
  updateUser,
};
