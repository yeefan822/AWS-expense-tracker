import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/home.vue';
import Login from '@/pages/Login.vue';
import Register from '@/pages/Register.vue';
import Expense from "@/pages/Expense.vue";

const routes = [
    { path: '/home', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/expenses', component: Expense }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;