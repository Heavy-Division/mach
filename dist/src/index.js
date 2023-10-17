"use strict";
/*
 * SPDX-FileCopyrightText: 2022 Synaptic Simulations and its contributors
 * SPDX-License-Identifier: MIT
 */
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
exports.machWatch = exports.machBuild = void 0;
const path_1 = __importDefault(require("path"));
const signale_1 = __importDefault(require("signale"));
const chalk_1 = __importDefault(require("chalk"));
const esbuild_1 = require("./esbuild");
const logger_1 = require("./logger");
function configureEnvironment(conf) {
    var _a, _b, _c;
    process.env.CONFIG_PATH = (_a = process.env.CONFIG_PATH) !== null && _a !== void 0 ? _a : path_1.default.join(process.cwd(), 'mach.config.js');
    process.env.BUNDLES_DIR = (_b = process.env.BUNDLES_DIR) !== null && _b !== void 0 ? _b : path_1.default.join(process.cwd(), 'bundles');
    process.env.OUTPUT_METAFILE = (_c = process.env.OUTPUT_METAFILE) !== null && _c !== void 0 ? _c : false;
    process.env.PACKAGE_NAME = conf.packageName;
    process.env.PACKAGE_DIR = path_1.default.join(process.cwd(), conf.packageDir);
}
function machBuild(conf, filter) {
    return __awaiter(this, void 0, void 0, function* () {
        configureEnvironment(conf);
        const instruments = conf.instruments.filter((instrument) => { var _a; return (_a = filter === null || filter === void 0 ? void 0 : filter.test(instrument.name)) !== null && _a !== void 0 ? _a : true; });
        signale_1.default.start(`Building ${instruments.length} instruments\n`);
        const startTime = performance.now();
        Promise.all(instruments.map((instrument) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield (0, esbuild_1.buildInstrument)(conf, instrument, new logger_1.BuildLogger(instrument.name));
            (_a = result.rebuild) === null || _a === void 0 ? void 0 : _a.dispose();
            return result;
        }))).then((results) => {
            const stopTime = performance.now();
            const successCount = results.filter((res) => res.errors.length === 0).length;
            if (successCount > 0) {
                signale_1.default.success(`Built ${results.filter((res) => res.errors.length === 0).length} instruments in`, chalk_1.default.greenBright(`${(stopTime - startTime).toFixed()} ms`), '\n');
            }
            else {
                signale_1.default.error(`All ${instruments.length} instruments failed to build`);
            }
            if (successCount < instruments.length) {
                process.exit(1);
            }
        });
    });
}
exports.machBuild = machBuild;
function machWatch(conf, filter) {
    return __awaiter(this, void 0, void 0, function* () {
        configureEnvironment(conf);
        const instruments = conf.instruments.filter((instrument) => { var _a; return (_a = filter === null || filter === void 0 ? void 0 : filter.test(instrument.name)) !== null && _a !== void 0 ? _a : true; });
        Promise.all(instruments.map((instrument) => (0, esbuild_1.watchInstrument)(conf, instrument, new logger_1.BuildLogger(instrument.name)))).then((results) => {
            if (results.some((res) => res.errors.length > 0)) {
                signale_1.default.error('Watch mode requires a build-able bundle to initialize');
                process.exit(1);
            }
            signale_1.default.watch('Watching for changes\n');
        });
    });
}
exports.machWatch = machWatch;
//# sourceMappingURL=index.js.map