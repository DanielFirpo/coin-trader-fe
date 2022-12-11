import React, { useEffect, useState } from 'react';
import { connect } from "react-redux"
import { setToast } from "../../../actions/actions"
import Item from "../../Item"
import openarrow from "../../../images/openarrow.svg"
import closedarrow from "../../../images/closedarrow.svg"

import axios from "axios"

function Homepage() {

    const [pageNumber, setPageNumber] = useState(0);
    const [availablePages, setAvailablePages] = useState(0);

    const [products, setProducts] = useState([]);

    const [filterOpen, setFilterOpen] = useState(true)
    const [filter, setFilter] = useState({ searchTerm: "", minPrice: "", maxPrice: "", minYear: "", maxYear: "" });

    useEffect(() => {
        axios
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
        axios
            .get(process.env.REACT_APP_API_URL + "products/products?pageNumber=" + pageNumber)
            .then(function (response) {
                setProducts(response.data.data)
            })
            .catch(function (error) {
                console.log("Error fetching products", error.response)
            })
    }

    function fetchProductSearch() {
        axios
            .get(process.env.REACT_APP_API_URL + "products/search?pageNumber=" + pageNumber + "&filter=" + JSON.stringify(filter))
            .then(function (response) {
                setProducts(response.data.data)
            })
            .catch(function (error) {
                console.log("Error fetching products", error.response)
            })
    }

    return (
        <div className="page-padding page-height">
            <h1 className="page-title"></h1>
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
                                        setFilter({...filter, searchTerm: e.target.value})
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
                                            setFilter({...filter, minPrice: e.target.value})
                                        }}></input>
                                        {/* </span> */}
                                        <span style={{ marginRight: "10px" }}>-</span>

                                        {/* <span class="price-input-container">$ */}
                                    $
                                        <input className="price-input" type="number" name="max-price" placeholder="Max" value={filter.maxPrice} onChange={(e) => {
                                            setFilter({...filter, maxPrice: e.target.value})
                                        }}></input>
                                    </span>
                                </div>
                            </div>

                            <div className="filter-column">

                                <p className="filter-title">Year</p>
                                <div className="filter-input-row">
                                    <span class="price-input-container">
                                        <input className="year-input" type="number" name="min-year" placeholder="Min" value={filter.minYear} onChange={(e) => {
                                            setFilter({...filter, minYear: e.target.value})
                                        }}></input>
                                        <span style={{ marginRight: "5px" }}>-</span>
                                        <input className="year-input" type="number" name="max-price" placeholder="Max" value={filter.maxYear} onChange={(e) => {
                                            setFilter({...filter, maxYear: e.target.value})
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
            <div id="item-list">
                {
                    products.map((item) => {
                        console.log("item: " + item);
                        return (
                            <Item item={item} />
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

export default connect(mapStateToProps, { setToast })(Homepage);