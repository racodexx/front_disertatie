import React from "react";
import { useHistory } from "react-router-dom";
import { TabMenu } from "primereact/tabmenu";

const MenuItems = {
  Orders: 1,
  Products: 2,
  Feedbacks: 3,
};

const AdminLayout = (props) => {
  const history = useHistory();

  const items = [
    {
      id: MenuItems.Orders,
      label: "Orders",
      icon: "pi pi-fw pi-bell",
      href: "/admin/orders",
    },
    {
      id: MenuItems.Products,
      label: "Products",
      icon: "pi pi-fw pi-folder",
      href: "/admin/products",
    },
    {
      id: MenuItems.Feedbacks,
      label: "Feedback",
      icon: "pi pi-fw pi-comments",
      href: "/admin/feedbacks",
    },
  ];

  const location = document.location.href.substring(
    document.location.href.indexOf("#/") + 1,
    document.location.href.length
  );
  const activeItem = items.find((x) => location === x.href);

  return (
    <div>
      <div className="card">
        <TabMenu
          model={items}
          activeItem={activeItem}
          onTabChange={(e) => {
            history.push(e.value.href);
          }}
        />
        {props.children}
      </div>
    </div>
  );
};
export default AdminLayout;
