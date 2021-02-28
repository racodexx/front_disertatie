import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";

import { getOrders } from "../../../services/orderService";
import OrderStatus from "../../../utils/enums/OrderStatus";
import OrderStatusSelection from "../../../utils/dataSelections";

const OrdersList = () => {
  let emptyOrder = {
    id: null,
    name: "",
    image: null,
    description: "",
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: "INSTOCK",
  };

  const CONTENT_HEIGHT = window.innerHeight;

  const [orders, setOrders] = useState(null);
  const [orderDialog, setOrderDialog] = useState(false);
  const [deleteOrderDialog, setDeleteOrderDialog] = useState(false);
  const [deleteOrdersDialog, setDeleteOrdersDialog] = useState(false);
  const [order, setOrder] = useState(emptyOrder);
  const [selectedOrders, setSelectedOrders] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    loadOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadOrders = async () => {
    let result = await getOrders();
    if (result && result.data && result.data.data && result.data.data.length) {
      setOrders(result.data.data);
    }
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const openNew = () => {
    setOrder(emptyOrder);
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

  const hideDeleteOrderssDialog = () => {
    setDeleteOrdersDialog(false);
  };

  const onCategoryChange = (e) => {
    let _order = { ...order };
    _order["category"] = e.value;
    setOrder(_order);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _order = { ...order };
    _order[`${name}`] = val;

    setOrder(_order);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _order = { ...order };
    _order[`${name}`] = val;

    setOrder(_order);
  };

  const saveOrder = () => {
    setSubmitted(true);

    if (order.name.trim()) {
      let _orders = [...orders];
      let _order = { ...order };
      if (order.id) {
        const index = findIndexById(order.id);

        _orders[index] = _order;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Order Updated",
          life: 3000,
        });
      } else {
        _order.id = createId();
        _orders.push(_order);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Order Created",
          life: 3000,
        });
      }

      setOrders(_orders);
      setOrderDialog(false);
      setOrder(emptyOrder);
    }
  };

  const editOrder = (order) => {
    setOrder({ ...order });
    setOrderDialog(true);
  };

  const confirmDeleteOrder = (order) => {
    setOrder(order);
    setDeleteOrderDialog(true);
  };

  const deleteOrder = () => {
    let _orders = orders.filter((val) => val.id !== order.id);
    setOrder(_orders);
    setDeleteOrderDialog(false);
    setOrder(emptyOrder);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Order Deleted",
      life: 3000,
    });
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

  const deleteSelectedOrders = () => {
    let _orders = orders.filter((val) => !selectedOrders.includes(val));
    setOrders(_orders);
    setDeleteOrdersDialog(false);
    setSelectedOrders(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Orders Deleted",
      life: 3000,
    });
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
    return formatCurrency(rowData.price);
  };

  const summaryBodyTemplate = (rowData) => {
    let summary = "";
    if (rowData.products) {
      for (let item of rowData.products) {
        let product = JSON.parse(item);
        summary += product.quantity + "x" + product.name + " ";
      }
    }
    return summary;
  };

  const statusBodyTemplate = (rowData) => {
    let statusName = "";
    let color = "";
    switch (rowData.statusId) {
      case OrderStatus.Pending:
        statusName = "In pending";
        color = "red";
        break;
      case OrderStatus.InProgress:
        statusName = "In progress";
        color = "orange";
        break;
      case OrderStatus.Finalized:
        statusName = "Finalized";
        color = "green";
        break;
      default:
        statusName = "Error";
        break;
    }
    return <strong style={{ color }}>{statusName}</strong>;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => editOrder(rowData)}
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
        onClick={hideDeleteOrderssDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedOrders}
      />
    </React.Fragment>
  );

  return (
    <div className="datatable-crud-demo">
      <Toast ref={toast} />

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
          dataKey="id"
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
          <Column
            field="products"
            header="Summary"
            body={summaryBodyTemplate}
            sortable
          ></Column>
          <Column
            field="price"
            header="Price"
            body={priceBodyTemplate}
            sortable
          ></Column>
          <Column
            field="phone"
            header="Phone"
            // body={statusBodyTemplate}
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
        style={{ width: "450px" }}
        header="Order Details"
        modal
        className="p-fluid"
        footer={orderDialogFooter}
        onHide={hideDialog}
      >
        <div className="p-field">
          <label htmlFor="name">Name</label>
          <InputText
            id="name"
            value={order.name}
            onChange={(e) => onInputChange(e, "name")}
            required
            autoFocus
          />
          {submitted && !order.name && (
            <small className="p-invalid">Name is required.</small>
          )}
        </div>
        <div className="p-field">
          <label htmlFor="description">Description</label>
          <InputTextarea
            id="description"
            value={order.description}
            onChange={(e) => onInputChange(e, "description")}
            required
            rows={3}
            cols={20}
          />
        </div>

        <div className="p-field">
          <label className="p-mb-3">Category</label>
          <div className="p-formgrid p-grid">
            <div className="p-field-radiobutton p-col-6">
              <RadioButton
                inputId="category1"
                name="category"
                value="Accessories"
                onChange={onCategoryChange}
                checked={order.category === "Accessories"}
              />
              <label htmlFor="category1">Accessories</label>
            </div>
            <div className="p-field-radiobutton p-col-6">
              <RadioButton
                inputId="category2"
                name="category"
                value="Clothing"
                onChange={onCategoryChange}
                checked={order.category === "Clothing"}
              />
              <label htmlFor="category2">Clothing</label>
            </div>
            <div className="p-field-radiobutton p-col-6">
              <RadioButton
                inputId="category3"
                name="category"
                value="Electronics"
                onChange={onCategoryChange}
                checked={order.category === "Electronics"}
              />
              <label htmlFor="category3">Electronics</label>
            </div>
            <div className="p-field-radiobutton p-col-6">
              <RadioButton
                inputId="category4"
                name="category"
                value="Fitness"
                onChange={onCategoryChange}
                checked={order.category === "Fitness"}
              />
              <label htmlFor="category4">Fitness</label>
            </div>
          </div>
        </div>

        <div className="p-formgrid p-grid">
          <div className="p-field p-col">
            <label htmlFor="price">Price</label>
            <InputNumber
              id="price"
              value={order.price}
              onValueChange={(e) => onInputNumberChange(e, "price")}
              mode="currency"
              currency="USD"
              locale="en-US"
            />
          </div>
          <div className="p-field p-col">
            <label htmlFor="quantity">Quantity</label>
            <InputNumber
              id="quantity"
              value={order.quantity}
              onValueChange={(e) => onInputNumberChange(e, "quantity")}
              integeronly
            />
          </div>
        </div>
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
          {order && (
            <span>
              Are you sure you want to delete <b>{order.name}</b>?
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
        onHide={hideDeleteOrderssDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle p-mr-3"
            style={{ fontSize: "2rem" }}
          />
          {order && (
            <span>Are you sure you want to delete the selected products?</span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default OrdersList;
