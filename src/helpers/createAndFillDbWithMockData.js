import bcryptjs from "bcryptjs";
import { db } from "../app/models/index.js";

const User = db.user;

export async function initial(count) {
  const possibleCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789";
  const data = [];

  for (let i = 0; i < count; i++) {
    let user = {
      username: createData(8, possibleCharacters),
      email: createData(10, possibleCharacters),
      password: bcryptjs.hashSync(createData(12, possibleCharacters), 8),
      registrationDate: Date.now(),
      status: "active",
    };
    data.push(user);
  }
  await User.bulkCreate(data);
}

export function createData(length, data) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += data.charAt(Math.floor(Math.random() * data.length));
  }
  return result;
}
