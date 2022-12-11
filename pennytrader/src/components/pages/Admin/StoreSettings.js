import React, { useState, useEffect } from 'react';
import qs from "qs";
import { axiosWithAuth } from "../../../auth/AxiosWithAuth"
import {connect} from "react-redux"
import {setToast} from "../../../actions/actions"

function StoreSettings(props) {

    const [settings, setSettings] = useState({});

    useEffect(() => {
        axiosWithAuth().get(`${process.env.REACT_APP_API_URL}admin/storesettings`)
            .then(res => {
                console.log(res.data)
                setSettings({tax_rate: res.data.tax_rate / 100, shipping_fee: res.data.shipping_fee / 100});
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])

    return (
        <div id="storesettings" className="page-height page-padding">
            <h1 className="page-title">Store Settings</h1>
            <form id="settings-form" name="storesettings">

                <p className="coin-input-title">Tax Rate %</p>
                <input type="number" value={settings.tax_rate} name="tax" placeholder="Tax rate % (e.g. 3.25)" className="add-coin-form-input" onChange={(e) => { setSettings({...settings, tax_rate: e.target.value}) }}></input>
                <p className="coin-input-title">Shipping Fee $</p>
                <input type="number" value={settings.shipping_fee} name="shipping" placeholder="Shipping fee in dollars (e.g. 3.25)" className="add-coin-form-input" onChange={(e) => { setSettings({...settings, shipping_fee: e.target.value}) }}></input>
        
                <button type="submit" onClick={(e) => {

                    e.preventDefault();

                    axiosWithAuth().post(`${process.env.REACT_APP_API_URL}admin/storesettings`, {...{tax_rate: settings.tax_rate * 100, shipping_fee: settings.shipping_fee * 100}})
                    .then(function (response) {
                        props.setToast("Settings Edited");
                    })
                    .catch(function (error) {
                        console.log(error.response)
                        // setError(error.response.data.message);
                    })
                }} className="button" style={{display: "block", marginTop: "50px"}}>Update</button>

            </form>
        </div>
    );
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, { setToast })(StoreSettings);