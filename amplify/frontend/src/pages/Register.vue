<template>
  <header>
    <div class="logo">My Expense Tracker</div>

  </header>
  <div class="login-container">
    <h2>Register</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />
      </div>

      <button @click="signUpp" class="login-btn">Sign up</button>
    </form>
    <p class="register-link">
      Don't have an account? <router-link to="/register">Register</router-link>
    </p>
  </div>
</template>


<script>
import { ref } from 'vue';
import { signIn } from 'aws-amplify/auth';
import { signUp } from 'aws-amplify/auth';

export default {
  setup() {
    const username = ref('');
    const password = ref('');



    const signUpp = async () => {
      try {
        await signUp({
          username: username.value,
          password: password.value,
          attributes: {
            email: `${username.value}@example.com`
          }
        });
        alert('Sign-up successful! Please confirm your email.');
      } catch (error) {
        alert(error.message);
      }
    };

    return { username, password, signUpp };
  }
};
</script>

<style scoped>
/* 登录页面整体居中 */
.login-container {
  max-width: 400px;
  margin: 120px auto; /* 顶部 120px 避免被悬浮的 nav 覆盖 */
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}
.logo {
  font-size: 24px;
  font-weight: bold;
}

header {
  display: flex;
  justify-content: space-between;  /* 使内容分布在左右两侧 */
  align-items: center;             /* 垂直居中对齐 */
  padding: 20px;
  background-color: #2c3e50;
  color: white;
}

/* 标题 */
h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

/* 输入框样式 */
.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  font-size: 14px;
  color: #333;
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

/* 按钮 */
.login-btn {
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: 0.3s;
}

.login-btn:hover {
  background-color: #2980b9;
}

/* 注册链接 */
.register-link {
  margin-top: 10px;
  font-size: 14px;
}

.register-link a {
  color: #3498db;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>