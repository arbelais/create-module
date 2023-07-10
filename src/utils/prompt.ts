import inquirer from 'inquirer';

export async function promptModuleName(): Promise<string> {
    const answers: Record<string, string> = await inquirer.prompt([
        {
            type: 'input',
            name: 'moduleName',
            message: 'Enter the module name:',
        },
    ]);

    return answers.moduleName;
}

export async function promptOverwrite(): Promise<boolean> {
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
