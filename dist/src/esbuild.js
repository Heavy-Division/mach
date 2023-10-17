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
exports.watchInstrument = exports.buildInstrument = void 0;
const esbuild_1 = __importDefault(require("esbuild"));
const chokidar_1 = __importDefault(require("chokidar"));
const path_1 = __importDefault(require("path"));
const plugins_1 = require("./plugins");
const types_1 = require("./types");
function build(config, instrument, logger, module = false) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const envVars = Object.fromEntries(Object.entries(process.env)
            .filter(([key]) => /^[A-Za-z_]*$/.test(key))
            .map(([key, value]) => {
            var _a;
            return ([
                `process.env.${key}`,
                (value === null || value === void 0 ? void 0 : value.toLowerCase()) === 'true' || (value === null || value === void 0 ? void 0 : value.toLowerCase()) === 'false'
                    ? value.toLowerCase()
                    : `"${(_a = value === null || value === void 0 ? void 0 : value.replace(/\\/g, '/').replace(/"/g, '\\"')) !== null && _a !== void 0 ? _a : ''}"`,
            ]);
        }));
        const buildOptions = {
            absWorkingDir: process.cwd(),
            entryPoints: [instrument.index],
            outfile: path_1.default.join(process.env.BUNDLES_DIR, instrument.name, module ? '/module/module.mjs' : 'bundle.js'),
            external: ['/Images/*', '/Fonts/*'],
            incremental: true,
            metafile: true,
            bundle: true,
            target: 'es2017',
            format: (module ? 'esm' : 'iife'),
            logLevel: 'silent',
            logOverride: process.env.WARNINGS_ERROR === 'true' ? types_1.ESBUILD_ERRORS : undefined,
            sourcemap: process.env.OUTPUT_SOURCEMAPS === 'true' ? 'inline' : undefined,
            minify: process.env.MINIFY_BUNDLES === 'true',
            plugins: [...((_a = config.plugins) !== null && _a !== void 0 ? _a : []), ...((_b = instrument.plugins) !== null && _b !== void 0 ? _b : [])],
            define: Object.assign(Object.assign({}, envVars), { 'process.env.MODULE': module.toString() }),
        };
        if (process.env.OUTPUT_METAFILE) {
            buildOptions.plugins.push(plugins_1.writeMetafile);
        }
        // Resolve submodules to their bundles
        if (instrument.modules) {
            buildOptions.plugins.push((0, plugins_1.resolve)(Object.fromEntries(instrument.modules.map((mod) => [
                mod.resolve,
                path_1.default.join(process.env.BUNDLES_DIR, mod.name, '/module/module.mjs'),
            ]))), (0, plugins_1.includeCSS)(instrument.modules.map((mod) => (path_1.default.join(process.env.BUNDLES_DIR, mod.name, '/module/module.css')))));
        }
        if (instrument.simulatorPackage && process.env.SKIP_SIM_PACKAGE !== 'true' && !module) {
            buildOptions.plugins.push((0, plugins_1.writePackageSources)(logger, instrument));
        }
        return esbuild_1.default.build(buildOptions);
    });
}
function buildInstrument(config, instrument, logger, module = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let moduleResults = [];
        // Recursively build included submodules
        if (instrument.modules) {
            moduleResults = yield Promise.all(instrument.modules.map((module) => buildInstrument(config, module, logger, true)));
            // Skip main instrument bundling if the submodule fails.
            for (const res of moduleResults) {
                if (res.errors.length > 0) {
                    return res;
                }
            }
            moduleResults.forEach((res) => { var _a; return (_a = res.rebuild) === null || _a === void 0 ? void 0 : _a.dispose(); });
        }
        const startTime = performance.now();
        const { success, result } = yield build(config, instrument, logger, module)
            .then((result) => ({
            success: true,
            result,
        }))
            .catch((result) => {
            logger.buildFailed(result.errors);
            return {
                success: false,
                result,
            };
        });
        const endTime = performance.now();
        if (success) {
            logger.buildComplete(instrument.name, endTime - startTime, result);
        }
        return result;
    });
}
exports.buildInstrument = buildInstrument;
function resolveFilename(input) {
    const cwdIndex = input.indexOf(process.cwd());
    return path_1.default.resolve(cwdIndex >= 0 ? input.slice(cwdIndex) : input);
}
function watchInstrument(config, instrument, logger, module = false) {
    return __awaiter(this, void 0, void 0, function* () {
        // Recursively watch included submodules
        if (instrument.modules) {
            yield Promise.all(instrument.modules.map((module) => watchInstrument(config, module, logger, true)));
        }
        let result = yield buildInstrument(config, instrument, logger, module);
        // Chokidar needs a list of files to watch, but we don't get the metafile on a failed build.
        if (result.errors.length > 0) {
            return result;
        }
        const builtFiles = Object.keys(result.metafile.inputs).map(resolveFilename);
        const watcher = chokidar_1.default.watch(builtFiles);
        watcher.on('change', (filePath) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            logger.changeDetected(filePath);
            const startTime = performance.now();
            const { success, res } = yield result.rebuild()
                .then((res) => ({
                success: true,
                res: res,
            }))
                .catch((res) => {
                logger.buildFailed(res.errors);
                return {
                    success: false,
                    res: res,
                };
            });
            const endTime = performance.now();
            if (success) {
                result = res;
                logger.buildComplete(instrument.name, endTime - startTime, result);
                const watchedFiles = watcher.getWatched();
                const bundledFiles = Object.keys(result.metafile.inputs).map(resolveFilename);
                // Watch files that have been added to the bundle
                for (const file of bundledFiles) {
                    if (!((_a = watchedFiles[path_1.default.dirname(file)]) === null || _a === void 0 ? void 0 : _a.includes(path_1.default.basename(file)))) {
                        watcher.add(file);
                    }
                }
                // Unwatch files that are no longer included in the bundle
                for (const [dir, files] of Object.entries(watchedFiles)) {
                    for (const file of files) {
                        const filePath = path_1.default.join(dir, file);
                        if (!bundledFiles.includes(filePath)) {
                            watcher.unwatch(filePath);
                        }
                    }
                }
            }
        }));
        return result;
    });
}
exports.watchInstrument = watchInstrument;
//# sourceMappingURL=esbuild.js.map