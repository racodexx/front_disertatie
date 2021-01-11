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

const OrdersList = () => {
  let emptyProduct = {
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
  const [orderDialog, setProductDialog] = useState(false);
  const [deleteOrderDialog, setDeleteProductDialog] = useState(false);
  const [deleteOrdersDialog, setDeleteProductsDialog] = useState(false);
  const [order, setOrder] = useState(emptyProduct);
  const [selectedOrders, setSelectedOrders] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    setOrders(
      JSON.parse(
        '[{"id":"1000","code":"f230fh0g3","name":"Bamboo Watch","description":"Product Description","image":"bamboo-watch.jpg","price":65,"category":"Accessories","quantity":24,"inventoryStatus":"INSTOCK","rating":5},{"id":"1001","code":"nvklal433","name":"Black Watch","description":"Product Description","image":"black-watch.jpg","price":72,"category":"Accessories","quantity":61,"inventoryStatus":"INSTOCK","rating":4},{"id":"1002","code":"zz21cz3c1","name":"Blue Band","description":"Product Description","image":"blue-band.jpg","price":79,"category":"Fitness","quantity":2,"inventoryStatus":"LOWSTOCK","rating":3},{"id":"1003","code":"244wgerg2","name":"Blue T-Shirt","description":"Product Description","image":"blue-t-shirt.jpg","price":29,"category":"Clothing","quantity":25,"inventoryStatus":"INSTOCK","rating":5},{"id":"1004","code":"h456wer53","name":"Bracelet","description":"Product Description","image":"bracelet.jpg","price":15,"category":"Accessories","quantity":73,"inventoryStatus":"INSTOCK","rating":4},{"id":"1005","code":"av2231fwg","name":"Brown Purse","description":"Product Description","image":"brown-purse.jpg","price":120,"category":"Accessories","quantity":0,"inventoryStatus":"OUTOFSTOCK","rating":4},{"id":"1006","code":"bib36pfvm","name":"Chakra Bracelet","description":"Product Description","image":"chakra-bracelet.jpg","price":32,"category":"Accessories","quantity":5,"inventoryStatus":"LOWSTOCK","rating":3},{"id":"1007","code":"mbvjkgip5","name":"Galaxy Earrings","description":"Product Description","image":"galaxy-earrings.jpg","price":34,"category":"Accessories","quantity":23,"inventoryStatus":"INSTOCK","rating":5},{"id":"1008","code":"vbb124btr","name":"Game Controller","description":"Product Description","image":"game-controller.jpg","price":99,"category":"Electronics","quantity":2,"inventoryStatus":"LOWSTOCK","rating":4},{"id":"1009","code":"cm230f032","name":"Gaming Set","description":"Product Description","image":"gaming-set.jpg","price":299,"category":"Electronics","quantity":63,"inventoryStatus":"INSTOCK","rating":3},{"id":"1010","code":"plb34234v","name":"Gold Phone Case","description":"Product Description","image":"gold-phone-case.jpg","price":24,"category":"Accessories","quantity":0,"inventoryStatus":"OUTOFSTOCK","rating":4},{"id":"1011","code":"4920nnc2d","name":"Green Earbuds","description":"Product Description","image":"green-earbuds.jpg","price":89,"category":"Electronics","quantity":23,"inventoryStatus":"INSTOCK","rating":4},{"id":"1012","code":"250vm23cc","name":"Green T-Shirt","description":"Product Description","image":"green-t-shirt.jpg","price":49,"category":"Clothing","quantity":74,"inventoryStatus":"INSTOCK","rating":5},{"id":"1013","code":"fldsmn31b","name":"Grey T-Shirt","description":"Product Description","image":"grey-t-shirt.jpg","price":48,"category":"Clothing","quantity":0,"inventoryStatus":"OUTOFSTOCK","rating":3},{"id":"1014","code":"waas1x2as","name":"Headphones","description":"Product Description","image":"headphones.jpg","price":175,"category":"Electronics","quantity":8,"inventoryStatus":"LOWSTOCK","rating":5},{"id":"1015","code":"vb34btbg5","name":"Light Green T-Shirt","description":"Product Description","image":"light-green-t-shirt.jpg","price":49,"category":"Clothing","quantity":34,"inventoryStatus":"INSTOCK","rating":4},{"id":"1016","code":"k8l6j58jl","name":"Lime Band","description":"Product Description","image":"lime-band.jpg","price":79,"category":"Fitness","quantity":12,"inventoryStatus":"INSTOCK","rating":3},{"id":"1017","code":"v435nn85n","name":"Mini Speakers","description":"Product Description","image":"mini-speakers.jpg","price":85,"category":"Clothing","quantity":42,"inventoryStatus":"INSTOCK","rating":4},{"id":"1018","code":"09zx9c0zc","name":"Painted Phone Case","description":"Product Description","image":"painted-phone-case.jpg","price":56,"category":"Accessories","quantity":41,"inventoryStatus":"INSTOCK","rating":5},{"id":"1019","code":"mnb5mb2m5","name":"Pink Band","description":"Product Description","image":"pink-band.jpg","price":79,"category":"Fitness","quantity":63,"inventoryStatus":"INSTOCK","rating":4},{"id":"1020","code":"r23fwf2w3","name":"Pink Purse","description":"Product Description","image":"pink-purse.jpg","price":110,"category":"Accessories","quantity":0,"inventoryStatus":"OUTOFSTOCK","rating":4},{"id":"1021","code":"pxpzczo23","name":"Purple Band","description":"Product Description","image":"purple-band.jpg","price":79,"category":"Fitness","quantity":6,"inventoryStatus":"LOWSTOCK","rating":3},{"id":"1022","code":"2c42cb5cb","name":"Purple Gemstone Necklace","description":"Product Description","image":"purple-gemstone-necklace.jpg","price":45,"category":"Accessories","quantity":62,"inventoryStatus":"INSTOCK","rating":4},{"id":"1023","code":"5k43kkk23","name":"Purple T-Shirt","description":"Product Description","image":"purple-t-shirt.jpg","price":49,"category":"Clothing","quantity":2,"inventoryStatus":"LOWSTOCK","rating":5},{"id":"1024","code":"lm2tny2k4","name":"Shoes","description":"Product Description","image":"shoes.jpg","price":64,"category":"Clothing","quantity":0,"inventoryStatus":"INSTOCK","rating":4},{"id":"1025","code":"nbm5mv45n","name":"Sneakers","description":"Product Description","image":"sneakers.jpg","price":78,"category":"Clothing","quantity":52,"inventoryStatus":"INSTOCK","rating":4},{"id":"1026","code":"zx23zc42c","name":"Teal T-Shirt","description":"Product Description","image":"teal-t-shirt.jpg","price":49,"category":"Clothing","quantity":3,"inventoryStatus":"LOWSTOCK","rating":3},{"id":"1027","code":"acvx872gc","name":"Yellow Earbuds","description":"Product Description","image":"yellow-earbuds.jpg","price":89,"category":"Electronics","quantity":35,"inventoryStatus":"INSTOCK","rating":3},{"id":"1028","code":"tx125ck42","name":"Yoga Mat","description":"Product Description","image":"yoga-mat.jpg","price":20,"category":"Fitness","quantity":15,"inventoryStatus":"INSTOCK","rating":5},{"id":"1029","code":"gwuby345v","name":"Yoga Set","description":"Product Description","image":"yoga-set.jpg","price":20,"category":"Fitness","quantity":25,"inventoryStatus":"INSTOCK","rating":8}]'
      )
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const openNew = () => {
    setOrder(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const onCategoryChange = (e) => {
    let _product = { ...order };
    _product["category"] = e.value;
    setOrder(_product);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...order };
    _product[`${name}`] = val;

    setOrder(_product);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _product = { ...order };
    _product[`${name}`] = val;

    setOrder(_product);
  };

  const saveProduct = () => {
    setSubmitted(true);

    if (order.name.trim()) {
      let _products = [...orders];
      let _product = { ...order };
      if (order.id) {
        const index = findIndexById(order.id);

        _products[index] = _product;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3000,
        });
      } else {
        _product.id = createId();
        _products.push(_product);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
      }

      setOrders(_products);
      setProductDialog(false);
      setOrder(emptyProduct);
    }
  };

  const editProduct = (product) => {
    setOrder({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setOrder(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    let _products = orders.filter((val) => val.id !== order.id);
    setOrder(_products);
    setDeleteProductDialog(false);
    setOrder(emptyProduct);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
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
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = () => {
    let _products = orders.filter((val) => !selectedOrders.includes(val));
    setOrders(_products);
    setDeleteProductsDialog(false);
    setSelectedOrders(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Products Deleted",
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

  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readonly cancel={false} />;
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <span
        className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}
      >
        {rowData.inventoryStatus}
      </span>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="p-m-0">Manage Products</h5>
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
  const productDialogFooter = (
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
        onClick={saveProduct}
      />
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteProduct}
      />
    </React.Fragment>
  );
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedProducts}
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
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          globalFilter={globalFilter}
          header={header}
          scrollable
          scrollHeight={`${CONTENT_HEIGHT - 355}px`}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          <Column field="code" header="Code" sortable></Column>
          <Column field="name" header="Name" sortable></Column>
          <Column
            field="price"
            header="Price"
            body={priceBodyTemplate}
            sortable
          ></Column>
          <Column field="category" header="Category" sortable></Column>
          <Column
            field="rating"
            header="Reviews"
            body={ratingBodyTemplate}
            sortable
          ></Column>
          <Column
            field="inventoryStatus"
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
        header="Product Details"
        modal
        className="p-fluid"
        footer={productDialogFooter}
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
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
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
        footer={deleteProductsDialogFooter}
        onHide={hideDeleteProductsDialog}
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
