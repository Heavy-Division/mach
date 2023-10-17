import { BuildIncremental, LogLevel, Metafile, Plugin } from 'esbuild';
import { z } from 'zod';
export declare type BuildResultWithMeta = BuildIncremental & {
    metafile: Metafile;
};
interface PackageSettings {
    /**
     * Specifies type of instrument.
     * - `React` instruments will be created with a `BaseInstrument` harness that exposes an `MSFS_REACT_MOUNT` element for mounting.
     * - `BaseInstrument` instruments must specify the `instrumentId` and `mountElementId` to match the instrument configuration.
     */
    type: string;
    /** Final template filename. Defaults to `template` */
    fileName?: string;
    /** Simulator packages to import in the HTML template. */
    imports?: string[];
    htmlTemplate?: string;
}
interface ReactInstrumentPackageSettings extends PackageSettings {
    type: 'react';
    /** Optional parameter to specify template ID. Defaults to `Instrument.name`. */
    templateId?: string;
    /** Whether the instrument is interactive or not. Defaults to `true`. */
    isInteractive?: boolean;
}
interface BaseInstrumentPackageSettings extends PackageSettings {
    type: 'baseInstrument';
    /**
     * Required for `BaseInstrument` instruments.
     * This value must match the return value from the `BaseInstrument.templateID()` function.
     * */
    templateId: string;
    /**
     * Required for `BaseInstrument` instruments.
     * This value must match the ID in your call to `FSComponent.render()`..
     */
    mountElementId: string;
}
export interface Instrument {
    /** Instrument name, used as directory name for bundles and packages. */
    name: string;
    /** Entrypoint filename for instrument. */
    index: string;
    /** When passed a configuration object, enables a simulator package export. */
    simulatorPackage?: ReactInstrumentPackageSettings | BaseInstrumentPackageSettings;
    /** Instruments to import as ESM modules. */
    modules?: Instrument[];
    /** (Required for instruments included as `modules`) Import name to resolve to the bundled module. */
    resolve?: string;
    /** esbuild plugins to include for only this instrument (<https://github.com/esbuild/community-plugins>) */
    plugins?: Plugin[];
}
export interface MachConfig {
    /** Name of package, used for bundling simulator packages. */
    packageName: string;
    /** Path to directory containing `html_ui`. */
    packageDir: string;
    /** esbuild plugins to include for all instruments (<https://github.com/esbuild/community-plugins>) */
    plugins?: Plugin[];
    /** All instruments to be bundled by Mach. */
    instruments: Instrument[];
}
export declare const PluginSchema: z.ZodType<Plugin>;
export declare const InstrumentSchema: z.ZodType<Instrument>;
export declare const MachConfigSchema: z.ZodObject<{
    packageName: z.ZodString;
    packageDir: z.ZodString;
    plugins: z.ZodOptional<z.ZodArray<z.ZodType<Plugin, z.ZodTypeDef, Plugin>, "many">>;
    instruments: z.ZodArray<z.ZodType<Instrument, z.ZodTypeDef, Instrument>, "many">;
}, "strip", z.ZodTypeAny, {
    plugins?: Plugin[] | undefined;
    packageName: string;
    packageDir: string;
    instruments: Instrument[];
}, {
    plugins?: Plugin[] | undefined;
    packageName: string;
    packageDir: string;
    instruments: Instrument[];
}>;
export declare const ESBUILD_ERRORS: Record<string, LogLevel>;
export {};
