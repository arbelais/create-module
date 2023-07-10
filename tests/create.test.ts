import { describe, expect, it } from 'vitest';
import { existsSync, promises as fs } from 'fs';
import * as path from 'path';
import { createModule } from '../src/commands/create.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
const MODULE_NAME = 'home';

describe('Create Module Command', () => {
    it('should create a new module with the correct structure', async () => {
        const moduleName =
            MODULE_NAME.charAt(0).toUpperCase() + MODULE_NAME.slice(1);
        const rootDir = process.cwd();

        const modulesPath = path.join(rootDir, 'src', 'modules');
        const modulePath = path.join(modulesPath, moduleName);
        const viewsPath = path.join(modulePath, 'views');
        const homeViewPath = path.join(viewsPath, `${moduleName}View.vue`);
        const moduleVuePath = path.join(modulePath, 'Module.vue');
        const routerPath = path.join(modulePath, 'router.ts');

        // Delete the module folder if it already exists
        if (existsSync(modulePath)) {
            await fs.rm(modulePath, { recursive: true });
        }

        await createModule(MODULE_NAME);

        expect(existsSync(modulePath)).toBeTruthy();
        expect(existsSync(viewsPath)).toBeTruthy();
        expect(existsSync(homeViewPath)).toBeTruthy();
        expect(existsSync(moduleVuePath)).toBeTruthy();
        expect(existsSync(routerPath)).toBeTruthy();

        // Read the content of the HomeView.vue file
        // const homeViewContent = await fs.readFile(homeViewPath, 'utf8');

        // Assert that the content contains the expected template content
        // expect(homeViewContent).toContain('<h1>{{ ModuleName }}</h1>');

        // Delete the module folder after the test
        await fs.rm(modulePath, { recursive: true });
    });
});
