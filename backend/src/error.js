  // errors to be thrown 
  export class setUpError extends Error {
    constructor (message) {
      super(message);
      this.name = 'setUpError';
    }
  }

  export class AccessError extends Error {
    constructor (message) {
      super(message);
      this.name = 'AccessError';
    }
  }

  export class RedisError extends Error {
    constructor (message) {
      super(message);
      this.name = 'RedisError';
    }
  }
  
