declare global {
  interface Window {
    __APP_CONFIG__: {
      SERVER_URL: string;
    };
  }
}

export {};
