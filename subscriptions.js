/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateExpense = /* GraphQL */ `
  subscription OnCreateExpense(
    $filter: ModelSubscriptionExpenseFilterInput
    $userId: String
  ) {
    onCreateExpense(filter: $filter, userId: $userId) {
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
export const onUpdateExpense = /* GraphQL */ `
  subscription OnUpdateExpense(
    $filter: ModelSubscriptionExpenseFilterInput
    $userId: String
  ) {
    onUpdateExpense(filter: $filter, userId: $userId) {
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
export const onDeleteExpense = /* GraphQL */ `
  subscription OnDeleteExpense(
    $filter: ModelSubscriptionExpenseFilterInput
    $userId: String
  ) {
    onDeleteExpense(filter: $filter, userId: $userId) {
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
