<script setup>
import { ref } from 'vue';
</script>

<template>
  <div class="home">
    <header>
      <div class="logo">My Expense Tracker</div>
      
    </header>

    <main>
      <div class="welcome-section">
        <h1>Welcome to Your Expense Tracker</h1>
        <p>Keep track of your daily expenses with Jeff.com!</p>
        <router-link to="/login" class="cta-button">Get Started</router-link>
      </div>
    </main>

    <footer>
      <p>&copy; 2025 My Expense Tracker | All rights reserved.</p>
    </footer>
  </div>
</template>
<script>
import {onMounted, ref} from 'vue';
import { getCurrentUser } from 'aws-amplify/auth';

export default {
  setup() {
    const isLoggedIn = ref(false);
    const user = ref(null);
    onMounted(async ()=> {
      try{
        user.value = getCurrentUser();
        isLoggedIn.value = true;
      } catch (e) {
        isLoggedIn.value = false;
      }

    });


    return {isLoggedIn, user};
  }
}
</script>
<style scoped>
/* Resetting margin and padding for all elements */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f4f7fc;
  color: #333;
  height: 100%;
}

/* Home page container */
.home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 2500px;
}

/* Header styling */
header {
  display: flex;
  justify-content: space-between;  /* 使内容分布在左右两侧 */
  align-items: center;             /* 垂直居中对齐 */
  padding: 20px;
  background-color: #2c3e50;
  color: white;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

nav {
  display: flex;
  gap: 20px;
  background-color: transparent;
}

nav a {
  text-decoration: none;
  color: white;
  font-size: 18px;
}

nav a:hover {
  color: #3498db;
}
* {
  margin: 0 !important;
}
.nav-link {
  text-decoration: none;
  color: white;
  font-size: 18px;
  transition: color 0.3s;
}



/* Main content section */
main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ecf0f1;
  padding: 40px 0;
}

.welcome-section {
  text-align: center;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 900px; /* Limiting max width */
}

.welcome-section h1 {
  font-size: 36px;
  color: #2c3e50;
}

.welcome-section p {
  font-size: 18px;
  margin-bottom: 20px;
}

.cta-button {
  text-decoration: none;
  padding: 12px 24px;
  background-color: #3498db;
  color: white;
  font-size: 18px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #2980b9;
}

/* Footer styling */
footer {
  text-align: center;
  padding: 10px;
  background-color: #2c3e50;
  color: white;
  margin-top: 20px;
}
</style>
