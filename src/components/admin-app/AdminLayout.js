import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { TabMenu } from "primereact/tabmenu";

const TabMenuWrapper = styled.div`
  /* .p-menuitem-link {
    box-shadow: unset !important;
  } */
`;

const MenuItems = {
  Orders: 1,
  Products: 2,
  M3: 3,
  M4: 4,
  M5: 5,
};

const AdminLayout = (props) => {
  const history = useHistory();

  const items = [
    {
      id: MenuItems.Orders,
      label: "Orders",
      icon: "pi pi-fw pi-home",
      href: "/admin/orders",
    },
    {
      id: MenuItems.Products,
      label: "Products",
      icon: "pi pi-fw pi-calendar",
      href: "/admin/products",
    },
    { id: MenuItems.M3, label: "Edit", icon: "pi pi-fw pi-pencil" },
    { id: MenuItems.M4, label: "Documentation", icon: "pi pi-fw pi-file" },
    { id: MenuItems.M5, label: "Settings", icon: "pi pi-fw pi-cog" },
  ];

  const location = document.location.href.substring(
    document.location.href.indexOf("#/") + 1,
    document.location.href.length
  );
  const activeItem = items.find((x) => location === x.href);

  return (
    <div>
      <div className="card">
        <TabMenuWrapper>
          <TabMenu
            model={items}
            activeItem={activeItem}
            onTabChange={(e) => {
              history.push(e.value.href);
            }}
          />
          {props.children}
        </TabMenuWrapper>
      </div>
    </div>
  );
};
export default AdminLayout;
