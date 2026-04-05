import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "crypto";
import JWT from "jsonwebtoken";

const secret = "B3y0ndTh3S3cr3t";

export interface createUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  private static getPasswordHash(password: string, salt: string) {
    return createHmac("sha256", salt).update(password).digest("hex");
  }

  public static decodeToken(token: string) {
    const decodedToken = JWT.verify(token, secret);
    return decodedToken;
  }

  public static createUser(payload: createUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(32).toString("hex");
    const hashedPass = UserService.getPasswordHash(password, salt);
    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        salt,
        password: hashedPass,
      },
    });
  }

  public static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({
      where: {
        email,
      },
    });
  }

  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await UserService.getUserByEmail(email);
    if (!user) throw new Error("User not found");

    const getPasswordHash = UserService.getPasswordHash(password, user.salt);
    if (getPasswordHash !== user.password) throw new Error("Invalid password");

    const token = JWT.sign({ id: user.id, email: user.email }, secret);
    return token;
  }
}

export default UserService;
