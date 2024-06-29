"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODECG_ROOT = void 0;
const rootPath_1 = require("../shared/utils/rootPath");
/**
 * The path to have bundles, cfg, db, and assets folder. Used by tests.
 */
exports.NODECG_ROOT = (_a = process.env['NODECG_ROOT']) !== null && _a !== void 0 ? _a : rootPath_1.nodecgRootPath;
//# sourceMappingURL=nodecg-root.js.map