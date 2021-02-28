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

import {
  getProducts,
  addProduct,
  editProduct,
  uploadPicture,
  deleteProducts,
  deleteProduct,
} from "../../../services/productService";
import {
  ProductAvailabilityStatusSelection,
  ProductCategorySelection,
  FoodCategorySelection,
  DrinkCategorySelection,
} from "../../../utils/dataSelections";
import ProductCategory from "../../../utils/enums/ProductCategory";
import { image, handleApiActionResult } from "../../../utils/util";

const ProductDialogType = {
  None: 0,
  Add: 1,
  Edit: 2,
};

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
    image: null,
  };

  const CONTENT_HEIGHT = window.innerHeight;

  const [selectedProduct, setSelectedProduct] = useState(emptyProduct);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(ProductDialogType.None);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toastRef = useRef(null);
  const dataTableRef = useRef(null);

  useEffect(() => {
    loadProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProducts = async () => {
    let result = await getProducts();
    if (result && result.data.length) {
      setProducts(result.data);
    }
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const openNew = () => {
    setSelectedProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(ProductDialogType.Add);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(ProductDialogType.None);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const setProductState = (field, value) => {
    let _product = { ...selectedProduct };
    _product[field] = value;
    if (field === "categoryId") {
      _product["subcategoryId"] = null;
    }
    setSelectedProduct(_product);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...selectedProduct };
    _product[`${name}`] = val;

    setSelectedProduct(_product);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _product = { ...selectedProduct };
    _product[`${name}`] = val;

    setSelectedProduct(_product);
  };

  const saveProduct = async () => {
    setSubmitted(true);
    let result;
    if (productDialog === ProductDialogType.Add) {
      const newProduct = {
        name: selectedProduct.name,
        description: selectedProduct.description,
        categoryId: selectedProduct.categoryId,
        subcategoryId: selectedProduct.subcategoryId,
        price: selectedProduct.price,
        availabilityStatusId: selectedProduct.availabilityStatusId,
        featured: selectedProduct.featured,
      };
      result = await addProduct(newProduct);
    } else {
      result = await editProduct(selectedProduct);
    }

    let resultData = handleApiActionResult(result, toastRef);
    console.log(resultData);
    if (!resultData) {
      return;
    }
    if (selectedProduct.image) {
      let formData = new FormData();
      formData.append("picture", selectedProduct.image, resultData._id + "");
      await uploadPicture(formData);
    }
    let _products = [...products];

    if (productDialog === ProductDialogType.Add) {
      _products.push(resultData);
    } else {
      const index = products.indexOf(
        products.find((x) => x._id === resultData._id)
      );
      _products[index] = resultData;
    }

    setProducts(_products);
    setProductDialog(ProductDialogType.None);
    setSelectedProduct(emptyProduct);
  };

  const edit = (product) => {
    setSelectedProduct({ ...product });
    setProductDialog(ProductDialogType.Edit);
  };

  const confirmDeleteProduct = (product) => {
    setSelectedProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProd = async () => {
    let result = await deleteProducts([selectedProduct._id]);
    let data = handleApiActionResult(result, toastRef);
    if (!data) {
      return;
    }

    let _products = products.filter((val) => val._id !== selectedProduct._id);
    setProducts(_products);
    setDeleteProductDialog(false);
    setSelectedProduct(emptyProduct);
  };

  const exportCSV = () => {
    dataTableRef.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = async () => {
    let result = await deleteProducts(selectedProducts.map((x) => x._id));
    let data = handleApiActionResult(result, toastRef);
    if (!data) {
      return;
    }
    let _products = products.filter((val) => !selectedProducts.includes(val));
    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
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

  const pictureBodyTemplate = (rowData) => {
    return <img src={image(rowData._id)} alt="product" width="200px" />;
  };

  const availabilityBodyTemplate = (rowData) => {
    let item = ProductAvailabilityStatusSelection.find(
      (x) => x.id === rowData.availabilityStatusId
    );
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
          onClick={() => edit(rowData)}
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
        onClick={deleteProd}
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
        onChange={(e) => {
          setProductState("categoryId", e.value);
        }}
        checked={selectedProduct.categoryId === x.id}
      />
      <label htmlFor={`category${index}`}>{x.name}</label>
    </div>
  ));

  const newProductSubcategories = (selectedProduct.categoryId ===
  ProductCategory.Drink
    ? DrinkCategorySelection
    : FoodCategorySelection
  ).map((x, index) => (
    <div className="p-field-radiobutton p-col-6" key={"subcategory-" + index}>
      <RadioButton
        inputId={`subcategory${index}`}
        name="subcategory"
        value={x.id}
        onChange={(e) => {
          setProductState("subcategoryId", e.value);
        }}
        checked={selectedProduct.subcategoryId === x.id}
      />
      <label htmlFor={`subcategory${index}`}>{x.name}</label>
    </div>
  ));

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
          ref={dataTableRef}
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="_id"
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
            body={pictureBodyTemplate}
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
        header={
          productDialog === ProductDialogType.Add
            ? "New product details"
            : "Edit product details"
        }
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
            value={selectedProduct.name}
            onChange={(e) => onInputChange(e, "name")}
            required
            autoFocus
          />
          {submitted && !selectedProduct.name && (
            <small className="p-invalid">Name is required.</small>
          )}
        </div>
        <div className="p-field">
          <label htmlFor="description">Description</label>
          <InputTextarea
            id="description"
            value={selectedProduct.description}
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
            value={selectedProduct.price}
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
            value={selectedProduct.availabilityStatusId}
            options={ProductAvailabilityStatusSelection}
            onChange={(e) => {
              setProductState("availabilityStatusId", e.value);
            }}
            optionLabel="name"
            optionValue="id"
            placeholder="Choose availability"
          />
        </div>

        <div className="p-field-checkbox">
          <Checkbox
            inputId="featured"
            checked={selectedProduct.featured}
            onChange={(e) => {
              setProductState("featured", e.checked);
            }}
          />
          <label htmlFor="featured">Featured</label>
        </div>

        <div className="card">
          <h5>Pictures</h5>
          <input
            type="file"
            multiple={false}
            accept=".jpg,.png"
            onChange={(e) => {
              setProductState("image", e.target.files[0]);
            }}
          />
        </div>
      </Dialog>

      <Dialog
        visible={deleteProductDialog}
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
          {selectedProduct && (
            <span>
              Are you sure you want to delete <b>{selectedProduct.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteProductsDialog}
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
          {selectedProduct && (
            <span>Are you sure you want to delete the selected products?</span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default ProductsList;
