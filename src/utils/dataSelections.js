import OrderStatus from "./enums/OrderStatus";
import ProductAvailabilityStatus from "./enums/ProductAvailabilityStatus";
import ProductCategory from "./enums/ProductCategory";
import FoodCategory from "./enums/FoodCategory";
import DrinkCategory from "./enums/DrinkCategory";

const OrderStatusSelection = [
  { id: OrderStatus.Pending, name: "Pending", color: "red" },
  { id: OrderStatus.Preparing, name: "Preparing", color: "orange" },
  { id: OrderStatus.ToBeDelivered, name: "To be delivered", color: "orange" },
  { id: OrderStatus.Delivering, name: "Delivering", color: "orange" },
  { id: OrderStatus.Finalized, name: "Finalized", color: "green" },
];

const ProductAvailabilityStatusSelection = [
  { id: ProductAvailabilityStatus.InStock, name: "In stock", color: "green" },
  {
    id: ProductAvailabilityStatus.LimitedStock,
    name: "Limited stock",
    color: "orange",
  },
  {
    id: ProductAvailabilityStatus.SoonInStock,
    name: "In stock soon",
    color: "yellow",
  },
  { id: ProductAvailabilityStatus.NoStock, name: "No stock", color: "red" },
];

const ProductCategorySelection = [
  { id: ProductCategory.Food, name: "Food" },
  { id: ProductCategory.Drink, name: "Drink" },
];

const FoodCategorySelection = [
  { id: FoodCategory.Soup, name: "Soup" },
  { id: FoodCategory.Salad, name: "Salad" },
  { id: FoodCategory.Pizza, name: "Pizza" },
  { id: FoodCategory.Pasta, name: "Pasta" },
  { id: FoodCategory.Meat, name: "Meat" },
];

const DrinkCategorySelection = [
  { id: DrinkCategory.Soda, name: "Soda" },
  { id: DrinkCategory.NaturalJuice, name: "Natural Juice" },
  { id: DrinkCategory.Cocktail, name: "Coctail" },
];

export {
  OrderStatusSelection,
  ProductAvailabilityStatusSelection,
  ProductCategorySelection,
  FoodCategorySelection,
  DrinkCategorySelection,
};
