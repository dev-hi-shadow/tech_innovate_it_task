const { profile, list } = require("./controller");

const router = require("express").Router();

router.route("/profile").get(profile);
router.route("/users").get(list);

module.exports = router;
