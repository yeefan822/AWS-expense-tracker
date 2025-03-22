export const listExpense = `
  query ListExpense {
    listExpenses {
      items {
        id
        userId
        amount
        category
        date
      }
    }
  }
`;