"use strict";
/*
 * SPDX-FileCopyrightText: 2022 Synaptic Simulations and its contributors
 * SPDX-License-Identifier: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESBUILD_ERRORS = exports.MachConfigSchema = exports.InstrumentSchema = exports.PluginSchema = void 0;
const zod_1 = require("zod");
exports.PluginSchema = zod_1.z.object({
    name: zod_1.z.string(),
    setup: zod_1.z.function()
        .args(zod_1.z.any())
        .returns(zod_1.z.union([zod_1.z.void(), zod_1.z.promise(zod_1.z.void())])),
});
exports.InstrumentSchema = zod_1.z.lazy(() => zod_1.z.object({
    name: zod_1.z.string(),
    index: zod_1.z.string(),
    simulatorPackage: zod_1.z.union([
        zod_1.z.object({
            type: zod_1.z.literal('react'),
            fileName: zod_1.z.string().optional(),
            templateName: zod_1.z.string().optional(),
            imports: zod_1.z.array(zod_1.z.string()).optional(),
            templateId: zod_1.z.string().optional(),
            isInteractive: zod_1.z.boolean().optional(),
            htmlTemplate: zod_1.z.string().optional(),
        }),
        zod_1.z.object({
            type: zod_1.z.literal('baseInstrument'),
            fileName: zod_1.z.string().optional(),
            templateName: zod_1.z.string().optional(),
            imports: zod_1.z.array(zod_1.z.string()).optional(),
            templateId: zod_1.z.string(),
            mountElementId: zod_1.z.string(),
            htmlTemplate: zod_1.z.string().optional(),
        }),
    ]).optional(),
    modules: zod_1.z.array(exports.InstrumentSchema).optional(),
    resolve: zod_1.z.string().optional(),
    plugins: zod_1.z.array(exports.PluginSchema).optional(),
    external: zod_1.z.array(zod_1.z.string()).optional(),
}));
exports.MachConfigSchema = zod_1.z.object({
    packageName: zod_1.z.string(),
    packageDir: zod_1.z.string(),
    plugins: zod_1.z.array(exports.PluginSchema).optional(),
    instruments: zod_1.z.array(exports.InstrumentSchema),
});
const ESBUILD_WARNINGS = [
    'assign-to-constant',
    'assign-to-import',
    'call-import-namespace',
    'commonjs-variable-in-esm',
    'delete-super-property',
    'duplicate-case',
    'duplicate-object-key',
    'empty-import-meta',
    'equals-nan',
    'equals-negative-zero',
    'equals-new-object',
    'html-comment-in-js',
    'impossible-typeof',
    'private-name-will-throw',
    'semicolon-after-return',
    'suspicious-boolean-not',
    'this-is-undefined-in-esm',
    'unsupported-dynamic-import',
    'unsupported-jsx-comment',
    'unsupported-regexp',
    'unsupported-require-call',
    'css-syntax-error',
    'invalid-@charset',
    'invalid-@import',
    'invalid-@nest',
    'invalid-@layer',
    'invalid-calc',
    'js-comment-in-css',
    'unsupported-@charset',
    'unsupported-@namespace',
    'unsupported-css-property',
    'ambiguous-reexport',
    'different-path-case',
    'ignored-bare-import',
    'ignored-dynamic-import',
    'import-is-undefined',
    'require-resolve-not-external',
    'invalid-source-mappings',
    'sections-in-source-map',
    'missing-source-map',
    'unsupported-source-map-comment',
    'package.json',
    'tsconfig.json',
];
exports.ESBUILD_ERRORS = Object.fromEntries(ESBUILD_WARNINGS.map((warning) => ([warning, 'error'])));
//# sourceMappingURL=types.js.map