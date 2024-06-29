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
exports.DashboardLib = void 0;
const path = __importStar(require("node:path"));
const json_1 = require("klona/json");
const express_1 = __importDefault(require("express"));
const config_1 = require("../config");
const ncgUtils = __importStar(require("../util"));
const rootPath_1 = require("../../shared/utils/rootPath");
const BUILD_PATH = path.join(rootPath_1.nodecgRootPath, 'dist');
class DashboardLib {
    constructor(bundleManager) {
        this.app = (0, express_1.default)();
        this.dashboardContext = undefined;
        const { app } = this;
        app.use(express_1.default.static(BUILD_PATH));
        app.use('/node_modules', express_1.default.static(path.join(rootPath_1.nodecgRootPath, 'node_modules')));
        app.get('/', (_, res) => {
            res.redirect('/dashboard/');
        });
        app.get('/dashboard', ncgUtils.authCheck, (req, res) => {
            if (!req.url.endsWith('/')) {
                res.redirect('/dashboard/');
                return;
            }
            if (!this.dashboardContext) {
                this.dashboardContext = getDashboardContext(bundleManager.all());
            }
            res.render(path.join(__dirname, 'dashboard.tmpl'), this.dashboardContext);
        });
        app.get('/nodecg-api.min.js', (_, res) => {
            res.sendFile(path.join(BUILD_PATH, 'api.js'));
        });
        app.get('/nodecg-api.min.js.map', (_, res) => {
            res.sendFile(path.join(BUILD_PATH, 'api.js.map'));
        });
        app.get('/bundles/:bundleName/dashboard/*', ncgUtils.authCheck, (req, res, next) => {
            const { bundleName } = req.params;
            const bundle = bundleManager.find(bundleName);
            if (!bundle) {
                next();
                return;
            }
            const resName = req.params[0];
            // If the target file is a panel or dialog, inject the appropriate scripts.
            // Else, serve the file as-is.
            const panel = bundle.dashboard.panels.find((p) => p.file === resName);
            if (panel) {
                const resourceType = panel.dialog ? 'dialog' : 'panel';
                ncgUtils.injectScripts(panel.html, resourceType, {
                    createApiInstance: bundle,
                    standalone: Boolean(req.query['standalone']),
                    fullbleed: panel.fullbleed,
                }, (html) => res.send(html));
            }
            else {
                const parentDir = bundle.dashboard.dir;
                const fileLocation = path.join(parentDir, resName);
                ncgUtils.sendFile(parentDir, fileLocation, res, next);
            }
        });
        // When a bundle changes, delete the cached dashboard context
        bundleManager.on('bundleChanged', () => {
            this.dashboardContext = undefined;
        });
    }
}
exports.DashboardLib = DashboardLib;
function getDashboardContext(bundles) {
    return {
        bundles: bundles.map((bundle) => {
            const cleanedBundle = (0, json_1.klona)(bundle);
            if (cleanedBundle.dashboard.panels) {
                cleanedBundle.dashboard.panels.forEach((panel) => {
                    // @ts-expect-error This is a performance hack.
                    delete panel.html;
                });
            }
            return cleanedBundle;
        }),
        publicConfig: config_1.filteredConfig,
        privateConfig: config_1.config,
        workspaces: parseWorkspaces(bundles),
        sentryEnabled: config_1.sentryEnabled,
    };
}
function parseWorkspaces(bundles) {
    let defaultWorkspaceHasPanels = false;
    let otherWorkspacesHavePanels = false;
    const workspaces = [];
    const workspaceNames = new Set();
    bundles.forEach((bundle) => {
        bundle.dashboard.panels.forEach((panel) => {
            if (panel.dialog) {
                return;
            }
            if (panel.fullbleed) {
                otherWorkspacesHavePanels = true;
                const workspaceName = `__nodecg_fullbleed__${bundle.name}_${panel.name}`;
                workspaces.push({
                    name: workspaceName,
                    label: panel.title,
                    route: `fullbleed/${panel.name}`,
                    fullbleed: true,
                });
            }
            else if (panel.workspace === 'default') {
                defaultWorkspaceHasPanels = true;
            }
            else {
                workspaceNames.add(panel.workspace);
                otherWorkspacesHavePanels = true;
            }
        });
    });
    workspaceNames.forEach((name) => {
        workspaces.push({
            name,
            label: name,
            route: `workspace/${name}`,
        });
    });
    workspaces.sort((a, b) => a.label.localeCompare(b.label));
    if (defaultWorkspaceHasPanels || !otherWorkspacesHavePanels) {
        workspaces.unshift({
            name: 'default',
            label: otherWorkspacesHavePanels ? 'Main Workspace' : 'Workspace',
            route: '',
        });
    }
    return workspaces;
}
//# sourceMappingURL=index.js.map