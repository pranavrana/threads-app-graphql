import UserService, {
  createUserPayload,
  GetUserTokenPayload,
} from "../../service/user";

const queries = {
  getUserToken: async (_: any, payload: GetUserTokenPayload) => {
    const token = await UserService.getUserToken(payload);
    return token;
  },
  getCurrentUser: async (_: any, payload: any, context: any) => {
    if (context && context.user) {
      return context.user;
    }
    throw new Error("Unauthorized");
  },
};

const mutations = {
  createUser: async (_: any, payload: createUserPayload) => {
    const user = await UserService.createUser(payload);
    return user.id;
  },
};

export const resolvers = { queries, mutations };
