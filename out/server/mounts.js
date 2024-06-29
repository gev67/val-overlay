"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Native
const path_1 = __importDefault(require("path"));
// Packages
const express_1 = __importDefault(require("express"));
const util_1 = require("./util");
class MountsLib {
    constructor(bundles) {
        this.app = (0, express_1.default)();
        bundles.forEach((bundle) => {
            bundle.mount.forEach((mount) => {
                this.app.get(`/bundles/${bundle.name}/${mount.endpoint}/*`, util_1.authCheck, (req, res, next) => {
                    const resName = req.params[0];
                    const parentDir = path_1.default.join(bundle.dir, mount.directory);
                    const fileLocation = path_1.default.join(parentDir, resName);
                    (0, util_1.sendFile)(parentDir, fileLocation, res, next);
                });
            });
        });
    }
}
exports.default = MountsLib;
//# sourceMappingURL=mounts.js.map