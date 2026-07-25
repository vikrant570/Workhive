declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_BASE_BURL: string;
    NEXT_PUBLIC_BASE_FURL: string;
    NODE_ENV: "development" | "production" | "test";
  }
}
