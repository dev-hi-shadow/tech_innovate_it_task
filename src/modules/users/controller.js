const { Op } = require("sequelize");
const { Users, Roles } = require("../../models");
const bcrypt = require("bcrypt");
const { generateJWT, getTableFilters } = require("../../helpers/index");

const register = async (req, res, next) => {
  try {
    const { role, password } = req.body;
    const roleId = await Roles.findOne({
      where: { name: role },
      attributes: ["name", "id"],
    });

    if (!roleId) {
      return res.status(404).json({
        success: false,
        message: "Please enter a role either admin or user",
      });
    }

    const hashPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT || 10)
    );
    console.log("🚀  hashPassword:", hashPassword);
    const user = await Users.create({
      ...req.body,
      password: hashPassword,
      role_id: roleId.toJSON().id,
    });
    const token = await generateJWT({ id: user.id });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { credential, password } = req.body;
    const user = await Users.findOne({
      where: { [Op.or]: [{ username: credential }, { email: credential }] },
    });
    const isPasswordValid = await user.isValidPassword(password);

    if (!isPasswordValid || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }
    const token = await generateJWT({ id: user.id });
    res.json({
      success: true,
      message: "User logged in successfully",
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

const profile = async (req, res, next) => {
  try {
    const user = await Users.findByPk(req.user_id);
    res.json({
      success: true,
      message: "User profile",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const { search } = req.query;
    let users = [];
    if (req.isAdmin) {
      users = await Users.findAll({
        where: {
          username: { [Op.like]: `%${search}%` },
        },
        ...getTableFilters(req),
      });
    }

    res.json({
      success: true,
      message: "Users list",
      data: {
        ...(req.isAdmin
          ? users
          : { message: `Hello ${req.user.display_name}` }),
      },
    });
  } catch (error) {
    console.log("🚀  error:", error);
    next(error);
  }
};

module.exports = {
  register,
  login,
  profile,
  list,
};
