"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Native
const path_1 = __importDefault(require("path"));
// Packages
const fs_extra_1 = __importDefault(require("fs-extra"));
const chokidar_1 = __importDefault(require("chokidar"));
const lodash_debounce_1 = __importDefault(require("lodash.debounce"));
const semver_1 = __importDefault(require("semver"));
const cosmiconfig_1 = require("cosmiconfig");
// Ours
const bundle_parser_1 = __importDefault(require("./bundle-parser"));
const git_1 = __importDefault(require("./bundle-parser/git"));
const logger_1 = __importDefault(require("./logger"));
const typed_emitter_1 = require("../shared/typed-emitter");
/**
 * Milliseconds
 */
const READY_WAIT_THRESHOLD = 1000;
// Start up the watcher, but don't watch any files yet.
// We'll add the files we want to watch later, in the init() method.
const watcher = chokidar_1.default.watch([
    '!**/*___jb_*___', // Ignore temp files created by JetBrains IDEs
    '!**/node_modules/**', // Ignore node_modules folders
    '!**/bower_components/**', // Ignore bower_components folders
    '!**/*.lock', // Ignore lockfiles
], {
    persistent: true,
    ignoreInitial: true,
    followSymlinks: true,
});
const blacklistedBundleDirectories = ['node_modules', 'bower_components'];
const bundles = [];
const log = (0, logger_1.default)('bundle-manager');
const hasChanged = new Set();
let backoffTimer;
class BundleManager extends typed_emitter_1.TypedEmitter {
    get ready() {
        return this._ready;
    }
    constructor(bundlesPaths, cfgPath, nodecgVersion, nodecgConfig) {
        super();
        this.bundles = [];
        this._ready = false;
        // This is on a debouncer to avoid false-positives that can happen when editing a manifest.
        this._debouncedManifestDeletionCheck = (0, lodash_debounce_1.default)((bundleName, manifestPath) => {
            if (fs_extra_1.default.existsSync(manifestPath)) {
                this.handleChange(bundleName);
            }
            else {
                log.debug('Processing removed event for', bundleName);
                log.info("%s's package.json can no longer be found on disk, assuming the bundle has been deleted or moved", bundleName);
                this.remove(bundleName);
                this.emit('bundleRemoved', bundleName);
            }
        }, 100);
        this._debouncedGitChangeHandler = (0, lodash_debounce_1.default)((bundleName) => {
            const bundle = this.find(bundleName);
            if (!bundle) {
                return;
            }
            bundle.git = (0, git_1.default)(bundle.dir);
            this.emit('gitChanged', bundle);
        }, 250);
        this._cfgPath = cfgPath;
        const readyTimeout = setTimeout(() => {
            this._ready = true;
            this.emit('ready');
        }, READY_WAIT_THRESHOLD);
        bundlesPaths.forEach((bundlesPath) => {
            log.trace(`Loading bundles from ${bundlesPath}`);
            // Create the "bundles" dir if it does not exist.
            /* istanbul ignore if: We know this code works and testing it is tedious, so we don't bother to test it. */
            if (!fs_extra_1.default.existsSync(bundlesPath)) {
                fs_extra_1.default.mkdirpSync(bundlesPath);
            }
            /* istanbul ignore next */
            watcher.on('add', (filePath) => {
                const bundleName = extractBundleName(bundlesPath, filePath);
                // In theory, the bundle parser would have thrown an error long before this block would execute,
                // because in order for us to be adding a panel HTML file, that means that the file would have been missing,
                // which the parser does not allow and would throw an error for.
                // Just in case though, its here.
                if (this.isPanelHTMLFile(bundleName, filePath)) {
                    this.handleChange(bundleName);
                }
                else if (isGitData(bundleName, filePath)) {
                    this._debouncedGitChangeHandler(bundleName);
                }
                if (!this.ready) {
                    readyTimeout.refresh();
                }
            });
            watcher.on('change', (filePath) => {
                const bundleName = extractBundleName(bundlesPath, filePath);
                if (isManifest(bundleName, filePath) || this.isPanelHTMLFile(bundleName, filePath)) {
                    this.handleChange(bundleName);
                }
                else if (isGitData(bundleName, filePath)) {
                    this._debouncedGitChangeHandler(bundleName);
                }
            });
            watcher.on('unlink', (filePath) => {
                const bundleName = extractBundleName(bundlesPath, filePath);
                if (this.isPanelHTMLFile(bundleName, filePath)) {
                    // This will cause NodeCG to crash, because the parser will throw an error due to
                    // a panel's HTML file no longer being present.
                    this.handleChange(bundleName);
                }
                else if (isManifest(bundleName, filePath)) {
                    this._debouncedManifestDeletionCheck(bundleName, filePath);
                }
                else if (isGitData(bundleName, filePath)) {
                    this._debouncedGitChangeHandler(bundleName);
                }
            });
            /* istanbul ignore next */
            watcher.on('error', (error) => {
                log.error(error.stack);
            });
            // Do an initial load of each bundle in the "bundles" folder.
            // During runtime, any changes to a bundle's "dashboard" folder will trigger a re-load of that bundle,
            // as will changes to its `package.json`.
            const bundleFolders = fs_extra_1.default.readdirSync(bundlesPath);
            bundleFolders.forEach((bundleFolderName) => {
                var _a, _b, _c;
                const bundlePath = path_1.default.join(bundlesPath, bundleFolderName);
                if (!fs_extra_1.default.statSync(bundlePath).isDirectory()) {
                    return;
                }
                // Prevent attempting to load unwanted directories. Those specified above and all dot-prefixed.
                if (blacklistedBundleDirectories.includes(bundleFolderName) || bundleFolderName.startsWith('.')) {
                    return;
                }
                if ((_b = (_a = nodecgConfig === null || nodecgConfig === void 0 ? void 0 : nodecgConfig['bundles']) === null || _a === void 0 ? void 0 : _a.disabled) === null || _b === void 0 ? void 0 : _b.includes(bundleFolderName)) {
                    log.debug(`Not loading bundle ${bundleFolderName} as it is disabled in config`);
                    return;
                }
                if (((_c = nodecgConfig === null || nodecgConfig === void 0 ? void 0 : nodecgConfig['bundles']) === null || _c === void 0 ? void 0 : _c.enabled) && !(nodecgConfig === null || nodecgConfig === void 0 ? void 0 : nodecgConfig['bundles'].enabled.includes(bundleFolderName))) {
                    log.debug(`Not loading bundle ${bundleFolderName} as it is not enabled in config`);
                    return;
                }
                log.debug(`Loading bundle ${bundleFolderName}`);
                // Parse each bundle and push the result onto the bundles array
                const bundle = (0, bundle_parser_1.default)(bundlePath, loadBundleCfg(cfgPath, bundleFolderName));
                // Check if the bundle is compatible with this version of NodeCG
                if (!semver_1.default.satisfies(nodecgVersion, bundle.compatibleRange)) {
                    log.error('%s requires NodeCG version %s, current version is %s', bundle.name, bundle.compatibleRange, nodecgVersion);
                    return;
                }
                bundles.push(bundle);
                // Use `chokidar` to watch for file changes within bundles.
                // Workaround for https://github.com/paulmillr/chokidar/issues/419
                // This workaround is necessary to fully support symlinks.
                // This is applied after the bundle has been validated and loaded.
                // Bundles that do not properly load upon startup are not recognized for updates.
                watcher.add([
                    path_1.default.join(bundlePath, '.git'), // Watch `.git` directories.
                    path_1.default.join(bundlePath, 'dashboard'), // Watch `dashboard` directories.
                    path_1.default.join(bundlePath, 'package.json'), // Watch each bundle's `package.json`.
                ]);
            });
        });
    }
    /**
     * Returns a shallow-cloned array of all currently active bundles.
     * @returns {Array.<Object>}
     */
    all() {
        return bundles.slice(0);
    }
    /**
     * Returns the bundle with the given name. undefined if not found.
     * @param name {String} - The name of the bundle to find.
     * @returns {Object|undefined}
     */
    find(name) {
        return bundles.find((b) => b.name === name);
    }
    /**
     * Adds a bundle to the internal list, replacing any existing bundle with the same name.
     * @param bundle {Object}
     */
    add(bundle) {
        /* istanbul ignore if: Again, it shouldn't be possible for "bundle" to be undefined, but just in case... */
        if (!bundle) {
            return;
        }
        // Remove any existing bundles with this name
        if (this.find(bundle.name)) {
            this.remove(bundle.name);
        }
        bundles.push(bundle);
    }
    /**
     * Removes a bundle with the given name from the internal list. Does nothing if no match found.
     * @param bundleName {String}
     */
    remove(bundleName) {
        const len = bundles.length;
        for (let i = 0; i < len; i++) {
            // TODO: this check shouldn't have to happen, idk why things in this array can sometimes be undefined
            if (!bundles[i]) {
                continue;
            }
            if (bundles[i].name === bundleName) {
                bundles.splice(i, 1);
            }
        }
    }
    handleChange(bundleName) {
        setTimeout(() => {
            this._handleChange(bundleName);
        }, 100);
    }
    /**
     * Resets the backoff timer used to avoid event thrashing when many files change rapidly.
     */
    resetBackoffTimer() {
        clearTimeout(backoffTimer); // Typedefs for clearTimeout are always wonky
        backoffTimer = setTimeout(() => {
            backoffTimer = undefined;
            for (const bundleName of hasChanged) {
                log.debug('Backoff finished, emitting change event for', bundleName);
                this.handleChange(bundleName);
            }
            hasChanged.clear();
        }, 500);
    }
    /**
     * Checks if a given path is a panel HTML file of a given bundle.
     * @param bundleName {String}
     * @param filePath {String}
     * @returns {Boolean}
     * @private
     */
    isPanelHTMLFile(bundleName, filePath) {
        const bundle = this.find(bundleName);
        if (bundle) {
            return bundle.dashboard.panels.some((panel) => panel.path.endsWith(filePath));
        }
        return false;
    }
    /**
     * Only used by tests.
     */
    _stopWatching() {
        void watcher.close();
    }
    _handleChange(bundleName) {
        const bundle = this.find(bundleName);
        /* istanbul ignore if: It's rare for `bundle` to be undefined here, but it can happen when using black/whitelisting. */
        if (!bundle) {
            return;
        }
        if (backoffTimer) {
            log.debug('Backoff active, delaying processing of change detected in', bundleName);
            hasChanged.add(bundleName);
            this.resetBackoffTimer();
        }
        else {
            log.debug('Processing change event for', bundleName);
            this.resetBackoffTimer();
            try {
                const reparsedBundle = (0, bundle_parser_1.default)(bundle.dir, loadBundleCfg(this._cfgPath, bundle.name));
                this.add(reparsedBundle);
                this.emit('bundleChanged', reparsedBundle);
            }
            catch (error) {
                log.warn('Unable to handle the bundle "%s" change:\n%s', bundleName, error.stack);
                this.emit('invalidBundle', bundle, error);
            }
        }
    }
}
exports.default = BundleManager;
/**
 * Returns the name of a bundle that owns a given path.
 * @param filePath {String} - The path of the file to extract a bundle name from.
 * @returns {String} - The name of the bundle that owns this path.
 * @private
 */
