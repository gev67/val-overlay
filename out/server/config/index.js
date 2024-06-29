"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sentryEnabled = exports.exitOnUncaught = exports.filteredConfig = exports.config = void 0;
const path = __importStar(require("node:path"));
const fs = __importStar(require("node:fs"));
const yargs_1 = require("yargs");
const loader_1 = require("./loader");
const nodecg_root_1 = require("../nodecg-root");
const cfgDirectoryPath = (_a = yargs_1.argv['cfgPath']) !== null && _a !== void 0 ? _a : path.join(nodecg_root_1.NODECG_ROOT, 'cfg');
// Make 'cfg' folder if it doesn't exist
if (!fs.existsSync(cfgDirectoryPath)) {
    fs.mkdirSync(cfgDirectoryPath, { recursive: true });
}
const { config, filteredConfig } = (0, loader_1.loadConfig)(cfgDirectoryPath);
exports.config = config;
exports.filteredConfig = filteredConfig;
exports.exitOnUncaught = config.exitOnUncaught;
exports.sentryEnabled = (_b = config.sentry) === null || _b === void 0 ? void 0 : _b.enabled;
//# sourceMappingURL=index.js.map