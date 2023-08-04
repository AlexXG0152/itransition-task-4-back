export default (sequelize, Sequelize) => {
  const AuthToken = sequelize.define(
    "AuthToken",
    {
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {}
  );

  AuthToken.writeToken = async function (userId, token) {
    const authToken = await this.create({
      token: token,
      userId: userId,
    });

    return authToken.token;
  };

  return AuthToken;
};
