export const createExpense = `
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      id
      userId
      amount
      category
      date
    }
  }
`;