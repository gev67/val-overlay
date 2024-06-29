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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeCGServer = void 0;
// Minimal imports for first setup
const os = __importStar(require("os"));
const Sentry = __importStar(require("@sentry/node"));
const config_1 = require("../config");
require("../util/sentry-config");
const util_1 = require("../util");
if ((_a = config_1.config.sentry) === null || _a === void 0 ? void 0 : _a.enabled) {
    Sentry.init({
        dsn: config_1.config.sentry.dsn,
        serverName: os.hostname(),
        release: util_1.pjson.version,
    });
    Sentry.configureScope((scope) => {
        scope.setTags({
            nodecgHost: config_1.config.host,
            nodecgBaseURL: config_1.config.baseURL,
        });
    });
    process.on('unhandledRejection', (reason, p) => {
        console.error('Unhandled Rejection at:', p, 'reason:', reason);
        Sentry.captureException(reason);
    });
    console.info('[nodecg] Sentry enabled.');
}
// Native
const fs = require("fs");
const path = require("path");
// Packages
const body_parser_1 = __importDefault(require("body-parser"));
const json_1 = require("klona/json");
const lodash_debounce_1 = __importDefault(require("lodash.debounce"));
const express_1 = __importDefault(require("express"));
const lodash_template_1 = __importDefault(require("lodash.template"));
const fast_memoize_1 = __importDefault(require("fast-memoize"));
const express_transform_bare_module_specifiers_1 = __importDefault(require("express-transform-bare-module-specifiers"));
const compression_1 = __importDefault(require("compression"));
const socket_io_1 = __importDefault(require("socket.io"));
const passport_1 = __importDefault(require("passport"));
// Ours
const bundle_manager_1 = __importDefault(require("../bundle-manager"));
const logger_1 = __importDefault(require("../logger"));
const socketAuthMiddleware_1 = __importDefault(require("../login/socketAuthMiddleware"));
const socketApiMiddleware_1 = __importDefault(require("./socketApiMiddleware"));
const replicator_1 = __importDefault(require("../replicant/replicator"));
const db = __importStar(require("../database"));
const graphics_1 = __importDefault(require("../graphics"));
const dashboard_1 = require("../dashboard");
const mounts_1 = __importDefault(require("../mounts"));
const sounds_1 = __importDefault(require("../sounds"));
const assets_1 = require("../assets");
const shared_sources_1 = __importDefault(require("../shared-sources"));
const extensions_1 = __importDefault(require("./extensions"));
const sentry_config_1 = __importDefault(require("../util/sentry-config"));
const typed_emitter_1 = require("../../shared/typed-emitter");
const rootPath_1 = require("../../shared/utils/rootPath");
const nodecg_root_1 = require("../nodecg-root");
const renderTemplate = (0, fast_memoize_1.default)((content, options) => (0, lodash_template_1.default)(content)(options));
class NodeCGServer extends typed_emitter_1.TypedEmitter {
    constructor() {
        super();
        this.log = (0, logger_1.default)('server');
        this._app = (0, express_1.default)();
        this.mount = (...args) => this._app.use(...args);
        this.mount = this.mount.bind(this);
        /**
         * HTTP(S) server setup
         */
        const { _app: app } = this;
        let server;
        if (config_1.config.ssl.enabled && config_1.config.ssl.keyPath && config_1.config.ssl.certificatePath) {
            const sslOpts = {
                key: fs.readFileSync(config_1.config.ssl.keyPath),
                cert: fs.readFileSync(config_1.config.ssl.certificatePath),
            };
            if (config_1.config.ssl.passphrase) {
                sslOpts.passphrase = config_1.config.ssl.passphrase;
            }
            // If we allow HTTP on the same port, use httpolyglot
            // otherwise, standard https server
            server = config_1.config.ssl.allowHTTP
                ? require('httpolyglot').createServer(sslOpts, app)
                : require('https').createServer(sslOpts, app);
        }
        else {
            server = require('http').createServer(app);
        }
        /**
         * Socket.IO server setup.
         */
        this._io = new socket_io_1.default.Server(server);
        this._io.setMaxListeners(75); // Prevent console warnings when many extensions are installed
        this._io.on('error', (err) => {
            if (config_1.sentryEnabled) {
                Sentry.captureException(err);
            }
            this.log.error(err.stack);
        });
        this._server = server;
    }
    start() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const { _app: app, _server: server, log } = this;
            const io = this._io.of('/');
            log.info('Starting NodeCG %s (Running on Node.js %s)', util_1.pjson.version, process.version);
            const database = yield db.getConnection();
            if (config_1.sentryEnabled) {
                app.use(Sentry.Handlers.requestHandler());
            }
            // Set up Express
            app.use((0, compression_1.default)());
            app.use(body_parser_1.default.json());
            app.use(body_parser_1.default.urlencoded({ extended: true }));
            app.set('trust proxy', true);
            app.engine('tmpl', (filePath, options, callback) => {
                fs.readFile(filePath, (error, content) => {
                    if (error) {
                        return callback(error);
                    }
                    return callback(null, renderTemplate(content, options));
                });
            });
            if ((_a = config_1.config.login) === null || _a === void 0 ? void 0 : _a.enabled) {
                log.info('Login security enabled');
                const login = yield Promise.resolve().then(() => __importStar(require('../login')));
                const { app: loginMiddleware, sessionMiddleware } = yield login.createMiddleware({
                    onLogin: (user) => {
                        var _a;
                        // If the user had no roles, then that means they "logged in"
                        // with a third-party auth provider but weren't able to
                        // get past the login page because the NodeCG config didn't allow that user.
                        // At this time, we only tell extensions about users that are valid.
                        if (user.roles.length > 0) {
                            (_a = this._extensionManager) === null || _a === void 0 ? void 0 : _a.emitToAllInstances('login', user);
                        }
                    },
                    onLogout: (user) => {
                        var _a;
                        if (user.roles.length > 0) {
                            (_a = this._extensionManager) === null || _a === void 0 ? void 0 : _a.emitToAllInstances('logout', user);
                        }
                    },
                });
                app.use(loginMiddleware);
                // convert a connect middleware to a Socket.IO middleware
                const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
                io.use(wrap(sessionMiddleware));
                io.use(wrap(passport_1.default.initialize()));
                io.use(wrap(passport_1.default.session()));
                this._io.use(socketAuthMiddleware_1.default);
            }
            else {
                app.get('/login*', (_, res) => {
                    res.redirect('/dashboard');
                });
            }
            this._io.use(socketApiMiddleware_1.default);
            const bundlesPaths = [path.join(nodecg_root_1.NODECG_ROOT, 'bundles')].concat((_c = (_b = config_1.config.bundles) === null || _b === void 0 ? void 0 : _b.paths) !== null && _c !== void 0 ? _c : []);
            const cfgPath = path.join(nodecg_root_1.NODECG_ROOT, 'cfg');
            const bundleManager = new bundle_manager_1.default(bundlesPaths, cfgPath, util_1.pjson.version, config_1.config);
            // Wait for Chokidar to finish its initial scan.
            yield new Promise((resolve, reject) => {
                let handled = false;
                const timeout = setTimeout(() => {
                    if (handled)
                        return;
                    handled = true;
                    reject(new Error('Timed out while waiting for the bundle manager to become ready.'));
                }, 15000);
                if (bundleManager.ready) {
                    succeed();
                }
                else {
                    bundleManager.once('ready', () => {
                        succeed();
                    });
                }
                function succeed() {
                    if (handled)
                        return;
                    handled = true;
                    clearTimeout(timeout);
                    resolve();
                }
            });
            bundleManager.all().forEach((bundle) => {
                // TODO: remove this feature in v3
                if (bundle.transformBareModuleSpecifiers) {
                    log.warn(`${bundle.name} uses the deprecated "transformBareModuleSpecifiers" feature. ` +
                        'This feature will be removed in NodeCG v3. ' +
                        'Please migrate to using browser-native import maps instead: ' +
                        'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap');
                    const opts = {
                        rootDir: nodecg_root_1.NODECG_ROOT,
                        modulesUrl: `/bundles/${bundle.name}/node_modules`,
                    };
                    app.use(`/bundles/${bundle.name}/*`, (0, express_transform_bare_module_specifiers_1.default)(opts));
                }
            });
            // Only used by tests. Kinda gross. Sorry.
            this._bundleManager = bundleManager;
            log.trace(`Attempting to listen on ${config_1.config.host}:${config_1.config.port}`);
            server.on('error', (err) => {
                switch (err.code) {
                    case 'EADDRINUSE':
                        if (process.env.NODECG_TEST) {
                            return;
                        }
                        log.error(`Listen ${config_1.config.host}:${config_1.config.port} in use, is NodeCG already running? NodeCG will now exit.`);
                        break;
                    default:
                        log.error('Unhandled error!', err);
                        break;
                }
                this.emit('error', err);
            });
            if (config_1.sentryEnabled) {
                const sentryHelpers = new sentry_config_1.default(bundleManager);
                app.use(sentryHelpers.app);
            }
            const persistedReplicantEntities = yield database.getRepository(db.Replicant).find();
            const replicator = new replicator_1.default(io, persistedReplicantEntities);
            this._replicator = replicator;
            const graphics = new graphics_1.default(io, bundleManager, replicator);
            app.use(graphics.app);
            const dashboard = new dashboard_1.DashboardLib(bundleManager);
            app.use(dashboard.app);
            const mounts = new mounts_1.default(bundleManager.all());
            app.use(mounts.app);
            const sounds = new sounds_1.default(bundleManager.all(), replicator);
            app.use(sounds.app);
            const assets = (0, assets_1.createAssetsMiddleware)(bundleManager.all(), replicator);
            app.use('/assets', assets);
            const sharedSources = new shared_sources_1.default(bundleManager.all());
            app.use(sharedSources.app);
            if (config_1.sentryEnabled) {
                app.use(Sentry.Handlers.errorHandler());
            }
            // Fallthrough error handler,
            // Taken from https://docs.sentry.io/platforms/node/express/
            app.use((err, _req, res, _next) => {
                res.statusCode = 500;
                if (config_1.sentryEnabled) {
                    // The error id is attached to `res.sentry` to be returned
                    // and optionally displayed to the user for support.
                    res.end(`Internal error\nSentry issue ID: ${String(res.sentry)}\n`);
                }
                else {
                    res.end('Internal error');
                }
                this.log.error(err);
            });
            // Set up "bundles" Replicant.
            const bundlesReplicant = replicator.declare('bundles', 'nodecg', {
                schemaPath: path.resolve(rootPath_1.nodecgRootPath, 'schemas/bundles.json'),
                persistent: false,
            });
            const updateBundlesReplicant = (0, lodash_debounce_1.default)(() => {
                bundlesReplicant.value = (0, json_1.klona)(bundleManager.all());
            }, 100);
            bundleManager.on('ready', updateBundlesReplicant);
            bundleManager.on('bundleChanged', updateBundlesReplicant);
            bundleManager.on('gitChanged', updateBundlesReplicant);
            bundleManager.on('bundleRemoved', updateBundlesReplicant);
            updateBundlesReplicant();
            const extensionManager = new extensions_1.default(io, bundleManager, replicator, this.mount);
            this._extensionManager = extensionManager;
            this.emit('extensionsLoaded');
            (_d = this._extensionManager) === null || _d === void 0 ? void 0 : _d.emitToAllInstances('extensionsLoaded');
            // We intentionally wait until all bundles and extensions are loaded before starting the server.
            // This has two benefits:
            // 1) Prevents the dashboard/views from being opened before everything has finished loading
            // 2) Prevents dashboard/views from re-declaring replicants on reconnect before extensions have had a chance
            return new Promise((resolve) => {
                server.listen({
                    host: config_1.config.host,
                    port: process.env.NODECG_TEST ? undefined : config_1.config.port,
                }, () => {
                    var _a, _b;
                    if (process.env.NODECG_TEST) {
                        const addrInfo = server.address();
                        if (typeof addrInfo !== 'object' || addrInfo === null) {
                            throw new Error("couldn't get port number");
                        }
                        const { port } = addrInfo;
                        log.warn(`Test mode active, using automatic listen port: ${port}`);
                        config_1.config.port = port;
                        config_1.filteredConfig.port = port;
                        process.env.NODECG_TEST_PORT = String(port);
                    }
                    const protocol = ((_a = config_1.config.ssl) === null || _a === void 0 ? void 0 : _a.enabled) ? 'https' : 'http';
                    log.info('NodeCG running on %s://%s', protocol, config_1.config.baseURL);
                    this.emit('started');
                    (_b = this._extensionManager) === null || _b === void 0 ? void 0 : _b.emitToAllInstances('serverStarted');
                    resolve();
                });
            });
        });
    }
    stop() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this._extensionManager) === null || _a === void 0 ? void 0 : _a.emitToAllInstances('serverStopping');
            this._io.disconnectSockets(true);
            yield new Promise((resolve) => {
                // Also closes the underlying HTTP server.
                this._io.close(() => {
                    resolve();
                });
            });
            if (this._replicator) {
                this._replicator.saveAllReplicants();
            }
            this.emit('stopped');
        });
    }
    getExtensions() {
        var _a;
        return Object.assign({}, (_a = this._extensionManager) === null || _a === void 0 ? void 0 : _a.extensions);
    }
    getSocketIOServer() {
        return this._io;
    }
    saveAllReplicantsNow() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = this._replicator) === null || _a === void 0 ? void 0 : _a.saveAllReplicantsNow();
        });
    }
}
exports.NodeCGServer = NodeCGServer;
//# sourceMappingURL=index.js.map