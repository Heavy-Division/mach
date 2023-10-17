"use strict";
/*
 * SPDX-FileCopyrightText: 2022 Synaptic Simulations and its contributors
 * SPDX-License-Identifier: MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildLogger = void 0;
/* eslint no-console: 0 */
const signale_1 = __importDefault(require("signale"));
const filesize_1 = require("filesize");
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
class BuildLogger {
    constructor(scope) {
        this.logger = new signale_1.default.Signale({
            scope,
            types: {
                file: { badge: ' ', label: 'file', color: 'blue', logLevel: 'info' },
                errorMessage: { badge: '', label: '', color: 'white', logLevel: 'error', stream: process.stderr },
                errorLocation: { badge: '→', label: '', color: 'white', logLevel: 'error', stream: process.stderr },
                warningMessage: { badge: '', label: '', color: 'white', logLevel: 'warning', stream: process.stderr },
                warningLocation: { badge: '→', label: '', color: 'white', logLevel: 'warning', stream: process.stderr },
            },
        });
    }
    buildComplete(name, time, result) {
        var _a, _b, _c, _d, _e, _f;
        if (result.warnings.length > 0) {
            this.logger.warn(`Built ${name} in ${chalk_1.default.yellowBright((time).toFixed(), 'ms')} —`, chalk_1.default.yellowBright(`${result.warnings.length} ${result.warnings.length === 1 ? 'warning' : 'warnings'}`));
        }
        else {
            this.logger.success(`Built ${name} in ${chalk_1.default.greenBright((time).toFixed(), 'ms')}`);
        }
        if (process.env.VERBOSE_OUTPUT === 'true') {
            for (const [file, meta] of Object.entries(result.metafile.outputs)) {
                this.logger.file(chalk_1.default.gray(`${file} — ${chalk_1.default.cyan((0, filesize_1.filesize)(meta.bytes))}`));
            }
        }
        console.log();
        if (result.warnings.length > 0) {
            for (const warning of result.warnings) {
                this.logger.errorMessage(chalk_1.default.yellowBright(`${warning.text} (${warning.id})`));
                this.logger.errorLocation(`at ${(_a = warning.location) === null || _a === void 0 ? void 0 : _a.file}:${(_b = warning.location) === null || _b === void 0 ? void 0 : _b.line}:${(_c = warning.location) === null || _c === void 0 ? void 0 : _c.column}`);
                if (warning.notes.length > 0) {
                    for (const note of warning.notes) {
                        this.logger.errorMessage(chalk_1.default.whiteBright(note.text));
                        this.logger.errorLocation(`at ${(_d = warning.location) === null || _d === void 0 ? void 0 : _d.file}:${(_e = warning.location) === null || _e === void 0 ? void 0 : _e.line}:${(_f = warning.location) === null || _f === void 0 ? void 0 : _f.column}`);
                    }
                }
                console.log();
            }
        }
    }
    buildFailed(errors) {
        var _a, _b, _c, _d, _e, _f;
        this.logger.error(`Build failed — ${chalk_1.default.redBright(errors.length, errors.length === 1 ? 'error' : 'errors')}\n`);
        for (const error of errors) {
            this.logger.errorMessage(chalk_1.default.redBright(`${error.text} (${error.id})`));
            this.logger.errorLocation(`at ${(_a = error.location) === null || _a === void 0 ? void 0 : _a.file}:${(_b = error.location) === null || _b === void 0 ? void 0 : _b.line}:${(_c = error.location) === null || _c === void 0 ? void 0 : _c.column}`);
            if (error.notes.length > 0) {
                for (const note of error.notes) {
                    this.logger.errorMessage(chalk_1.default.whiteBright(note.text));
                    this.logger.errorLocation(`at ${(_d = error.location) === null || _d === void 0 ? void 0 : _d.file}:${(_e = error.location) === null || _e === void 0 ? void 0 : _e.line}:${(_f = error.location) === null || _f === void 0 ? void 0 : _f.column}`);
                }
            }
            console.log();
        }
    }
    changeDetected(file) {
        console.clear();
        signale_1.default.watch(`Change detected in ${path_1.default.relative(process.cwd(), file)}, rebuilding\n`);
    }
}
exports.BuildLogger = BuildLogger;
//# sourceMappingURL=logger.js.map