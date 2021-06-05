import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import moment from "moment";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Toolbar } from "primereact/toolbar";

import Feedbackdetails from "../feedbacks/FeedbackDetails";

import { useWindowDimensions } from "../../../hooks/windowDimensions";

import { FeedbackStatusSelection } from "../../../utils/dataSelections";
import { getFeedbacks, readFeedback } from "../../../services/feedbackService";
import { handleApiActionResult } from "../../../utils/util";
import FeedbackStatus from "../../../utils/enums/FeedbackStatus";

const DataTableWrapper = styled.div`
  tr:hover {
    background-color: aliceblue !important;
    cursor: pointer;
  }
`;

const FeedbacksList = () => {
  const filterVisibility_LS_KEY = "feedbacks_list_filter_visibility";
  const defaultFilters = {
    _id: { value: "", matchMode: "contains" },
    date: { value: null, matchMode: "contains" },
    name: { value: "", matchMode: "contains" },
    email: { value: "", matchMode: "contains" },
    phone: { value: "", matchMode: "contains" },
    statusId: { value: null, matchMode: "in" },
  };

  const toastRef = useRef();
  const dataTableRef = useRef(null);
  const { height } = useWindowDimensions();
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilterVisibility, setColumnFilterVisibility] = useState(false);
  const [columnFilterValues, setColumnFilterValues] = useState(defaultFilters);

  useEffect(() => {
    loadFilterVisibility();
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    const result = await getFeedbacks();
    const success = handleApiActionResult(result, null);
    if (success) {
      let feedbacksList = [];
      for (let item of result.data) {
        let order = { ...item };
        let date = moment(item.date).format("DD-MM-YYYY");
        order.date = date;
        feedbacksList.push(order);
      }
      setFeedbacks(feedbacksList);
    }
  };

  const loadFilterVisibility = () => {
    let visibility = localStorage.getItem(filterVisibility_LS_KEY);
    if (visibility) {
      setColumnFilterVisibility(JSON.parse(visibility));
    }
  };

  const onColumnFilterChange = (filterValue, field) => {
    let columnFilters = { ...columnFilterValues };
    columnFilters[field].value = filterValue;
    setColumnFilterValues(columnFilters);
  };

  const handleMoreFilters = () => {
    localStorage.setItem(filterVisibility_LS_KEY, !columnFilterVisibility);
    setColumnFilterVisibility(!columnFilterVisibility);
  };

  const resetFilters = () => {
    setGlobalFilter("");
    setColumnFilterValues(defaultFilters);
  };

  const onRowClick = async (rowData) => {
    setSelectedFeedback(rowData);
    if (rowData.statusId === FeedbackStatus.Unread) {
      await readFeedback(rowData._id);
    }
  };

  const onCloseFeedback = (data) => {
    if (!data) {
      setSelectedFeedback(null);
      return;
    }

    let newState = [...feedbacks];
    let currentItem = newState.find((x) => x._id === selectedFeedback._id);
    if (currentItem) {
      if (data.statusId === FeedbackStatus.Deleted) {
        let index = feedbacks.indexOf(currentItem);
        newState.splice(index, 1);
      } else {
        Object.keys(data).forEach((key) => {
          currentItem[key] = data[key];
        });
      }
    }
    setFeedbacks(newState);
    setSelectedFeedback(null);
  };

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
            onChange={(e) => onColumnFilterChange(e.target.value, field)}
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
            onChange={(e) => onColumnFilterChange(e.target.value, field)}
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
        onInput={(e) => onColumnFilterChange(e.target.value, field)}
        placeholder={placeholder}
        showClear
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

  const statusBodyTemplate = (rowData) => {
    let item = FeedbackStatusSelection.find((x) => x.id === rowData.statusId);
    return (
      <strong style={{ color: item?.color || "unset" }}>
        {item?.name || ""}
      </strong>
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
          icon="pi pi-refresh"
          className="p-button-secundary"
          onClick={resetFilters}
          tooltipOptions={{ position: "left" }}
          tooltip={"Reset filters"}
        />
      </React.Fragment>
    );
  };

  const dateFilter = renderDateFilter("date");

  const nameFilter = renderFilter({
    field: "name",
    placeholder: "Search",
  });

  const emailFilter = renderFilter({
    field: "email",
    placeholder: "Search",
  });
  const phoneFilter = renderFilter({
    field: "phone",
    placeholder: "Search",
  });

  const feedbacksFilter = renderFilter({
    field: "statusId",
    placeholder: "Select",
    options: FeedbackStatusSelection,
    isMultiSelect: true,
  });

  return (
    <>
      <Toast ref={toastRef} />
      <div className="card">
        <Toolbar
          className="p-mb-4"
          // left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>
        <DataTableWrapper>
          <DataTable
            className="p-datatable-striped"
            ref={dataTableRef}
            value={feedbacks}
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
            onRowClick={(e) => onRowClick(e.data)}
          >
            <Column
              field="date"
              header="Date"
              sortable
              filter={columnFilterVisibility}
              filterElement={dateFilter}
            ></Column>
            <Column
              field="name"
              header="Name"
              sortable
              filter={columnFilterVisibility}
              filterElement={nameFilter}
            ></Column>
            <Column
              field="phone"
              header="Phone"
              sortable
              filter={columnFilterVisibility}
              filterElement={phoneFilter}
            ></Column>
            <Column
              field="email"
              header="Email"
              sortable
              filter={columnFilterVisibility}
              filterElement={emailFilter}
            ></Column>
            <Column
              field="statusId"
              header="Status"
              body={statusBodyTemplate}
              sortable
              filter={columnFilterVisibility}
              filterElement={feedbacksFilter}
            ></Column>
          </DataTable>
        </DataTableWrapper>
        <Feedbackdetails
          feedback={selectedFeedback}
          onHide={(data) => {
            onCloseFeedback(data);
          }}
          toastRef={toastRef}
        />
      </div>
    </>
  );
};
export default FeedbacksList;
