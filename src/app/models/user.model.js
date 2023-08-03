export default (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    registrationDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    deleteDate: {
      type: Sequelize.DATE,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return User;
};
