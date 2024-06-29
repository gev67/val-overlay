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
Object.defineProperty(exports, "__esModule", { value: true });
const json_1 = require("klona/json");
const logger_1 = __importDefault(require("../logger"));
const server_replicant_1 = __importDefault(require("./server-replicant"));
const util_1 = require("../util");
const uuid = __importStar(require("uuid"));
const db = __importStar(require("../database"));
const errors_1 = require("../../shared/utils/errors");
const log = (0, logger_1.default)('replicator');
class Replicator {
    constructor(io, repEntities) {
        this.io = io;
        this.declaredReplicants = new Map();
        this._uuid = uuid.v4();
        this._pendingSave = new WeakMap();
        this.io = io;
        io.on('connection', (socket) => {
            this._attachToSocket(socket);
        });
        this._repEntities = repEntities;
    }
    declare(name, namespace, opts) {
        // If replicant already exists, return that.
        const nsp = this.declaredReplicants.get(namespace);
        if (nsp) {
            const existing = nsp.get(name);
            if (existing) {
                existing.log.replicants('Existing replicant found, returning that instead of creating a new one.');
                return existing;
            }
        }
        else {
            this.declaredReplicants.set(namespace, new Map());
        }
        // Look up the persisted value, if any.
        let parsedPersistedValue;
        const repEnt = this._repEntities.find((re) => re.namespace === namespace && re.name === name);
        if (repEnt) {
            try {
                parsedPersistedValue = repEnt.value === '' ? undefined : JSON.parse(repEnt.value);
            }
            catch (_) {
                parsedPersistedValue = repEnt.value;
            }
        }
        // Make the replicant and add it to the declaredReplicants map
        const rep = new server_replicant_1.default(name, namespace, opts, parsedPersistedValue);
        this.declaredReplicants.get(namespace).set(name, rep);
        // Add persistence hooks
        rep.on('change', () => {
            this.saveReplicant(rep);
        });
        // Listen for server-side operations
        rep.on('operations', (data) => {
            this.emitToClients(rep, 'replicant:operations', data);
        });
        return rep;
    }
    /**
     * Applies an array of operations to a replicant.
     * @param replicant {object} - The Replicant to perform these operation on.
     * @param operations {array} - An array of operations.
     */
    applyOperations(replicant, operations) {
        const oldValue = (0, json_1.klona)(replicant.value);
        operations.forEach((operation) => replicant._applyOperation(operation));
        replicant.revision++;
        replicant.emit('change', replicant.value, oldValue, operations);
        this.emitToClients(replicant, 'replicant:operations', {
            name: replicant.name,
            namespace: replicant.namespace,
            revision: replicant.revision,
            operations,
        });
    }
    /**
     * Emits an event to all remote Socket.IO listeners.
     * @param namespace - The namespace in which to emit this event. Only applies to Socket.IO listeners.
     * @param eventName - The name of the event to emit.
     * @param data - The data to emit with the event.
     */
    emitToClients(replicant, eventName, data) {
        // Emit to clients (in the given namespace's room) using Socket.IO
        const namespace = `replicant:${replicant.namespace}:${replicant.name}`;
        log.replicants('emitting %s to %s:', eventName, namespace, JSON.stringify(data, undefined, 2));
        this.io.to(namespace).emit(eventName, data); // TODO: figure out how to type this properly
    }
    saveAllReplicants() {
        for (const replicants of this.declaredReplicants.values()) {
            for (const replicant of replicants.values()) {
                this.saveReplicant(replicant);
            }
        }
    }
    saveAllReplicantsNow() {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            for (const replicants of this.declaredReplicants.values()) {
                for (const replicant of replicants.values()) {
                    promises.push(this._saveReplicant(replicant));
                }
            }
            yield Promise.all(promises);
        });
    }
    saveReplicant(replicant) {
        if (!replicant.opts.persistent) {
            return;
        }
        (0, util_1.throttleName)(`${this._uuid}:${replicant.namespace}:${replicant.name}`, () => {
            this._saveReplicant(replicant).catch((error) => {
                log.error('Error saving replicant:', error);
            });
        }, replicant.opts.persistenceInterval);
    }
    _saveReplicant(replicant) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!replicant.opts.persistent) {
                return;
            }
            let valueChangedDuringSave = false;
            // Return the promise so that it can still be awaited
            if (this._pendingSave.has(replicant)) {
                return this._pendingSave.get(replicant);
            }
            try {
                const promise = new Promise((resolve, reject) => {
                    db.getConnection()
                        .then((db) => {
                        resolve(db.manager);
                    })
                        .catch(reject);
                }).then((manager) => {
                    let repEnt;
                    const exitingEnt = this._repEntities.find((pv) => pv.namespace === replicant.namespace && pv.name === replicant.name);
                    if (exitingEnt) {
                        repEnt = exitingEnt;
                    }
                    else {
                        repEnt = manager.create(db.Replicant, {
                            namespace: replicant.namespace,
                            name: replicant.name,
                        });
                        this._repEntities.push(repEnt);
                    }
                    return new Promise((resolve, reject) => {
                        const valueRef = replicant.value;
                        let serializedValue = JSON.stringify(valueRef);
                        if (typeof serializedValue === 'undefined') {
                            serializedValue = '';
                        }
                        const changeHandler = (newVal) => {
                            if (newVal !== valueRef && !isNaN(valueRef)) {
                                valueChangedDuringSave = true;
                            }
                        };
                        repEnt.value = serializedValue;
                        replicant.on('change', changeHandler);
                        manager
                            .save(repEnt)
                            .then(() => new Promise((resolve, reject) => {
                            if (!valueChangedDuringSave) {
                                resolve();
                                return;
                            }
                            // If we are here, then that means the value changed again during
                            // the save operation, and so we have to do some recursion
                            // to save it again.
                            this._pendingSave.delete(replicant);
                            this._saveReplicant(replicant).then(resolve).catch(reject);
                        }))
                            .then(() => {
                            resolve();
                        })
                            .catch(reject)
                            .finally(() => {
                            replicant.off('change', changeHandler);
                        });
                    });
                });
                this._pendingSave.set(replicant, promise);
                yield promise;
            }
            catch (error) {
                replicant.log.error('Failed to persist value:', (0, errors_1.stringifyError)(error));
            }
            finally {
                this._pendingSave.delete(replicant);
            }
        });
    }
    _attachToSocket(socket) {
        socket.on('replicant:declare', (data, cb) => {
            log.replicants('received replicant:declare', JSON.stringify(data, undefined, 2));
            try {
                const replicant = this.declare(data.name, data.namespace, data.opts);
                cb(undefined, {
                    value: replicant.value,
                    revision: replicant.revision,
                    schema: replicant.schema,
                    schemaSum: replicant.schemaSum,
                });
            }
            catch (e) {
                if (e.message.startsWith('Invalid value rejected for replicant')) {
                    cb(e.message, undefined);
                }
                else {
                    throw e;
                }
            }
        });
        socket.on('replicant:proposeOperations', (data, cb) => {
            log.replicants('received replicant:proposeOperations', JSON.stringify(data, undefined, 2));
            const serverReplicant = this.declare(data.name, data.namespace, data.opts);
            if (serverReplicant.schema && (!('schemaSum' in data) || data.schemaSum !== serverReplicant.schemaSum)) {
                log.replicants('Change request %s:%s had mismatched schema sum (ours %s, theirs %s), invoking callback with new schema and fullupdate', data.namespace, data.name, serverReplicant.schemaSum, 'schemaSum' in data ? data.schemaSum : '(no schema)');
                cb('Mismatched schema version, assignment rejected', {
                    schema: serverReplicant.schema,
                    schemaSum: serverReplicant.schemaSum,
                    value: serverReplicant.value,
                    revision: serverReplicant.revision,
                });
            }
            else if (serverReplicant.revision !== data.revision) {
                log.replicants('Change request %s:%s had mismatched revision (ours %s, theirs %s), invoking callback with fullupdate', data.namespace, data.name, serverReplicant.revision, data.revision);
                cb('Mismatched revision number, assignment rejected', {
                    value: serverReplicant.value,
                    revision: serverReplicant.revision,
                });
            }
            this.applyOperations(serverReplicant, data.operations);
        });
        socket.on('replicant:read', (data, cb) => {
            log.replicants('replicant:read', JSON.stringify(data, undefined, 2));
            const replicant = this.declare(data.name, data.namespace);
            if (typeof cb === 'function') {
                if (replicant) {
                    cb(undefined, replicant.value);
                }
                else {
                    cb(undefined, undefined);
                }
            }
        });
    }
}
exports.default = Replicator;
//# sourceMappingURL=replicator.js.map