declare namespace NodeJS {
    interface ProcessEnv{
        PORT: string;
        DB: string;
        SECRET: string;
    }
}