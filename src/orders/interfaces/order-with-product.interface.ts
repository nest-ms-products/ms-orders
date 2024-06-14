import { OrdersStatus } from '@prisma/client';
export interface OrderWithProducts {
  ordersItems: {
    name: string;
    productId: number;
    quantity: number;
    price: number;
  }[];
  id: string;
  totalAmount: number;
  totalItems: number;
  status: OrdersStatus;
  paid: boolean;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
