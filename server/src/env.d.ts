declare namespace NodeJS {
  export interface ProcessEnv {
    REDIS_HOST: string;
    REDIS_PASSWORD: string;
    URL_ID_LENGTH: number;
    SERVER_PORT: number;
  }
}
