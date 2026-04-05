import express from "express";
import "dotenv/config";
import { expressMiddleware } from "@as-integrations/express5";
import createApolloGraphqlServer from "./graphql";
import UserService from "./service/user";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running!" });
  });

  app.use(
    "/graphql",
    expressMiddleware(await createApolloGraphqlServer(), {
      context: async ({ req }) => {
        const token = req.headers.authorization;
        try {
          const decodedToken = UserService.decodeToken(token as string);
          return { user: decodedToken };
        } catch (error) {
          console.error("Error verifying token:", error);
        }
      },
    })
  );

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

init();
