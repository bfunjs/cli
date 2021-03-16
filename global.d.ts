declare global {
  namespace NodeJS {
    interface Global {
      name: string;
      version: string;
      rootDir: string;
      userDir: string;
      configDir: string;
    }
  }
}

export {};
