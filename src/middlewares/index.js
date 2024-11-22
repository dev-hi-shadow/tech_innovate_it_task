const { Users, Roles } = require("../models");
const rolesAttributes = require("../modules/roles/attributes");
const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      let user = await Users.findByPk(decoded.id, {
      include: [
        {
          model: Roles,
          as: "role",
          attributes: rolesAttributes.auth,
        },
      ],
    });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    user = user.toJSON();

     req.isAdmin = Boolean(user.role.name === "admin");
    req.user_id = user.id;
    req.user = user;
    next();
  } catch (error) {
     res.status(401).json({ message: "Invalid token" });
  }
};

const JoiValidator = (schema) => (req, res, next) => {
  try {
    const result = schema.validate(req.body, {
      abortEarly: false,
      errors: {
        wrap: {
          label: "",
        },
      },
    });
    if (result?.error?.details?.length) {
      console.log("🚀  result?.error?.details:", result?.error?.details);
      return res.status(422).json({
        status: false,
        message: "Invalid data.",
        errors: result?.error?.details?.map((obj) => ({
          key: obj?.context?.key,
          message: obj?.message,
        })),
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authentication,
  JoiValidator,
};
