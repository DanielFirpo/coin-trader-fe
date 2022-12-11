import React, { useState } from 'react';
import { setToast } from "../../../actions/actions"
import { connect } from "react-redux";
import axios from "axios";
import { useHistory } from 'react-router-dom';

function Login(props) {

    const [error, setError] = useState("");
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");

    const history = useHistory();

    return (
        <div id="login" className="page-height page-padding">
            <h1 className="page-title">Login</h1>
            <form id="login-form" name="login" method="POST">
                <input type="text" name="username" placeholder="Email or username" className="login-form-input" id="login-form-username" onChange={(e) => { setUsernameOrEmail(e.target.value) }}></input>
                <input type="password" name="password" placeholder="Password" className="login-form-input" id="login-form-password" onChange={(e) => { setPassword(e.target.value) }}></input>
                {/* <div id={successId}><div id="success-text">Your message was sent successfully. Thanks!</div><div onClick={() => {setSuccessId("success-hidden")}} id="success-close"></div></div> */}
                <div className="row-display">
                    <p className="form-error">{error}</p>
                    <button type="submit" onClick={(e) => {
                        e.preventDefault();
                        axios.post(`${process.env.REACT_APP_API_URL}login`, { usernameOrEmail: usernameOrEmail, password: password })
                            .then(function (response) {
                                console.log(response.data);
                                localStorage.setItem('token', response.data.token);
                                localStorage.setItem('administrator', response.data.administrator);
                                props.setToast("Logged In", "success")
                                history.push("/");
                            })
                            .catch(function (error) {
                                // console.log(error.response)
                                setError(error.response.data.message)
                            })
                    }} id="login-form-submit-button" className="button">Submit</button>
                </div>
                <button type="submit" onClick={(e) => {
                        e.preventDefault();
                        axios.post(`${process.env.REACT_APP_API_URL}login`, { usernameOrEmail: "USER", password: "USER" })
                            .then(function (response) {
                                console.log(response.data);
                                localStorage.setItem('token', response.data.token);
                                localStorage.setItem('administrator', response.data.administrator);
                                props.setToast("Logged In", "success")
                                history.push("/");
                            })
                            .catch(function (error) {
                                // console.log(error.response)
                                setError(error.response.data.message)
                            })
                    }} className="test-login-button">Skip This and Continue as Test User &gt;</button>
                                        <button type="submit" onClick={(e) => {
                        e.preventDefault();
                        axios.post(`${process.env.REACT_APP_API_URL}login`, { usernameOrEmail: "ADMIN", password: "ADMIN" })
                            .then(function (response) {
                                console.log(response.data);
                                localStorage.setItem('token', response.data.token);
                                localStorage.setItem('administrator', response.data.administrator);
                                props.setToast("Logged In", "success")
                                history.push("/");
                            })
                            .catch(function (error) {
                                // console.log(error.response)
                                setError(error.response.data.message)
                            })
                    }} className="test-login-button">Skip This and Continue as Test Admin &gt;</button>
            </form>
        </div>
    );
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, { setToast })(Login);