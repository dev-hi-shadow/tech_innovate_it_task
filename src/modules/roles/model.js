const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../../config/mysql");

class Roles extends Model {
  static associate(db) {
    Roles.hasMany(db.Users, {
      as: "users",
      foreignKey: "role_id",
      sourceKey: "id",
    });
  }
}

Roles.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "roles",
    modelName: "Roles",
    hooks: {
      afterDestroy: async (instance, options) => {
        if (options?.deleted_by) {
          instance.setDataValue("deleted_by", options?.deleted_by);
          await instance.save();
        }
      },
    },
  }
);

module.exports = Roles;
