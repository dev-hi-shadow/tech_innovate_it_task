const { authentication } = require("../middlewares");

const router = require("express").Router();

// Public Routes
router.use(require("../modules/users/public_routes"));

// JWT Authentication
router.use(authentication);

// Private Routes
router.use("/", require("../modules/users"));
module.exports = router;
