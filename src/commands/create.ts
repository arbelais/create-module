import { existsSync, promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url'; // Add this import
import { Command } from 'commander';
import * as z from 'zod';
import ora from 'ora';
import inquirer from 'inquirer';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url); // Add this line
const __dirname = path.dirname(__filename);

const optsSchema = z.object({
    name: z.string().optional(),
    overwrite: z.boolean().default(false),
});

async function promptModuleName(): Promise<string> {
    const answers: Record<string, string> = await inquirer.prompt([
        {
            type: 'input',
            name: 'moduleName',
            message: 'Enter the module name:',
        },
    ]);

    return answers.moduleName;
}

async function promptOverwrite(): Promise<boolean> {
    const answers: Record<string, boolean> = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'overwrite',
            message: 'Module already exists. Do you want to overwrite it?',
            default: false,
        },
    ]);

    return answers.overwrite;
}

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

        const modulePath = path.join(modulesPath, capitalizedModuleName);

        const viewsPath = path.join(modulePath, 'views');
        const moduleViewPath = path.join(
            viewsPath,
            `${capitalizedModuleName}View.vue`
        );
        const moduleVuePath = path.join(modulePath, 'Module.vue');
        const routerPath = path.join(modulePath, 'router.ts');

        // Templates
        const templatePath = path.join(rootDir, 'templates');
        const viewTemplatePath = path.join(templatePath, 'View.template.vue');
        const routerTemplatePath = path.join(
            templatePath,
            'router.template.ts'
        );
        const moduleVueTemplatePath = path.join(
            templatePath,
            'Module.template.vue'
        );

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
            const viewTemplateContent = await fs.readFile(
                viewTemplatePath,
                'utf8'
            );
            const viewContent = viewTemplateContent.replace(
                '{{ ModuleName }}',
                capitalizedModuleName
            );

            const routerTemplateContent = await fs.readFile(
                routerTemplatePath,
                'utf8'
            );
            const routerContent = routerTemplateContent.replace(
                /{{ ModuleName }}/g,
                capitalizedModuleName
            );

            const moduleVueTemplateContent = await fs.readFile(
                moduleVueTemplatePath,
                'utf8'
            );

            await fs.writeFile(moduleViewPath, viewContent);
            await fs.writeFile(moduleVuePath, moduleVueTemplateContent);
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
