import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../App/config.js";

export interface AuthRequest extends Request {
  user?: { email: string; rol: string };
}
export const Auth: any = () => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    let token_acc;

    const authHeader = req.headers["authorization"];

    if (authHeader) {
      token_acc = authHeader.split(" ")[1];
    }


    if (!token_acc) {
      return res.status(404).json({ error: "token no suministrado" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token_acc, JWT_SECRET_KEY as string) as {
        email: string;
        rol: string;
      };
      if (decoded) {
        req.user = decoded;
        next();
      }
    } catch (error) {
      console.error("Ha ocurrido un error", error);
      return res.status(401).json({ error: "token invalido o expirado" });
    }
  };
};
