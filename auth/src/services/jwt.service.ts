import { JwtPayload, sign, verify } from "jsonwebtoken";

interface PayLoadInterface extends JwtPayload {
  email: string;
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: PayLoadInterface;
    }
  }
}

export function signJWT(payLoad: JwtPayload) {
  return sign(payLoad, <string>process.env.JWT_KEY);
}

export function verifyToken(token: string) {
  const { iat, ...payload } = <PayLoadInterface>(
    verify(token, <string>process.env.JWT_KEY)
  );
  return payload;
}
