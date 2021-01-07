import React from "react";
import AdminLayout from "../admin-app/AdminLayout";
import ProductsList from "../admin-app/products/ProductsList";
const AdminOrders = () => {
  return (
    <AdminLayout>
      <ProductsList />
    </AdminLayout>
  );
};
export default AdminOrders;
