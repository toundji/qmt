/* eslint-disable prettier/prettier */
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import 'dotenv/config'


const ormConfig: TypeOrmOptionsFactory | any = {
    type: "postgres" ?? process.env.DATABASE_SG,
    url: process.env.DB_URL,
    ssl: { rejectUnauthorized: false },
    host: process.env.DATABASE_HOST,
    port: (process.env.DATABASE_PORT as any) as number,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ["dist/**/*.entity{.ts,.js}"],

    synchronize: true,

    migrations: ["dist/migrations/*.js"],
    cli: {
        migrationsDir: "src/migrations",
        entitiesDir: "src/**/*"
    }
};

export default ormConfig;