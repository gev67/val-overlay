"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timers = new Map();
/**
 * A standard debounce, but uses a string `name` as the key instead of the callback.
 */
function default_1(name, callback, duration = 500) {
    const existing = timers.get(name);
    if (existing) {
        clearTimeout(existing);
    }
    timers.set(name, setTimeout(() => {
        timers.delete(name);
        callback();
    }, duration));
}
exports.default = default_1;
//# sourceMappingURL=debounce-name.js.map