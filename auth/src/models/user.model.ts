import { Schema, model } from "mongoose";
import { genSalt, hash } from "bcrypt";

interface UserDoc {
  email: string;
  password: string;
}

const UserSchema = new Schema<UserDoc>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function () {
  const user = this;
  const salt = await genSalt(10);
  if (user.isModified("password")) {
    const hashedPassword = await hash(user.password, salt);
    user.set("password", hashedPassword);
  }
});

const User = model<UserDoc>("User", UserSchema);

export default User;
