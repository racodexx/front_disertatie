import OrderStatus from "./enums/OrderStatus";
import ProductAvailabilityStatus from "./enums/ProductAvailabilityStatus";
import ProductCategory from "./enums/ProductCategory";
import FoodCategory from "./enums/FoodCategory";
import DrinkCategory from "./enums/DrinkCategory";

const OrderStatusSelection = [
  { id: OrderStatus.Pending, name: "Pending", color: "red" },
  { id: OrderStatus.Preparing, name: "Preparing", color: "orange" },
  {
    id: OrderStatus.ToBeDelivered,
    name: "To be delivered",
    color: "greenyellow",
  },
  { id: OrderStatus.Delivering, name: "Delivering", color: "turquoise" },
  { id: OrderStatus.Finalized, name: "Finalized", color: "green" },
  { id: OrderStatus.Rejected, name: "Rejected", color: "black" },
];

const ProductAvailabilityStatusSelection = [
  {
    id: ProductAvailabilityStatus.Available,
    name: "Available",
    color: "green",
  },
  {
    id: ProductAvailabilityStatus.Limited,
    name: "Limited",
    color: "orange",
  },
  {
    id: ProductAvailabilityStatus.AvailableSoon,
    name: "Available soon",
    color: "#8c8c2b",
  },
  {
    id: ProductAvailabilityStatus.Unavailable,
    name: "Unavailable",
    color: "red",
  },
];

const ProductCategorySelection = [
  { id: ProductCategory.Food, name: "Food" },
  { id: ProductCategory.Drink, name: "Drink" },
];

const FoodCategorySelection = [
  { id: FoodCategory.Soup, name: "Soup" },
  { id: FoodCategory.Pizza, name: "Pizza" },
  { id: FoodCategory.Pasta, name: "Pasta" },
  { id: FoodCategory.Salad, name: "Salad" },
  { id: FoodCategory.MeatSpeciality, name: "Meat Speciality" },
  { id: FoodCategory.VegetarianSpecality, name: "Vegetarian Speciality" },
  { id: FoodCategory.Sauce, name: "Sauce" },
  { id: FoodCategory.Other, name: "Other" },
];

const DrinkCategorySelection = [
  { id: DrinkCategory.Water, name: "Water" },
  { id: DrinkCategory.Soda, name: "Soda" },
  { id: DrinkCategory.NaturalJuice, name: "Natural Juice" },
  { id: DrinkCategory.Beer, name: "Beer" },
  { id: DrinkCategory.Cocktail, name: "Cocktail" },
  { id: DrinkCategory.StrongAlcohol, name: "Strong Alcohol" },
  { id: DrinkCategory.EnergyDrink, name: "Energy Drink" },
  { id: DrinkCategory.Other, name: "Other" },
];

export {
  OrderStatusSelection,
  ProductAvailabilityStatusSelection,
  ProductCategorySelection,
  FoodCategorySelection,
  DrinkCategorySelection,
};
