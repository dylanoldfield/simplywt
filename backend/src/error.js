  export class AccessError extends Error {
    constructor (message) {
      super(message);
      this.name = 'AccessError';
    }
  }