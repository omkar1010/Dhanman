import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Autosuggest from "react-autosuggest";
import { CSVLink } from "react-csv";
import "../index.css";

const schema = yup.object().shape({
  comp_name: yup.number().required("Company Name is required"),
  prod_name: yup.number().required("Product is required"),
  Production_Date: yup.date().required("Production Date is required"),
  Moulds_Poured: yup
    .number()
    .typeError("Production Quantity must be a valid number")
    .required("Production Quantity is required"),
  Prodction_Quantity: yup
    .number()
    .typeError("Production Quantity must be a valid number")
    .required("Production Quantity is required"),
  Production_Weight: yup
    .number()
    .typeError("Production Quantity must be a valid number")
    .required("Production Quantity is required"),
});

const AddProductionPage = () => {
  const [companies, setCompanies] = useState([]);
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState({});
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductionId, setCurrentProductionId] = useState("");
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    fetchCompanies();
    fetchProducts();
    fetchData();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/customers");
      setCompanies(response.data);
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

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/Productions");

      const sortedData = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Fetch the product data from the products endpoint
      const productResponse = await axios.get("http://localhost:5000/products");
      const productsData = productResponse.data.reduce(
        (acc, product) => ({
          ...acc,
          [product.prodId]: product.prod_name,
        }),
        {}
      );

      // Map the Productions and include the product name in each Production
      const filteredData = response.data.map((Production) => ({
        ...Production,
        prod_name: productsData[Production.prodId] || "N/A",
      }));

      setFilteredProducts(filteredData);
      setIsLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // After setting filteredData, check if we have a current Production (editing mode)
    if (currentProductionId) {
      // Find the corresponding Production object based on currentProductionId
      const currentProduction = filteredProducts.find(
        (Production) => Production.id === currentProductionId
      );

      // If we found a matching Production, set the product dropdown value to the prodId of the Production
      if (currentProduction) {
        reset({
          compId: currentProduction.compId,
          prodId: currentProduction.prodId,
          Production_Date: currentProduction.Production_Date,
          Moulds_Poured: currentProduction.Moulds_Poured,
          Prodction_Quantity: currentProduction.Prodction_Quantity,
          Production_Weight: currentProduction.Production_Weight,
        });
      }
    }
  }, [currentProductionId, filteredProducts, reset]);

  const onSubmit = async (data) => {
    try {
      // If editing, update the Production
      if (isEditing) {
        const confirmUpdate = window.confirm(
          "Are you sure you want to update this Production?"
        );
        if (confirmUpdate) {
          await updateProduction(data);
          setIsEditing(false);
        }
      } else {
        // If adding, create a new Production
        await addProduction(data);
      }

      reset();
      setCurrentProductionId("");
      setIsLoaded(false);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const addProduction = async (data) => {
    try {
      await axios.post("http://localhost:5000/Productions", data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateProduction = async (data) => {
    try {
      const ProductionId = currentProductionId;
      await axios.patch(
        `http://localhost:5000/Productions/${ProductionId}`,
        data
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProduction = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this Production?"
      );
      if (confirmDelete) {
        await axios.delete(`http://localhost:5000/Productions/${id}`);
        setIsLoaded(false);
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditProduction = (Production) => {
    reset({
      compId: Production.compId,
      prodId: Production.prodId,
      Production_Date: Production.Production_Date,
      Moulds_Poured: Production.Moulds_Poured,
      Prodction_Quantity: Production.Prodction_Quantity,
      Production_Weight: Production.Production_Weight,
    });

    setSelectedCompany({
      compId: Production.compId,
      comp_name: Production.comp_name,
    });
    setCurrentProductionId(Production.id);

    setIsEditing(true);
  };

  const handleExportCSV = () => {
    const csvData = filteredProducts.map((Production) => ({
      Company_Name: Production.comp_name,
      Product_Name: Production.prod_name,
      Production_Date: Production.Production_Date,
      Production_Weight: Production.Production_Weight,
      Prodction_Quantity: Production.Prodction_Quantity,
    }));

    return (
      <CSVLink
        data={csvData}
        filename={`Productions-${new Date().toISOString()}.csv`}
      >
        Export CSV
      </CSVLink>
    );
  };

  const handleCompanySearch = (value) => {
    const suggestions = companies.filter((company) =>
      company.comp_name.toLowerCase().includes(value.toLowerCase())
    );
    setCompanySuggestions(suggestions);
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);

    if (company.compId) {
      // If company.compId exists, filter products based on the selected company ID (compId)
      const filteredProducts = products.filter(
        (product) => product.compId === company.compId
      );
      setFilteredProducts(filteredProducts);
    } else if (company.comp_name) {
      // If company.comp_name exists, filter products based on the selected company name (comp_name)
      const filteredProducts = products.filter(
        (product) => product.comp_name === company.comp_name
      );
      setFilteredProducts(filteredProducts);
    }
  };

  const handleCompanyChange = (event, { newValue }) => {
    if (!newValue) {
      // If newValue is empty, reset the selectedCompany state
      setSelectedCompany({});
      // Reset the filtered products to show all products
      setFilteredProducts(products);
    } else {
      // If newValue is not empty, set compId to null and only set comp_name
      setSelectedCompany({ compId: null, comp_name: newValue });
      // Filter the products based on the entered company name (comp_name)
      const filteredProducts = products.filter(
        (product) => product.comp_name === newValue
      );
      setFilteredProducts(filteredProducts);
      
    }
    
  };

  console.log(filteredProducts)

  const getSuggestionValue = (company) => {
    return company.comp_name;
  };

  const renderSuggestion = (company) => {
    return <div>{company.comp_name}</div>;
  };

  const inputProps = {
    placeholder: "Search Company",
    value: selectedCompany?.comp_name || "", // Use optional chaining to safely access comp_name
    onChange: handleCompanyChange,
  };

  return (
    <>
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-6">
              <form
                className="p-8 rounded-s-md"
                style={{ backgroundColor: "#CAFFF0" }}
                onSubmit={handleSubmit(onSubmit)}
              >
                <h2
                  className="text-center m-5 text-header-add font-semibold"
                  style={{
                    color: "#006A4D",
                    fontFamily: "Inter",
                    fontSize: "28px",
                  }}
                >
                  Production
                </h2>

                <div className="field">
                  <div className="control" style={{ width: "100%" }}>
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
                          width: "100%", // Default width for all devices
                          maxWidth: "400px", // Maximum width for larger screens
                          margin: "0 auto", // Center the input field
                          padding: "6px", // Add some padding for better appearance
                          boxSizing: "border-box", // Ensure padding is included in the total width
                          border: "0.5px ridge #D8D8D8", // Remove the border
                        },
                      }}
                      onSuggestionSelected={(_, { suggestion }) =>
                        handleCompanySelect(suggestion)
                      }
                    />
                    {errors.compId && (
                      <p className="help is-danger">{errors.compId.message}</p>
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
                          className={`input ${
                            errors.prodId ? "is-danger" : ""
                          }`}
                          value={field.value} // Set the value to the prodId from the form data
                        >
                          <option value="">Select Product</option>
                          {filteredProducts.map((product) => (
                            <option key={product.prodId} value={product.prodId}>
                              {product.product?.prod_name}
                            </option>
                          ))}
                        </select>
                      )}
                    />

                    {errors.prodId && (
                      <p className="help is-danger">{errors.prodId.message}</p>
                    )}
                  </div>
                </div>

                <div className="field">
                  <div className="control">
                    <label className="label">Production Date</label>
                    <Controller
                      name="Production_Date"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className={`input ${
                            errors.Production_Date ? "is-danger" : ""
                          }`}
                          type="date"
                          placeholder="Enter Production Date"
                        />
                      )}
                    />
                    {errors.Production_Date && (
                      <p className="help is-danger">
                        {errors.Production_Date.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Production Mould Poured */}
                <div className="field">
                  <div className="control">
                    <label className="label">Enter Mould Poured</label>
                    <Controller
                      name="Moulds_Poured"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <input
                          {...field}
                          className={`input ${
                            errors.Moulds_Poured ? "is-danger" : ""
                          }`}
                          type="number"
                          placeholder="Enter Mould Poured"
                        />
                      )}
                    />
                    {errors.Moulds_Poured && (
                      <p className="help is-danger">
                        {errors.Moulds_Poured.message}
                      </p>
                    )}
                  </div>
                </div>


                <div className="field">
                  <div className="control">
                    <button type="submit" className="button is-primary">
                      {isEditing ? "Update" : "Add"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <table className="table is-striped is-bordered is-fullwidth">
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Company Name</th>
              <th>Product Name</th>
              <th>Production Date</th>
              <th>Enter Mould Poured</th>
              <th>Prodction Quantity</th>
              <th>Total Weight</th>
              <th>Date Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoaded ? (
              filteredProducts.map((Production, index) => (
                <tr key={Production.id}>
                  <td>{index + 1}</td>
                  <td>{Production.comp_name}</td>
                  <td>{Production.prodId.prod_name}</td>
                  <td>{Production.Production_Date}</td>
                  <td>{Production.Moulds_Poured}</td>
                  <td>{Production.Prodction_Quantity}</td>
                  <td>{Production.Production_Weight}</td>
                  <td>{new Date(Production.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="edit-button ml-1"
                      onClick={() => handleEditProduction(Production)}
                    >
                      <i className="fi fi-rr-edit"></i>
                    </button>{" "}
                    <button
                      className="delete-button ml-2"
                      onClick={() => handleDeleteProduction(Production.id)}
                    >
                      <i className="fi fi-rs-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="has-text-centered">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AddProductionPage;