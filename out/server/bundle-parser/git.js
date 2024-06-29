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
// Packages
const git = __importStar(require("git-rev-sync"));
function default_1(bundleDir) {
    const workingDir = process.cwd();
    let retValue;
    try {
        // These will error if bundleDir is not a git repo
        const branch = git.branch(bundleDir);
        const hash = git.long(bundleDir);
        const shortHash = git.short(bundleDir);
        try {
            // Needed for the below commands to work.
            process.chdir(bundleDir);
            // These will error if bundleDir is not a git repo and if `git` is not in $PATH.
            const date = git.date().toISOString();
            const message = git.message();
            retValue = { branch, hash, shortHash, date, message };
        }
        catch (_a) {
            retValue = {
                branch,
                hash,
                shortHash,
            };
        }
    }
    catch (_b) {
        //
    }
    process.chdir(workingDir);
    return retValue;
}
exports.default = default_1;
//# sourceMappingURL=git.js.map