export const enum OrdersMessages {
  Create = 'CREATE_ORDER',
  FindAll = 'FIND_ALL_ORDERS',
  FindOne = 'FIND_ONE_ORDER',
  ChangeStatus = 'CHANGE_ORDER_STATUS',
  PaymentSuccess = 'PAYMENT_SUCCESS',
}

export const enum ProductMessages {
  Create = 'CREATE_PRODUCT',
  Update = 'UPDATE_PRODUCT',
  Delete = 'DELETE_PRODUCT',
  FindAll = 'FIND_ALL_PRODUCTS',
  FindOne = 'FIND_ONE_PRODUCT',
  ValidateProducts = 'VALIDATE_PRODUCTS',
}

export const enum PaymentsMessages {
  CreasteSession = 'CREATE_PAYMENT_SESSION',
}
