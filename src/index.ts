import { BConfig } from './types';

export * from './shared/logger';
export * from './shared/solutions';
export * from './shared/util';

export function create(options: BConfig): BConfig {
    return options;
}
