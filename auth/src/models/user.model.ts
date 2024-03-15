import { Model, Schema, model } from "mongoose";
import { genSalt, hash, compare } from "bcrypt";

interface UserDoc {
  email: string;
  password: string;
}

interface UserDocMethods {
  comparePassword: (password: string) => Promise<boolean>;
}

type UserDocModel = Model<UserDoc, {}, UserDocMethods>;

const UserSchema = new Schema<UserDoc, UserDocModel, UserDocMethods>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

UserSchema.methods.comparePassword = async function (password: string) {
  const user = this as UserDoc;

  const isLogin = await compare(password, user.password);

  return isLogin;
};

UserSchema.pre("save", async function () {
  const user = this;
  const salt = await genSalt(10);
  if (user.isModified("password")) {
    const hashedPassword = await hash(user.password, salt);
    user.set("password", hashedPassword);
  }
});

const User = model<UserDoc, UserDocModel>("User", UserSchema);

export default User;
