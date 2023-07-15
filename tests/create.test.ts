import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { existsSync, promises as fs } from 'fs';
import * as path from 'path';
import { createModule } from '../src/commands/create.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
const MODULE_NAME = 'home';
const capitalizedModuleName =
    MODULE_NAME.charAt(0).toUpperCase() + MODULE_NAME.slice(1);
const rootDir = process.cwd();

describe('Create Module Command', () => {
    beforeEach(async () => {
        await createModule(MODULE_NAME);
    });

    afterEach(async () => {
        const modulePath = path.join(rootDir, 'src', 'modules');

        await fs.rm(modulePath, { recursive: true });
    });

    it('should create the module folder', async () => {
        const modulePath = path.join(rootDir, 'src', 'modules', MODULE_NAME);

        expect(existsSync(modulePath)).toBeTruthy();
    });

    it('the module folder should be in lowercase', async () => {
        const modulePath = path.join(rootDir, 'src', 'modules', MODULE_NAME);

        const expectedModulePath = path.join(
            rootDir,
            'src',
            'modules',
            MODULE_NAME.toLowerCase()
        );
        expect(modulePath.toLowerCase()).toBe(expectedModulePath.toLowerCase());
    });

    it('should create the views folder', async () => {
        const viewsPath = path.join(
            rootDir,
            'src',
            'modules',
            MODULE_NAME,
            'views'
        );

        expect(existsSync(viewsPath)).toBeTruthy();
    });

    it('should create the home view file', async () => {
        const homeViewPath = path.join(
            rootDir,
            'src',
            'modules',
            MODULE_NAME,
            'views',
            `${capitalizedModuleName}View.vue`
        );

        expect(existsSync(homeViewPath)).toBeTruthy();
    });

    it('the module view file should be capitalized', async () => {
        const homeViewPath = path.join(
            rootDir,
            'src',
            'modules',
            MODULE_NAME,
            'views',
            `${capitalizedModuleName}View.vue`
        );

        const expectedHomeViewPath = path.join(
            rootDir,
            'src',
            'modules',
            MODULE_NAME,
            'views',
            `${capitalizedModuleName}View.vue`
        );
        expect(homeViewPath.toString()).toBe(expectedHomeViewPath.toString());
    });

    it('should create the module Vue file', async () => {
        const moduleVuePath = path.join(
            rootDir,
            'src',
            'modules',
            MODULE_NAME,
            'Module.vue'
        );

        expect(existsSync(moduleVuePath)).toBeTruthy();
    });

    it('should create the router file', async () => {
        const routerPath = path.join(
            rootDir,
            'src',
            'modules',
            MODULE_NAME,
            'router.ts'
        );

        expect(existsSync(routerPath)).toBeTruthy();
    });
});
