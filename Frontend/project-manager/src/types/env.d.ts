declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_BACKEND_URL: "http://localhost:8000/manager" | "https://[IP_ADDRESS]/manager"
    NEXT_PUBLIC_FRONTEND_URL: string;
    NODE_ENV: "development" | "production";
  }
}
