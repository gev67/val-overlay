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
Object.defineProperty(exports, "__esModule", { value: true });
// Native
const path = __importStar(require("path"));
// Packages
const semver = __importStar(require("semver"));
function default_1(pkg, bundlePath) {
    if (!semver.valid(pkg.version)) {
        throw new Error(`${pkg.name}'s package.json must specify a valid version.`);
    }
    // Check if this manifest has a nodecg property
    if (!{}.hasOwnProperty.call(pkg, 'nodecg')) {
        throw new Error(`${pkg.name}'s package.json lacks a "nodecg" property, and therefore cannot be parsed.`);
    }
    if (!semver.validRange(pkg.nodecg.compatibleRange)) {
        throw new Error(`${pkg.name}'s package.json does not have a valid "nodecg.compatibleRange" property.`);
    }
    const bundleFolderName = path.parse(bundlePath).base;
    if (bundleFolderName !== pkg.name) {
        throw new Error(`${pkg.name}'s folder is named "${bundleFolderName}". Please rename it to "${pkg.name}".`);
    }
    // Grab the standard properties from the package.json that we care about.
    const manifest = Object.assign(Object.assign({}, pkg.nodecg), { name: pkg.name, version: pkg.version, license: pkg.license, description: pkg.description, homepage: pkg.homepage, author: pkg.author, contributors: pkg.contributors, transformBareModuleSpecifiers: Boolean(pkg.nodecg.transformBareModuleSpecifiers) });
    return manifest;
}
exports.default = default_1;
//# sourceMappingURL=manifest.js.map