import React, { useState, useEffect } from 'react';
import { axiosWithAuth } from "../../../auth/AxiosWithAuth"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { setToast } from "../../../actions/actions"
import CartItem from "../../CartItem"

import openarrow from "../../../images/openarrow.svg"
import closedarrow from "../../../images/closedarrow.svg"

function Products(props) {

    const [pageNumber, setPageNumber] = useState(0);
    const [availablePages, setAvailablePages] = useState(0);

    const [products, setProducts] = useState([]);

    const [filterOpen, setFilterOpen] = useState(false)
    const [filter, setFilter] = useState({ searchTerm: "", minPrice: "", maxPrice: "", minYear: "", maxYear: "", status: 1 });

    useEffect(() => {
        axiosWithAuth()
            .get(process.env.REACT_APP_API_URL + "products/productpages")
            .then(function (response) {
                console.log("pages")
                console.log(response.data.pages)
                setAvailablePages(response.data.pages)
            })
            .catch(function (error) {
                console.log("Error fetching available product pages", error.response)
            })
    }, [])

    useEffect(() => {
        if (filter.searchTerm === "" && filter.minPrice === "" && filter.maxPrice === "" && filter.minYear === "" && filter.maxYear === "") {
            fetchProducts();
        } else {
            fetchProductSearch();
        }
    }, [pageNumber])

    // useEffect(() => {
    //     if (searchTerm === "") {
    //         fetchProducts();
    //     } else {
    //         fetchProductSearch();
    //     }
    // }, [searchTerm])

    function fetchProducts() {
        axiosWithAuth()
            .get(process.env.REACT_APP_API_URL + "products/adminproducts?pageNumber=" + pageNumber)
            .then(function (response) {
                console.log(response)
                setProducts(response.data.data)
            })
            .catch(function (error) {
                console.log("Error fetching products", error.response)
            })
    }

    function fetchProductSearch() {
        axiosWithAuth()
            .get(process.env.REACT_APP_API_URL + "products/adminsearch?pageNumber=" + pageNumber + "&filter=" + JSON.stringify(filter))
            .then(function (response) {
                console.log(response)
                setProducts(response.data.data)
            })
            .catch(function (error) {
                console.log("Error fetching products", error.response)
            })
    }

    return (
        <div id="products" className="page-height page-padding">
            <h1 className="page-title">Products</h1>
            <form id="products-search">
                <div id="coin-filter-container">
                    <div className="row-display"><div id="coin-filter-header">Filter Coins</div><img src={filterOpen ? openarrow : closedarrow} id="filter-collapse" onClick={() => {
                        setFilterOpen(!filterOpen)
                    }}></img></div>
                    <div id={"coin-filter" + (!filterOpen ? "-closed" : "")}>
                        <div className="filter-row">
                            <div className="filter-column">
                                <p className="filter-title">Search</p>
                                <div className="filter-input-row">
                                    <input className="coin-search" type="text" name="search" placeholder="Search for year, price, description, etc." value={filter.searchTerm} onChange={(e) => {
                                        setFilter({ ...filter, searchTerm: e.target.value })
                                    }}></input>
                                </div>
                            </div>
                        </div>


                        <div className="filter-row">
                            <div className="filter-column">
                                <p className="filter-title">Price</p>
                                <div className="filter-input-row">
                                    <span class="price-input-container">
                                        $
                                        <input className="price-input" type="number" name="min-price" placeholder="Min" value={filter.minPrice} onChange={(e) => {
                                            setFilter({ ...filter, minPrice: e.target.value })
                                        }}></input>
                                        {/* </span> */}
                                        <span style={{ marginRight: "10px" }}>-</span>

                                        {/* <span class="price-input-container">$ */}
                                    $
                                        <input className="price-input" type="number" name="max-price" placeholder="Max" value={filter.maxPrice} onChange={(e) => {
                                            setFilter({ ...filter, maxPrice: e.target.value })
                                        }}></input>
                                    </span>
                                </div>
                            </div>

                            <div className="filter-column">

                                <p className="filter-title">Year</p>
                                <div className="filter-input-row">
                                    <span class="price-input-container">
                                        <input className="year-input" type="number" name="min-year" placeholder="Min" value={filter.minYear} onChange={(e) => {
                                            setFilter({ ...filter, minYear: e.target.value })
                                        }}></input>
                                        <span style={{ marginRight: "5px" }}>-</span>
                                        <input className="year-input" type="number" name="max-price" placeholder="Max" value={filter.maxYear} onChange={(e) => {
                                            setFilter({ ...filter, maxYear: e.target.value })
                                        }}></input>
                                    </span>
                                </div>

                            </div>

                            <div className="filter-column">

                                <p className="filter-title">Status</p>
                                <div className="filter-input-row">
                                    <span class="price-input-container">
                                        Unlisted
                                        <input className="year-input" type="checkbox" name="unlisted" placeholder="Unlisted" checked={filter.status === 0} onChange={(e) => {
                                            setFilter({ ...filter, status: 0 })
                                        }}></input>
                                        Listed
                                        <input className="year-input" type="checkbox" name="unlisted" placeholder="Unlisted" checked={filter.status === 1} onChange={(e) => {
                                            setFilter({ ...filter, status: 1 })
                                        }}></input>
                                        Sold
                                        <input className="year-input" type="checkbox" name="unlisted" placeholder="Unlisted" checked={filter.status === 2} onChange={(e) => {
                                            setFilter({ ...filter, status: 2 })
                                        }}></input>
                                    </span>
                                </div>

                            </div>

                            <button id="filter-button" className="button" type="submit" onClick={(e) => {
                                e.preventDefault();
                                setPageNumber(0);
                                fetchProductSearch();
                            }}>Filter</button>

                        </div>
                    </div>
                </div>
            </form>
            <div id="product-list">
                {
                    products.map((item) => {
                        return (
                            <div id="product-container">
                                {/* <img id="product-image" src={process.env.REACT_APP_API_URL + "images/products/" + item.image_name}></img>
                                <div id="product-info-list">
                                    <p className="product-info">Name: {item.name}</p>
                                    <p className="product-info">Year: {item.year}</p>
                                    <p className="product-info">Price: ${item.price/100}</p>
                                    <p className="product-info">Description: {item.description}</p>
                                </div> */}
                                <CartItem item={item} hideButton="yes please :D"></CartItem>
                                <div id="product-buttons-container" style={{ marginTop: "-50px" }}>
                                    <Link to={{ pathname: 'editproduct', search: `?id=${item.id}&name=${item.name}&year=${item.year}&price=${item.price}&description=${item.description}&status=${item.status}&rating=${item.rating}&manufacturer=${item.manufacturer}&front_image_name=${item.front_image_name}` }}>
                                        <div className="product-button">Edit</div>
                                    </Link>
                                    <div className="product-button" onClick={() => {
                                        axiosWithAuth()
                                            .delete(`${process.env.REACT_APP_API_URL}admin/delete?id=${item.id}`)
                                            .then(function (response) {
                                                props.setToast("Deleted Product")
                                                setPageNumber("8127018237102391823128371293712893712983712837123871923871238719387123712837192837198237918237918273198237918731928731283718237192837    ");
                                                setPageNumber(pageNumber);//fetch products again now that we deleted that one
                                            })
                                            .catch(function (error) {
                                                console.log(error.response)
                                            })
                                    }}>Delete</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div id="page-controls">
                <div className="button" id="previous-page" onClick={() => { pageNumber == 0 ? setPageNumber(0) : setPageNumber(pageNumber - 1) }}>Prev</div>
                <div id="page-number">{pageNumber + 1}</div>
                <div className="button" id="next-page" onClick={() => { pageNumber + 1 < availablePages ? setPageNumber(pageNumber + 1) : setPageNumber(pageNumber) }}>Next</div>
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, { setToast })(Products);