function extractBundleName(bundlesPath, filePath) {
    return filePath.replace(bundlesPath, '').split(path_1.default.sep)[1];
}
/**
 * Checks if a given path is the manifest file for a given bundle.
 * @param bundleName {String}
 * @param filePath {String}
 * @returns {Boolean}
 * @private
 */
function isManifest(bundleName, filePath) {
    return path_1.default.dirname(filePath).endsWith(bundleName) && path_1.default.basename(filePath) === 'package.json';
}
/**
 * Checks if a given path is in the .git dir of a bundle.
 * @param bundleName {String}
 * @param filePath {String}
 * @returns {Boolean}
 * @private
 */
function isGitData(bundleName, filePath) {
    const regex = new RegExp(`${bundleName}\\${path_1.default.sep}\\.git`);
    return regex.test(filePath);
}
/**
 * Determines which config file to use for a bundle.
 */
function loadBundleCfg(cfgDir, bundleName) {
    try {
        const cc = (0, cosmiconfig_1.cosmiconfigSync)('nodecg', {
            searchPlaces: [
                `${bundleName}.json`,
                `${bundleName}.yaml`,
                `${bundleName}.yml`,
                `${bundleName}.js`,
                `${bundleName}.config.js`,
            ],
            stopDir: cfgDir,
        });
        const result = cc.search(cfgDir);
        return result === null || result === void 0 ? void 0 : result.config;
    }
    catch (_) {
        throw new Error(`Config for bundle "${bundleName}" could not be read. Ensure that it is valid JSON, YAML, or CommonJS.`);
    }
}
//# sourceMappingURL=bundle-manager.js.map