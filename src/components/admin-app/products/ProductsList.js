import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";

import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { MultiSelect } from "primereact/multiselect";

import CustomInput from "../../base/CustomInput";
import CustomTextArea from "../../base/CustomTextArea";

import { useWindowDimensions } from "../../../hooks/windowDimensions";

import {
  getProducts,
  addProduct,
  editProduct,
  uploadPicture,
  deleteProducts,
  deletePictures,
} from "../../../services/productService";
import {
  ProductAvailabilityStatusSelection,
  ProductCategorySelection,
  FoodCategorySelection,
  DrinkCategorySelection,
} from "../../../utils/dataSelections";
import ProductCategory from "../../../utils/enums/ProductCategory";
import {
  image,
  handleApiActionResult,
  formatPrice,
  showNotification,
} from "../../../utils/util";

const ProductDialogType = {
  None: 0,
  Add: 1,
  Edit: 2,
};

const ProductsList = () => {
  const filterVisibility_LS_KEY = "products_list_filter_visibility";
  const { height } = useWindowDimensions();
  let emptyProduct = {
    id: "",
    name: "",
    description: "",
    categoryId: ProductCategory.Food,
    subcategoryId: null,
    price: 0,
    availabilityStatusId: null,
    featured: false,
    isVegetarian: false,
    image: null,
  };

  const defaultFilters = {
    _id: { value: "", matchMode: "contains" },
    name: { value: "", matchMode: "contains" },
    categoryId: { value: null, matchMode: "equals" },
    subcategoryId: { value: null, matchMode: "in" },
    price: { value: "", matchMode: "contains" },
    availabilityStatusId: { value: null, matchMode: "in" },
    featured: { value: "", matchMode: "equals" },
  };

  const [selectedProduct, setSelectedProduct] = useState(emptyProduct);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(ProductDialogType.None);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilterVisibility, setColumnFilterVisibility] = useState(false);
  const [columnFilterValues, setColumnFilterValues] = useState(defaultFilters);
  const toastRef = useRef(null);
  const dataTableRef = useRef(null);

  useEffect(() => {
    loadFilterVisibility();
    loadProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setProductState("isVegetarian", false);
    //eslint-disable-next-line
  }, [selectedProduct.categoryId]);

  const loadFilterVisibility = () => {
    let visibility = localStorage.getItem(filterVisibility_LS_KEY);
    if (visibility) {
      setColumnFilterVisibility(JSON.parse(visibility));
    }
  };

  const loadProducts = async () => {
    let result = await getProducts();
    if (result && result.data.length) {
      setProducts(result.data);
    }
  };

  const openNew = () => {
    setSelectedProduct(emptyProduct);
    setProductDialog(ProductDialogType.Add);
  };

  const hideDialog = () => {
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

  const validateProduct = () => {
    let errors = [];
    if (!selectedProduct.name) {
      errors.push("Name is required!");
    }
    if (!selectedProduct.description) {
      errors.push("Description is required!");
    }
    if (!selectedProduct.categoryId) {
      errors.push("Category number is required!");
    }
    if (!selectedProduct.subcategoryId) {
      errors.push("Subcategory is required!");
    }
    if (!selectedProduct.subcategoryId) {
      errors.push("Subcategory is required!");
    }
    if (!selectedProduct.price) {
      errors.push("Price is required!");
    }
    if (!selectedProduct.availabilityStatusId) {
      errors.push("Availability is required!");
    }
    if (errors.length) {
      showNotification(
        "error",
        "Please fill all the info",
        errors.join(", "),
        toastRef
      );
      return false;
    }
    return true;
  };

  const saveProduct = async () => {
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
      let isValid = validateProduct(newProduct);
      if (!isValid) {
        return;
      }
      result = await addProduct(newProduct);
    } else {
      result = await editProduct(selectedProduct);
    }

    let resultData = handleApiActionResult(result, toastRef);
    if (!resultData) {
      return;
    }
    try {
      if (selectedProduct.image) {
        let formData = new FormData();
        formData.append("picture", selectedProduct.image, resultData._id + "");
        await uploadPicture(formData);
      }
    } catch (e) {
      console.log(e);
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
    hideDialog();
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

    try {
      await deletePictures([selectedProduct._id]);
    } catch (e) {
      console.log(e);
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
    try {
      await deletePictures(selectedProducts.map((x) => x._id));
    } catch (e) {
      console.log(e);
    }

    let _products = products.filter((val) => !selectedProducts.includes(val));
    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
  };

  const handleMoreFilters = () => {
    localStorage.setItem(filterVisibility_LS_KEY, !columnFilterVisibility);
    setColumnFilterVisibility(!columnFilterVisibility);
  };

  const resetFilters = () => {
    setGlobalFilter("");
    setColumnFilterValues(defaultFilters);
  };

  const onColumnFilterChange = (event, field) => {
    const filterValue = event.target.value;
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
          className="p-button-danger  p-mr-2"
          onClick={confirmDeleteSelected}
          disabled={!selectedProducts || !selectedProducts.length}
        />
        <Button
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
          tooltip={"Export CSV"}
        />
      </React.Fragment>
    );
  };

  const getFilterSubcategorySelection = (categoryId) => {
    let searchBy = categoryId || columnFilterValues.categoryId.value;
    if (searchBy === ProductCategory.Food) {
      return FoodCategorySelection;
    }
    if (searchBy === ProductCategory.Drink) {
      return DrinkCategorySelection;
    }
    return [];
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
              showClear
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
          icon="pi pi-refresh"
          className="p-button-secundary"
          onClick={resetFilters}
          tooltipOptions={{ position: "left" }}
          tooltip={"Reset filters"}
        />
      </React.Fragment>
    );
  };

  const priceBodyTemplate = (rowData) => {
    return formatPrice(rowData.price);
  };

  const categoryBodyTemplate = (rowData) => {
    let currentCategory = ProductCategorySelection.find(
      (x) => x.id === rowData.categoryId
    );
    return currentCategory.name;
  };

  const subcategoryBodyTemplate = (rowData) => {
    let selection = getFilterSubcategorySelection(rowData.categoryId);
    let currentSubcategory = selection.find(
      (x) => x.id === rowData.subcategoryId
    );
    return currentSubcategory?.name || "";
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

  const featuredBodyTemplate = (rowData) => {
    return rowData.featured ? "Yes" : "No";
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

  const renderFilter = ({
    field,
    placeholder,
    options = false,
    isMultiSelect = false,
  }) => {
    return options ? (
      <>
        {isMultiSelect ? (
          <MultiSelect
            className={"p-dropdown p-column-filter"}
            value={columnFilterValues[field].value}
            selectedItemsLabel={"Items"}
            options={options}
            onChange={(e) => onColumnFilterChange(e, field)}
            maxSelectedLabels={1}
            showClear
            placeholder={placeholder}
            appendTo={document.body}
            optionValue="id"
            optionLabel="name"
          />
        ) : (
          <Dropdown
            id="availability"
            value={columnFilterValues[field].value}
            options={options}
            onChange={(e) => onColumnFilterChange(e, field)}
            optionLabel="name"
            optionValue="id"
            placeholder={placeholder}
            appendTo={document.body}
          />
        )}
      </>
    ) : (
      <InputText
        type="search"
        value={columnFilterValues[field].value}
        onInput={(e) => onColumnFilterChange(e, field)}
        placeholder={placeholder}
        showClear
      />
    );
  };

  const idFilter = renderFilter({ field: "_id", placeholder: "Search by id" });
  const nameFilter = renderFilter({
    field: "name",
    placeholder: "Search",
  });
  const priceFilter = renderFilter({
    field: "price",
    placeholder: "Search",
  });
  const categoryFilter = renderFilter({
    field: "categoryId",
    placeholder: "Select",
    options: ProductCategorySelection,
  });
  const subcategoryFilter = renderFilter({
    field: "subcategoryId",
    placeholder: "Select",
    options: getFilterSubcategorySelection(),
    isMultiSelect: true,
  });
  const availabilityFilter = renderFilter({
    field: "availabilityStatusId",
    placeholder: "Select",
    options: ProductAvailabilityStatusSelection,
    isMultiSelect: true,
  });
  const featuredFilter = renderFilter({
    field: "featured",
    placeholder: "Select",
    options: [
      { id: true, name: "Yes" },
      { id: false, name: "No" },
    ],
  });

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

  const newProductSubcategories = (
    selectedProduct.categoryId === ProductCategory.Drink
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
          filters={columnFilterValues}
          // header={}
          scrollable
          scrollHeight={`${height - (columnFilterVisibility ? 342 : 270)}px`}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          <Column
            field="picture"
            header="Picture"
            body={pictureBodyTemplate}
            sortable
          ></Column>
          <Column
            field="_id"
            header="Id"
            sortable
            filter={columnFilterVisibility}
            filterElement={idFilter}
          ></Column>
          <Column
            field="name"
            header="Name"
            sortable
            filter={columnFilterVisibility}
            filterElement={nameFilter}
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
            field="categoryId"
            header="Category"
            body={categoryBodyTemplate}
            sortable
            filter={columnFilterVisibility}
            filterElement={categoryFilter}
          ></Column>
          <Column
            field="subcategoryId"
            header="Subcategory"
            body={subcategoryBodyTemplate}
            sortable
            filter={columnFilterVisibility}
            filterElement={subcategoryFilter}
          ></Column>
          <Column
            field="availabilityStatusId"
            header="Availability"
            body={availabilityBodyTemplate}
            sortable
            filter={columnFilterVisibility}
            filterElement={availabilityFilter}
          ></Column>
          <Column
            header="Featured"
            field="featured"
            body={featuredBodyTemplate}
            sortable
            filter={columnFilterVisibility}
            filterElement={featuredFilter}
          ></Column>
          <Column body={actionBodyTemplate}></Column>
        </DataTable>
      </div>

      <Dialog
        visible={productDialog ? true : false}
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
            currency="RON"
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
        {selectedProduct.categoryId === ProductCategory.Food && (
          <div className="p-field-checkbox">
            <Checkbox
              inputId="isVegetarian"
              checked={selectedProduct.isVegetarian}
              onChange={(e) => {
                setProductState("isVegetarian", e.checked);
              }}
            />
            <label htmlFor="isVegetarian">Is Vegetarian</label>
          </div>
        )}

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
