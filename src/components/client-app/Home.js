import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { Carousel } from "primereact/carousel";
import { Toast } from "primereact/toast";

import { useWindowDimensions } from "../../hooks/windowDimensions";

import Section from "../base/Section";
import FeaturedItem from "../base/FeaturedItem";
import AddToCartDialog from "../base/AddToCartDialog";
import ContactBanner from "./ContactBanner";
import { getProducts } from "../../services/productService";
import pizza_background from "../../assets/images/pizza_background.jpg";
import full_logo from "../../assets/images/full_logo.png";
import FoodCategory from "../../utils/enums/FoodCategory";
import ProductCategory from "../../utils/enums/ProductCategory";
import { showNotification } from "../../utils/util";
import DrinkCategory from "../../utils/enums/DrinkCategory";

const Wrapper = styled.div`
  /* position: relative; */
`;
const HeadImage = styled.div`
  .desktop {
    width: 100%;
    position: relative;
    text-align: center;
    .background-img {
      width: 100%;
      opacity: 0.6;
      @media only screen and (max-width: 1600px) {
        width: 100%;
      }
    }
    .centered {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .logo {
    background-color: white;
    opacity: 0.8;
    padding: 30px;
    @media only screen and (max-width: 1000px) {
      width: 100%;
    }
  }

  @media only screen and (max-width: 700px) {
    .desktop {
      display: none;
    }
  }
  @media only screen and (min-width: 700px) {
    .mobile {
      display: none;
    }
  }
`;
const PageContent = styled.div`
  @media only screen and (min-width: 1300px) {
    width: 80%;
  }
  margin: auto;
`;

const AboutUsBanner = styled.div`
  background-color: #3a3a3a;
  width: 100%;
  text-align: center;
  margin-top: -4px;
  .content {
    margin: auto;
    padding: 25px;
    max-width: 700px;
    min-width: 300px;
  }
  .title {
    color: #dfc15e;
    font-family: "Shadows Into Light", Sans-serif;
    font-size: 50px;
    @media only screen and (max-width: 700px) {
      font-size: 27px;
    }
  }
  .text {
    color: #bababa;
    font-size: 17px;
    line-height: 1.6em;
  }
`;

const MenuInfoBanner = styled.div`
  width: 100%;
  background-color: #525252;
  text-align: center;
  .content {
    margin: auto;
    padding: 25px;
    max-width: 700px;
    min-width: 300px;
    .title {
      color: #dfc15e;
      font-family: "Shadows Into Light", Sans-serif;
      font-size: 50px;
      margin-bottom: 10px;
    }
    .text {
      color: #bababa;
      font-size: 17px;
      line-height: 1.6em;
    }
    .check-menu-button {
      cursor: pointer;
      color: #dfc15e;
      border-color: #dfc15e;
      border-style: solid;
      display: inline-block;
      padding: 3px 10px 5px 10px;
      border-radius: 19px;
      margin: 20px;
    }
  }
`;

const SectionTitle = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ fontFamily: "Courier New" }}>Featured products</h1>
    </div>
  );
};

const Home = () => {
  const { height } = useWindowDimensions();
  const toastRef = useRef(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  useEffect(() => {
    getFeaturedProducts();
  }, []);

  const getFeaturedProducts = async () => {
    let searchParameters = { featured: true };
    let result = await getProducts(searchParameters);
    setFeaturedProducts((result && result.data) || []);
  };

  const pizzaItems = featuredProducts.filter(
    (x) =>
      x.categoryId === ProductCategory.Food &&
      x.subcategoryId === FoodCategory.Pizza
  );

  const burgerItems = featuredProducts.filter(
    (x) =>
      x.categoryId === ProductCategory.Food &&
      x.subcategoryId === FoodCategory.Burger
  );

  const soupItems = featuredProducts.filter(
    (x) =>
      x.categoryId === ProductCategory.Food &&
      x.subcategoryId === FoodCategory.Soup
  );

  const pastaItems = featuredProducts.filter(
    (x) =>
      x.categoryId === ProductCategory.Food &&
      x.subcategoryId === FoodCategory.Pasta
  );

  const saladItems = featuredProducts.filter(
    (x) =>
      x.categoryId === ProductCategory.Food &&
      x.subcategoryId === FoodCategory.Salad
  );

  const drinkItems = featuredProducts.filter(
    (x) =>
      x.categoryId === ProductCategory.Drink &&
      x.subcategoryId !== DrinkCategory.StrongAlcohol
  );

  const responsiveOptions = [
    {
      breakpoint: "1500px",
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: "1200px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "900px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

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

  const productTemplate = (product) => {
    return (
      <FeaturedItem
        product={product}
        addToCart={() => {
          setSelectedProduct(product);
        }}
      />
    );
  };

  const selections = [
    { name: "Pizza", items: pizzaItems },
    { name: "Burger", items: burgerItems },
    { name: "Pasta", items: pastaItems },
    { name: "Soup", items: soupItems },
    { name: "Salad", items: saladItems },
    { name: "Drink", items: drinkItems },
  ];

  return (
    <Wrapper>
      <Toast ref={toastRef} />
      <AddToCartDialog product={selectedProduct} onClose={onCloseAddToCart} />
      <HeadImage>
        <div className="desktop">
          <img
            className="background-img"
            src={pizza_background}
            alt="pizza"
            height={height - 50 - 220}
          />
          <h1 className="centered">
            <img className="logo" src={full_logo} alt="logo" />
          </h1>
        </div>
        <div className="mobile">
          <img className="logo" src={full_logo} alt="logo" />
        </div>
      </HeadImage>
      <AboutUsBanner>
        <div className="content">
          <div className="title">
            Get you favourite food even on pandemic times
          </div>
          <div className="text">
            You missed the times when you went to our restaurant to take the
            lunch? Now you can order directly from our website. Same food, same
            quality, fast delivery!
          </div>
        </div>
      </AboutUsBanner>
      <PageContent>
        <SectionTitle text={"Featured products"} />
        {selections.map((x) => {
          return (
            <Section title={x.name}>
              <Carousel
                value={x.items}
                numVisible={4}
                numScroll={1}
                responsiveOptions={responsiveOptions}
                className="custom-carousel"
                circular
                // autoplayInterval={3000}
                itemTemplate={productTemplate}
                // header={<h5>Check our Pizza</h5>}
              />
            </Section>
          );
        })}
      </PageContent>
      <MenuInfoBanner>
        <div className="content">
          <div className="title">Our Menu</div>
          <div className="text">
            When you are saying Old Mill, you are saying well prepared food and
            a wide variety of dishes. You can search in our offer for soup,
            pizza, pasta, burgers and many other food specialities and drinks.
          </div>
          <div
            className="check-menu-button"
            onClick={() => {
              window.location.href = "/#/client/menu";
            }}
          >
            Check menu
          </div>
        </div>
      </MenuInfoBanner>
      <ContactBanner />
    </Wrapper>
  );
};
export default Home;
