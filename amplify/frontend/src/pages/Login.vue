<template>
  <div>
    <h2>Login</h2>
    <input v-model="username" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="signIn">Login</button>
    <button @click="signUp">Register</button>
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

    const signInn = async () => {
      try {
        await signIn(username.value, password.value);
        alert('Login successful');
      } catch (error) {
        alert(error.message);
      }
    };

    const signUpp = async () => {
      const signInData = {
        username: 'testuser',
        password: 'Test@1234'};

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

    return { username, password, signIn, signUp };
  }
};
</script>

<style scoped>

</style>