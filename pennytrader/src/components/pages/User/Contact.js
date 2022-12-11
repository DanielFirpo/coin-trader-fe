import React, {useState} from 'react';
import { setToast } from "../../../actions/actions"
import { connect } from "react-redux";
import axios from "axios";
import { useHistory } from 'react-router-dom';

function Contact(props) {

    const [error, setError] = useState("");
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");

    const history = useHistory();

    return (
        <div id="contact" className="page-height page-padding">
            <div className="page-title">Contact Us</div>
            <div className="page-subtitle" style={{paddingBottom: "120px", marginTop: "-60px"}}>Need help with an order? Contact us!</div>
            <div className="contact-value"><p style={{paddingRight: "5px"}}>Email:</p><a style={{color: "black"}} href="mailto:danielfirpodev@gmail.com">danielfirpodev@gmail.com</a></div>
            <div className="contact-value"><p style={{paddingRight: "5px"}}>Phone:</p><a style={{color: "black"}} href="tel:18000000000">1(800)-000-0000</a></div>
        </div>
    );
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, { setToast })(Contact);