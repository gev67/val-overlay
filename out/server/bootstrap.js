"use strict";
/**
 * This file is used to automatically bootstrap a NodeCG Server instance.
 * It exports nothing and offers no controls.
 *
 * At this time, other means of starting NodeCG are not officially supported,
 * but they are used internally by our tests.
 *
 * Tests directly instantiate the NodeCGServer class, so that they may have full control
 * over its lifecycle and when the process exits.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = __importDefault(require("semver"));
const node_fetch_commonjs_1 = __importDefault(require("node-fetch-commonjs"));
const rootPath_1 = require("../shared/utils/rootPath");
const cwd = process.cwd();
if (cwd !== rootPath_1.nodecgRootPath) {
    console.warn('[nodecg] process.cwd is %s, expected %s', cwd, rootPath_1.nodecgRootPath);
    process.chdir(rootPath_1.nodecgRootPath);
    console.info('[nodecg] Changed process.cwd to %s', rootPath_1.nodecgRootPath);
}
const util_1 = require("./util");
const server_1 = require("./server");
const exit_hook_1 = require("./util/exit-hook");
const config_1 = require("./config");
process.title = `NodeCG - ${util_1.pjson.version}`;
process.on('uncaughtException', (err) => {
    if (!config_1.sentryEnabled) {
        if (config_1.exitOnUncaught) {
            console.error('UNCAUGHT EXCEPTION! NodeCG will now exit.');
        }
        else {
            console.error('UNCAUGHT EXCEPTION!');
        }
        console.error(err);
        if (config_1.exitOnUncaught) {
            (0, exit_hook_1.gracefulExit)(1);
        }
    }
});
process.on('unhandledRejection', (err) => {
    if (!config_1.sentryEnabled) {
        console.error('UNHANDLED PROMISE REJECTION!');
        console.error(err);
    }
});
const server = new server_1.NodeCGServer();
server.on('error', () => {
    (0, exit_hook_1.gracefulExit)(1);
});
server.on('stopped', () => {
    if (!process.exitCode) {
        (0, exit_hook_1.gracefulExit)(0);
    }
});
server.start().catch((error) => {
    console.error(error);
    process.nextTick(() => {
        (0, exit_hook_1.gracefulExit)(1);
    });
});
(0, util_1.asyncExitHook)(() => __awaiter(void 0, void 0, void 0, function* () {
    yield server.stop();
}), {
    minimumWait: 100,
});
// Check for updates
(0, node_fetch_commonjs_1.default)('https://registry.npmjs.org/nodecg/latest')
    .then((res) => res.json())
    .then((body) => {
    if (semver_1.default.gt(body.version, util_1.pjson.version)) {
        console.warn('An update is available for NodeCG: %s (current: %s)', JSON.parse(body).version, util_1.pjson.version);
    }
})
    .catch(
/* istanbul ignore next */ () => {
    // Discard errors.
});
//# sourceMappingURL=bootstrap.js.map