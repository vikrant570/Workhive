declare namespace NodeJS {
    interface ProcessEnv {
        PORT: number;
        DB_URL: string;
        JWT_SECRET: string;
        SMTP_EMAIL: string;
        CLIENT_URL: "http://localhost:3000" | "https://[IP_ADDRESS]" | "https://manager.workhive.in";
        SMTP_PASS: string;
        CLOUD_NAME: string;
        CLOUD_API_KEY: number;
        CLOUD_API_SECRET: string;
        NODE_ENV: "development" | "production"
    }
}