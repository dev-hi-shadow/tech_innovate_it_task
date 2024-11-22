const { Sequelize } = require("sequelize");
const config = require("./config")[process.env.APP_MODE];


const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: 3306,
    logging: false,
    dialect: config.dialect,
    define: {
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
    },
  }
);

module.exports = {
  sequelize,
};
