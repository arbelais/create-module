export const moduleTemplate = `
<template>
    <RouterView />
</template>
`;

export const viewTemplate = `
<template>
    <main>
        <h1>{{ ModuleName }}</h1>
    </main>
</template>

<script setup lang="ts"></script>
`;

export const routerTemplate = `
import { RouteRecordRaw } from 'vue-router';

export const moduleRouteTemplate: RouteRecordRaw = {
    path: '/',
    name: '{{ ModuleName }}',
    component: () => import('./Module.vue'),
    children: [
        {
            path: '',
            name: '{{ ModuleName }}',
            component: () => import(./view/{{ ModuleName }}View.vue),
        },
    ],
};
`;
