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
const path = __importStar(require("node:path"));
const json_1 = require("klona/json");
const express_1 = __importDefault(require("express"));
const hasha_1 = __importDefault(require("hasha"));
const util_1 = require("./util");
const rootPath_1 = require("../shared/utils/rootPath");
class SoundsLib {
    constructor(bundles, replicator) {
        this.app = (0, express_1.default)();
        this._cueRepsByBundle = new Map();
        this._bundles = bundles;
        // Create the replicant for the "Master Fader"
        replicator.declare('volume:master', '_sounds', { defaultValue: 100 });
        bundles.forEach((bundle) => {
            // If this bundle has sounds
            if (bundle.soundCues.length > 0) {
                // Create an array replicant that will hold all this bundle's sound cues.
                const defaultCuesRepValue = this._makeCuesRepDefaultValue(bundle);
                const cuesRep = replicator.declare('soundCues', bundle.name, {
                    schemaPath: path.resolve(rootPath_1.nodecgRootPath, 'schemas/soundCues.json'),
                    defaultValue: [],
                });
                this._cueRepsByBundle.set(bundle.name, cuesRep);
                if (cuesRep.value.length > 0) {
                    // Remove any persisted cues that are no longer in the bundle manifest.
                    cuesRep.value = cuesRep.value.filter((persistedCue) => defaultCuesRepValue.find((defaultCue) => defaultCue.name === persistedCue.name));
                    // Add/update any cues in the bundle manifest that aren't in the persisted replicant.
                    defaultCuesRepValue.forEach((defaultCue) => {
                        const existingIndex = cuesRep.value.findIndex((persistedCue) => persistedCue.name === defaultCue.name);
                        // We need to just update a few key properties in the persisted cue.
                        // We leave things like volume as-is.
                        if (existingIndex >= 0) {
                            cuesRep.value[existingIndex].assignable = defaultCue.assignable;
                            cuesRep.value[existingIndex].defaultFile = defaultCue.defaultFile;
                            // If we're updating the cue to not be assignable, then we have to
                            // set the `defaultFile` as the selected `file`.
                            if (!defaultCue.assignable && defaultCue.defaultFile) {
                                cuesRep.value[existingIndex].file = (0, json_1.klona)(defaultCue.defaultFile);
                            }
                        }
                        else {
                            cuesRep.value.push(defaultCue);
                        }
                    });
                }
                else {
                    // There's no persisted value, so just assign the default.
                    cuesRep.value = defaultCuesRepValue;
                }
                // Create this bundle's "Bundle Fader"
                replicator.declare(`volume:${bundle.name}`, '_sounds', {
                    defaultValue: 100,
                });
            }
        });
        this.app.get('/sound/:bundleName/:cueName/default.mp3', this._serveDefault.bind(this));
        this.app.get('/sound/:bundleName/:cueName/default.ogg', this._serveDefault.bind(this));
    }
    _serveDefault(req, res, next) {
        const bundle = this._bundles.find((b) => b.name === req.params['bundleName']);
        if (!bundle) {
            res.status(404).send(`File not found: ${req.path}`);
            return;
        }
        const cue = bundle.soundCues.find((cue) => cue.name === req.params['cueName']);
        if (!cue) {
            res.status(404).send(`File not found: ${req.path}`);
            return;
        }
        if (!cue.defaultFile) {
            res.status(404).send(`Cue "${cue.name}" had no default file`);
            return;
        }
        const parentDir = bundle.dir;
        const fullPath = path.join(parentDir, cue.defaultFile);
        (0, util_1.sendFile)(parentDir, fullPath, res, next);
    }
    _makeCuesRepDefaultValue(bundle) {
        var _a;
        const formattedCues = [];
        for (const rawCue of bundle.soundCues) {
            let file;
            if (rawCue.defaultFile) {
                const filepath = path.join(bundle.dir, rawCue.defaultFile);
                const parsedPath = path.parse(filepath);
                file = {
                    sum: hasha_1.default.fromFileSync(filepath, { algorithm: 'sha1' }),
                    base: parsedPath.base,
                    ext: parsedPath.ext,
                    name: parsedPath.name,
                    url: `/sound/${bundle.name}/${rawCue.name}/default${parsedPath.ext}`,
                    default: true,
                };
            }
            const formatted = {
                name: rawCue.name,
                assignable: Boolean(rawCue.assignable),
                volume: (_a = rawCue.defaultVolume) !== null && _a !== void 0 ? _a : 30,
            };
            if ('defaultVolume' in rawCue) {
                formatted.defaultVolume = rawCue.defaultVolume;
            }
            if (file) {
                formatted.file = file;
                formatted.defaultFile = (0, json_1.klona)(file);
            }
            formattedCues.push(formatted);
        }
        return formattedCues;
    }
}
exports.default = SoundsLib;
//# sourceMappingURL=sounds.js.map