import React, { useState, useEffect } from 'react';
import qs from "qs";
import { axiosWithAuth } from "../../../auth/AxiosWithAuth"
import { Link } from "react-router-dom"
import CartItem from "../../CartItem"

function Order(props) {

    const [order, setOrder] = useState();
    const [status, setStatus] = useState(0);

    useEffect(() => {
        axiosWithAuth().get(`${process.env.REACT_APP_API_URL}/order?id=${qs.parse(props.location.search, { ignoreQueryPrefix: true }).id}`)
            .then(res => {
                console.log(res.data)
                if (res.data.order.status === 0) {
                    res.data.order.readableStatus = "Placed"
                }
                else if (res.data.order.status === 1) {
                    res.data.order.readableStatus = "Shipped"
                }
                else if (res.data.order.status === 2) {
                    res.data.order.readableStatus = "Delivered"
                }
                console.log(res.data.order)
                setOrder(res.data.order);
                setStatus(res.data.order.status)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])

    return (
        <div id="order" className="page-height page-padding">
            <h1 className="page-title">Order Info</h1>
            {
                order ?
                    <div>
                        <div id="order-info-table">

                            <div className="order-info-column">
                                <p className="page-subtitle">Status</p>
                                <p className="order-info">{order.readableStatus}</p>
                            </div>

                            <div className="order-info-column">

                                <p className="order-info page-subtitle">Total</p>
                                <p className="order-info">${(order.total / 100)}</p>
                            </div>

                            <div className="order-info-column">
                                <p className="order-info page-subtitle">First Name</p>
                                <p className="order-info">{order.first_name}</p>
                            </div>

                            <div className="order-info-column">
                                <p className="order-info page-subtitle">Last Name</p>
                                <p className="order-info">{order.last_name}</p>
                            </div>

                            <div className="order-info-column">
                                <p className="order-info page-subtitle">Address</p>
                                <p className="order-info">{order.address}</p>
                            </div>

                            <div className="order-info-column">
                                <p className="order-info page-subtitle">City</p>
                                <p className="order-info">{order.city}</p>
                            </div>

                            <div className="order-info-column">
                                <p className="order-info page-subtitle">State</p>
                                <p className="order-info">{order.state}</p>
                            </div>

                            <div className="order-info-column">
                                <p className="order-info page-subtitle">ZIP</p>
                                <p className="order-info">{order.zip}</p>
                            </div>

                            <div className="order-info-column">
                                <p className="order-info page-subtitle">Phone</p>
                                <p className="order-info">{order.phone}</p>
                            </div>

                            <div className="order-info-column">
                                <p className="order-info page-subtitle">Email</p>
                                <p className="order-info">{order.email}</p>
                            </div>

                            <div className="order-info-column">
                                <p className="order-info page-subtitle">Date Placed</p>
                                <p className="order-info">{order.date.substring(0, 10)}</p>
                            </div>

                        </div>

                        <div id="order-item-list">
                            {
                                order.items.map((item) => {
                                    return (
                                        <CartItem hideButton="yes" item={item}></CartItem>
                                    )
                                })
                            }
                        </div>
                    </div>
                    :
                    <p>Loading...</p>
            }
        </div>
    );
}

export default Order;