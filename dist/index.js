#! /usr/bin/env node
"use strict";
/*
 * SPDX-FileCopyrightText: 2022 Synaptic Simulations and its contributors
 * SPDX-License-Identifier: MIT
 */
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
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
exports.machWatch = exports.machBuild = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const commander_1 = require("commander");
const signale_1 = __importDefault(require("signale"));
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const package_json_1 = require("./package.json");
const src_1 = require("./src");
const types_1 = require("./src/types");
try {
    dotenv_1.default.config();
}
catch (_a) {
    // .env is optional, but dotenv throws an error if it cannot load it
}
const cli = new commander_1.Command();
const commandWithOptions = (name) => cli.command(name)
    .option('-c, --config <filename>', 'specify path to configuration file', './mach.config.js')
    .option('-d, --work-in-config-dir', 'use config directory as working directory')
    .option('-b, --bundles <dirname>', 'bundles output directory', './bundles')
    .option('-e, --werror', 'makes all warnings into errors')
    .option('-f, --filter <regex>', 'regex filter of included instrument names')
    .option('-m, --minify', 'minify bundle code')
    .option('-s, --skip-simulator-package', 'skips writing simulator package templates')
    .option('-t, --output-metafile', 'output `build_meta.json` file to bundles directory')
    .option('-u, --output-sourcemaps', 'append sourcemaps to the end of bundle files')
    .option('-v, --verbose', 'output additional build information')
    .hook('preAction', (thisCommand, actionCommand) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f, _g, _h;
    signale_1.default.info(`Welcome to ${chalk_1.default.cyanBright('Mach')}, v${package_json_1.version}`);
    process.env.CONFIG_PATH = path_1.default.resolve(actionCommand.getOptionValue('config'));
    process.env.BUNDLES_DIR = path_1.default.resolve(actionCommand.getOptionValue('bundles'));
    process.env.WARNINGS_ERROR = (_b = actionCommand.getOptionValue('werror')) !== null && _b !== void 0 ? _b : false;
    process.env.MINIFY_BUNDLES = (_c = actionCommand.getOptionValue('minify')) !== null && _c !== void 0 ? _c : false;
    process.env.SKIP_SIM_PACKAGE = (_d = actionCommand.getOptionValue('skipSimulatorPackage')) !== null && _d !== void 0 ? _d : false;
    process.env.VERBOSE_OUTPUT = (_e = actionCommand.getOptionValue('verbose')) !== null && _e !== void 0 ? _e : false;
    process.env.OUTPUT_METAFILE = (_f = actionCommand.getOptionValue('outputMetafile')) !== null && _f !== void 0 ? _f : false;
    process.env.OUTPUT_SOURCEMAPS = (_g = actionCommand.getOptionValue('outputSourcemaps')) !== null && _g !== void 0 ? _g : false;
    process.env.WORK_IN_CONFIG_DIR = (_h = actionCommand.getOptionValue('workInConfigDir')) !== null && _h !== void 0 ? _h : false;
    actionCommand.setOptionValue('filter', new RegExp(actionCommand.getOptionValue('filter')));
    // Load config
    yield Promise.resolve().then(() => __importStar(require(process.env.CONFIG_PATH.replace(/\\/g, '/')))).then((module) => {
        // Check config integrity
        const result = types_1.MachConfigSchema.safeParse(module.default);
        if (result.success) {
            actionCommand.setOptionValue('config', result.data);
            signale_1.default.info('Loaded config file', chalk_1.default.cyanBright(process.env.CONFIG_PATH), '\n');
        }
        else {
            signale_1.default.error('Invalid config file', chalk_1.default.redBright(process.env.CONFIG_PATH));
            process.exit(1);
        }
        if (process.env.WORK_IN_CONFIG_DIR) {
            process.chdir(path_1.default.dirname(process.env.CONFIG_PATH));
        }
    })
        .catch(() => {
        signale_1.default.error('Unable to load config file', chalk_1.default.redBright(process.env.CONFIG_PATH));
        process.exit(1);
    });
}));
cli
    .name('mach')
    .version(package_json_1.version)
    .description(package_json_1.description);
commandWithOptions('build')
    .description('compile instruments specified in configuration file')
    .action(({ config, filter }) => (0, src_1.machBuild)(config, filter));
commandWithOptions('watch')
    .description('watch instruments for changes and re-compile bundles when updated')
    .action(({ config, filter }) => (0, src_1.machWatch)(config, filter));
cli.parse();
var src_2 = require("./src");
Object.defineProperty(exports, "machBuild", { enumerable: true, get: function () { return src_2.machBuild; } });
Object.defineProperty(exports, "machWatch", { enumerable: true, get: function () { return src_2.machWatch; } });
__exportStar(require("./src/types"), exports);
//# sourceMappingURL=index.js.map