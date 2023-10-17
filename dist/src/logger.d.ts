import { Message } from 'esbuild';
import { BuildResultWithMeta } from './types';
export declare class BuildLogger {
    private readonly logger;
    constructor(scope: string);
    buildComplete(name: string, time: number, result: BuildResultWithMeta): void;
    buildFailed(errors: Message[]): void;
    changeDetected(file: string): void;
}
