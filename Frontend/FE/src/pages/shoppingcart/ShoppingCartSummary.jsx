// src/components/ShoppingCartSummary.js

import React from "react";

const ShoppingCartSummary = ({ items, totalPrice, shipping, onCheckout }) => {
  return (
    <div className="shopping-cart-summary">
      <h3>Summary</h3>
      <div>
        <p>ITEMS {items?.length}</p>
        <p>VNĐ {totalPrice}</p>
      </div>
      <div>
        <label>SHIPPING</label>
        <select>
          <option value="30.000">Standard-Delivery - 30.000VNĐ</option>
          <option value="50.000">Express-Delivery - 50.000VNĐ</option>
        </select>
      </div>
      <div>
        <label>GIVE CODE</label>
        <input type="text" placeholder="Enter your code" />
      </div>
      <div>
        <p>TOTAL PRICE</p>
        <p>VNĐ {totalPrice + shipping}</p>
      </div>
      <button onClick={onCheckout}>CHECKOUT</button>
    </div>
  );
};

export default ShoppingCartSummary;
