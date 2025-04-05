<template>

  <div class="expense-page">
    <header>
      <div class="logo">Your expense</div>

    </header>

    <!-- Table to display expenses -->
    <table v-if="expenses.length > 0">
      <thead>
      <tr>
        <th>ID</th>
        <th>Category</th>
        <th>Amount</th>
        <th>Date</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="expense in expenses" :key="expense.id">
        <td>{{ expense.id }}</td>
        <td>{{ expense.category }}</td>
        <td>{{ expense.amount }}</td>
        <td>{{ expense.date }}</td>
      </tr>
      </tbody>
    </table>
    <p v-else>No expenses found.</p>

    <!-- Add Expense Button -->
    <button @click="showDialog = true">Add Expense</button>

    <!-- Modal for Adding Expense -->
    <div v-if="showDialog" class="modal">
      <div class="modal-content">
        <h3>Add a new expense</h3>
        <form @submit.prevent="addExpense">
          <div>
            <label for="userId">User ID:</label>
            <input type="text" v-model="newExpense.userId" id="userId" required />
          </div>
          <div>
            <label for="amount">Amount:</label>
            <input type="number" v-model="newExpense.amount" id="amount" required />
          </div>
          <div>
            <label for="category">Category:</label>
            <input type="text" v-model="newExpense.category" id="category" required />
          </div>
          <div>
            <label for="date">Date:</label>
            <input type="date" v-model="newExpense.date" id="date" required />
          </div>
          <button type="submit">Add Expense</button>
          <button type="button" @click="showDialog = false">Cancel</button>
        </form>
      </div>
    </div>

    <!-- Success or Error Message -->
    <p v-if="isSuccess" class="success-message">Expense added successfully!</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { generateClient } from 'aws-amplify/api';
import { createExpense } from '../graphql/mutations.js';
import { listExpenses } from '../graphql/queries.js';
import { getCurrentUser } from 'aws-amplify/auth';

export default {
  async setup() {
    const client = generateClient();
    const expenses = ref([]);
    const showDialog = ref(false);
    const isSuccess = ref(false);
    const errorMessage = ref('');
    const userId = ref(null);

    //const user = await getCurrentUser();


    // 绑定输入框的数据
    const newExpense = ref({
      userId: userId,
      amount: null,
      category: '',
      date: ''
    });

    // 获取数据库中的消费记录
    const fetchExpenses = async () => {
      try {
        const result = await client.graphql({query: listExpenses});
        expenses.value = result.data.listExpenses.items || [];
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    // 添加消费记录
    const addExpense = async () => {
      if (!newExpense.value.amount || !newExpense.value.category || !newExpense.value.date) {
        alert('Please fill in full details');
        return;
      }

      try {
        await client.graphql({
          query: createExpense,
          variables: {input: newExpense.value},
        });

        showDialog.value = false;
        isSuccess.value = true;
        errorMessage.value = '';
        newExpense.value = {userId: userId, amount: null, category: '', date: ''};
        await fetchExpenses();
      } catch (error) {
        console.error('Error adding expense:', error);
        isSuccess.value = false;
        errorMessage.value = '添加失败，请稍后重试';
      }
    };


    onMounted(async () => {
      try {
        const user = await getCurrentUser();
        userId.value = user.userId;

        newExpense.value.userId = user.userId;
        await fetchExpenses();
      } catch (error) {
        console.warn('用户未登录，跳转登录页或隐藏内容');

        window.location.href = '/login';
      }
    });

    return {
      expenses,
      newExpense,
      showDialog,
      addExpense,
      isSuccess,
      errorMessage,
      userId
    };
  }
};
</script>

<style scoped>
/* Page styles */

.expense-page {
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

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.success-message {
  color: green;
  font-weight: bold;
}

.error-message {
  color: red;
  font-weight: bold;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
}

input {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button[type="button"] {
  background-color: #f44336;
}

button[type="button"]:hover {
  background-color: #d32f2f;
}
</style>
