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
function default_1(bundlePath, manifest) {
    if (!manifest.soundCues) {
        return { soundCues: [], hasAssignableSoundCues: false };
    }
    if (!Array.isArray(manifest.soundCues)) {
        throw new Error(`${manifest.name}'s nodecg.soundCues is not an Array`);
    }
    let hasAssignable = false;
    const parsedCues = manifest.soundCues.map((unparsedCue, index) => {
        if (typeof unparsedCue.name !== 'string') {
            throw new Error(`nodecg.soundCues[${index}] in bundle ${manifest.name} lacks a "name" property`);
        }
        const parsedCue = Object.assign({}, unparsedCue);
        if (typeof parsedCue.assignable === 'undefined') {
            parsedCue.assignable = true;
        }
        if (parsedCue.assignable) {
            hasAssignable = true;
        }
        // Clamp default volume to 0-100.
        if (parsedCue.defaultVolume) {
            parsedCue.defaultVolume = Math.min(parsedCue.defaultVolume, 100);
            parsedCue.defaultVolume = Math.max(parsedCue.defaultVolume, 0);
        }
        // Verify that defaultFile exists, if provided.
        if (parsedCue.defaultFile) {
            const defaultFilePath = path.join(bundlePath, parsedCue.defaultFile);
            if (!fs.existsSync(defaultFilePath)) {
                throw new Error(`nodecg.soundCues[${index}].defaultFile in bundle ${manifest.name} does not exist`);
            }
        }
        return parsedCue;
    });
    return { soundCues: parsedCues, hasAssignableSoundCues: hasAssignable };
}
exports.default = default_1;
//# sourceMappingURL=sounds.js.map