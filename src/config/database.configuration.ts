import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const databaseConfiguration: MongooseModuleAsyncOptions = {
    useFactory: () => ({
        uri: process.env.MONGODB_URL,
    }),
};

export default databaseConfiguration;
