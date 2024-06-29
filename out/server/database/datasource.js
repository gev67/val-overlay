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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.testing = void 0;
const path = __importStar(require("node:path"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
__exportStar(require("./entity"), exports);
const User_1 = require("./entity/User");
const Session_1 = require("./entity/Session");
const Role_1 = require("./entity/Role");
const Replicant_1 = require("./entity/Replicant");
const Permission_1 = require("./entity/Permission");
const Identity_1 = require("./entity/Identity");
const ApiKey_1 = require("./entity/ApiKey");
const rootPath_1 = require("../../shared/utils/rootPath");
const dbPath = path.join(rootPath_1.nodecgRootPath, 'db/nodecg.sqlite3');
exports.testing = ((_a = process.env.NODECG_TEST) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'true';
const dataSource = new typeorm_1.DataSource({
    type: 'better-sqlite3',
    /**
     * TypeORM has this special :memory: key which indicates
     * that an in-memory version of SQLite should be used.
     *
     * I can't find ANY documentation on this,
     * only references to it in GitHub issue threads
     * and in the TypeORM source code.
     *
     * But, bad docs aside, it is still useful
     * and we use it for tests.
     */
    database: exports.testing ? ':memory:' : dbPath,
    logging: false,
    entities: [ApiKey_1.ApiKey, Identity_1.Identity, Permission_1.Permission, Replicant_1.Replicant, Role_1.Role, Session_1.Session, User_1.User],
    migrations: [path.join(rootPath_1.nodecgRootPath, 'out/server/database/migration/*.js')],
    migrationsRun: true,
    synchronize: false,
});
exports.default = dataSource;
//# sourceMappingURL=datasource.js.map