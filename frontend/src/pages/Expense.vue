<template>
  <div class="expense-page">
    <h2>Your Expenses</h2>

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
import { listExpense } from '../graphql/queries.js';

export default {
  setup() {
    const client = generateClient();
    const expenses = ref([]);
    const showDialog = ref(false);

    // 绑定输入框的数据
    const newExpense = ref({
      userId: '',
      amount: null,
      category: '',
      date: ''
    });

    // 获取数据库中的消费记录
    const fetchExpenses = async () => {
      try {
        const result = await client.graphql({ query: listExpense });
        expenses.value = result.data.listExpenses.items || [];
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    // 添加消费记录
    const addExpense = async () => {
      if (!newExpense.value.amount || !newExpense.value.category || !newExpense.value.date) {
        alert('请填写完整信息');
        return;
      }

      try {
        await client.graphql({
          query: createExpense,
          variables: { input: newExpense.value },
        });

        showDialog.value = false;
        newExpense.value = { amount: '', category: '', date: '' };
        await fetchExpenses(); // 重新加载数据
      } catch (error) {
        console.error('Error adding expense:', error);
      }
    };

    // 组件加载时获取数据
    onMounted(fetchExpenses);

    return {
      expenses,
      newExpense,
      showDialog,
      addExpense
    };
  }
};
</script>

<style scoped>
/* Page styles */
.expense-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
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
