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
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const json_schema_lib_1 = __importDefault(require("json-schema-lib"));
const json_1 = require("klona/json");
const hasha_1 = __importDefault(require("hasha"));
const replicants_shared_1 = require("../../shared/replicants.shared");
const schema_hacks_1 = __importDefault(require("./schema-hacks"));
const logger_1 = __importDefault(require("../logger"));
const compileJsonSchema_1 = require("../../shared/utils/compileJsonSchema");
const nodecg_root_1 = require("../nodecg-root");
/**
 * Never instantiate this directly.
 * Always use Replicator.declare instead.
 * The Replicator needs to have complete control over the ServerReplicant class.
 */
class ServerReplicant extends replicants_shared_1.AbstractReplicant {
    constructor(name, namespace, opts = {}, startingValue = undefined) {
        super(name, namespace, opts);
        /**
         * Server Replicants are immediately considered declared.
         * Client Replicants aren't considered declared until they have
         * fetched the current value from the server, which is an
         * async operation that takes time.
         */
        this.status = 'declared';
        this.log = (0, logger_1.default)(`Replicant/${namespace}.${name}`);
        // If present, parse the schema and generate the validator function.
        if (opts.schemaPath) {
            const absoluteSchemaPath = path.isAbsolute(opts.schemaPath)
                ? opts.schemaPath
                : path.join(nodecg_root_1.NODECG_ROOT, opts.schemaPath);
            if (fs.existsSync(absoluteSchemaPath)) {
                try {
                    const rawSchema = json_schema_lib_1.default.readSync(absoluteSchemaPath);
                    const parsedSchema = (0, schema_hacks_1.default)(rawSchema.root, rawSchema.rootFile, rawSchema.files);
                    if (!parsedSchema) {
                        throw new Error('parsed schema was unexpectedly undefined');
                    }
                    this.schema = parsedSchema;
                    this.schemaSum = (0, hasha_1.default)(JSON.stringify(parsedSchema), { algorithm: 'sha1' });
                    this.validate = this._generateValidator();
                }
                catch (e) {
                    /* istanbul ignore next */
                    if (!process.env.NODECG_TEST) {
                        this.log.error('Schema could not be loaded, are you sure that it is valid JSON?\n', e.stack);
                    }
                }
            }
        }
        let defaultValue = 'defaultValue' in opts ? opts.defaultValue : undefined;
        // Set the default value, if a schema is present and no default value was provided.
        if (this.schema && defaultValue === undefined) {
            defaultValue = (0, compileJsonSchema_1.getSchemaDefault)(this.schema, `${this.namespace}:${this.name}`);
        }
        // If `opts.persistent` is true and this replicant has a persisted value, try to load that persisted value.
        // Else, apply `defaultValue`.
        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        if (opts.persistent && typeof startingValue !== 'undefined' && startingValue !== null) {
            if (this.validate(startingValue, { throwOnInvalid: false })) {
                this._value = (0, replicants_shared_1.proxyRecursive)(this, startingValue, '/');
                this.log.replicants('Loaded a persisted value:', startingValue);
            }
            else if (this.schema) {
                this._value = (0, replicants_shared_1.proxyRecursive)(this, (0, compileJsonSchema_1.getSchemaDefault)(this.schema, `${this.namespace}:${this.name}`), '/');
                this.log.replicants('Discarded persisted value, as it failed schema validation. Replaced with defaults from schema.');
            }
        }
        else {
            if (this.schema && defaultValue !== undefined) {
                this.validate(defaultValue);
            }
            if (defaultValue === undefined) {
                this.log.replicants('Declared "%s" in namespace "%s"\n', name, namespace);
            }
            else {
                this._value = (0, replicants_shared_1.proxyRecursive)(this, (0, json_1.klona)(defaultValue), '/');
                this.log.replicants('Declared "%s" in namespace "%s" with defaultValue:\n', name, namespace, defaultValue);
            }
        }
    }
    get value() {
        return this._value;
    }
    set value(newValue) {
        if (newValue === this._value) {
            this.log.replicants('value unchanged, no action will be taken');
            return;
        }
        this.validate(newValue);
        this.log.replicants('running setter with', newValue);
        const clonedNewVal = (0, json_1.klona)(newValue);
        this._addOperation({
            path: '/',
            method: 'overwrite',
            args: {
                newValue: clonedNewVal,
            },
        });
        (0, replicants_shared_1.ignoreProxy)(this);
        this._value = (0, replicants_shared_1.proxyRecursive)(this, newValue, '/');
        (0, replicants_shared_1.resumeProxy)(this);
    }
    /**
     * Refer to the abstract base class' implementation for details.
     * @private
     */
    _addOperation(operation) {
        this._operationQueue.push(operation);
        if (!this._pendingOperationFlush) {
            this._oldValue = (0, json_1.klona)(this.value);
            this._pendingOperationFlush = true;
            process.nextTick(() => {
                this._flushOperations();
            });
        }
    }
    /**
     * Refer to the abstract base class' implementation for details.
     * @private
     */
    _flushOperations() {
        this._pendingOperationFlush = false;
        if (this._operationQueue.length <= 0)
            return;
        this.revision++;
        this.emit('operations', {
            name: this.name,
            namespace: this.namespace,
            operations: this._operationQueue,
            revision: this.revision,
        });
        const opQ = this._operationQueue;
        this._operationQueue = [];
        this.emit('change', this.value, this._oldValue, opQ);
    }
}
exports.default = ServerReplicant;
//# sourceMappingURL=server-replicant.js.map