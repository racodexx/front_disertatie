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
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";

import { getProducts, addProduct } from "../../../services/productService";
import {
  ProductAvailabilityStatusSelection,
  ProductCategorySelection,
  FoodCategorySelection,
  DrinkCategorySelection,
} from "../../../utils/dataSelections";
import ProductCategory from "../../../utils/enums/ProductCategory";

const ProductsList = () => {
  let emptyProduct = {
    id: "",
    name: "",
    description: "",
    categoryId: ProductCategory.Food,
    subcategoryId: null,
    price: 0,
    availabilityStatusId: null,
    featured: false,
    imgSrc: null,
  };

  const CONTENT_HEIGHT = window.innerHeight;

  const [products, setProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteOrderDialog, setDeleteProductDialog] = useState(false);
  const [deleteOrdersDialog, setDeleteProductsDialog] = useState(false);
  const [order, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    loadProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProducts = async () => {
    let result = await getProducts();
    if (result && result.data && result.data.data && result.data.data.length) {
      setProducts(result.data.data);
    }
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const openNew = () => {
    setProduct(emptyProduct);
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
    _product["categoryId"] = e.value;
    _product["subcategoryId"] = null;
    setProduct(_product);
  };

  const onSubategoryChange = (e) => {
    let _product = { ...order };
    _product["subcategoryId"] = e.value;
    setProduct(_product);
  };

  const onAvailabilityChange = (e) => {
    let _product = { ...order };
    _product["availabilityStatusId"] = e.value;
    setProduct(_product);
  };

  const onFeaturedChange = (e) => {
    let _product = { ...order };
    _product["featured"] = e.checked;
    setProduct(_product);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...order };
    _product[`${name}`] = val;

    setProduct(_product);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _product = { ...order };
    _product[`${name}`] = val;

    setProduct(_product);
  };

  const onUpload = () => {
    alert("upload");
  };

  const saveProduct = async () => {
    setSubmitted(true);
    const newProduct = {
      name: order.name,
      description: order.description,
      categoryId: order.categoryId,
      subCategoryId: order.subcategoryId,
      price: order.price,
      availabilityStatusId: order.availabilityStatusId,
      imgSrc: "",
      featured: order.featured,
    };
    const result = await addProduct(newProduct);
    console.log(result);
    if (result.errors) {
      return;
    }
    let _products = [...products];
    if (order.name.trim()) {
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
        console.log(result.data.data._id);
        _product.id = result.data.data._id;
        _products.push(_product);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
      }

      setProducts(_products);
      setProductDialog(false);
      setProduct(emptyProduct);
    }
  };

  const editProduct = (product) => {
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    let _products = products.filter((val) => val.id !== order.id);
    setProduct(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
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
    let _products = products.filter((val) => !selectedProducts.includes(val));
    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
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
          disabled={!selectedProducts || !selectedProducts.length}
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

  const availabilityBodyTemplate = (rowData) => {
    let item = ProductAvailabilityStatusSelection.find(
      (x) => x.id === rowData.availabilityStatusId
    );
    console.log(item);
    return <strong style={{ color: item.color }}>{item.name}</strong>;
  };

  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly stars={5} cancel={false} />;
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

  const newProductCategories = ProductCategorySelection.map((x, index) => (
    <div className="p-field-radiobutton p-col-6" key={"category-" + index}>
      <RadioButton
        inputId={`category${index}`}
        name="category"
        value={x.id}
        onChange={onCategoryChange}
        checked={order.categoryId === x.id}
      />
      <label htmlFor={`category${index}`}>{x.name}</label>
    </div>
  ));

  const newProductSubcategories = (order.categoryId === ProductCategory.Drink
    ? DrinkCategorySelection
    : FoodCategorySelection
  ).map((x, index) => (
    <div className="p-field-radiobutton p-col-6" key={"subcategory-" + index}>
      <RadioButton
        inputId={`subcategory${index}`}
        name="subcategory"
        value={x.id}
        onChange={onSubategoryChange}
        checked={order.subcategoryId === x.id}
      />
      <label htmlFor={`subcategory${index}`}>{x.name}</label>
    </div>
  ));

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
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
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
          <Column field="_id" header="Id" sortable></Column>
          <Column field="name" header="Name" sortable></Column>
          <Column
            field="picture"
            header="Picture"
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
            field="availabilityStatusId"
            header="Availability"
            body={availabilityBodyTemplate}
            sortable
          ></Column>
          <Column
            field="rating"
            header="Rating"
            body={ratingBodyTemplate}
            sortable
          ></Column>
          <Column body={actionBodyTemplate}></Column>
        </DataTable>
      </div>

      <Dialog
        visible={productDialog}
        style={{ width: "500px" }}
        header="New Product Details"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <div className="p-field">
          <label className="p-mb-3">Category</label>
          <div className="p-formgrid p-grid">{newProductCategories}</div>
        </div>

        <div className="p-field">
          <label className="p-mb-3">Subategory</label>
          <div className="p-formgrid p-grid">{newProductSubcategories}</div>
        </div>

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
            cols={30}
          />
        </div>

        <div className="p-field">
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

        <div className="p-field">
          <label htmlFor="availability">Product availability</label>
          <Dropdown
            id="availability"
            value={order.availabilityStatusId}
            options={ProductAvailabilityStatusSelection}
            onChange={onAvailabilityChange}
            optionLabel="name"
            optionValue="id"
            placeholder="Choose availability"
          />
        </div>

        <div className="p-field-checkbox">
          <Checkbox
            inputId="featured"
            checked={order.featured}
            onChange={onFeaturedChange}
          />
          <label htmlFor="featured">Featured</label>
        </div>

        <div className="card">
          <h5>Pictures</h5>
          <FileUpload
            name="demo[]"
            url="./upload.php"
            onUpload={onUpload}
            multiple
            accept="image/*"
            maxFileSize={1000000}
            emptyTemplate={
              <p className="p-m-0">Drag and drop files to here to upload.</p>
            }
          />
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

export default ProductsList;
