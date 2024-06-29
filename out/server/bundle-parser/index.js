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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Native
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// Ours
const panels_1 = __importDefault(require("./panels"));
const mounts_1 = __importDefault(require("./mounts"));
const graphics_1 = __importDefault(require("./graphics"));
const manifest_1 = __importDefault(require("./manifest"));
const assets_1 = __importDefault(require("./assets"));
const sounds_1 = __importDefault(require("./sounds"));
const config = __importStar(require("./config"));
const extension_1 = __importDefault(require("./extension"));
const git_1 = __importDefault(require("./git"));
function default_1(bundlePath, bundleCfg) {
    // Resolve the path to the bundle and its package.json
    const pkgPath = path.join(bundlePath, 'package.json');
    if (!fs.existsSync(pkgPath)) {
        throw new Error(`Bundle at path ${bundlePath} does not contain a package.json!`);
    }
    // Read metadata from the package.json
    let pkg;
    try {
        pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    }
    catch (_) {
        throw new Error(`${pkgPath} is not valid JSON, please check it against a validator such as jsonlint.com`);
    }
    const dashboardDir = path.resolve(bundlePath, 'dashboard');
    const graphicsDir = path.resolve(bundlePath, 'graphics');
    const manifest = (0, manifest_1.default)(pkg, bundlePath);
    const bundle = Object.assign(Object.assign(Object.assign({}, manifest), { dir: bundlePath, 
        // If there is a config file for this bundle, parse it.
        // Else if there is only a configschema for this bundle, parse that and apply any defaults.
        config: bundleCfg
            ? config.parse(manifest.name, bundlePath, bundleCfg)
            : config.parseDefaults(manifest.name, bundlePath), dashboard: {
            dir: dashboardDir,
            panels: (0, panels_1.default)(dashboardDir, manifest),
        }, mount: (0, mounts_1.default)(manifest), graphics: (0, graphics_1.default)(graphicsDir, manifest), assetCategories: (0, assets_1.default)(manifest), hasExtension: (0, extension_1.default)(bundlePath, manifest), git: (0, git_1.default)(bundlePath) }), (0, sounds_1.default)(bundlePath, manifest));
    return bundle;
}
exports.default = default_1;
//# sourceMappingURL=index.js.map