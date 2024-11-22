const Roles = require("../modules/roles/model");
const Users = require("../modules/users/model");

const db = {
  Roles,
  Users,
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
