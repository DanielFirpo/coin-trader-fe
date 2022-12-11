import React, { useEffect } from "react";
import { connect } from "react-redux";
import { setImage, setToast } from "../actions/actions";

function CartItem(props) {
  return (
    <div className="cart-item-container">
      <div className="cart-item">
        <img
          className="cart-item-image"
          src={
            !props.item.front_image_name
              ? process.env.REACT_APP_API_URL + "images/products/no-image.png"
              : process.env.REACT_APP_API_URL +
                "images/products/" +
                props.item.front_image_name +
                ".png"
          }
          onClick={(e) => {
            if (props.item.front_image_name && props.item.front_image_name != "no-image") {
              props.setImage(
                process.env.REACT_APP_API_URL +
                  "images/products/" +
                  props.item.front_image_name +
                  ".png"
              );
            }
          }}
        ></img>
        <div className="cart-item-column">
          <p className="cart-item-title">
            {props.item.year} Penny - {props.item.name}
          </p>
          <p className="cart-item-description" title={props.item.description}>
            {props.item.description.length > 140
              ? props.item.description.substring(0, 140) + "..."
              : props.item.description}
          </p>
        </div>
        <div id="right-item-column" className="cart-item-column">
          <p className="cart-item-price">
            $
            {(props.item.price / 100).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          {!props.hideButton ? (
            <div
              className="cart-item-remove-button"
              onClick={() => {
                let cartArray = JSON.parse(localStorage.getItem("cart"));
                cartArray = cartArray.filter((value, index, arr) => {
                  return value != props.item.id;
                });
                localStorage.setItem("cart", JSON.stringify(cartArray));
                props.setUpdate(Date.now());
                props.setToast("Item Removed from Cart");
              }}
            >
              Remove
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { setImage, setToast })(CartItem);
