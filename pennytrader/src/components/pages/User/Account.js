import React, { useState, useEffect } from 'react';
import { setToast } from "../../../actions/actions"
import { connect } from "react-redux";
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { axiosWithAuth } from '../../../auth/AxiosWithAuth';
import { Link } from "react-router-dom"

function Account(props) {

    const [orders, setOrders] = useState([]);
    const [details, setDetails] = useState({});
    const [passwords, setPasswords] = useState({password: "", confirmedPassword: ""});
    const [error, setError] = useState("");

    useEffect(() => {
        axiosWithAuth().get(`${process.env.REACT_APP_API_URL}orders`)
            .then(res => {
                console.log(res.data)
                setOrders(res.data.rows);
            })
            .catch(function (error) {
                console.log(error)
            })

        axiosWithAuth().get(`${process.env.REACT_APP_API_URL}details`)
            .then(res => {
                setDetails(res.data[0]);
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])

    const history = useHistory();

    return (
        <div id="account" className="page-height page-padding">
            <h1 className="page-title">Your Account</h1>
            <p className="page-subtitle">Orders</p>
            <div id="account-orders-table">
                <div id="orders-table-titles" className="row-display"><div className="full-width">ID</div><div className="full-width">Total</div><div className="full-width">Status</div><div className="full-width">Date</div></div>
                <div id="orders-table-values" className="column-display">
                    {
                        orders.map((order, index) => {
                            let status;
                            if (order.status == 0) {
                                status = "Placed"
                            }
                            else if (order.status == 1) {
                                status = "Shipped"
                            }
                            else {
                                status = "Delivered"
                            }
                            return (
                                <div id={index % 2 == 0 ? "" : "odd-table-row"} className="row-display orders-table-value-row">
                                    <div className="full-width">{order.id}</div>
                                    <div className="full-width">${(order.total / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                    <div className="full-width">{status}</div>
                                    <div className="full-width">{order.date.substring(0, 10)}</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div id="account-details" className="column-display">

                <p className="page-subtitle">Username</p>
                <div className="account-details-row"> {details.username}</div>

                <p className="page-subtitle">Email</p>
                <div className="account-details-row"> {details.email}</div>

                <p className="page-subtitle">Password</p>
                <form id="account-form" name="storesettings">

                    <p className="new-password-input-title" style={{marginTop: "10px"}}>New Password</p>
                    <input type="password" value={passwords.password} name="password" placeholder="New Password" className="" onChange={(e) => { setPasswords({ ...passwords, password: e.target.value }) }}></input>
                    <p className="new-password-input-title">Confirm New Password</p>
                    <input type="password" value={passwords.confirmedPassword} name="confirm" placeholder="Confirm New Password" className="" onChange={(e) => { setPasswords({ ...passwords, confirmedPassword: e.target.value }) }}></input>
                <p className="error-text">{error}</p>
                </form>
                <div className="button account-details-row" style={{ width: "150px" }} onClick={(e) => {
                    e.preventDefault()
                    if(passwords.password != passwords.confirmedPassword) {
                        setError("Passwords do not match.")
                    }
                    else if(passwords.password.length == 0) {
                        setError("Password too short.")
                    }
                    else {
                        axiosWithAuth().put(`${process.env.REACT_APP_API_URL}updatepassword`, {password: passwords.password})
                        .then(res => {
                            props.setToast("Password Changed")
                        })
                        .catch(function (error) {
                            console.log(error?.response?.data?.message)
                            setError(error?.response?.data?.message)
                        })
                    }
                }}>Change Password</div>

            </div>
        </div>
    );
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, { setToast })(Account);