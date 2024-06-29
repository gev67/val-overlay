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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMiddleware = void 0;
const path = __importStar(require("node:path"));
const crypto = __importStar(require("node:crypto"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_steam_1 = __importDefault(require("passport-steam"));
const passport_local_1 = require("passport-local");
const connect_typeorm_1 = require("connect-typeorm");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const node_fetch_commonjs_1 = __importDefault(require("node-fetch-commonjs"));
const config_1 = require("../config");
const logger_1 = __importDefault(require("../logger"));
const database_1 = require("../database");
const utils_1 = require("../database/utils");
const rootPath_1 = require("../../shared/utils/rootPath");
const log = (0, logger_1.default)('login');
const protocol = ((_a = config_1.config.ssl) === null || _a === void 0 ? void 0 : _a.enabled) || (config_1.config.login.enabled && config_1.config.login.forceHttpsReturn) ? 'https' : 'http';
// Required for persistent login sessions.
// Passport needs ability to serialize and unserialize users out of session.
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        done(null, yield (0, utils_1.findUser)(id));
    }
    catch (error) {
        done(error);
    }
}));
if (config_1.config.login.enabled && ((_b = config_1.config.login.steam) === null || _b === void 0 ? void 0 : _b.enabled) && config_1.config.login.steam.apiKey) {
    const steamLoginConfig = config_1.config.login.steam;
    const apiKey = config_1.config.login.steam.apiKey;
    passport_1.default.use(new passport_steam_1.default({
        returnURL: `${protocol}://${config_1.config.baseURL}/login/auth/steam`,
        realm: `${protocol}://${config_1.config.baseURL}/login/auth/steam`,
        apiKey,
    }, (_, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        var _f;
        try {
            const roles = [];
            const allowed = (_f = steamLoginConfig === null || steamLoginConfig === void 0 ? void 0 : steamLoginConfig.allowedIds) === null || _f === void 0 ? void 0 : _f.includes(profile.id);
            if (allowed) {
                log.info('(Steam) Granting "%s" (%s) access', profile.id, profile.displayName);
                roles.push(yield (0, utils_1.getSuperUserRole)());
            }
            else {
                log.info('(Steam) Denying "%s" (%s) access', profile.id, profile.displayName);
            }
            const user = yield (0, utils_1.upsertUser)({
                name: profile.displayName,
                provider_type: 'steam',
                provider_hash: profile.id,
                roles,
            });
            done(undefined, user);
            return;
        }
        catch (error) {
            done(error);
        }
    })));
}
if (config_1.config.login.enabled && ((_c = config_1.config.login.twitch) === null || _c === void 0 ? void 0 : _c.enabled)) {
    const twitchLoginConfig = config_1.config.login.twitch;
    const TwitchStrategy = require('passport-twitch-helix').Strategy;
    // The "user:read:email" scope is required. Add it if not present.
    const scopesArray = twitchLoginConfig.scope.split(' ');
    if (!scopesArray.includes('user:read:email')) {
        scopesArray.push('user:read:email');
    }
    const concatScopes = scopesArray.join(' ');
    passport_1.default.use(new TwitchStrategy({
        clientID: twitchLoginConfig.clientID,
        clientSecret: twitchLoginConfig.clientSecret,
        callbackURL: `${protocol}://${config_1.config.baseURL}/login/auth/twitch`,
        scope: concatScopes,
        customHeaders: { 'Client-ID': twitchLoginConfig.clientID },
    }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        var _g, _h, _j;
        try {
            const roles = [];
            const allowed = (_h = (_g = twitchLoginConfig.allowedUsernames) === null || _g === void 0 ? void 0 : _g.includes(profile.username)) !== null && _h !== void 0 ? _h : (_j = twitchLoginConfig.allowedIds) === null || _j === void 0 ? void 0 : _j.includes(profile.id);
            if (allowed) {
                log.info('(Twitch) Granting %s access', profile.username);
                roles.push(yield (0, utils_1.getSuperUserRole)());
            }
            else {
                log.info('(Twitch) Denying %s access', profile.username);
            }
            const user = yield (0, utils_1.upsertUser)({
                name: profile.displayName,
                provider_type: 'twitch',
                provider_hash: profile.id,
                provider_access_token: accessToken,
                provider_refresh_token: refreshToken,
                roles,
            });
            done(undefined, user);
            return;
        }
        catch (error) {
            done(error);
        }
    })));
}
function makeDiscordAPIRequest(guild, userID) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield (0, node_fetch_commonjs_1.default)(`https://discord.com/api/v8/guilds/${guild.guildID}/members/${userID}`, {
            headers: {
                Authorization: `Bot ${guild.guildBotToken}`,
            },
        });
        const data = (yield res.json());
        if (res.status === 200) {
            return [guild, false, data];
        }
        return [guild, true, data];
    });
}
if (config_1.config.login.enabled && ((_d = config_1.config.login.discord) === null || _d === void 0 ? void 0 : _d.enabled)) {
    const discordLoginConfig = config_1.config.login.discord;
    const DiscordStrategy = require('passport-discord').Strategy;
    // The "identify" scope is required. Add it if not present.
    const scopeArray = discordLoginConfig.scope.split(' ');
    if (!scopeArray.includes('identify')) {
        scopeArray.push('identify');
    }
    // The "guilds" scope is required if allowedGuilds are used. Add it if not present.
    if (!scopeArray.includes('guilds') && discordLoginConfig.allowedGuilds) {
        scopeArray.push('guilds');
    }
    const scope = scopeArray.join(' ');
    passport_1.default.use(new DiscordStrategy({
        clientID: discordLoginConfig.clientID,
        clientSecret: discordLoginConfig.clientSecret,
        callbackURL: `${protocol}://${config_1.config.baseURL}/login/auth/discord`,
        scope,
    }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        var _k;
        if (!discordLoginConfig) {
            // Impossible but TS doesn't know that.
            done(new Error('Discord login config was impossibly undefined.'));
            return;
        }
        let allowed = false;
        if ((_k = discordLoginConfig.allowedUserIDs) === null || _k === void 0 ? void 0 : _k.includes(profile.id)) {
            // Users that are on allowedUserIDs are allowed
            allowed = true;
        }
        else if (discordLoginConfig.allowedGuilds) {
            // Get guilds that are specified in the config and that user is in
            const intersectingGuilds = discordLoginConfig.allowedGuilds.filter((allowedGuild) => profile.guilds.some((profileGuild) => profileGuild.id === allowedGuild.guildID));
            const guildRequests = [];
            for (const intersectingGuild of intersectingGuilds) {
                if (!intersectingGuild.allowedRoleIDs || intersectingGuild.allowedRoleIDs.length === 0) {
                    // If the user matches any guilds that only have member and not role requirements we do not need to make requests to the discord API
                    allowed = true;
                }
                else {
                    // Queue up all requests to the Discord API to improve speed
                    guildRequests.push(makeDiscordAPIRequest(intersectingGuild, profile.id));
                }
            }
            if (!allowed) {
                const guildsData = yield Promise.all(guildRequests);
                for (const [guildWithRoles, err, memberResponse] of guildsData) {
                    if (err) {
                        log.warn(`Got error while trying to get guild ${guildWithRoles.guildID} ` +
                            `(Make sure you're using the correct bot token and guild id): ${JSON.stringify(memberResponse)}`);
                        continue;
                    }
                    const intersectingRoles = guildWithRoles.allowedRoleIDs.filter((allowedRole) => memberResponse.roles.includes(allowedRole));
                    if (intersectingRoles.length > 0) {
                        allowed = true;
                        break;
                    }
                }
            }
        }
        else {
            allowed = false;
        }
        const roles = [];
        if (allowed) {
            log.info('(Discord) Granting %s#%s (%s) access', profile.username, profile.discriminator, profile.id);
            roles.push(yield (0, utils_1.getSuperUserRole)());
        }
        else {
            log.info('(Discord) Denying %s#%s (%s) access', profile.username, profile.discriminator, profile.id);
        }
        const user = yield (0, utils_1.upsertUser)({
            name: `${profile.username}#${profile.discriminator}`,
            provider_type: 'discord',
            provider_hash: profile.id,
            provider_access_token: accessToken,
            provider_refresh_token: refreshToken,
            roles,
        });
        done(undefined, user);
    })));
}
if (config_1.config.login.enabled && ((_e = config_1.config.login.local) === null || _e === void 0 ? void 0 : _e.enabled) && config_1.config.login.sessionSecret) {
    const { sessionSecret, local: { allowedUsers }, } = config_1.config.login;
    const hashes = crypto.getHashes();
    passport_1.default.use(new passport_local_1.Strategy({
        usernameField: 'username',
        passwordField: 'password',
        session: false,
    }, (username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        var _l;
        try {
            const roles = [];
            const foundUser = allowedUsers === null || allowedUsers === void 0 ? void 0 : allowedUsers.find((u) => u.username === username);
            let allowed = false;
            if (foundUser) {
                const match = /^([^:]+):(.+)$/.exec((_l = foundUser.password) !== null && _l !== void 0 ? _l : '');
                let expected = foundUser.password;
                let actual = password;
                if (match && hashes.includes(match[1])) {
                    expected = match[2];
                    actual = crypto.createHmac(match[1], sessionSecret).update(actual, 'utf8').digest('hex');
                }
                if (expected === actual) {
                    allowed = true;
                    roles.push(yield (0, utils_1.getSuperUserRole)());
                }
            }
            log.info('(Local) %s "%s" access', allowed ? 'Granting' : 'Denying', username);
            const user = yield (0, utils_1.upsertUser)({
                name: username,
                provider_type: 'local',
                provider_hash: username,
                roles,
            });
            done(undefined, user);
            return;
        }
        catch (error) {
            done(error);
        }
    })));
}
function createMiddleware(callbacks) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield (0, database_1.getConnection)();
        const sessionRepository = database.getRepository(database_1.Session);
        const app = (0, express_1.default)();
        const redirectPostLogin = (req, res) => {
            var _a, _b;
            const url = (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.returnTo) !== null && _b !== void 0 ? _b : '/dashboard';
            delete req.session.returnTo;
            res.redirect(url);
            app.emit('login', req.user);
            if (req.user)
                callbacks.onLogin(req.user);
        };
        if (!config_1.config.login.enabled || !config_1.config.login.sessionSecret) {
            throw new Error("no session secret defined, can't salt sessions, not safe, aborting");
        }
        app.use((0, cookie_parser_1.default)(config_1.config.login.sessionSecret));
        const sessionMiddleware = (0, express_session_1.default)({
            resave: false,
            saveUninitialized: false,
            store: new connect_typeorm_1.TypeormStore({
                cleanupLimit: 2,
                ttl: Infinity,
            }).connect(sessionRepository),
            secret: config_1.config.login.sessionSecret,
            cookie: {
                path: '/',
                httpOnly: true,
                secure: (_a = config_1.config.ssl) === null || _a === void 0 ? void 0 : _a.enabled,
            },
        });
        app.use(sessionMiddleware);
        app.use(passport_1.default.initialize());
        app.use(passport_1.default.session());
        app.use('/login', express_1.default.static(path.join(rootPath_1.nodecgRootPath, 'dist/login')));
        app.get('/login', (req, res) => {
            // If the user is already logged in, don't show them the login page again.
            if (req.user && (0, utils_1.isSuperUser)(req.user)) {
                res.redirect('/dashboard');
            }
            else {
                res.render(path.join(__dirname, 'views/login.tmpl'), {
                    user: req.user,
                    config: config_1.config,
                });
            }
        });
        app.get('/authError', (req, res) => {
            res.render(path.join(__dirname, 'views/authError.tmpl'), {
                message: req.query['message'],
                code: req.query['code'],
                viewUrl: req.query['viewUrl'],
            });
        });
        app.get('/login/steam', passport_1.default.authenticate('steam'));
        app.get('/login/auth/steam', passport_1.default.authenticate('steam', { failureRedirect: '/login' }), redirectPostLogin);
        app.get('/login/twitch', passport_1.default.authenticate('twitch'));
        app.get('/login/auth/twitch', passport_1.default.authenticate('twitch', { failureRedirect: '/login' }), redirectPostLogin);
        app.get('/login/discord', passport_1.default.authenticate('discord'));
        app.get('/login/auth/discord', passport_1.default.authenticate('discord', { failureRedirect: '/login' }), redirectPostLogin);
        app.get('/login/local', passport_1.default.authenticate('local'));
        app.post('/login/local', passport_1.default.authenticate('local', { failureRedirect: '/login' }), redirectPostLogin);
        app.get('/logout', (req, res) => {
            var _a;
            app.emit('logout', req.user);
            (_a = req.session) === null || _a === void 0 ? void 0 : _a.destroy(() => {
                res.clearCookie('connect.sid', { path: '/' });
                res.clearCookie('io', { path: '/' });
                res.clearCookie('socketToken', {
                    secure: req.secure,
                    sameSite: req.secure ? 'none' : undefined,
                });
                res.redirect('/login');
            });
            if (req.user)
                callbacks.onLogout(req.user);
        });
        return { app, sessionMiddleware };
    });
}
exports.createMiddleware = createMiddleware;
//# sourceMappingURL=index.js.map