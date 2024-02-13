import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select, { components } from "react-select";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Rejection1.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import AsyncSelect from "react-select/async";
import Autosuggest from "react-autosuggest";
import TextField from "@mui/material/TextField";
import { CSVLink } from "react-csv";

// import dateIcon from '../images/date-icon.png';
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const schema = yup.object().shape({
  cust_name: yup.object(),
  comp_name: yup.string().required("Company Name is required"),
  quantity: yup.string().required("Quantity is required"),
  date: yup.string().required("Date is required"),
  prodId: yup.string().required("Product is required"),
  // ... Other fields ...

  // Loop to generate schema for Rejection Quantity fields
  ...Array.from({ length: 10 }).reduce((rejectionSchema, index) => {
    rejectionSchema[`rejec_Id[${index}]`] = yup
      .number()
      .integer("Rejection Quantity must be an integer")
      .positive("Rejection Quantity must be a positive number")
      .typeError("Invalid Rejection Quantity value")
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      );
    return rejectionSchema;
  }, {}),
});

const Rejection1Page = () => {
  const [isIconChanged, setIsIconChanged] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [currentCustomerId, setCurrentCustomerId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyObj, setSelectedCompanyObj] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [rejections, setRejections] = useState([]);
  const [products, setProducts] = useState([]);
  const [subtype, setSubtype] = useState([]);
  const [inputValues, setInputValues] = useState([]);
  const [rejecIds, setRejecIds] = useState([]);
  const [rejectionQuantities, setRejectionQuantities] = useState([]);
  const [currentRejectionId, setCurrentRejectionId] = useState(null);

  const rejecTypes = [
    { label: "Drain" },
    { label: "Shrink" },
    { label: "Sand" },
    { label: "Core Puncture" },
    { label: "Short Poured" },
    { label: "Parting Leek" },
    { label: "Cold" },
    { label: "Blow" },
    { label: "core Puncture" },
    { label: "Other" },
  ];

  const handleQuantityChange = (rejecId, quantity) => {
    const updatedRejections = [...rejections];
    const existingIndex = updatedRejections.findIndex(
      (rej) => rej.rejec_Id === rejecId
    );

    if (existingIndex !== -1) {
      updatedRejections[existingIndex].Rejection_Quantity = quantity;
    } else {
      updatedRejections.push({
        rejec_Id: rejecId,
        Rejection_Quantity: quantity,
      });
    }

    setRejections(updatedRejections);
  };

  

  const handleButtonClick = () => {
    setIsIconChanged(!isIconChanged);
    setIsDropdownOpen(!isDropdownOpen);
    setIsButtonClicked(!isButtonClicked);
  };

  const dispatches = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatches(getMe());
  }, [dispatches]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
    if (user && user.role !== "quality" && user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [isError, user, navigate]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/products?includeNames=true"
      );

      const sortedData = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Map the products and include the grade name, company name, and product name in each product
      const mappedData = sortedData.map((product) => ({
        ...product,
        comp_name: product?.customer?.comp_name || "N/A",
        prod_name: product?.product?.prod_name || "N/A",
        grade_name: product?.MS_Grade?.Grade_Name || "N/A",
      }));

      setFilteredData(mappedData); // Set the filtered data
      setFilteredProducts(mappedData); // Set the filtered products
      setIsLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRejections = async (data) => {
    try {
      const response = await axios.get("http://localhost:5000/Rejections");
      setRejections(response.data);
      setIsLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  
  const fetchMsRejection = async () => {
    try {
      const response = await axios.get("http://localhost:5000/MSRejections");
      setSubtype(response.data);
      setIsLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCompanies();
    fetchRejections();
    fetchProducts();
    fetchMsRejection();
  }, []);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleDeleteCustomer = async (customer) => {
    try {
      await axios.delete(`http://localhost:5000/customers/${customer.uuid}`);
      setIsLoaded(false);
      fetchData(); // Fetch updated data after deleting the customer
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditRejection = (rejectionId, rejectionData) => {
    // Set the current rejection ID in the state
    setCurrentRejectionId(rejectionId);
  
    // Reset the form fields with the data from the selected rejection
    reset({
      
      comp_name: rejectionData.comp_name,
      prodId: rejectionData.prodId,
      quantity: rejectionData.Production_Quantity,
      date: rejectionData.Rejection_Date,
      // Check if rejectionData.rejec_Id is an array before mapping
      rejec_Id: Array.isArray(rejectionData.rejec_Id)
        ? rejectionData.rejec_Id.map((id, index) => ({
            [index]: rejecTypes[index].label,
          }))
        : [], // Provide an empty array if rejec_Id is not an array
      
    });
    const sample = reset
    console.log(sample)
  
    // Set the editing state to true to switch to the editing mode
    setIsEditing(true);
    fetchData();
    fetchCompanies();
    fetchRejections();
    fetchProducts();
    fetchMsRejection();
  };
  
  

  const onSubmit = async (data) => {
    try {
      data.comp_name = selectedCompany.comp_name;
      data.prod_name = selectedCompany.prod_name;

      if (isEditing) {
        const confirmUpdate = window.confirm(
          "Are you sure you want to update this customer?"
        );
        if (confirmUpdate) {
          await updateCustomer(data);
          setIsEditing(false);
        }
      } else {
        await addCustomer(data);
      }

      reset();
      setCurrentCustomerId("");
      setIsLoaded(false);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const addCustomer = async (data) => {
    try {
      const compId = parseInt(data.comp_name); // Assuming comp_name is the selected company ID
      const prodId = parseInt(data.prodId);
      const rejectionDate = data.date;
      const productionQuantity = parseInt(data.quantity);

      const rejIdList = [];
      const rejQtyList = [];

      for (let i = 0; i < data.rejec_Id?.length; i++) {
        const parsedQuantity = parseInt(data.rejec_Id[i]);
        if (parsedQuantity > 0) {
          rejIdList.push(i + 1);
          rejQtyList.push(parsedQuantity);
        }
      }

      const formattedData = {
        compId: selectedCompanyObj.PK_CompanyID,
        prodId,
        Rejection_Date: rejectionDate,
        Production_Quantity: productionQuantity,
        Rejection_Quantity: rejQtyList,
        rejec_Id: rejIdList,
      };

      console.log(selectedCompanyObj);
      console.log(formattedData);

      await axios.post("http://localhost:5000/Rejections", formattedData);
      console.log("Rejections created successfully");
      // You can update the state or perform other actions here
      fetchData();
      fetchCompanies();
      fetchRejections();
      fetchProducts();
      fetchMsRejection();
    } catch (error) {
      console.log("Error creating rejections:", error);
      // You can show an error message to the user or perform other error-handling actions here
    }
  };

  const updateCustomer = async (data, id) => {
    try {
      const compId = parseInt(data.comp_name); // Assuming comp_name is the selected company ID
      const prodId = parseInt(data.prodId);
      const customerId = currentCustomerId;
       // Assuming you have customerId defined
      console.log(data, id);
      // Ensure that rejectionId is defined and is a valid number
      if (id === undefined || isNaN(customerId)) {
        console.error("Invalid rejectionId:", customerId);
        return; // Return early if rejectionId is not valid
      }

      // Extract the relevant data from 'data' object
      const { Rejection_Quantity, Production_Quantity, Rejection_Date } = data;

      const formattedData = {
        Rejection_Quantity: Rejection_Quantity,
        Production_Quantity: Production_Quantity,
        Rejection_Date: Rejection_Date,
        compId: selectedCompanyObj.PK_CompanyID,
        prodId: selectedCompanyObj.PK_ProductID,
      
      };

      console.log(formattedData)

      // Make a PUT request to update the rejection by its 'id'
      await axios.post(`http://localhost:5000/Rejections/${customerId}`, formattedData);
      console.log(`Rejection with ID${id} updated successfully`);
      // You can update the state or perform other actions here
    } catch (error) {
      console.log("Error updating rejection:", error);
      // You can show an error message to the user or perform other error-handling actions here
    }
  };





  // const updateCustomer = async (data) => {
  //   try {
  //     const rejectionId = currentCustomerId; // Replace with the ID of the rejection you want to update
  //     const response = await axios.patch(`http://localhost:5000/updateR3ejectionById/${rejectionId}`, data);
      
  //     // Handle the response as needed (e.g., update state or show a success message)
  //     console.log('Rejection updated successfully', response.data);
  //   } catch (error) {
  //     // Handle errors (e.g., show an error message)
  //     console.error('Error updating rejection:', error.message);
  //   }
  // };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company.comp_name);
    setSelectedCompanyObj(company);
    // Filter products based on the selected company name
    const filteredProducts = filteredData.filter(
      (product) => product.comp_name === company.comp_name
    );
    setFilteredProducts(filteredProducts);
    // Reset the form's company name field
    reset({ comp_name: company.comp_name });
  };

  const handleUpdateCustomer = async (data) => {
    try {
      if (window.confirm("Are you sure you want to update this customer?")) {
        await updateCustomer(data);

        // Find the updated customer in the customers array and update its data
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.uuid === currentCustomerId
              ? { ...customer, ...data }
              : customer
          )
        );

        // Reset form values and editing state
        reset();
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCompanyChange = (event, { newValue }) => {
    setSelectedCompany(newValue);

    const filteredProducts = filteredData.filter(
      (product) => product.comp_name === newValue
    );
    setFilteredProducts(filteredProducts);
  };

  const handleDeleteRejection = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this customer?"
      );
      if (confirmDelete) {
        await axios.delete(`http://localhost:5000/rejections/${id}`);

        setIsLoaded(false);
        fetchData();
        fetchCompanies();
        fetchRejections();
        fetchProducts();
        fetchMsRejection();
      }
    } catch (error) {
      console.log(error);
      console.log(`http://localhost:5000/rejection/${id}`);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/msproducts");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Use useEffect to get the current date and set it to the state
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setCurrentDate(`${year}-${month}-${day}`);
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/mscustomers");
      setCompanies(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle input focus and switch type to "date"
  const handleInputFocus = (e) => {
    e.target.type = "date";
    e.target.click(); // Trigger the date picker
  };

  const handleCompanySearch = (value) => {
    const suggestions = companies.filter((company) =>
      company.comp_name.toLowerCase().includes(value.toLowerCase())
    );
    setCompanySuggestions(suggestions);
  };

  const getSuggestionValue = (company) => {
    return company.comp_name;
  };
  const renderSuggestion = (suggestion) => {
    return <div>{suggestion?.comp_name}</div>;
  };

  // this is used to getting the data from the input box

  const inputProps = {
    placeholder: "Search Company",
    value: selectedCompany,
    onChange: handleCompanyChange,
    style: {
      borderColor: "your-desired-color", // Change this to the desired color
    },
  };

  const handleExportCSV = () => {
    const csvData = filteredProducts.map((product) => ({
      Company_Name: product.comp_name,
      Product_Name: product.prod_name,
      Grade_Name: product.grade_name,
      No_of_casting_in_mould: product.No_of_casting_in_mould,
      Casting_Weight: product.Casting_Weight,
    }));

    return (
      <CSVLink
        data={csvData}
        filename={`products-${new Date().toISOString()}.csv`}
      >
        Export CSV
      </CSVLink>
    );
  };

  // ###########################################################################################
  

  // ########################## ############################# #################################################################
console.log(rejecTypes,"abc")
  return (
    <>
      {/* Customer Form */}
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
                  R1 Rejection
                </h2>

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
                          className={`input ${
                            errors.prodId ? "is-danger" : ""
                          }`}
                        >
                          <option value="">Select Product</option>
                          {filteredProducts.map((product) => {
                            // console.log(product); // Log the entire product object
                            // console.log(product.prodId, product.prod_name); // Log the values for each product
                            return (
                              <option
                                key={product.prodId}
                                value={product.prodId}
                              >
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
                  <div className="control">
                    <label className="label">Quantity</label>
                    <Controller
                      name="quantity"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <input
                          {...field}
                          className={`input ${
                            errors.quantity ? "is-danger" : ""
                          }`}
                          type="text"
                          placeholder="Enter Quantity"
                        />
                      )}
                    />
                    {errors.quantity && (
                      <p className="help is-danger">
                        {errors.quantity.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="field">
                  <div className="control date-input-container">
                    <label className="label">Enter Date</label>
                    <Controller
                      name="date"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <div className="date-input-wrapper">
                          <input
                            {...field}
                            className={`input ${
                              errors.date ? "is-danger" : ""
                            }`}
                            type="text" // Use text input initially
                            placeholder={currentDate} // Show the current date as a placeholder
                            onFocus={handleInputFocus} // Switch type to "date" on input focus
                          />
                          {errors.date && (
                            <p className="help is-danger">
                              {errors.date.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Full-width button dropdown */}
                <div className="field">
                  <div className="control">
                    <button
                      id="r1-rejection-button"
                      type="button"
                      className={`button is-fullwidth ${
                        isButtonClicked ? "is-primary" : "is-info"
                      }`}
                      onClick={handleButtonClick}
                    >
                      R1 Rejection
                      {isIconChanged ? (
                        <FontAwesomeIcon
                          icon={faAngleDown}
                          style={{ marginLeft: "10px" }}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faAngleUp}
                          style={{ marginLeft: "10px" }}
                        />
                      )}
                    </button>
                    {isDropdownOpen && (
                      <div className="dropdown-content">
                        {rejecTypes.map((rejecType, index) => (
                          <div className="field" key={index}>
                            <div className="control">
                              <label className="label">{rejecType.label}</label>
                              <Controller
                                name={`rejec_Id[${index}]`} // Use the index as the key
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    className={`input ${
                                      errors.rejec_Id && errors.rejec_Id[index]
                                        ? "is-danger"
                                        : ""
                                    }`}
                                    type="text"
                                    placeholder={`Enter ${rejecType.label} Quantity`}
                                  />
                                )}
                              />
                              {errors.rejec_Id && errors.rejec_Id[index] && (
                                <p className="help is-danger">
                                  {errors.rejec_Id[index].message}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <center>
                  <div className="field">
                    <div className="control">
                      <button type="submit" className="button is-success">
                        {isEditing ? "Update" : "Add"}
                      </button>
                    </div>
                  </div>
                </center>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="container mt-5">
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Company Name</th>
              <th>Product Name</th>
              <th>Production Quantity</th>
              <th>Rejection Quantity</th>
              <th>Stock Balance</th>
              <th>Rejection Type</th>
            
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {isLoaded ? (
              rejections.map((rejection, index) => (
                <tr key={rejection.id}>
                  <td>{index + 1}</td>
                  <td>
                    {
                      companies.find(
                        (company) => company.PK_CompanyID === rejection.compId
                      )?.comp_name
                    }
                  </td>

                  <td>
                    {" "}
                    {
                      products.find(
                        (product) => product.PK_ProductID === rejection.prodId
                      )?.prod_name
                    }
                  </td>

                  <td>{rejection.Production_Quantity}</td>
                  <td>{rejection.Rejection_Quantity}</td>
                  <td>{rejection.Stock_Balance}</td>
                  <td>
                    {" "}
                    {
                      subtype.find(
                        (subtypes) =>
                          subtypes.PK_RejectonID === rejection.rejec_Id
                      )?.Sub_Type
                    }{" "}
                  </td>
                  <td>
                    <button
                      onClick={
                        () => handleEditRejection(rejection.id, rejection)
                      }
                      className="edit-button"
                    >
                      <i className="fi fi-rr-edit"></i>
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteRejection(rejection.id)}
                      className="delete-button"
                    >
                      <i className="fi fi-rs-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Loading...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Rejection1Page;
