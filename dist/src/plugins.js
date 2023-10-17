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
exports.writePackageSources = exports.writeMetafile = exports.includeCSS = exports.resolve = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const template_file_1 = require("template-file");
/**
 * Override module resolution of specified imports.
 */
const resolve = (options) => ({
    name: 'resolve',
    setup(build) {
        build.onResolve({ filter: new RegExp(`^(${Object.keys(options).join('|')})$`) }, (args) => ({ path: options[args.path] }));
    },
});
exports.resolve = resolve;
/**
 * Include specified CSS bundles in main bundle.
 */
const includeCSS = (modules) => ({
    name: 'includeCSS',
    setup(build) {
        build.onEnd(() => {
            const cssPath = path_1.default.join(path_1.default.dirname(build.initialOptions.outfile), 'bundle.css');
            modules.map((mod) => __awaiter(this, void 0, void 0, function* () {
                const css = yield promises_1.default.readFile(mod);
                yield promises_1.default.appendFile(cssPath, css);
            }));
        });
    },
});
exports.includeCSS = includeCSS;
/**
 * Write `build_meta.json` files containing build data into the bundle directory.
 */
exports.writeMetafile = {
    name: 'writeMetafile',
    setup(build) {
        build.onEnd((result) => {
            if (process.env.OUTPUT_METAFILE && result.errors.length === 0) {
                promises_1.default.writeFile(path_1.default.join(path_1.default.dirname(build.initialOptions.outfile), 'build_meta.json'), JSON.stringify(result.metafile));
            }
        });
    },
};
/**
 * Export simulator packages to `PackageSources` directory
 */
const writePackageSources = (logger, instrument) => ({
    name: 'writePackageSources',
    setup(build) {
        build.onEnd((result) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            if (instrument.simulatorPackage && result.errors.length === 0) {
                const jsPath = path_1.default.join(path_1.default.dirname(build.initialOptions.outfile), 'bundle.js');
                const cssPath = path_1.default.join(path_1.default.dirname(build.initialOptions.outfile), 'bundle.css');
                const js = yield promises_1.default.readFile(jsPath, { encoding: 'utf-8' });
                const css = yield promises_1.default.readFile(cssPath, { encoding: 'utf-8' });
                const packageTarget = path_1.default.join(process.env.PACKAGE_DIR, 'html_ui/Pages/VCockpit/Instruments', process.env.PACKAGE_NAME, instrument.name);
                yield promises_1.default.mkdir(packageTarget, { recursive: true });
                const packagePath = path_1.default.join('/Pages/VCockpit/Instruments', process.env.PACKAGE_NAME, instrument.name);
                const fileName = (_a = instrument.simulatorPackage.fileName) !== null && _a !== void 0 ? _a : 'template';
                const templateId = (_b = instrument.simulatorPackage.templateId) !== null && _b !== void 0 ? _b : instrument.name;
                const htmlTemplate = (_c = instrument.simulatorPackage.htmlTemplate) !== null && _c !== void 0 ? _c : './templates/template.html';
                yield promises_1.default.writeFile(path_1.default.join(packageTarget, `${fileName}.css`), css);
                yield promises_1.default.writeFile(path_1.default.join(packageTarget, `${fileName}.js`), instrument.simulatorPackage.type === 'react'
                    ? yield (0, template_file_1.renderFile)(path_1.default.join(__dirname, './templates/reactTemplate.cjs'), {
                        templateId,
                        jsBundle: js,
                        instrumentName: `${process.env.PACKAGE_NAME.toLowerCase()}-${templateId.toLowerCase()}`,
                    })
                    : js);
                yield promises_1.default.writeFile(path_1.default.join(packageTarget, `${fileName}.html`), yield (0, template_file_1.renderFile)(path_1.default.join(__dirname, htmlTemplate), {
                    templateId,
                    mountElementId: instrument.simulatorPackage.type === 'react'
                        ? 'MSFS_REACT_MOUNT'
                        : instrument.simulatorPackage.mountElementId,
                    imports: (_d = instrument.simulatorPackage.imports) !== null && _d !== void 0 ? _d : [],
                    cssPath: path_1.default.join(packagePath, `${fileName}.css`).replace(/\\/g, '/'),
                    jsPath: path_1.default.join(packagePath, `${fileName}.js`).replace(/\\/g, '/'),
                }));
            }
        }));
    },
});
exports.writePackageSources = writePackageSources;
//# sourceMappingURL=plugins.js.map