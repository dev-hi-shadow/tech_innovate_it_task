const { JoiValidator } = require("../../middlewares");
const { register, login } = require("./controller");
const { preventDuplicate } = require("./helper");
const { registerJoiValidation, loginJoiValidation } = require("./validation");

const router = require("express").Router();
router
  .route("/register")
  .post(JoiValidator(registerJoiValidation), preventDuplicate, register);
router.route("/login").post(JoiValidator(loginJoiValidation), login);
module.exports = router;
