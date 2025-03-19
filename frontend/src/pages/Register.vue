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
      Already have an account? <router-link to="/login">Sign in</router-link>
    </p>
  </div>
  <div v-if="onConfirm" class="dialog-overlay">
    <div class="dialog-box">
      <h3>Enter Verification Code</h3>
      <p>A verification code was sent to your email.</p>

      <input type="text" v-model="verificationCode" placeholder="Enter code" />
      <button @click="confirmSignup">Confirm</button>
      <button @click="onConfirm = false">Cancel</button>
    </div>
  </div>
</template>


<script>
import { ref } from 'vue';
import { signIn } from 'aws-amplify/auth';
import { signUp } from 'aws-amplify/auth';
import { confirmSignUp } from 'aws-amplify/auth';


export default {

  setup() {
    const email = ref('');
    const password = ref('');
    const verificationCode = ref('');
    const onConfirm = ref(false);



    const signUpp = async () => {
      try {
        console.log("Hi")
        console.log(email.value)
        await signUp({
          username: email.value,
          password: password.value,
          attributes: {
            email: email.value
          }
        });
        onConfirm.value = true;
      } catch (error) {
        alert(error.message);
      }
    };

    const confirmSignup = async () => {
      try {
        await confirmSignUp({
          username: email.value,
          confirmationCode: verificationCode.value
        });
        alert('Account confirmed successfully! You can now log in.');
        onConfirm.value = false;
      } catch (error) {
        alert(error.message);
      }
    };

    return { email, password, signUpp, onConfirm, confirmSignup, verificationCode };
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

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-box {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.dialog-box input {
  margin: 10px 0;
  padding: 8px;
  width: 80%;
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