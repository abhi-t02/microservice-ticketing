import { JwtPayload, sign, verify } from "jsonwebtoken";

export function signJWT(payLoad: JwtPayload) {
  return sign(payLoad, <string>process.env.JWT_KEY);
}

export function verifyToken(token: string) {
  const { iat, ...payload } = <JwtPayload>(
    verify(token, <string>process.env.JWT_KEY)
  );
  return payload;
}
