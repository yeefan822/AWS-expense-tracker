<template>
  <header>
    <div class="logo">My Expense Tracker</div>

  </header>
  <div>


    <table v-if="expenses.length > 0" class="expense-table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Category</th>
        <th>Amount</th>
        <th>Date</th>
        <th> <button @click="showDialog = true" class="add-button-m1">Add Expense</button>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="expense in expenses" :key="expense.id">
        <td>{{ expense.id }}</td>
        <td>{{ expense.category }}</td>
        <td>{{ expense.amount }}</td>
        <td>{{ expense.date }}</td>
        <td class="text-right">
          <button @click="deleteExpense(expense.id)" class="px-3 py-1 bg-red-600 text-white rounded shadow hover:bg-red-700 transition add-button-m1">
            Delete
          </button>
        </td>
      </tr>
      </tbody>
    </table>
    <p v-else>No expenses found.</p>

    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog-content">
        <h2 class="dialog-title">Add Expense</h2>
        <form @submit.prevent="addExpense">
          <input type="date" v-model="newExpense.date" class="dialog-input" required />
          <input type="text" v-model="newExpense.category" placeholder="Category" class="dialog-input" required />
          <input type="number" step="any" min="0" v-model.number="newExpense.amount" placeholder="Amount" class="dialog-input" required />
          <div class="dialog-actions">
            <button type="button" @click="showDialog = false" class="dialog-cancel">Cancel</button>
            <button type="submit" class="dialog-submit">Add</button>
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
import { deleteExpense as deleteExpenseMutation } from '@/graphql/mutations';
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
      category: '',
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

    const deleteExpense = async (id) => {
      try {
        await client.graphql({
          query: deleteExpenseMutation,
          variables: { input: { id } }
        });
        expenses.value = expenses.value.filter(e => e.id !== id);
      } catch (error) {
        console.error("Failed to delete expense:", error);
      }
    };

    const addExpense = async () => {
      try {
        const user = await getCurrentUser();
        const userId = user?.userId || user?.username;

        const input = {
          userId,
          amount: parseFloat(newExpense.value.amount),
          category: newExpense.value.category,
          date: newExpense.value.date,
        };

        await client.graphql({
          query: createExpense,
          variables: { input },
        });

        newExpense.value = { amount: null, category: '', date: '' };
        await fetchExpenses(); // refresh list
      } catch (err) {
        console.error('Failed to add expense:', err);
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

    return {expenses, showDialog, newExpense, addExpense, deleteExpense};
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
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #2c3e50;
  color: white;
}
.expense-table {
  width: 100%;
  max-height: 50%;
  border-collapse: collapse;
  margin-top: 1rem;
  background-color: #34495e;
  color: #f5f5dc;
  border: 1px solid #bdc3c7;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.expense-table th,
.expense-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #7f8c8d;
}

.expense-table th {
  background-color: #2c3e50; /* 深色背景 */
  color: #ffe; /* 更亮的米色文字 */
  font-weight: 600;
}

.expense-table tr:hover {
  background-color: #3e556b;
}

.add-button-m1 {
  background-color: #f5f5dc;
  color: #2c3e50;
  border: none;
  padding: 10px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-button-m1:hover {
  background-color: #e8e1c1;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.add-button-m1:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background-color: #fffaf3; /* 柔和米色背景 */
  padding: 2rem;
  border-radius: 1.5rem; /* 更圆润的角 */
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3); /* 高级阴影 */
  width: 100%;
  max-width: 400px;
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
}

.dialog-input {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.75rem;
  font-size: 1rem;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.dialog-cancel {
  background-color: #ddd;
  color: #2c3e50;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dialog-cancel:hover {
  background-color: #ccc;
}

.dialog-submit {
  background-color: #2c3e50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dialog-submit:hover {
  background-color: #1f2a35;
}

</style>