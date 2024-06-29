"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Ours
const database_1 = require("../database");
const utils_1 = require("../database/utils");
const config_1 = require("../config");
/**
 * Express middleware that checks if the user is authenticated.
 */
function default_1(req, res, next) {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!((_a = config_1.config.login) === null || _a === void 0 ? void 0 : _a.enabled)) {
                next();
                return;
            }
            let { user } = req;
            let isUsingKeyOrSocketToken = false;
            let keyOrSocketTokenAuthenticated = false;
            if ((_b = req.query['key']) !== null && _b !== void 0 ? _b : req.cookies.socketToken) {
                isUsingKeyOrSocketToken = true;
                const database = yield (0, database_1.getConnection)();
                const apiKey = yield database.getRepository(database_1.ApiKey).findOne({
                    where: { secret_key: (_c = req.query['key']) !== null && _c !== void 0 ? _c : req.cookies.socketToken },
                    relations: ['user'],
                });
                // No record of this API Key found, reject the request.
                if (!apiKey) {
                    // Ensure we delete the existing cookie so that it doesn't become poisoned
                    // and cause an infinite login loop.
                    (_d = req.session) === null || _d === void 0 ? void 0 : _d.destroy(() => {
                        res.clearCookie('socketToken', {
                            secure: req.secure,
                            sameSite: req.secure ? 'none' : undefined,
                        });
                        res.clearCookie('connect.sid', { path: '/' });
                        res.clearCookie('io', { path: '/' });
                        res.redirect('/login');
                    });
                    return;
                }
                user = (_e = (yield (0, utils_1.findUser)(apiKey.user.id))) !== null && _e !== void 0 ? _e : undefined;
            }
            if (!user) {
                if (req.session) {
                    req.session.returnTo = req.url;
                }
                res.status(403).redirect('/login');
                return;
            }
            const allowed = (0, utils_1.isSuperUser)(user);
            keyOrSocketTokenAuthenticated = isUsingKeyOrSocketToken && allowed;
            const provider = user.identities[0].provider_type;
            const providerAllowed = (_g = (_f = config_1.config.login) === null || _f === void 0 ? void 0 : _f[provider]) === null || _g === void 0 ? void 0 : _g.enabled;
            if ((keyOrSocketTokenAuthenticated || req.isAuthenticated()) && allowed && providerAllowed) {
                let apiKey = user.apiKeys[0];
                // This should only happen if the database is manually edited, say, in the event of a security breach
                // that reavealed an API key that needed to be deleted.
                if (!apiKey) {
                    // Make a new api key.
                    const database = yield (0, database_1.getConnection)();
                    apiKey = database.manager.create(database_1.ApiKey);
                    yield database.manager.save(apiKey);
                    // Assign this key to the user.
                    user.apiKeys.push(apiKey);
                    yield database.manager.save(user);
                }
                // Set the cookie so that requests to other resources on the page
                // can also be authenticated.
                // This is crucial for things like OBS browser sources,
                // where we don't have a session.
                res.cookie('socketToken', apiKey.secret_key, {
                    secure: req.secure,
                    sameSite: req.secure ? 'none' : undefined,
                });
                next();
                return;
            }
            if (req.session) {
                req.session.returnTo = req.url;
            }
            res.status(403).redirect('/login');
            return;
        }
        catch (error) {
            next(error);
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=authcheck.js.map