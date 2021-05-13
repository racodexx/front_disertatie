import React from "react";
import AdminLayout from "../AdminLayout";
import OrdersList from "../orders/OrdersList";
const AdminOrders = () => {
  return (
    <AdminLayout>
      <OrdersList />
    </AdminLayout>
  );
};
export default AdminOrders;
