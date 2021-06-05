import OrderStatus from "./enums/OrderStatus";
import ProductAvailabilityStatus from "./enums/ProductAvailabilityStatus";
import ProductCategory from "./enums/ProductCategory";
import FoodCategory from "./enums/FoodCategory";
import DrinkCategory from "./enums/DrinkCategory";
import FeedbackStatus from "./enums/FeedbackStatus";

const OrderStatusSelection = [
  { id: OrderStatus.Pending, name: "Pending", color: "#ff0000" },
  { id: OrderStatus.Preparing, name: "Preparing", color: "#ffa500" },
  {
    id: OrderStatus.ToBeDelivered,
    name: "To be delivered",
    color: "#7aac2c",
  },
  { id: OrderStatus.Delivering, name: "Delivering", color: "turquoise" },
  { id: OrderStatus.Finalized, name: "Finalized", color: "#008000" },
  { id: OrderStatus.Rejected, name: "Rejected", color: "#000000" },
];

const ProductAvailabilityStatusSelection = [
  {
    id: ProductAvailabilityStatus.Available,
    name: "Available",
    color: "#008000",
  },
  {
    id: ProductAvailabilityStatus.Limited,
    name: "Limited",
    color: "#ffa500",
  },
  {
    id: ProductAvailabilityStatus.AvailableSoon,
    name: "Available soon",
    color: "#8c8c2b",
  },
  {
    id: ProductAvailabilityStatus.Unavailable,
    name: "Unavailable",
    color: "#ff0000",
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
  { id: FoodCategory.Burger, name: "Burger" },
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

const FeedbackStatusSelection = [
  { id: FeedbackStatus.Unread, name: "Unread", color: "#ff0000" },
  { id: FeedbackStatus.Read, name: "Read", color: "#ffa500" },
  { id: FeedbackStatus.Replied, name: "Replied", color: "#008000" },
];

export {
  OrderStatusSelection,
  ProductAvailabilityStatusSelection,
  ProductCategorySelection,
  FoodCategorySelection,
  DrinkCategorySelection,
  FeedbackStatusSelection,
};
