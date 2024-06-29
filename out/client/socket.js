var _a;
import Cookies from 'cookies-js';
import io from 'socket.io-client';
const params = new URLSearchParams(location.search);
globalThis.token = (_a = params.get('key')) !== null && _a !== void 0 ? _a : Cookies.get('socketToken');
if (globalThis.token) {
    globalThis.socket = io(undefined, {
        query: { token: globalThis.token },
    });
}
else {
    globalThis.socket = io();
}
//# sourceMappingURL=socket.js.map