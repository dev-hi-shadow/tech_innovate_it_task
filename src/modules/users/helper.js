const { Op } = require("sequelize");
const { Users } = require("../../models");

const preventDuplicate = async (req, res, next) => {
  const { email, username } = req.body;
  const user = await Users.count({
    where: {
      [Op.or]: [{ email }, { username }],
    },
  });
  if (user) {
    return res
      .status(409)
      .json({ message: "Please use different username or email" });
  }
  next();
};

module.exports = { preventDuplicate };
