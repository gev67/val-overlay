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
exports.isSuperUser = exports.upsertUser = exports.getSuperUserRole = exports.findUser = void 0;
const database_1 = require("../database");
const ApiKey_1 = require("./entity/ApiKey");
function findUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield (0, database_1.getConnection)();
        return database.getRepository(database_1.User).findOne({
            where: { id },
            relations: ['roles', 'identities', 'apiKeys'],
            cache: true,
        });
    });
}
exports.findUser = findUser;
function getSuperUserRole() {
    return __awaiter(this, void 0, void 0, function* () {
        const superUserRole = yield findRole('superuser');
        if (!superUserRole) {
            throw new Error('superuser role unexpectedly not found');
        }
        return superUserRole;
    });
}
exports.getSuperUserRole = getSuperUserRole;
function upsertUser({ name, provider_type, provider_hash, provider_access_token, provider_refresh_token, roles, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield (0, database_1.getConnection)();
        const { manager } = database;
        let user = null;
        // Check for ident that matches.
        // If found, it should have an associated user, so return that.
        // Else, make an ident and user.
        const existingIdent = yield findIdent(provider_type, provider_hash);
        if (existingIdent) {
            existingIdent.provider_access_token = provider_access_token !== null && provider_access_token !== void 0 ? provider_access_token : null;
            existingIdent.provider_refresh_token = provider_refresh_token !== null && provider_refresh_token !== void 0 ? provider_refresh_token : null;
            yield manager.save(existingIdent);
            user = yield findUserById(existingIdent.user.id);
        }
        else {
            const ident = yield createIdentity({
                provider_type,
                provider_hash,
                provider_access_token: provider_access_token !== null && provider_access_token !== void 0 ? provider_access_token : null,
                provider_refresh_token: provider_refresh_token !== null && provider_refresh_token !== void 0 ? provider_refresh_token : null,
            });
            const apiKey = yield createApiKey();
            user = manager.create(database_1.User, {
                name,
                identities: [ident],
                apiKeys: [apiKey],
            });
        }
        if (!user) {
            // Something went very wrong.
            throw new Error('Failed to find user after upserting.');
        }
        // Always update the roles, regardless of if we are making a new user or updating an existing one.
        user.roles = roles;
        return manager.save(user);
    });
}
exports.upsertUser = upsertUser;
function isSuperUser(user) {
    var _a;
    return Boolean((_a = user.roles) === null || _a === void 0 ? void 0 : _a.find((role) => role.name === 'superuser'));
}
exports.isSuperUser = isSuperUser;
function findRole(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield (0, database_1.getConnection)();
        const { manager } = database;
        return manager.findOne(database_1.Role, { where: { name }, relations: ['permissions'] });
    });
}
function createIdentity(identInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield (0, database_1.getConnection)();
        const { manager } = database;
        // See https://github.com/typeorm/typeorm/issues/9070
        const ident = manager.create(database_1.Identity, identInfo);
        return manager.save(ident);
    });
}
function createApiKey() {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield (0, database_1.getConnection)();
        const { manager } = database;
        const apiKey = manager.create(ApiKey_1.ApiKey);
        return manager.save(apiKey);
    });
}
function findIdent(type, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield (0, database_1.getConnection)();
        return database.getRepository(database_1.Identity).findOne({
            where: { provider_hash: hash, provider_type: type },
            relations: ['user'],
        });
    });
}
function findUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield (0, database_1.getConnection)();
        return database.getRepository(database_1.User).findOne({
            where: {
                id: userId,
            },
            relations: ['roles', 'identities', 'apiKeys'],
        });
    });
}
//# sourceMappingURL=utils.js.map