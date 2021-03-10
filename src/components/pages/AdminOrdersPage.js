import React from "react";
import AdminLayout from "../admin-app/AdminLayout";
import OrdersList from "../admin-app/orders/OrdersList";
const AdminOrders = () => {
  return (
    <AdminLayout>
      <OrdersList />
    </AdminLayout>
  );
};
export default AdminOrders;
