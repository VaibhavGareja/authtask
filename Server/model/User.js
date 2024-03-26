const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../helper/db");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    Fname: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    Lname: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      unique: true,
    },
    phoneno: {
      type: DataTypes.BIGINT ,
      allowNull: true,
      defaultValue: null,
    },
    DOB: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    isVerify: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    emailToken: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: false,
    modelName: "User",
  }
);

User.beforeCreate(async (user, options) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(5);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.prototype.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Error comparing passwords: " + error.message);
  }
};
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Model synchronized successfully.");
  })
  .catch((error) => {
    console.error("Error synchronizing model:", error);
  });
module.exports = User;
