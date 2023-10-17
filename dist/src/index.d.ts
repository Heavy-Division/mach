import { MachConfig } from './types';
export declare function machBuild(conf: MachConfig, filter?: RegExp): Promise<void>;
export declare function machWatch(conf: MachConfig, filter?: RegExp): Promise<void>;
