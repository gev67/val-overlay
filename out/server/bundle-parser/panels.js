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
// Packages
const cheerio_1 = __importDefault(require("cheerio"));
function default_1(dashboardDir, manifest) {
    var _a;
    const unparsedPanels = (_a = manifest.dashboardPanels) !== null && _a !== void 0 ? _a : undefined;
    const bundleName = manifest.name;
    const panels = [];
    // If the dashboard folder exists but the nodecg.dashboardPanels property doesn't, throw an error.
    if (fs.existsSync(dashboardDir) && typeof unparsedPanels === 'undefined') {
        throw new Error(`${bundleName} has a "dashboard" folder, ` +
            'but no "nodecg.dashboardPanels" property was found in its package.json');
    }
    // If nodecg.dashboardPanels exists but the dashboard folder doesn't, throw an error.
    if (!fs.existsSync(dashboardDir) && typeof unparsedPanels !== 'undefined') {
        throw new Error(`${bundleName} has a "nodecg.dashboardPanels" property in its package.json, but no "dashboard" folder`);
    }
    // If neither the folder nor the manifest exist, return an empty array.
    if (!fs.existsSync(dashboardDir) && typeof unparsedPanels === 'undefined') {
        return panels;
    }
    unparsedPanels === null || unparsedPanels === void 0 ? void 0 : unparsedPanels.forEach((panel, index) => {
        var _a, _b, _c;
        assertRequiredProps(panel, index);
        // Check if this bundle already has a panel by this name
        const dupeFound = panels.some((p) => p.name === panel.name);
        if (dupeFound) {
            throw new Error(`Panel #${index} (${panel.name}) has the same name as another panel in ${bundleName}.`);
        }
        const filePath = path.join(dashboardDir, panel.file);
        // Check that the panel file exists, throws error if it doesn't
        if (!fs.existsSync(filePath)) {
            throw new Error(`Panel file "${panel.file}" in bundle "${bundleName}" does not exist.`);
        }
        // This fixes some harder to spot issues with Unicode Byte Order Markings in dashboard HTML.
        const panelStr = fs.readFileSync(filePath, 'utf8');
        const $ = cheerio_1.default.load(panelStr.trim());
        // We used to need to check for a <head> tag, but modern versions of Cheerio add this for us automatically!
        // Check that the panel has a DOCTYPE
        const html = $.html();
        if (!html.match(/(<!doctype )/gi)) {
            throw new Error(`Panel "${path.basename(panel.file)}" in bundle "${bundleName}" has no DOCTYPE,` +
                'panel resizing will not work. Add <!DOCTYPE html> to it.');
        }
        // Error if this panel is a dialog but also has a workspace defined
        if (panel.dialog && panel.workspace) {
            throw new Error(`Dialog "${path.basename(panel.file)}" in bundle "${bundleName}" has a "workspace" ` +
                'configured. Dialogs don\'t get put into workspaces. Either remove the "workspace" property from ' +
                'this dialog, or turn it into a normal panel by setting "dialog" to false.');
        }
        if (panel.dialog && panel.fullbleed) {
            throw new Error(`Panel "${path.basename(panel.file)}" in bundle "${bundleName}" is fullbleed, ` +
                'but it also a dialog. Fullbleed panels cannot be dialogs. Either set fullbleed or dialog ' +
                'to false.');
        }
        if (panel.fullbleed && panel.workspace) {
            throw new Error(`Panel "${path.basename(panel.file)}" in bundle "${bundleName}" is fullbleed, ` +
                'but it also has a workspace defined. Fullbleed panels are not allowed to define a workspace, ' +
                'as they are automatically put into their own workspace. Either set fullbleed to ' +
                'false or remove the workspace property from this panel.');
        }
        if (panel.fullbleed && typeof panel.width !== 'undefined') {
            throw new Error(`Panel "${path.basename(panel.file)}" in bundle "${bundleName}" is fullbleed, ` +
                'but it also has a width defined. Fullbleed panels have their width set based on the, ' +
                'width of the browser viewport. Either set fullbleed to ' +
                'false or remove the width property from this panel.');
        }
        if ((_a = panel.workspace) === null || _a === void 0 ? void 0 : _a.toLowerCase().startsWith('__nodecg')) {
            throw new Error(`Panel "${path.basename(panel.file)}" in bundle "${bundleName}" is in a workspace ` +
                'whose name begins with __nodecg, which is a reserved string. Please change the name ' +
                'of this workspace to not begin with this string.');
        }
        let sizeInfo;
        if (panel.fullbleed) {
            sizeInfo = {
                fullbleed: true,
            };
        }
        else {
            sizeInfo = {
                fullbleed: false,
                width: (_b = panel.width) !== null && _b !== void 0 ? _b : 1,
            };
        }
        let workspaceInfo;
        if (panel.dialog) {
            workspaceInfo = {
                dialog: true,
                dialogButtons: panel.dialogButtons,
            };
        }
        else {
            workspaceInfo = {
                dialog: false,
                workspace: panel.workspace ? panel.workspace.toLowerCase() : 'default',
            };
        }
        const parsedPanel = Object.assign(Object.assign(Object.assign({ name: panel.name, title: panel.title, file: panel.file }, sizeInfo), workspaceInfo), { path: filePath, headerColor: (_c = panel.headerColor) !== null && _c !== void 0 ? _c : '#525F78', bundleName, html: $.html() });
        panels.push(parsedPanel);
    });
    return panels;
}
exports.default = default_1;
function assertRequiredProps(panel, index) {
    const missingProps = [];
    if (typeof panel.name === 'undefined') {
        missingProps.push('name');
    }
    if (typeof panel.title === 'undefined') {
        missingProps.push('title');
    }
    if (typeof panel.file === 'undefined') {
        missingProps.push('file');
    }
    if (missingProps.length) {
        throw new Error(`Panel #${index} could not be parsed as it is missing the following properties: ` + missingProps.join(', '));
    }
}
//# sourceMappingURL=panels.js.map