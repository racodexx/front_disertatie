import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { Carousel } from "primereact/carousel";
import { Toast } from "primereact/toast";

import Section from "../base/Section";
import FeaturedItem from "../base/FeaturedItem";
import AddToCartDialog from "../base/AddToCartDialog";
import { getProducts } from "../../services/productService";
import pizza_background from "../../assets/images/pizza_background.jpg";
import full_logo from "../../assets/images/full_logo_transparent.png";
import interior from "../../assets/images/interior.jpg";
import FoodCategory from "../../utils/enums/FoodCategory";
import ProductCategory from "../../utils/enums/ProductCategory";
import { showNotification } from "../../utils/util";

const Wrapper = styled.div`
  /* position: relative; */
`;
const HeadImage = styled.div`
  width: 100%;
  position: relative;
  text-align: center;

  .background-img {
    width: 100%;
    opacity: 0.45;
  }
  .logo {
    background-color: white;
    opacity: 0.8;
    padding: 30px;
    @media only screen and (max-width: 1000px) {
      width: 100%;
    }
  }

  .centered {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
const PageContent = styled.div`
  @media only screen and (min-width: 1300px) {
    width: 80%;
  }
  margin: auto;
`;

const Introduction = styled.div`
  @media only screen and (max-width: 1300px) {
    display: inline-block;
  }

  height: 450px;
  background-color: #fff;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .description {
    width: 400px;
    margin-right: 70px;
    .title {
      margin-bottom: 30px;
      color: #dfc15e;
      font-family: "Ovo", Sans-serif;
      font-size: 54px;
      font-weight: 600;
      letter-spacing: -2px;
    }
    .text {
      color: #a3a3a3;
      font-weight: 400;
    }
  }

  img {
    width: 450px;
  }
`;

const AboutUsBanner = styled.div`
  background-color: #3a3a3a;
  width: 100%;
  text-align: center;
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

const AboutRestaurantBanner = styled.div`
  width: 100%;
  text-align: center;
  .content {
    margin: auto;
    padding: 100px 25px;
    max-width: 700px;
    min-width: 300px;
    .title {
      color: #c17d0f;
      font-size: 24px;
      font-weight: 400;
      letter-spacing: 2px;
      margin-bottom: 20px;
    }
    .text {
      color: #929292;
      font-weight: 400;
      font-size: 17px;
      line-height: 1.6em;
    }
  }
`;

const ContactBanner = styled.div`
  background-color: #2e3b42;
  text-align: center;
  color: white;
  .content {
    margin: auto;
    padding: 100px 25px;
    max-width: 700px;
    min-width: 300px;
    display: flex;
    justify-content: space-between;
    .card {
      text-align: left;
      .item {
        margin-bottom: 5px;
        color: #929292;
        font-size: 15px;
        font-weight: 500;
      }
      .title {
        border-left: 5px solid darkorange;
        padding-left: 10px;
        margin-bottom: 10px;
        margin-left: 5px;
      }
      .text {
        /* color: #929292;
        font-size: 15px;
        font-weight: 500; */
      }
      i {
        margin-right: 10px;
        color: darkorange;
      }
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
  const toastRef = useRef(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [addToCartProduct, setAddToCartProduct] = useState();
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

  const drinkItems = featuredProducts.filter(
    (x) => x.categoryId === ProductCategory.Drink
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
    setAddToCartProduct(null);
  };

  const productTemplate = (product) => {
    return (
      <FeaturedItem
        product={product}
        addToCart={() => {
          setAddToCartProduct(product);
        }}
      />
    );
  };

  return (
    <Wrapper>
      <Toast ref={toastRef} />
      <AddToCartDialog product={addToCartProduct} onClose={onCloseAddToCart} />
      <HeadImage>
        <img className="background-img" src={pizza_background} alt="pizza" />
        <h1 className="centered">
          <img className="logo" src={full_logo} alt="logo" />
        </h1>
      </HeadImage>
      <Introduction>
        <div className="description">
          <div className="title">About us</div>
          <div className="text">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged.
          </div>
        </div>
        <img src={interior} alt="interior" />
      </Introduction>
      <AboutUsBanner>
        <div className="content">
          <div className="title">
            Get you favourite food even on pandemic times
          </div>
          <div className="text">
            Contrary to popular belief, Lorem Ipsum is not simply random text.
            It has roots in a piece of classical Latin literature from 45 BC,
            making it over 2000 years old.
          </div>
        </div>
      </AboutUsBanner>
      <PageContent>
        <SectionTitle text={"Featured products"} />
        <Section title="Pizza">
          <Carousel
            value={pizzaItems}
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
        <Section title="Soup">
          <Carousel
            value={soupItems}
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
        <Section title="Pasta">
          <Carousel
            value={pastaItems}
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
        <Section title="Drinks">
          <Carousel
            value={drinkItems}
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
      </PageContent>
      <MenuInfoBanner>
        <div className="content">
          <div className="title">Our Menu</div>
          <div className="text">
            There are many variations of passages of Lorem Ipsum available, but
            the majority have suffered alteration in some form, by injected
            humour, or randomised words which don't look even slightly
            believable.
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
      <AboutRestaurantBanner>
        <div className="content">
          <div className="title">... about Racodex Restaurant</div>
          <div className="text">
            There are many variations of passages of Lorem Ipsum available, but
            the majority have suffered alteration in some form, by injected
            humour, or randomised words which don't look even slightly
            believable.
          </div>
        </div>
      </AboutRestaurantBanner>
      <ContactBanner>
        <div className="content">
          <div className="card">
            <div className="title">Location</div>
            <div className="item">
              <i className="pi pi-map-marker"></i>
              <span className="text">Address: Curtea de Arges</span>
            </div>
            <div className="item">
              <i className="pi pi-map"></i>
              <span className="text">Street: Main Street</span>
            </div>
          </div>
          <div className="card">
            <div className="title">Contact details</div>
            <div className="item">
              <i className="pi pi-inbox"></i>
              <span>Email: </span>
              <a className="text" href="mailto: racodexx@gmail.com">
                racodexx@gmail.com
              </a>
            </div>
            <div className="item">
              <i className="pi pi-phone"></i>
              <span>Phone: </span>
              <a className="text" href="tel: 0741234567">
                0741234567
              </a>
            </div>
          </div>
        </div>
      </ContactBanner>
    </Wrapper>
  );
};
export default Home;
