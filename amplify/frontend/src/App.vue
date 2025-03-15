<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
</script>

<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/register">Register</router-link> |
      <router-link to="/expenses">Expenses</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style>
nav {
  padding: 10px;
  background: #f5f5f5;
}
nav a {
  margin-right: 10px;
  text-decoration: none;
  color: #333;
}
</style>
