import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import moment from "moment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import {
  getOrders,
  deleteOrders,
  updateOrder,
} from "../../../services/orderService";
import OrderStatus from "../../../utils/enums/OrderStatus";
import OrderDetailsView from "./OrderDetailsView";
import { formatPrice, handleApiActionResult } from "../../../utils/util";
import { OrderStatusSelection } from "../../../utils/dataSelections";

const StatusEditIcon = styled.i`
  cursor: pointer;
  color: #061e38;
  margin-left: 8px;
`;

const OrdersList = () => {
  let emptyOrder = {
    id: null,
    name: "",
    image: null,
    description: "",
    category: null,
    price: 0,
    quantity: 0,
    statusId: OrderStatus.Pending,
  };

  const CONTENT_HEIGHT = window.innerHeight;

  const [orders, setOrders] = useState(null);
  const [orderDialog, setOrderDialog] = useState(false);
  const [deleteOrderDialog, setDeleteOrderDialog] = useState(false);
  const [deleteOrdersDialog, setDeleteOrdersDialog] = useState(false);
  const [updateStatusDialog, setUpdateStatusDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(emptyOrder);
  const [selectedOrders, setSelectedOrders] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toastRef = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    loadOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadOrders = async () => {
    let result = await getOrders();
    if (result && result.data && result.data.data && result.data.data.length) {
      let data = result.data.data;
      let orders = [];
      for (let item of data) {
        let order = { ...item };
        let date = moment(item.date).format("DD-MM-YYYY");
        let time = moment(item.date).format("HH:mm ");
        order.date = date;
        order.time = time;
        orders.push(order);
      }
      setOrders(orders);
    }
  };

  const openNew = () => {
    setSelectedOrder(emptyOrder);
    setSubmitted(false);
    setOrderDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setOrderDialog(false);
  };

  const hideDeleteOrderDialog = () => {
    setDeleteOrderDialog(false);
  };

  const hideDeleteOrdersDialog = () => {
    setDeleteOrdersDialog(false);
  };

  const hideUpdateStatusDialog = () => {
    setUpdateStatusDialog(false);
  };

  const onCategoryChange = (e) => {
    let _order = { ...selectedOrder };
    _order["category"] = e.value;
    setSelectedOrder(_order);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _order = { ...selectedOrder };
    _order[`${name}`] = val;

    setSelectedOrder(_order);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _order = { ...selectedOrder };
    _order[`${name}`] = val;

    setSelectedOrder(_order);
  };

  const saveOrder = () => {
    setSubmitted(true);

    if (selectedOrder.name.trim()) {
      let _orders = [...orders];
      let _order = { ...selectedOrder };
      if (selectedOrder.id) {
        const index = findIndexById(selectedOrder.id);

        _orders[index] = _order;
        toastRef.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Order Updated",
          life: 3000,
        });
      } else {
        _order.id = createId();
        _orders.push(_order);
        toastRef.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Order Created",
          life: 3000,
        });
      }

      setOrders(_orders);
      setOrderDialog(false);
      setSelectedOrder(emptyOrder);
    }
  };

  const showOrderdetails = (order) => {
    setSelectedOrder({ ...order });
    setOrderDialog(true);
  };

  const updateOrderStatus = (order) => {
    setSelectedOrder({ ...order });
    setUpdateStatusDialog(true);
  };

  const confirmDeleteOrder = (order) => {
    setSelectedOrder(order);
    setDeleteOrderDialog(true);
  };

  const deleteOrder = async () => {
    let result = await deleteOrders([selectedOrder._id]);
    let data = handleApiActionResult(result, toastRef);
    if (!data) {
      return;
    }

    let _orders = orders.filter((val) => val._id !== selectedOrder._id);
    setOrders(_orders);
    setDeleteOrderDialog(false);
    setSelectedOrder(emptyOrder);
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteOrdersDialog(true);
  };

  const deleteSelectedOrders = async () => {
    let result = await deleteOrders(selectedOrders.map((x) => x._id));
    let data = handleApiActionResult(result, toastRef);
    if (!data) {
      return;
    }

    let _orders = orders.filter((val) => !selectedOrders.includes(val));
    setOrders(_orders);
    setDeleteOrdersDialog(false);
    setSelectedOrders(null);
  };

  const updateStatusId = async () => {
    let result = await updateOrder({
      id: selectedOrder._id,
      statusId: selectedOrder.statusId,
    });
    let data = handleApiActionResult(result, toastRef);
    if (!data) {
      return;
    }

    let newOrders = [...orders];
    let updatedOrder = newOrders.find((x) => x._id === selectedOrder._id);
    updatedOrder.statusId = selectedOrder.statusId;
    setUpdateStatusDialog(false);
    setSelectedOrder(emptyOrder);
  };

  const statusOptionTemplate = (option) => {
    return (
      <div style={{ color: option.color, fontWeight: 500 }}>{option.name}</div>
    );
  };

  const onStatusChange = (e) => {
    let newState = { ...selectedOrder };
    newState.statusId = e.value;
    setSelectedOrder(newState);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success p-mr-2"
          onClick={openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedOrders || !selectedOrders.length}
        />
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <FileUpload
          mode="basic"
          accept="image/*"
          maxFileSize={1000000}
          label="Import"
          chooseLabel="Import"
          className="p-mr-2 p-d-inline-block"
        />
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
      </React.Fragment>
    );
  };

  const priceBodyTemplate = (rowData) => {
    return formatPrice(rowData.price);
  };

  const summaryBodyTemplate = (rowData) => {
    let summary = "";
    if (rowData.products) {
      for (let item of rowData.products) {
        summary += item.quantity + "x" + item.product.name + " ";
      }
    }
    return summary;
  };

  const statusBodyTemplate = (rowData) => {
    let currentStatus = OrderStatusSelection.find(
      (x) => x.id === rowData.statusId
    );
    return (
      <div>
        <span style={{ color: currentStatus.color, fontWeight: 500 }}>
          {currentStatus.name}
        </span>
        <StatusEditIcon
          className="pi pi-pencil"
          onClick={() => {
            updateOrderStatus(rowData);
          }}
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-search"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => showOrderdetails(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteOrder(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="p-m-0">Manage Orders</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );
  const orderDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveOrder}
      />
    </React.Fragment>
  );
  const deleteOrderDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteOrderDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteOrder}
      />
    </React.Fragment>
  );
  const deleteOrdersDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteOrdersDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedOrders}
      />
    </React.Fragment>
  );

  const updateStatusDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideUpdateStatusDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={updateStatusId}
      />
    </React.Fragment>
  );

  return (
    <div className="datatable-crud-demo">
      <Toast ref={toastRef} />

      <div className="card">
        <Toolbar
          className="p-mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}
          value={orders}
          selection={selectedOrders}
          onSelectionChange={(e) => setSelectedOrders(e.value)}
          dataKey="_id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
          globalFilter={globalFilter}
          header={header}
          scrollable
          scrollHeight={`${CONTENT_HEIGHT - 355}px`}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          <Column field="_id" header="Id" sortable></Column>
          <Column field="date" header="Date" sortable></Column>
          <Column field="time" header="Time" sortable></Column>
          <Column
            field="products"
            header="Summary"
            body={summaryBodyTemplate}
            sortable
          ></Column>
          <Column
            field="phone"
            header="Phone"
            // body={statusBodyTemplate}
            sortable
          ></Column>
          <Column
            field="price"
            header="Price"
            body={priceBodyTemplate}
            sortable
          ></Column>
          <Column
            field="statusId"
            header="Status"
            body={statusBodyTemplate}
            sortable
          ></Column>
          <Column body={actionBodyTemplate}></Column>
        </DataTable>
      </div>

      <Dialog
        visible={orderDialog}
        style={{ width: "850px" }}
        header="Order Details"
        modal
        className="p-fluid"
        footer={orderDialogFooter}
        onHide={hideDialog}
      >
        <OrderDetailsView order={selectedOrder}></OrderDetailsView>
      </Dialog>

      <Dialog
        visible={deleteOrderDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteOrderDialogFooter}
        onHide={hideDeleteOrderDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle p-mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedOrder && (
            <span>
              Are you sure you want to delete <b>{selectedOrder.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteOrdersDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteOrdersDialogFooter}
        onHide={hideDeleteOrdersDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle p-mr-3"
            style={{ fontSize: "2rem" }}
          />
          {selectedOrder && (
            <span>Are you sure you want to delete the selected products?</span>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={updateStatusDialog}
        style={{ width: "350px" }}
        contentStyle={{ height: "300px" }}
        header="Update order"
        modal
        footer={updateStatusDialogFooter}
        onHide={hideUpdateStatusDialog}
      >
        <div className="p-grid p-ai-center">
          <label className="p-col-4">Order status</label>
          <div className="p-col-8">
            <Dropdown
              value={selectedOrder.statusId}
              options={OrderStatusSelection}
              onChange={onStatusChange}
              optionValue="id"
              optionLabel="name"
              placeholder="Select a status"
              valueTemplate={statusOptionTemplate}
              itemTemplate={statusOptionTemplate}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default OrdersList;
