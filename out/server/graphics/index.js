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
const util_1 = require("../util");
const registration_1 = __importDefault(require("./registration"));
class GraphicsLib {
    constructor(io, bundleManager, replicator) {
        this.app = (0, express_1.default)();
        const { app } = this;
        // Start up the registration lib, which tracks how many instances of
        // a graphic are open, and enforces singleInstance behavior.
        app.use(new registration_1.default(io, bundleManager, replicator).app);
        app.get('/bundles/:bundleName/graphics*', util_1.authCheck, (req, res, next) => {
            const { bundleName } = req.params;
            const bundle = bundleManager.find(bundleName);
            if (!bundle) {
                next();
                return;
            }
            // We start out assuming the user is trying to reach the index page
            let resName = 'index.html';
            // We need a trailing slash for view index pages so that relatively linked assets can be reached as expected.
            if (req.path.endsWith(`/${bundleName}/graphics`)) {
                res.redirect(`${req.url}/`);
                return;
            }
            // If the url path has more params beyond just /graphics/,
            // then the user is trying to resolve an asset and not the index page.
            if (!req.path.endsWith(`/${bundleName}/graphics/`)) {
                resName = req.params[0];
            }
            // Set a flag if this graphic is one we should enforce singleInstance behavior on.
            // This flag is passed to injectScripts, which then injects the client-side portion of the
            // singleInstance enforcement.
            let isGraphic = false;
            bundle.graphics.some((graphic) => {
                if (`/${graphic.file}` === resName || graphic.file === resName) {
                    isGraphic = true;
                    return true;
                }
                return false;
            });
            const parentDir = path_1.default.join(bundle.dir, 'graphics');
            const fileLocation = path_1.default.join(parentDir, resName);
            // If this file is a main HTML file for a graphic, inject the graphic setup scripts.
            if (isGraphic) {
                (0, util_1.injectScripts)(fileLocation, 'graphic', {
                    createApiInstance: bundle,
                    sound: bundle.soundCues && bundle.soundCues.length > 0,
                }, (html) => res.send(html));
            }
            else {
                (0, util_1.sendFile)(parentDir, fileLocation, res, next);
            }
        });
        // This isn't really a graphics-specific thing, should probably be in the main server lib.
        app.get('/bundles/:bundleName/:target(bower_components|node_modules)/*', (req, res, next) => {
            const { bundleName } = req.params;
            const bundle = bundleManager.find(bundleName);
            if (!bundle) {
                next();
                return;
            }
            const resName = req.params[0];
            const parentDir = path_1.default.join(bundle.dir, req.params['target']);
            const fileLocation = path_1.default.join(parentDir, resName);
            (0, util_1.sendFile)(parentDir, fileLocation, res, next);
        });
    }
}
exports.default = GraphicsLib;
//# sourceMappingURL=index.js.map