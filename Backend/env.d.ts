declare namespace NodeJS {
    interface ProcessEnv {
        PORT: number;
        DB_URL: string;
        JWT_SECRET: string;
        SMTP_EMAIL: string;
        SMTP_PASS: string;
        CLOUD_NAME: string;
        CLOUD_API_KEY: number;
        CLOUD_API_SECRET: string;
    }
}