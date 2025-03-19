import './assets/main.css'
import router from './router';
import { createApp } from 'vue'
import App from './App.vue'
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';

Amplify.configure(awsExports);
const app = createApp(App)
app.use(router);
app.mount('#app');
