const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Cek email apakah sudah dipakai atau belum
 * @param {string} email
 * @returns {boolean}
 */
async function emailChecker(email) {
  return await usersRepository.emailChecker(email);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirm Password
 * @returns {boolean}
 */
async function createUser(name, email, password, confirmPassword) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Compare password dengan hashed password
 * @param {string} password - Password
 * @param {string} hashedPassword - Hashed Password
 * @returns {boolean}
 */
async function comparePassword(password, hashedPassword) {
  return passwordMatched(password, hashedPassword);
}

/**
 * Change user password
 * @param {string} id - Uer ID
 * @param {string} newPassword - New Password
 * @returns {boolean}
 */
async function changePassword(id, newPassword) {
  //hash new password
  const hashedPassword = await hashPassword(newPassword);
  return usersRepository.updatePassword(id, hashedPassword);
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailChecker,
  comparePassword,
  changePassword,
};
