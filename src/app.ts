#!/usr/bin/env node
import { Command } from 'commander';

import { getPackageInfo } from './utils/get-package-info.js';
import { create } from './commands/create.js';

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

async function main() {
    const packageInfo = getPackageInfo();

    const program = new Command()
        .name('nc-vue-module')
        .description('Simple CLI tool for create new modules in Vue')
        .version(
            packageInfo.version ?? '1.0.0',
            '-v, --version',
            'display the version number'
        );

    program.addCommand(create);

    program.parse();
}

void main();
