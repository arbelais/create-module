import { existsSync, promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import * as z from 'zod';
import ora from 'ora';
import { logger } from '../utils/logger.js';
import {
    moduleTemplate,
    viewTemplate,
    routerTemplate,
} from '../utils/templates.js';
import { promptModuleName, promptOverwrite } from '../utils/prompt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const optsSchema = z.object({
    name: z.string().optional(),
    overwrite: z.boolean().default(false),
});

export async function createModule(
    name?: string,
    opts?: { overwrite: boolean }
): Promise<void> {
    try {
        const options = optsSchema.parse({ name, ...opts });

        let moduleName = options.name;

        if (!moduleName) {
            moduleName = await promptModuleName();
        }

        const capitalizedModuleName =
            moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

        const rootDir = process.cwd();
        const modulesPath = path.join(rootDir, 'src', 'modules');

        if (!modulesPath) {
            await fs.mkdir(modulesPath);
        }

        const modulePath = path.join(modulesPath, moduleName);

        const viewsPath = path.join(modulePath, 'views');
        const moduleViewPath = path.join(
            viewsPath,
            `${capitalizedModuleName}View.vue`
        );
        const moduleVuePath = path.join(modulePath, 'Module.vue');
        const routerPath = path.join(modulePath, 'router.ts');

        if (!existsSync(modulesPath)) {
            await fs.mkdir(modulesPath);
        }

        if (existsSync(modulePath)) {
            if (!options.overwrite) {
                const shouldOverwrite = await promptOverwrite();
                if (!shouldOverwrite) {
                    logger.info(
                        'Module creation canceled. Module already exists.'
                    );
                    return;
                }

                await fs.rm(modulePath, { recursive: true });
            }
        }

        await fs.mkdir(modulePath);
        await fs.mkdir(viewsPath);

        const spinner = ora(`Creating module "${moduleName}"`).start();
        try {
            const viewContent = viewTemplate.replace(
                '{{ ModuleName }}',
                capitalizedModuleName
            );

            const routerContent = routerTemplate.replace(
                /{{ ModuleName }}/g,
                capitalizedModuleName
            );

            await fs.writeFile(moduleViewPath, viewContent);
            await fs.writeFile(moduleVuePath, moduleTemplate);
            await fs.writeFile(routerPath, routerContent);

            spinner.succeed(`Module "${moduleName}" created successfully.`);
        } catch (error) {
            spinner.fail(`Failed to create module "${moduleName}".`);
            logger.error(error);
        }
    } catch (error) {
        logger.error(error);
    }
}

export const create = new Command()
    .name('create')
    .description('Create a new module')
    .argument('[name]', 'Module name')
    .option('-o, --overwrite', 'Overwrite existing module', false)
    .action(createModule);
