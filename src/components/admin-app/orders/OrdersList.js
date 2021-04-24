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
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";

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
  const filterVisibility_LS_KEY = "orders_list_filter_visibility";
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
  const toastRef = useRef(null);
  const dt = useRef(null);

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilterVisibility, setColumnFilterVisibility] = useState(false);
  const [columnFilterValues, setColumnFilterValues] = useState({
    _id: { value: "", matchMode: "contains" },
    date: { value: null, matchMode: "contains" },
    time: { value: null, matchMode: "contains" },
    summary: { value: "", matchMode: "contains" },
    phone: { value: null, matchMode: "contains" },
    price: { value: null, matchMode: "contains" },
    statusId: { value: "", matchMode: "in" },
  });

  useEffect(() => {
    loadFilterVisibility();
    loadOrders();
  }, []); // eslint-disable-line

  const loadFilterVisibility = () => {
    let visibility = localStorage.getItem(filterVisibility_LS_KEY);
    if (visibility) {
      setColumnFilterVisibility(JSON.parse(visibility));
    }
  };

  const getSummary = (order) => {
    let summary = "";
    if (order.products) {
      for (let item of order.products) {
        summary += item.quantity + "x" + item.product.name + " ";
      }
    }
    return summary;
  };

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
        order.summary = getSummary(item);
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

  const handleMoreFilters = () => {
    localStorage.setItem(filterVisibility_LS_KEY, !columnFilterVisibility);
    setColumnFilterVisibility(!columnFilterVisibility);
  };

  const onColumnFilterChange = (filterValue, field) => {
    let columnFilters = { ...columnFilterValues };
    columnFilters[field].value = filterValue;
    setColumnFilterValues(columnFilters);
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
        <div className="p-mr-5">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              type="search"
              onInput={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
            />
          </span>
        </div>
        <Button
          icon={`pi pi-filter` + (columnFilterVisibility ? "-slash" : "")}
          className="p-button-info p-mr-2"
          onClick={handleMoreFilters}
          tooltipOptions={{ position: "left" }}
          tooltip={"Filters"}
        />
        <Button
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
          tooltipOptions={{ position: "left" }}
          tooltip={"Export"}
        />
      </React.Fragment>
    );
  };

  const priceBodyTemplate = (rowData) => {
    return formatPrice(rowData.price);
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

  const renderFilter = (field, placeholder, options = false) => {
    return options ? (
      <MultiSelect
        className={"p-dropdown p-column-filter"}
        value={columnFilterValues[field].value}
        selectedItemsLabel={"Items"}
        options={options}
        onChange={(e) => onColumnFilterChange(e.target.value, field)}
        maxSelectedLabels={1}
        showClear
        placeholder={placeholder}
        appendTo={document.body}
        optionValue="id"
        optionLabel="name"
      />
    ) : (
      <InputText
        type="search"
        value={columnFilterValues[field].value}
        onChange={(e) => onColumnFilterChange(e.target.value, field)}
        placeholder={placeholder}
      />
    );
  };

  const renderDateFilter = (field) => {
    let currentDate = "";
    const currentValue = columnFilterValues[field].value;
    if (currentValue) {
      const day = parseInt(currentValue.substr(0, 2));
      const month = parseInt(currentValue.substr(3, 2)) - 1;
      const year = parseInt(currentValue.substr(6, 4));
      currentDate = new Date(year, month, day);
    }
    return (
      <Calendar
        id="basic"
        value={currentDate}
        dateFormat={"d-mm-yy"}
        onChange={(e) =>
          onColumnFilterChange(
            e.value ? moment(e.value).format("DD-MM-YYYY") : null,
            field
          )
        }
        appendTo={document.body}
        placeholder="Select date"
      />
    );
  };

  const idFilter = renderFilter("_id", "Search by Id");
  const dateFilter = renderDateFilter("date", "Search by date");
  const timeFilter = renderFilter("time", ["Search by time"]);
  const summaryFilter = renderFilter("summary", "Search by content");
  const phoneFilter = renderFilter("phone", "Search by phone");
  const priceFilter = renderFilter("price", "Search by price");
  const statusIdFilter = renderFilter(
    "statusId",
    "Search by status",
    OrderStatusSelection
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
          filters={columnFilterValues}
          // header={header}
          scrollable
          scrollHeight={`${
            CONTENT_HEIGHT - (columnFilterVisibility ? 342 : 270)
          }px`}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          <Column
            field="_id"
            header="Id"
            sortable
            filter={columnFilterVisibility}
            filterElement={idFilter}
          ></Column>
          <Column
            field="date"
            header="Date"
            sortable
            filter={columnFilterVisibility}
            filterElement={dateFilter}
          ></Column>
          <Column
            field="time"
            header="Time"
            sortable
            filter={columnFilterVisibility}
            filterElement={timeFilter}
          ></Column>
          <Column
            field="summary"
            header="Summary"
            sortable
            filterField="summary"
            filter={columnFilterVisibility}
            filterElement={summaryFilter}
          ></Column>
          <Column
            field="phone"
            header="Phone"
            sortable
            filter={columnFilterVisibility}
            filterElement={phoneFilter}
          ></Column>
          <Column
            field="price"
            header="Price"
            body={priceBodyTemplate}
            sortable
            filter={columnFilterVisibility}
            filterElement={priceFilter}
          ></Column>
          <Column
            field="statusId"
            header="Status"
            body={statusBodyTemplate}
            sortable
            filter={columnFilterVisibility}
            filterElement={statusIdFilter}
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
