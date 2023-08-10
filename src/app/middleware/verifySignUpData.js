import { db } from "../models/index.js";

const User = db.user;

export const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // let user = await User.findOne({
    //   where: {
    //     username: req.body.username,
    //     status: 'active'  
    //   },
    // }, { paranoid: false });

    // if (user) {
    //   return res.status(400).send({
    //     message: "Failed! Username is already in use!",
    //   });
    // }

    let user = await User.findOne({
      where: {
        email: req.body.email,
        status: 'active'
      },
    }, { paranoid: false });

    if (user) {
      return res.status(401).send({
        message: "Failed! Email is already in use!",
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Username!",
    });
  }
};
