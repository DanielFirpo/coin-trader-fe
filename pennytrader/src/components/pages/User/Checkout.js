import React, { useState, useEffect } from "react";
import { setToast } from "../../../actions/actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { axiosWithAuth } from "../../../auth/AxiosWithAuth";
import axios from "axios";
import paypal from "../../../images/paypal.svg";
import validator from "validator";

function Checkout(props) {
  //step 0 = shipping info, 1 = payment
  const [step, setStep] = useState(0);
  const [error, setError] = useState();
  const [shippingInfo, setShippingInfo] = useState({
    firstName: undefined,
    lastName: undefined,
    address: undefined,
    address2: undefined,
    city: undefined,
    state: "AL",
    zip: undefined,
    phone: undefined,
    email: undefined,
    save: true,
  });

  const [shippingInfoErrors, setShippingInfoErrors] = useState({
    firstName: undefined,
    lastName: undefined,
    address: undefined,
    address2: undefined,
    city: undefined,
    zip: undefined,
    phone: undefined,
    email: undefined,
  });

  const [taxAndShipping, setTaxAndShipping] = useState({
    tax_rate: 0,
    shipping_fee: 0,
  });
  const [products, setProducts] = useState([]);

  const [accepted, setAccepted] = useState(false);
  const [acceptedError, setAcceptedError] = useState(false);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + "payment/taxandshipping")
      .then(function (response) {
        setTaxAndShipping(response.data.data);
      })
      .catch(function (error) {
        console.log("Error fetching tax and shipping", error.response);
      });

    fetchProducts();
  }, []);

  function fetchProducts() {
    let itemIDs = JSON.parse(localStorage.getItem("cart"));
    if (!itemIDs) {
      itemIDs = [];
    }
    if (itemIDs.length > 0) {
      axios
        .get(
          process.env.REACT_APP_API_URL +
            "products/product?ids=" +
            JSON.stringify(itemIDs)
        )
        .then(function (response) {
          setProducts(response.data.data);
        })
        .catch(function (error) {
          console.log("Error fetching products", error.response);
        });
    } else {
      setProducts([]);
    }
  }

  useEffect(() => {

    if (localStorage.getItem("token") && step == 0) {
      axiosWithAuth()
        .get(`${process.env.REACT_APP_API_URL}shipping`)
        .then((res) => {
            console.log("getting saved shipping", res.data);
          let savedShippingInfo = {
            firstName: undefined,
            lastName: undefined,
            address: undefined,
            address2: undefined,
            city: undefined,
            state: "AL",
            zip: undefined,
            phone: undefined,
            email: undefined,
            save: true,
          };
          res.data = res.data.data[0];
          if (res.data.first_name) {
            savedShippingInfo.firstName = res.data.first_name;
          }
          if (res.data.last_name) {
            savedShippingInfo.lastName = res.data.last_name;
          }
          if (res.data.address) {
            savedShippingInfo.address = res.data.address;
          }
          if (res.data.address_2) {
            savedShippingInfo.address2 = res.data.address_2 == "undefined" ? "" : res.data.address_2;
          }
          if (res.data.city) {
            savedShippingInfo.city = res.data.city;
          }
          if (res.data.state) {
            savedShippingInfo.state = res.data.state;
          }
          if (res.data.zip) {
            savedShippingInfo.zip = res.data.zip;
          }
          if (res.data.phone) {
            savedShippingInfo.phone = res.data.phone;
          }
          if (res.data.email) {
            savedShippingInfo.email = res.data.email;
          }
          setShippingInfo(savedShippingInfo);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [step]);

  return (
    <div id="checkout" className="page-height page-padding">
      {shipping()}
      {payment()}
    </div>
  );

  function shippingHasErrors() {
    return (
      shippingInfoErrors.firstName ||
      shippingInfoErrors.lastName ||
      shippingInfoErrors.address ||
      shippingInfoErrors.address2 ||
      shippingInfoErrors.city ||
      shippingInfoErrors.zip ||
      shippingInfoErrors.phone ||
      shippingInfoErrors.email ||
      !(
        shippingInfo.firstName &&
        shippingInfo.lastName &&
        shippingInfo.address &&
        shippingInfo.city &&
        shippingInfo.zip &&
        shippingInfo.phone &&
        shippingInfo.email
      )
    );
  }

  function shipping() {
    // -+------------=------------+-

    //          ~ BEHOLD ~

    // -+------------=------------+-

    //    THE MOST CONVOLUTED FORM
    //    YOU'VE EVER SEEN IN YOUR
    //        ENTIRE EXISTANCE

    if (step == 0) {
      return (
        <div>
          <div className="checkout-title" style={{marginBottom: "20px"}}>Shipping Info</div>
          <div className="page-subtitle" style={{marginBottom: "10vh"}}>Warning! Do not enter real info, anyone can access the test admin account and can read what is entered here from the Orders page.</div>
          <div className="checkout-form-container">
            <form id="checkout-form" name="register" method="POST">
              <div id="first-and-last" className="checkout-form-row">
                <div className="checkout-form-input-container checkout-form-half-width">
                  <div className="shipping-form-input-title">
                    <p className="form-field-title">First Name</p>
                    {shippingInfoErrors.firstName ? (
                      <>
                        <div className="shipping-form-input-error-image"></div>
                        <p className="shipping-form-input-error-text">
                          {shippingInfoErrors.firstName}
                        </p>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <input
                    type="text"
                    value={shippingInfo.firstName}
                    name="firstname"
                    placeholder="First Name"
                    className="shipping-form-input"
                    id="shipping-form-firstname"
                    onChange={(e) => {
                      setShippingInfo({
                        ...shippingInfo,
                        firstName: e.target.value,
                      });
                    }}
                    onBlur={() => {
                      if (
                        !shippingInfo.firstName ||
                        shippingInfo.firstName.length == 0
                      ) {
                        setShippingInfoErrors({
                          ...shippingInfoErrors,
                          firstName: "Required",
                        });
                      } else {
                        setShippingInfoErrors({
                          ...shippingInfoErrors,
                          firstName: undefined,
                        });
                      }
                    }}
                  ></input>
                </div>
                <div className="checkout-form-padding"></div>
                <div className="checkout-form-input-container checkout-form-half-width">
                  <div className="shipping-form-input-title">
                    <p className="form-field-title">Last Name</p>
                    {shippingInfoErrors.lastName ? (
                      <>
                        <div className="shipping-form-input-error-image"></div>
                        <p className="shipping-form-input-error-text">
                          {shippingInfoErrors.lastName}
                        </p>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <input
                    type="text"
                    value={shippingInfo.lastName}
                    name="lastname"
                    placeholder="Last Name"
                    className="shipping-form-input checkout-form-half-width"
                    id="shipping-form-lastname"
                    onChange={(e) => {
                      setShippingInfo({
                        ...shippingInfo,
                        lastName: e.target.value,
                      });
                    }}
                    onBlur={() => {
                      if (
                        !shippingInfo.lastName ||
                        shippingInfo.lastName.length == 0
                      ) {
                        console.log("Working");
                        setShippingInfoErrors({
                          ...shippingInfoErrors,
                          lastName: "Required",
                        });
                      } else {
                        setShippingInfoErrors({
                          ...shippingInfoErrors,
                          lastName: undefined,
                        });
                      }
                    }}
                  ></input>
                </div>
              </div>
              <div className="shipping-form-input-title">
                <p className="form-field-title">Address</p>
                {shippingInfoErrors.address ? (
                  <>
                    <div className="shipping-form-input-error-image"></div>
                    <p className="shipping-form-input-error-text">
                      {shippingInfoErrors.address}
                    </p>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <input
                type="text"
                value={shippingInfo.address}
                name="address"
                placeholder="Address"
                className="shipping-form-input checkout-form-full-width"
                id="shipping-form-address"
                onChange={(e) => {
                  setShippingInfo({ ...shippingInfo, address: e.target.value });
                }}
                onBlur={() => {
                  if (
                    !shippingInfo.address ||
                    shippingInfo.address.length == 0
                  ) {
                    setShippingInfoErrors({
                      ...shippingInfoErrors,
                      address: "Required",
                    });
                  } else {
                    setShippingInfoErrors({
                      ...shippingInfoErrors,
                      address: undefined,
                    });
                  }
                }}
              ></input>
              <div className="shipping-form-input-title">
                <p className="form-field-title">Address 2</p>
                {shippingInfoErrors.address2 ? (
                  <>
                    <div className="shipping-form-input-error-image"></div>
                    <p className="shipping-form-input-error-text">
                      {shippingInfoErrors.address2}
                    </p>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <input
                type="text"
                value={shippingInfo.address2}
                name="address2"
                placeholder="Address 2 (optional)"
                className="shipping-form-input checkout-form-full-width"
                id="shipping-form-address2"
                onChange={(e) => {
                  setShippingInfo({
                    ...shippingInfo,
                    address2: e.target.value,
                  });
                }}
                onBlur={() => {
                  if (false) {
                  } else {
                    setShippingInfoErrors({
                      ...shippingInfoErrors,
                      address2: undefined,
                    });
                  }
                }}
              ></input>
              <div id={"city-state-zip-row"} className="checkout-form-row">
                <div className="checkout-form-input-container checkout-form-third-width">
                  <div className="shipping-form-input-title">
                    <p className="form-field-title">City</p>
                    {shippingInfoErrors.city ? (
                      <>
                        <div className="shipping-form-input-error-image"></div>
                        <p className="shipping-form-input-error-text">
                          {shippingInfoErrors.city}
                        </p>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <input
                    type="text"
                    value={shippingInfo.city}
                    name="city"
                    placeholder="City"
                    className="shipping-form-input"
                    id="shipping-form-city"
                    onChange={(e) => {
                      setShippingInfo({
                        ...shippingInfo,
                        city: e.target.value,
                      });
                    }}
                    onBlur={() => {
                      if (!shippingInfo.city || shippingInfo.city.length == 0) {
                        setShippingInfoErrors({
                          ...shippingInfoErrors,
                          city: "Required",
                        });
                      } else {
                        setShippingInfoErrors({
                          ...shippingInfoErrors,
                          city: undefined,
                        });
                      }
                    }}
                  ></input>
                </div>
                <div className="checkout-form-padding-third"></div>
                <div className="checkout-form-input-container checkout-form-third-width">
                  <p id="padding-before-state" className="form-field-title">
                    State
                  </p>
                  <select
                    value={shippingInfo.state}
                    className="shipping-form-input"
                    id="shipping-form-state"
                    onChange={(e) => {
                      setShippingInfo({
                        ...shippingInfo,
                        state: e.target.value,
                      });
                    }}
                  >
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                  </select>
                </div>
                <div className="checkout-form-padding-third"></div>
                <div className="checkout-form-input-container checkout-form-third-width">
                  <div className="shipping-form-input-title">
                    <p className="form-field-title">Postal Code</p>
                    {shippingInfoErrors.zip ? (
                      <>
                        <div className="shipping-form-input-error-image"></div>
                        <p className="shipping-form-input-error-text">
                          {shippingInfoErrors.zip}
                        </p>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>{" "}
                  <input
                    type="number"
                    value={shippingInfo.zip}
                    name="zip"
                    placeholder="Postal Code"
                    className="shipping-form-input"
                    id="shipping-form-zip"
                    onChange={(e) => {
                      setShippingInfo({ ...shippingInfo, zip: e.target.value });
                    }}
                    onBlur={() => {
                      let error = "";

                      if (!shippingInfo.zip || shippingInfo.zip.length == 0) {
                        error += "Required";
                      } else if (
                        !validator.isPostalCode(shippingInfo.zip, "US")
                      ) {
                        error += "Invalid";
                      }

                      if (error != "") {
                        setShippingInfoErrors({
                          ...shippingInfoErrors,
                          zip: error,
                        });
                      } else {
                        setShippingInfoErrors({
                          ...shippingInfoErrors,
                          zip: undefined,
                        });
                      }
                    }}
                  ></input>
                </div>
              </div>
              <div className="shipping-form-input-title">
                <p className="form-field-title">Phone</p>
                {shippingInfoErrors.phone ? (
                  <>
                    <div className="shipping-form-input-error-image"></div>
                    <p className="shipping-form-input-error-text">
                      {shippingInfoErrors.phone}
                    </p>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <input
                type="tel"
                name="phone"
                value={shippingInfo.phone}
                placeholder="Phone"
                className="shipping-form-input checkout-form-third-width"
                id="shipping-form-phone"
                onChange={(e) => {
                  setShippingInfo({ ...shippingInfo, phone: e.target.value });
                }}
                onBlur={() => {
                  let error = "";

                  if (!shippingInfo.phone || shippingInfo.phone.length == 0) {
                    error += "Required";
                  } else if (!validator.isMobilePhone(shippingInfo.phone)) {
                    error += "Invalid";
                  }

                  if (error != "") {
                    setShippingInfoErrors({
                      ...shippingInfoErrors,
                      phone: error,
                    });
                  } else {
                    setShippingInfoErrors({
                      ...shippingInfoErrors,
                      phone: undefined,
                    });
                  }
                }}
              ></input>
              <div className="shipping-form-input-title">
                <p className="form-field-title">Email</p>
                {shippingInfoErrors.email ? (
                  <>
                    <div className="shipping-form-input-error-image"></div>
                    <p className="shipping-form-input-error-text">
                      {shippingInfoErrors.email}
                    </p>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <input
                type="email"
                name="email"
                value={shippingInfo.email}
                placeholder="Email"
                className="shipping-form-input checkout-form-two-third-width"
                id="shipping-form-email"
                onChange={(e) => {
                  setShippingInfo({ ...shippingInfo, email: e.target.value });
                }}
                onBlur={() => {
                  let error = "";

                  if (!shippingInfo.email || shippingInfo.email.length == 0) {
                    error += "Required";
                  } else if (!validator.isEmail(shippingInfo.email)) {
                    error += "Invalid";
                  }

                  if (error != "") {
                    setShippingInfoErrors({
                      ...shippingInfoErrors,
                      email: error,
                    });
                  } else {
                    setShippingInfoErrors({
                      ...shippingInfoErrors,
                      email: undefined,
                    });
                  }
                }}
              ></input>
              {localStorage.getItem("token") ? (
                <div className="row-display">
                  <p>Save shipping info for future purchases?</p>
                  <input
                    type="checkbox"
                    checked={shippingInfo.save}
                    name="save"
                    placeholder="Save Shipping Address?"
                    className="shipping-form-input"
                    id="shipping-form-save"
                    onChange={(e) => {
                      setShippingInfo({
                        ...shippingInfoErrors,
                        save: e.target.checked,
                      });
                    }}
                  ></input>
                </div>
              ) : (
                <></>
              )}
            </form>
          </div>
          <p>{error}</p>
          <div className="checkout-buttons">
            <Link to={"/cart"} className="cart-back-to-shopping">
              &#60; Back To Cart
            </Link>
            <div
              className={shippingHasErrors() ? "button-disabled" : "button"}
              onClick={(e) => {
                //TODO: validate shipping info
                console.log("resulting ship info");
                console.log(shippingInfo);
                e.preventDefault();
                console.log(shippingInfoErrors);
                if (!shippingHasErrors()) {
                  if (shippingInfo.save) {
                    axiosWithAuth()
                      .put(`${process.env.REACT_APP_API_URL}shipping`, {
                        shipping: shippingInfo,
                      })
                      .then((res) => {
                        console.log("updated shipping info");
                        setStep(1);
                      })
                      .catch(function (error) {
                        console.log(error);
                        setStep(1);
                      });
                  }
                }
              }}
            >
              Next &gt;
            </div>
          </div>
        </div>
      );
    }
  }

  function payment() {
    if (step == 1) {
      let priceTotal = 0.0;
      products.forEach((item) => {
        priceTotal += item.price;
      });
      return (
        <div>
          <h1 className="checkout-title">Payment</h1>

          <div>
            <div className="cart-breakdown-container">
              <p className="cart-breakdown" style={{ flexShrink: 0 }}>
                Subtotal ({JSON.parse(localStorage.getItem("cart")).length}{" "}
                items)
              </p>
              <div className="cart-breakdown-division"></div>
              <p className="cart-breakdown-value">
                $
                {(priceTotal / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="cart-breakdown-container">
              <p className="cart-breakdown">Tax </p>
              <div className="cart-breakdown-division"></div>
              <p className="cart-breakdown-value">
                $
                {(
                  (priceTotal / 100) *
                  (taxAndShipping.tax_rate / 10000)
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="cart-breakdown-container">
              <p className="cart-breakdown">Shipping </p>
              <div className="cart-breakdown-division"></div>
              <p className="cart-breakdown-value">
                $
                {(taxAndShipping.shipping_fee / 100).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="cart-linebreak"></div>

            <div className="cart-checkout">
              <p className="cart-total">Total</p>
              <div className="cart-breakdown-division"></div>
              <p className="cart-total-value">
                $
                {(
                  priceTotal / 100 +
                  taxAndShipping.shipping_fee / 100 +
                  (priceTotal / 100) * (taxAndShipping.tax_rate / 10000)
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              {/* TODO: Get min purchase amount from server and don't allow them to checkout if subtotal not met. Also get and display tax rate/shipping fee */}
            </div>
            <form>
              <div className="row-display">
                <p>
                  I fully understand that sales are final, and that Ultimate
                  Penny Trader offers <strong>absolutely no returns.</strong>
                </p>
                <input
                  type="checkbox"
                  checked={accepted}
                  name="accept"
                  placeholder="accept"
                  className="shipping-form-input"
                  id="shipping-form-save"
                  onChange={(e) => {
                    setAccepted(!accepted);
                  }}
                ></input>
                {acceptedError && !accepted ? (
                  <div
                    style={{ marginTop: "15px", color: "red" }}
                    className="row-display"
                  >
                    <div
                      style={{
                        width: "25px",
                        height: "25px",
                        marginTop: "0px",
                      }}
                      className="shipping-form-input-error-image"
                    ></div>
                    Required{" "}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </form>
          </div>
          <div className="checkout-buttons">
            <div
              className="cart-back-to-shopping"
              onClick={(e) => {
                setStep(0);
              }}
            >
              &#60; Back to Shipping
            </div>

            <div id="paypal-button-container">
              <div
                id="paypal-button"
                onClick={(e) => {
                  if (!localStorage.getItem("token")) {
                    axios
                      .post(`${process.env.REACT_APP_API_URL}payment/pay`, {
                        coins: JSON.parse(localStorage.getItem("cart")),
                        shipping: shippingInfo,
                      })
                      .then((res) => {
                        let text = res.data;
                        console.log(
                          "successfully got paypal checkout URL: " + text
                        );
                        window.location.assign(text);
                      })
                      .catch(function (error) {
                        console.log(JSON.stringify(error));
                      });
                  } else {
                    console.log("LOGGED IN CHECKOUT");
                    if (accepted) {
                      axiosWithAuth()
                        .post(`${process.env.REACT_APP_API_URL}payment/pay`, {
                          coins: JSON.parse(localStorage.getItem("cart")),
                          shipping: shippingInfo,
                        })
                        .then((res) => {
                          let text = res.data;
                          console.log(
                            "successfully got paypal checkout URL: " + text
                          );
                          window.location.assign(text);
                        })
                        .catch(function (error) {
                          console.log(JSON.stringify(error));
                        });
                    } else {
                      setAcceptedError(true);
                    }
                  }
                }}
              >
                <span id="pay-with">Pay with </span>
                <img id="paypal-logo" src={paypal}></img>
              </div>
              <span id="paypal-text">The safer, faster way to pay</span>
              <br />
              <div
                className={"button"}
                onClick={(e) => {
                  e.preventDefault();
                  if (accepted) {
                    axiosWithAuth()
                      .post(
                        `${process.env.REACT_APP_API_URL}payment/testsuccess`,
                        {
                          coins: JSON.parse(localStorage.getItem("cart")),
                          shipping: shippingInfo,
                        }
                      )
                      .then((res) => {
                        let text = res.data.redirect;
                        console.log(
                          "successfully got paypal checkout URL: " + text
                        );
                        window.location.assign(text);
                      })
                      .catch(function (error) {
                        console.log(error);
                        props.setToast(error.response.data.error, "failure")
                      });
                  } else {
                    setAcceptedError(true);
                  }
                }}
              >
                Instantly Pay (to Test Application) &gt;
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { setToast })(Checkout);
