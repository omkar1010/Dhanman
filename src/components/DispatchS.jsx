// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { getMe } from '../features/authSlice';

// const DispatchS = () => {
//   const dispatches = useDispatch();
//   const navigate = useNavigate();
//   const { isError, user } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatches(getMe());
//   }, [dispatches]);

//   useEffect(() => {
//     if (isError) {
//       navigate("/");
//     }
//     if (user && user.role !== "dispatch" && user.role !== "admin") {
//       navigate("/dispatch");
//     }
//   }, [isError, user, navigate]);

//   return(
//     <>
//     </>
//   )
// };

// export default DispatchS;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getMe } from "../features/authSlice";
import axios from "axios";
import Autosuggest from "react-autosuggest";
import { CSVLink } from "react-csv";

const schema = yup.object().shape({
  dispatchDate: yup.date().required("Date is required"),
  cust_name: yup.string().required("Customer Name is required"),
  prod_name: yup.string().required("Product Name is required"),
  dispatchQuantity: yup
    .number()
    .typeError("Dispatch quantity must be a valid number")
    .required("Dispatch quantity is required"),
});

const DispatchProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const { isError, user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [dispatchedProducts, setDispatchedProducts] = useState([]);
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);


  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
    if (user && user.role !== "dispatch" && user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [isError, user, navigate]);

  useEffect(() => {
    // Fetch customers and products data
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/customers");
      setCustomers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = (data) => {
    // Add the dispatched product to the list
    setDispatchedProducts((prevProducts) => [...prevProducts, data]);
    // Clear the form fields after submission
    reset();
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleCustomerSearch = (value) => {
    const inputValue = value.trim().toLowerCase();
    const customerSuggestions = customers.filter((customer) =>
      customer.cust_name.toLowerCase().startsWith(inputValue)
    );
    setCustomerSuggestions(customerSuggestions);
    setSelectedCustomer(value);
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer.cust_name);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product.prod_name);
  };

  const handleCustomerChange = (event, { newValue }) => {
    setSelectedCustomer(newValue);
  };

  const getSuggestionValue = (customer) => {
    return customer.cust_name;
  };

  const renderSuggestion = (customer) => {
    return <div>{customer.cust_name}</div>;
  };


  const handleCompanySearch = (value) => {
    const suggestions = companies.filter((company) =>
      company.comp_name.toLowerCase().includes(value.toLowerCase())
    );
    setCompanySuggestions(suggestions);
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company.comp_name);
    // Filter products based on the selected company name
    const filteredProducts = filteredData.filter(
      (product) => product.comp_name === company.comp_name
    );
    setFilteredProducts(filteredProducts);
    // Reset the form's company name field
    reset({ comp_name: company.comp_name });
  };




  const inputProps = {
    placeholder: "Search Customer",
    value: selectedCustomer,
    onChange: handleCustomerChange,
  };

  const handleExportCSV = () => {
    const csvData = dispatchedProducts.map((product) => ({
      Date: product.dispatchDate,
      "Customer Name": product.cust_name,
      "Product Name": product.prod_name,
      "Dispatch Quantity": product.dispatchQuantity,
    }));

    const headers = [
      { label: "Date", key: "Date" },
      { label: "Customer Name", key: "Customer Name" },
      { label: "Product Name", key: "Product Name" },
      { label: "Dispatch Quantity", key: "Dispatch Quantity" },
    ];

    return (
      <div className="export-csv-container">
        <CSVLink
          data={csvData}
          headers={headers}
          filename={"dispatched_products.csv"}
          className="button is-primary"
        >
          Export as CSV
        </CSVLink>
      </div>
    );
  };

  return (
    <>
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-6">
              {/* Product Form */}
              <form
                className="p-8 rounded-s-md"
                style={{ backgroundColor: "#CAFFF0" }}
                onSubmit={handleSubmit(onSubmit)}
              >
                <h2
                  className="text-center m-5 text-header-add"
                  style={{
                    color: "#006A4D",
                    fontFamily: "Inter",
                    fontSize: "28px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "normal",
                  }}
                >
                  Dispatch
                </h2>
                <div className="field">
                  <div className="control">
                    <label className="label">Enter Date</label>
                    <Controller
                      name="Schedule_Date"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className={`input ${
                            errors.Schedule_Date ? "is-danger" : ""
                          }`}
                          type="date"
                          placeholder="Enter Schedule Date"
                        />
                      )}
                    />
                    {errors.Schedule_Date && (
                      <p className="help is-danger">
                        {errors.Schedule_Date.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="field field-equal-width">
  <div className="control">
    <label className="label">Company Name</label>
    <Autosuggest
      suggestions={companySuggestions}
      onSuggestionsFetchRequested={({ value }) =>
        handleCompanySearch(value)
      }
      onSuggestionsClearRequested={() =>
        setCompanySuggestions([])
      }
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={{
        ...inputProps,
        style: {
          width: '100%', // Default width for all devices
          maxWidth: '400px', // Maximum width for larger screens
          margin: '0 auto', // Center the input field
          padding: '6px', // Add some padding for better appearance
          boxSizing: 'border-box', // Ensure padding is included in the total width
          border: '0.5px ridge #D8D8D8', // Remove the border
        }
      }}
      onSuggestionSelected={(_, { suggestion }) =>
        handleCompanySelect(suggestion)
      }
      value={selectedCompany}
    />

    {errors.comp_name && (
      <p className="help is-danger">
        {errors.comp_name.message}
      </p>
    )}
  </div>
</div>
<div className="field">
  <div className="control">
    <label className="label">Product Name</label>
    <Controller
      name="prodId"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <select
          {...field}
          className={`input ${errors.prodId ? "is-danger" : ""}`}
        >
          <option value="">Select Product</option>
          {filteredProducts.map((product) => {
            console.log(product); // Log the entire product object
            console.log(product.prodId, product.prod_name); // Log the values for each product
            return (
              <option key={product.prodId} value={product.prodId}>
                {product.prod_name}
              </option>
            );
          })}
        </select>
      )}
    />
    {errors.prodId && (
      <p className="help is-danger">{errors.prodId.message}</p>
    )}
  </div>
</div>

                <div className="field">
                  <label className="label">Dispatch Quantity</label>
                  <div className="control">
                    <Controller
                      name="dispatchQuantity"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          style={{ width: "100%" }}
                        />
                      )}
                    />
                    {errors.dispatchQuantity && (
                      <p className="help is-danger">
                        {errors.dispatchQuantity.message}
                      </p>
                    )}
                  </div>
                </div>

                <center>
                  <div className="field">
                    <div className="control">
                      <button type="submit" className="button is-success">
                        {"Add"}
                      </button>
                    </div>
                  </div>
                </center>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <h2 className="title is-4">Dispatched Products</h2>
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Product Name</th>
              <th>Dispatch Quantity</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dispatchedProducts.map((product, index) => (
              <tr key={index}>
                <td>{product.dispatchDate}</td>
                <td>{product.cust_name}</td>
                <td>{product.prod_name}</td>
                <td>{product.dispatchQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DispatchProductPage;
