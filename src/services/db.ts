export interface Order {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

class MockDB {
  private STORAGE_KEY = 'mock_db_orders';

  getOrders(): Order[] {
    const orders = localStorage.getItem(this.STORAGE_KEY);
    return orders ? JSON.parse(orders) : [];
  }

  addOrder(order: Order): void {
    const orders = this.getOrders();
    orders.push(order);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
    console.log('Order added to mock DB:', order);
  }
}

export const db = new MockDB();
