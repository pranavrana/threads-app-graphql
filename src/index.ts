import express from 'express';
import 'dotenv/config'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { prismaClient } from './lib/db';
async function init(){
    const app = express();
    const PORT = Number(process.env.PORT) || 8000
    
    app.use(express.json());
    //Create graphql server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
            }
            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }`,
        resolvers: {
            Query: {
                hello: () => 'Hello, world!'
            },
            Mutation: {
                createUser: async(_, {firstName, lastName, email, password}: 
                    {firstName: string; lastName: string; email: string; password: string;}) => {
                        await prismaClient.user.create({
                            data: {
                                firstName,
                                lastName,
                                email,
                                password,
                                salt: "random_salt" // In a real application, you should generate a unique salt for each user and hash the password
                            }
                        })
                        return true;
                    }
            }
        }
    })

    //Start gql server
    await gqlServer.start();

    app.get('/', (req, res) => {
    res.json({message: 'Server is up and running!'});
    });

    app.use('/graphql', expressMiddleware(gqlServer));

    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
}

init();