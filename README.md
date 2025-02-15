1. use node 20 and above
2. npm i
3. npm run dev
4. open http://localhost:3000
5. deployed version : https://order-management-rs.vercel.app/order

6. OrderManagementTable -

### **Performance**

1. Added pagination for efficient data handling when dealing with large volumes of data.
2. Added debounce to the search functionality to reduce server load during searches.

---

### **Trade-offs**

#### **Not handling global state while editing and adding new orders**

1. Fetching the order list again after editing and returning to the order page to display updated orders. Since we are only fetching 10 orders at a time, this could be improved using state managers like Redux or Zustand by updating the edited order. Same for creating new order we could add the new order to the start though it is o(n) it is still faster than network call.
2. Fetching the product list each time. This could be improved by caching the fetched product data in the browser. However, since we are unsure when product data changes in the database, this approach seems acceptable. If we are certain that the product data does not change frequently, we could cache it using localStorage or IndexedDB.
