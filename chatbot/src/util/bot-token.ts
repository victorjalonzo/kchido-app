export class BotTokenStore {
    private static instance: BotTokenStore;
    private token: string | null = null;
  
    private constructor() {}
  
    static getInstance(): BotTokenStore {
      if (!BotTokenStore.instance) {
        BotTokenStore.instance = new BotTokenStore();
      }
      return BotTokenStore.instance;
    }
  
    setToken(token: string) {
      this.token = token;
    }
  
    getToken(): string | null {
      return this.token;
    }
}