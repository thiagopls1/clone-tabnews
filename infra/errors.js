export class BaseError extends Error {
  constructor(message, options) {
    super(message, options);
    Object.defineProperty(this, "name", {
      value: this.constructor.name,
      enumerable: false,
    });
  }
}

export class InternalServerError extends BaseError {
  constructor({ cause }) {
    super("Um erro interno não esperado aconteceu.", {
      cause: cause,
    });
    this.action = "Entre em contato com o suporte.";
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: 500,
    };
  }
}
