/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getExpense = /* GraphQL */ `
  query GetExpense($id: ID!) {
    getExpense(id: $id) {
      id
      userId
      amount
      category
      date
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listExpenses = /* GraphQL */ `
  query ListExpenses(
    $filter: ModelExpenseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listExpenses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        amount
        category
        date
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const getMonthlyExpenses = /* GraphQL */ `
    query GetMonthlyExpenses {
        getMonthlyExpenses {
            total
            __typename
        }
    }
`;

