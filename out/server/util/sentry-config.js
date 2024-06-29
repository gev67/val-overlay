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
const os = __importStar(require("node:os"));
const Sentry = __importStar(require("@sentry/node"));
const express_1 = __importDefault(require("express"));
const config_1 = require("../config");
const util_1 = require("../util");
const baseSentryConfig = {
    dsn: config_1.config.sentry.enabled ? config_1.config.sentry.dsn : '',
    serverName: os.hostname(),
    release: util_1.pjson.version,
};
class SentryConfig {
    constructor(bundleManager) {
        this.bundleMetadata = [];
        this.app = (0, express_1.default)();
        const { app, bundleMetadata } = this;
        bundleManager.on('ready', () => {
            Sentry.configureScope((scope) => {
                bundleManager.all().forEach((bundle) => {
                    bundleMetadata.push({
                        name: bundle.name,
                        git: bundle.git,
                        version: bundle.version,
                    });
                });
                scope.setExtra('bundles', bundleMetadata);
            });
        });
        bundleManager.on('gitChanged', (bundle) => {
            const metadataToUpdate = bundleMetadata.find((data) => data.name === bundle.name);
            if (!metadataToUpdate) {
                return;
            }
            metadataToUpdate.git = bundle.git;
            metadataToUpdate.version = bundle.version;
        });
        // Render a pre-configured Sentry instance for client pages that request it.
        app.get('/sentry.js', util_1.authCheck, (_req, res) => {
            res.type('.js');
            res.render(path.join(__dirname, 'sentry.js.tmpl'), {
                baseSentryConfig,
                bundleMetadata,
            });
        });
    }
}
exports.default = SentryConfig;
//# sourceMappingURL=sentry-config.js.map