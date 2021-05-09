import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import styled from "styled-components";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { BreadCrumb } from "primereact/breadcrumb";

import MenuItem from "./MenuItem";
import AddToCartDialog from "../base/AddToCartDialog";

import ProductCategory from "../../utils/enums/ProductCategory";
import {
  FoodCategorySelection,
  DrinkCategorySelection,
  ProductCategorySelection,
} from "../../utils/dataSelections";

import { getProducts } from "../../services/productService";
import { useWindowDimensions } from "../../hooks/windowDimensions";
import { showNotification } from "../../utils/util";
import menu_background from "../../assets/images/menu-background.png";
import menu_icon from "../../assets/images/menu-icon.png";

const MenuPageWrapper = styled.div`
  width: ${(props) => props.width}px;
  min-height: ${(props) => props.height - 100}px;
  background-image: url(${menu_background});
  background-size: cover;
  .content {
    width: ${(props) =>
      props.width > 1000 ? (1000 * 100) / props.width : 100}%;
    margin: auto;
    background-color: white;
    .products {
      overflow-y: auto;
      height: ${(props) =>
        props.height - 162 - (props.hasFiltersApplied ? 55 : 0)}px;
    }
    .p-grid {
      margin: unset !important;
    }
  }
`;

const Menu = () => {
  const defaultFilters = {
    categoryId: null,
    subcategoryId: null,
    name: "",
    vegetarian: "",
  };
  const toastRef = useRef();
  const { height, width } = useWindowDimensions();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const onMenuSelect = (categoryId, subcategoryId) => {
    setFilters({ ...filters, categoryId, subcategoryId });
  };

  const getMenuBarItems = () => {
    let menuBarItems = [];

    for (let productCategory of ProductCategorySelection) {
      let categoryItems = [];
      const subcategorySelection =
        productCategory.id === ProductCategory.Food
          ? FoodCategorySelection
          : DrinkCategorySelection;
      for (let productSubcategory of subcategorySelection) {
        categoryItems.push({
          label: productSubcategory.name,
          command: () =>
            onMenuSelect(productCategory.id, productSubcategory.id),
        });
      }
      menuBarItems.push({
        label: productCategory.name,
        items: categoryItems,
      });
    }
    return menuBarItems;
  };

  const loadProducts = async () => {
    let result = await getProducts();
    let randomizedList = result.data.sort(() => Math.random() - 0.5);
    setProducts(randomizedList);
    setFilters(defaultFilters);
  };

  const resetFilter = (field) => {
    let newFilters = { ...filters };
    newFilters[field] = "";
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const onCloseAddToCart = (hasAdded) => {
    if (hasAdded) {
      showNotification(
        "success",
        "Product(s) added to cart",
        "Go to shopping cart to finalize the order",
        toastRef
      );
    }
    setSelectedProduct(null);
  };

  const getProductItems = () => {
    if (products.length === 0) {
      return [];
    }
    let data = [...products];
    let filterFields = Object.keys(filters);
    if (filterFields.length) {
      for (let filter of filterFields) {
        if (!filters[filter]) {
          continue;
        }
        if (filter === "name") {
          data = data.filter((x) =>
            x[filter].toLowerCase().includes(filters[filter].toLowerCase())
          );
          continue;
        } else {
          data = data.filter((x) => x[filter] === filters[filter]);
        }
      }
    }

    return data.map((x, index) => (
      <div className="p-col-12 p-md-6" key={index}>
        <MenuItem
          item={x}
          onClick={() => {
            setSelectedProduct(x);
          }}
        />
      </div>
    ));
  };

  const getFiltersSummary = () => {
    let items = [];
    let item = null;
    if (filters.categoryId) {
      item = ProductCategorySelection.find((x) => x.id === filters.categoryId);
      if (item) {
        items.push({
          label: item.name,
          command: () => resetFilter("subcategoryId"),
        });
      }
    }
    if (filters.subcategoryId) {
      item = (filters.categoryId === ProductCategory.Food
        ? FoodCategorySelection
        : DrinkCategorySelection
      ).find((x) => x.id === filters.subcategoryId);
      if (item) {
        items.push({
          label: item.name,
          command: () => resetFilter("name"),
        });
      }
    }

    if (filters.name) {
      items.push({
        label: filters.name,
        // command: () => resetFilter("name"),
      });
    }
    return items;
  };

  const productItems = useMemo(() => {
    return getProductItems();
    //eslint-disable-next-line
  }, [filters]);

  const menuBarItems = getMenuBarItems();

  const appliedFilters = getFiltersSummary();

  const start = (
    <img
      alt="logo"
      src={menu_icon}
      onError={(e) =>
        (e.target.src =
          "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
      }
      height="40"
      className="p-mr-2"
    ></img>
  );
  const end = (
    <div className="p-d-flex p-jc-between">
      <InputText
        placeholder="Search"
        type="text"
        value={filters.name}
        onChange={(e) => {
          setFilters({ ...filters, name: e.target.value });
        }}
        showClear
      />
    </div>
  );
  const home = {
    icon: "pi pi-filter-slash",
    command: () => resetFilters(),
  };
  return (
    <MenuPageWrapper
      height={height}
      width={width}
      hasFiltersApplied={appliedFilters.length > 0}
    >
      <Toast ref={toastRef} />
      <AddToCartDialog product={selectedProduct} onClose={onCloseAddToCart} />
      <div className="content">
        <div className="card">
          <Menubar model={menuBarItems} start={start} end={end} />
          {appliedFilters.length ? (
            <BreadCrumb model={appliedFilters} home={home} />
          ) : (
            <></>
          )}
          <div className="products p-grid">{productItems}</div>
        </div>
      </div>
    </MenuPageWrapper>
  );
};
export default Menu;
