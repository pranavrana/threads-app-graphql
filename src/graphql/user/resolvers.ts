import UserService, {
  createUserPayload,
  GetUserTokenPayload,
} from "../../service/user";

const queries = {
  getUserToken: async (_: any, payload: GetUserTokenPayload) => {
    const token = await UserService.getUserToken(payload);
    return token;
  },
};

const mutations = {
  createUser: async (_: any, payload: createUserPayload) => {
    const user = await UserService.createUser(payload);
    return user.id;
  },
};

export const resolvers = { queries, mutations };
