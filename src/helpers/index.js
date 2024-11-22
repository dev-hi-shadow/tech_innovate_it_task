const jwt = require("jsonwebtoken");
const generateJWT = async (payload, exp = null) => {
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET_KEY,
    exp && { expiresIn: exp }
  );
  return token;
};

const getTableFilters = (req) => {
  const {
    limit = null,
    offset = 0,
    order_by = "created_at",
    sort_by = "DESC",
  } = req.query;

  return {
    ...(limit ? { limit } : {}),
    ...(offset ? { offset } : {}),
    sort_by,
    order: [[order_by, sort_by]],
  };
};

module.exports = {
  generateJWT,
  getTableFilters,
};
