import { TypeOf, object, string } from "zod";

export const signupUserSchema = object({
  body: object({
    email: string({
      required_error: "Email required.",
    })
      .trim()
      .email("Should be valid email."),
    password: string({
      required_error: "Password is required.",
    })
      .trim()
      .min(6, "Password too short - Should be more than 6 characters long."),
  }).strict(),
});

export type signupUserInput = TypeOf<typeof signupUserSchema>;

export const signinUserSchema = Object.assign(signupUserSchema);

export type signinUserInput = TypeOf<typeof signinUserSchema>;
