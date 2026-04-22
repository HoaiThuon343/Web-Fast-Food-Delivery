import React, { useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { ShoppingCartOutlined } from "@ant-design/icons";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import "./index.scss";

// import required modules
import { Autoplay, Pagination } from "swiper/modules";
import axios from "axios";
import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import { useDispatch, useSelector } from "react-redux";
import { addFood } from "../../redux/features/fastfoodCart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Carousel({
  numberOfSlides = 1,
  Category = "Trending",
  autoplay = false,
}) {
  const dispatch = useDispatch();
  const [fastfoods, setFastFood] = useState([]); // luôn là mảng
  const navigate = useNavigate();
  const user = useSelector((store) => store.account);

  const handleGetByFastFoodId = async (foodId) => {
    console.log("Get Fast Food by Id", foodId);
  };

  const fetchFastFood = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5213/api/MenuItemFood/ViewAllFoods"
      );

      // Đảm bảo luôn set về MẢNG, tránh null
      const data = response?.data?.data;
      if (Array.isArray(data)) {
        setFastFood(data);
      } else {
        setFastFood([]); // nếu API trả null / object / undefined
      }
    } catch (error) {
      console.error("Error fetching fast foods:", error);
      setFastFood([]); // fallback khi lỗi
    }
  };

  useEffect(() => {
    fetchFastFood();
  }, []);

  function handlegetValue(e) {
    if (!user) {
      navigate("/login");
      toast.error("Please Login");
    } else {
      dispatch(
        addFood({
          id: e.foodId,
          name: e.foodName,
          description: e.description,
          price: e.unitPrice,
          quantity: 1,
          image: e.image,
        })
      );
      return toast.success("Add Food Successfully");
    }
  }

  return (
    <>
      <h3>{Category}</h3>
      <Swiper
        spaceBetween={20}
        slidesPerView={numberOfSlides}
        pagination={{ clickable: true }}
        modules={autoplay ? [Pagination, Autoplay] : [Pagination]}
        className={`carousel ${numberOfSlides > 1 ? "multi-item" : ""}`}
        autoplay={
          autoplay
            ? {
                delay: 2500,
                disableOnInteraction: false,
              }
            : false
        }
      >
        {(fastfoods || [])
          .filter((fastfood) => fastfood.categoryName === Category)
          .map((fastfood) => (
            <SwiperSlide key={fastfood.foodId}>
              <Card
                className="Card"
                hoverable
                style={{ width: 240 }}
                cover={<img src={fastfood.image} alt={fastfood.foodName} />}
                onClick={() => {
                  handlegetValue(fastfood);
                }}
              >
                <Meta
                  title={fastfood.foodName}
                  description={fastfood.unitPrice}
                />
                <ShoppingCartOutlined className="carousel__cart" />
              </Card>
            </SwiperSlide>
          ))}
      </Swiper>
    </>
  );
}
