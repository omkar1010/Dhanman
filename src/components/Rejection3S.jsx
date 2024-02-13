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
    // cust_name: yup.object(),
    comp_name: yup.string().required("Company Name is required"),
    Rejection_Quantity: yup.string().required("Quantity is required"),
    Rejection_Date: yup.string().required("Date is required"),
    prodId: yup.string().required("Product is required"),
    // ... Other fields ...
  
    // Loop to generate schema for Rejection Quantity fields
    ...Array.from({ length: 10 }).reduce((rejectionSchema,index) => {
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
  })





const Rejection3S = () => {
  const [isIconChanged, setIsIconChanged] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [currentCustomerId, setCurrentCustomerId] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyObj, setSelectedCompanyObj] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [rejections, setRejections] = useState([]);
  const [products, setProducts] = useState([]);
  const [showTimeLimitAlert, setShowTimeLimitAlert] = useState(false);

  


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

  const fetchRejections = async () => {
    try {
      const response = await axios.get("http://localhost:5000/R3Rejections");
      console.log(response.data)
      setRejections(response.data);
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
    fetchRejections();
  }, []);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  
 

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
          fetchData();
          fetchCompanies();
          fetchRejections(); 

          fetchProducts();
          setIsEditing(false);
        }
      } else {
        await addCustomer(data);
       fetchData();
       fetchCompanies();
       fetchRejections();
       fetchProducts();
        setCurrentCustomerId("");
        setIsLoaded(false);
      }
     
    
    } catch (error) {
      console.log(error);
    }
  };


  const handleEditRejection = (rejection) => {
    reset({
      // Populate form fields with rejection data
    
      comp_name: rejection.comp_name,
      Rejection_Date: rejection.Reject_date,
      // Production_Quantity: rejection.Production_Quantity,
      Rejection_Quantity: rejection.Rejection_Quantity,
      prodId:rejection.prodId
    });
  
    setCurrentCustomerId(rejection.id); // Set the ID of the rejection you're editing
 
    setIsEditing(true); // Set the editing state to true
  };

  const addCustomer = async (data) => {
    try {
      const {
        compId,
        prodId,
        Rejection_Date,
        Production_Quantity,
        Rejection_Quantity,
      } = data;
  
      // Check if Rejection_Quantity is a valid number
      if (isNaN(Rejection_Quantity)) {
        throw new Error('Rejection_Quantity must be a valid number');
      }
  
      const formattedData = {
        compId: parseInt(selectedCompanyObj.PK_CompanyID), // Parse to integer
        prodId: parseInt(prodId), // Parse to integer
        Rejection_Date,
        Production_Quantity: parseInt(Production_Quantity), // Parse to integer
        Rejection_Quantity: parseInt(Rejection_Quantity), // Parse to integer
      };
  
      const response = await axios.post('http://localhost:5000/R3Rejections', formattedData);
  
      // Handle the response, update state, or perform other actions
      console.log('Rejection created successfully', response.data);
    } catch (error) {
      // Handle errors, show error messages, or perform other error-handling actions
      console.error('Error creating rejection:', error.message);
    }
  };



  const updateCustomer = async (data) => {
    try {
      const rejectionId = currentCustomerId; // Replace with the ID of the rejection you want to update
      const response = await axios.patch(`http://localhost:5000/updateR3ejectionById/${rejectionId}`, data);
      
      // Handle the response as needed (e.g., update state or show a success message)
      console.log('Rejection updated successfully', response.data);
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error('Error updating rejection:', error.message);
    }
  };
  

  
  
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

  // const handleUpdateCustomer = async (data) => {
  //   try {
  //     if (window.confirm("Are you sure you want to update this customer?")) {
  //       await updateCustomer(data);

  //       // Find the updated customer in the customers array and update its data
  //       setCustomers((prevCustomers) =>
  //         prevCustomers.map((customer) =>
  //           customer.uuid === currentCustomerId
  //             ? { ...customer, ...data }
  //             : customer
  //         )
  //       );

  //       // Reset form values and editing state
  //       reset();
  //       setIsEditing(false);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
        await axios.delete(`http://localhost:5000/R3Rejections/${id}`);
        fetchData();
         fetchCompanies();
         fetchRejections();
         fetchProducts();
       
        setIsLoaded(false);
       
      }
    } catch (error) {
      console.log(error);
      console.log(`http://localhost:5000/rejection/${id}`)
    }
  };




  // const handleDeleteRejection = async (id) => {
  //   try {
  //     const confirmDelete = window.confirm(
  //       "Are you sure you want to delete this customer?"
  //     );
  //     if (confirmDelete) {
  //       const customer =  rejections.rejections.find((c) => c.id === id);
  //       const createdAt = new Date(customer.createdAt);
  //       const currentTime = new Date();
  //       const timeDifference = currentTime - createdAt;
  //       const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

  //       if (user.role === "dispatch" && timeDifference > twoDaysInMillis) {
  //         setShowTimeLimitAlert(true); // Show the alert
  //       } else {
  //         await axios.delete(`http://localhost:5000/customers/${id}`);
  //         setIsLoaded(false);
  //         fetchData();
        
  //                 fetchCompanies();
  //                 fetchRejections();
  //                 fetchProducts();
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };





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
      console.log(response.data)
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
                  R3 Rejection
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
                      name="comp_name"
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
                      name="Rejection_Quantity"
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

                {/* <div className="field">
                  <div className="control date-input-container">
                    <label className="label">Enter Date</label>
                    <Controller
                      name="Rejection_Date"
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
                </div> */}







                <div className="field">
                  <div className="control">
                    <label className="label">Enter Date</label>
                    <Controller
                      name="Rejection_Date"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className={`input ${
                            errors.Schedule_Date ? "is-danger" : ""
                          }`}
                          type="date"
                          placeholder="Enter schedule Date"
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
             
              <th>Rejection Quantity</th>
              <th>Stock Balance</th>
        
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {isLoaded ? (
             
               rejections.rejections.map((rejection, index) => (
                
                <tr key={rejection.id}>
                  <td>{index + 1}</td>
                  <td>
                {companies.find((company) => company.PK_CompanyID === rejection.compId)?.comp_name}
              </td>

                  <td>  {products.find((product) => product.PK_ProductID === rejection.prodId)?.prod_name}</td>
                
                  {/* <td>{rejection.Production_Quantity}</td> */}
                  <td>{rejection.Rejection_Quantity}</td>
                  {/* <td>{console.log(rejection) || rejection.Rejection_Quantity}</td> */}
                    <td>{rejection.Stock_Balance}</td>
                    {/* <td> {subtype.find((subtypes) => subtypes.PK_RejectonID === rejection.rejec_Id)?.Sub_Type}  </td> */}
                  <td>
                    <button
                      onClick={() => handleEditRejection(rejection)}
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

export default Rejection3S;





//Rejection3S

