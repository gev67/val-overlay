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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function default_1(bundleDir, manifest) {
    const singleFilePath = path.resolve(bundleDir, 'extension.js');
    const directoryPath = path.resolve(bundleDir, 'extension');
    const singleFileExists = fs.existsSync(singleFilePath);
    const directoryExists = fs.existsSync(directoryPath);
    // If there is a file named "extension", throw an error. It should be a directory.
    if (directoryExists && !fs.lstatSync(directoryPath).isDirectory()) {
        throw new Error(`${manifest.name} has an illegal file named "extension" in its root. ` +
            'Either rename it to "extension.js", or make a directory named "extension"');
    }
    // If both "extension.js" and a directory named "extension" exist, throw an error.
    if (singleFileExists && directoryExists) {
        throw new Error(`${manifest.name} has both "extension.js" and a folder named "extension". ` +
            'There can only be one of these, not both.');
    }
    // Return "true" if either "extension.js" or a directory named "extension" exist.
    return singleFileExists || directoryExists;
}
exports.default = default_1;
//# sourceMappingURL=extension.js.map