"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Native
const path_1 = __importDefault(require("path"));
// Packages
const express_1 = __importDefault(require("express"));
// Ours
const util_1 = require("./util");
class SharedSourcesLib {
    constructor(bundles) {
        this.app = (0, express_1.default)();
        this.app.get('/bundles/:bundleName/shared/*', util_1.authCheck, (req, res, next) => {
            const { bundleName } = req.params;
            const bundle = bundles.find((b) => b.name === bundleName);
            if (!bundle) {
                next();
                return;
            }
            // Essentially behave like express.static
            // Serve up files with no extra logic
            const resName = req.params[0];
            const parentDir = path_1.default.join(bundle.dir, 'shared');
            const fileLocation = path_1.default.join(parentDir, resName);
            (0, util_1.sendFile)(parentDir, fileLocation, res, next);
        });
    }
}
exports.default = SharedSourcesLib;
//# sourceMappingURL=shared-sources.js.map