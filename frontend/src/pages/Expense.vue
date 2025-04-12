<template>
  <header>
    <div class="logo">My Expense Tracker</div>

  </header>
  <div>
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
    <button @click="showDialog = true">Add Expense</button>
    <div v-if="showDialog" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-md w-96">
        <h2 class="text-xl font-semibold mb-4">Add Expense</h2>
        <form @submit.prevent="addExpense">
          <input type="date" v-model="newExpense.date" class="w-full mb-2 p-2 border rounded" required />
          <input type="text" v-model="newExpense.description" placeholder="Description" class="w-full mb-2 p-2 border rounded" required />
          <input type="number" v-model.number="newExpense.amount" placeholder="Amount" class="w-full mb-2 p-2 border rounded" required />
          <div class="flex justify-end gap-2">
            <button type="button" @click="showDialog = false" class="px-3 py-1 bg-gray-300 rounded">Cancel</button>
            <button type="submit" class="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import {onMounted, ref} from "vue";
import {getCurrentUser} from "aws-amplify/auth";
import { listExpenses } from '@/graphql/queries';
import { createExpense } from '@/graphql/mutations';
import { generateClient } from 'aws-amplify/api';
import {Amplify} from "aws-amplify";

export default {
  setup() {
    const client = generateClient({
      authMode: 'userPool'
    });
    const expenses = ref([]);
    const showDialog = ref(false);
    const loading = ref(true);
    const newExpense = ref({
      userId: null,
      date: '',
      description: '',
      amount: null,
    })

    console.log('Amplify Config', Amplify.getConfig());



    const fetchExpenses = async () => {
      try {
        const user = await getCurrentUser();
        const client = generateClient({ authMode: 'userPool' });

        const result = await client.graphql({
          query: listExpenses,
          variables: {
            filter: {
              userId: { eq: user.userId } // filter by userId if needed
            }
          }
        });

        expenses.value = result.data.listExpenses.items;
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
      }
    };

    const checkCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        console.log('Current user:', user);
        // user.username gives you the username
        // user.userId gives you the unique user ID (sub)
        return user;
      } catch (error) {
        console.log('No user is currently signed in');
        return null;
      }
    }
    onMounted(
        async () => {
          await fetchExpenses();
          await checkCurrentUser();
        }
    )

    return {expenses, showDialog, newExpense};
  }
}
</script>


<style scoped>
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
</style>