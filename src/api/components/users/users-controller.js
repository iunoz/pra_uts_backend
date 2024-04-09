const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { verifyPassword } = require('../../../utils/password');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const confirmPassword = request.body.confirmPassword;

    //melakuka pengecekan antara password dan confirmPassword
    if (password !== confirmPassword) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password and Confirm Password do not match'
      );
    }

    const emailTaken = await usersService.emailChecker(email);
    if (emailTaken) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email already taken'
      );
    }

    const success = await usersService.createUser(name, email, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    const success = await usersService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle Change Password Request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @return {object} Response object or pass an error to the next route
 */
async function changePassword(request, response, next) {
  try {
    const userId = request.params.id;
    const { oldPassword, newPassword, confirmPassword } = request.body;

    // check apakah newPassword sama confirmPassword
    if (newPassword !== confirmPassword) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'New Password and Confirm Password Do Not Match!'
      );
    }

    // check apakah oldPassword sama dengan password sekarang
    const user = await usersService.getUser(userID);
    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'User Not Found!');
    }

    const isPasswordTrue = await verifyPassword(oldPassword, user.password);
    if (isPasswordTrue) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Old Password is Incorrect!'
      );
    }

    // Update Password
    const success = await usersService.changePassword(userId, newPassword);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to Change Password!'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};
