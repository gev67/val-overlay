"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnauthorizedError extends Error {
    constructor(code, message) {
        super(message);
        this.message = message;
        this.serialized = {
            message: this.message,
            code,
            type: 'UnauthorizedError',
        };
    }
}
exports.default = UnauthorizedError;
//# sourceMappingURL=UnauthorizedError.js.map