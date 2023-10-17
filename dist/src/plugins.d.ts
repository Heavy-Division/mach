import { Plugin } from 'esbuild';
import { BuildLogger } from './logger';
import { Instrument } from './types';
/**
 * Override module resolution of specified imports.
 */
export declare const resolve: (options: {
    [module: string]: string;
}) => Plugin;
/**
 * Include specified CSS bundles in main bundle.
 */
export declare const includeCSS: (modules: string[]) => Plugin;
/**
 * Write `build_meta.json` files containing build data into the bundle directory.
 */
export declare const writeMetafile: Plugin;
/**
 * Export simulator packages to `PackageSources` directory
 */
export declare const writePackageSources: (logger: BuildLogger, instrument: Instrument) => Plugin;
