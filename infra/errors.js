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
  constructor({ cause, statusCode }) {
    super("Um erro interno não esperado aconteceu.", {
      cause: cause,
    });
    this.action = "Entre em contato com o suporte.";
    this.statusCode = statusCode || 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends BaseError {
  constructor({ cause, message }) {
    super(message || "Serviço indisponível no momento", {
      cause: cause,
    });
    this.action = "Verifique se o serviço está disponível";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ValidationError extends BaseError {
  constructor({ cause, message, action }) {
    super(message || "Um erro de validação ocorreu", {
      cause: cause,
    });
    this.action = action || "Ajuste os dados enviados e tente novamente";
    this.statusCode = 400;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class NotFoundError extends BaseError {
  constructor({ cause, message, action }) {
    super(message || "Recurso não encontrado no sistema", {
      cause: cause,
    });
    this.action =
      action || "Verifique se os parâmetros enviados estão corretos";
    this.statusCode = 404;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends BaseError {
  constructor() {
    super("Método não permitido para esse endpoint.");
    this.action =
      "Verifique se o método HTTP enviado é válido para este endpoint.";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
