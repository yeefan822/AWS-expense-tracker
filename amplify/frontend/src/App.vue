<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
</script>

<template>
  <div class="appp">

    <router-view />
    <div>
      <nav>
        <router-link to="/home">Home</router-link>
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
        <router-link to="/expenses">Expenses</router-link>
      </nav>



    </div>
  </div>

</template>

<style>


nav {
  position: fixed; /* Fixes the nav bar in place */
  top: 20px;       /* Adjust from top */
  right: 20px;     /* Adjust from right */
  background-color: transparent; /* Optional: transparent background */
  padding: 10px 20px;
  border-radius: 5px;
  display: flex;
  gap: 20px;
}

nav a {
  text-decoration: none;
  color: white;
  font-size: 18px;
}

nav a:hover {
  color: #3498db;
}

.appp{
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 2500px;
  background: #ecf0f1;
}

</style>
