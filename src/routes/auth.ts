import { Router, Request, Response, NextFunction } from "express";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { NewUser, users } from "../db/schema";
import bcryptjs from "bcryptjs";

const authRouter = Router();

interface SignUpBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

authRouter.post(
  "/signup",
  async (
    req: Request<{}, {}, SignUpBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // get req body
      const { name, email, password } = req.body;

      // check if email present in db
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (existingUser) {
        res.status(400).json({ msg: "User with same email already exists" });
        return;
      }

      // hash password
      const encriptedPasswrd = await bcryptjs.hash(password, 8);

      // create new user and store in db
      const newUser: NewUser = {
        name: name,
        email: email,
        password: encriptedPasswrd,
      };

      const [user] = await db.insert(users).values(newUser).returning();
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

authRouter.post(
  "/login",
  async (
    req: Request<{}, {}, LoginBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // get req body
      const { email, password } = req.body;

      // check if email present in db
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!existingUser) {
        res.status(400).json({ msg: "User does not exists" });
        return;
      } else {
      }

      // hash password
      const isMatched = await bcryptjs.compare(password, existingUser.password);

      if (!isMatched) {
        res.status(400).json({ msg: "incorrect password" });
      }
      res.json(existingUser);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

authRouter.get("/", (req, res) => {
  res.send("Hey there!, from auth");
});

export default authRouter;
