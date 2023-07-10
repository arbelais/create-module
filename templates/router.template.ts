import { type RouteRecordRaw } from 'vue-router';

const moduleRoute: RouteRecordRaw = {
    path: '/',
    name: '{{ ModuleName }}',
    component: () => import('./Module.vue'),
    children: [
        {
            path: '',
            name: '{{ ModuleName }}',
            component: () => import('./view/{{ ModuleName }}View.vue'),
        },
    ],
};

export default moduleRoute;
