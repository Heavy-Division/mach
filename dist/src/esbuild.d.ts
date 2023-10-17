import { BuildLogger } from './logger';
import { BuildResultWithMeta, Instrument, MachConfig } from './types';
export declare function buildInstrument(config: MachConfig, instrument: Instrument, logger: BuildLogger, module?: boolean): Promise<BuildResultWithMeta>;
export declare function watchInstrument(config: MachConfig, instrument: Instrument, logger: BuildLogger, module?: boolean): Promise<BuildResultWithMeta>;
