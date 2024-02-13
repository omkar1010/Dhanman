import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import { useForm, Controller, } from "react-hook-form";
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

// import dateIcon from '../images/date-icon.png';
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const schema = yup.object().shape({
  cust_name: yup.string().required("Customer Name is required"),
  comp_name: yup.string().required("Company Name is required"),
  comp_add: yup.string().required("Company Address is required"),
  gstn_number: yup
    .string()
    .required("GST Number is required")
    .matches(/^[A-Z0-9]{15}$/, "Invalid GST Number"),
  cont_num: yup
    .string()
    .required("Contact Number is required")
    .matches(/^\+?[0-9]{10,15}$/, "Invalid Contact Number"),
  grade_name: yup.string().required("Grade Name is required"),
});

const Rejection1Page = () => {
  const [isIconChanged, setIsIconChanged] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [currentCustomerId, setCurrentCustomerId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputValues, setInputValues] = useState();
  const [isClicked, setIsClicked] = useState(false);
const [isButtonClicked, setIsButtonClicked] = useState(false);
const [currentDate, setCurrentDate] = useState("");

  
  const handleButtonClick = () => {
    setIsIconChanged(!isIconChanged);
    setIsDropdownOpen(!isDropdownOpen);
    setIsButtonClicked(!isButtonClicked);
  
  };

  const customerOptions = [
    { value: "customer1", label: "Omkar" },
    { value: "customer2", label: "Vishal" },
    { value: "customer3", label: "Kalpesh" },
    { value: "customer4", label: "Sushil" },
    { value: "customer5", label: "Kunal" },
    // Add more customer options as needed
  ];

  const gradeOptions = [
    { value: "grade1", label: "Grade 1" },
    { value: "grade2", label: "Grade 2" },
    { value: "grade3", label: "Grade 3" },
    { value: "grade4", label: "Grade 4" },
    { value: "grade5", label: "Grade 5" },
    // Add more grade options as needed
  ];

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
      const response = await axios.get("http://localhost:5000/customers");
      setCustomers(response.data);
      setIsLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
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

  const handleEditCustomer = (customer) => {
    // Set the form values with the selected customer data
    reset({
      cust_name: customer.cust_name,
      comp_name: customer.comp_name,
      comp_add: customer.comp_add,
      gstn_number: customer.gstn_number,
      cont_num: customer.cont_num,
      grade_name: customer.grade_name,
    });

    // Store the customer ID in state for further processing
    setCurrentCustomerId(customer.uuid);

    // Set editing mode to true
    setIsEditing(true);
  };

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        // Perform update operation if editing
        await handleUpdateCustomer(data);
      } else {
        // Perform add operation if not editing
        await addCustomer(data);
      }

      // Reset the form and clear the current customer ID
      reset();
      setCurrentCustomerId("");

      setIsLoaded(false);
      fetchData(); // Fetch updated data after adding or updating a customer
    } catch (error) {
      console.log(error);
    }
  };

  const addCustomer = async (data) => {
    try {
      await axios.post("http://localhost:5000/customers", data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateCustomer = async (data) => {
    try {
      const customerId = currentCustomerId;
      await axios.patch(`http://localhost:5000/customers/${customerId}`, data);
    } catch (error) {
      console.log(error);
    }
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

  // Use useEffect to get the current date and set it to the state
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setCurrentDate(`${year}-${month}-${day}`);
  }, []);

   // Function to handle input focus and switch type to "date"
   const handleDateChange = (e) => {
    setCurrentDate(e.target.value);
  };




  const handleInputChange = (index, side, value) => {
    setInputValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = {
        ...newValues[index],
        [side]: value,
      };
      return newValues;
    });
  };

 
  

 



  

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

         
                <div className="field">
                  <div className="control">
                  <label className="label">Product Name</label>
                    {/* <label className="label">Customer Name</label> */}
                    <Controller
                      name="cust_name"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <select
                        {...field}
                        className={`input ${errors.cust_name ? "is-danger" : ""}`}
                      >
                        <option value="">Select Product</option>
                        {customers.length > 0 &&
                          customers.map((customer) => (
                            <option key={customer.uuid} value={customer.uuid}>
                              {customer.cust_name}
                            </option>
                          ))}
                      </select>
                      
                      )}
                    />
                    {errors.cust_name && (
                      <p className="help is-danger">
                        {errors.cust_name.message}
                      </p>
                    )}
                  </div>
                </div>





        <div className="field">
                  <div className="control">
                  <label className="label">Product Name</label>
                    <Controller
                      name="cust_name"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <select
                        {...field}
                        className={`input ${errors.cust_name ? "is-danger" : ""}`}
                      >
                        <option value="" className="customer-heading-input">Select Customer</option>
                        {customers.length > 0 &&
                          customers.map((customer) => (
                            <option key={customer.uuid} value={customer.uuid}>
                              {customer.cust_name}
                            </option>
                          ))}
                      </select>
                      
                      )}
                    />
                    {errors.cust_name && (
                      <p className="help is-danger">
                        {errors.cust_name.message}
                      </p>
                    )}
                  </div>
                </div>


                <div className="field">
                  <div className="control">
                  <label className="label">Enter Quantity</label>
                    <Controller
                      name="gstn_number"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <input
                          {...field}
                          className={`input ${errors.gstn_number ? 'is-danger' : ''}`}
                          type="text"
                          placeholder="Enter Quantity"
                        />
                      )}
                    />
                    {errors.gstn_number && (
                      <p className="help is-danger">{errors.gstn_number.message}</p>
                    )}
                  </div>
                </div>
               
    <div className="field">
      <div className="control date-input-container">
      <label className="label">Enter Date</label>
        <Controller
        
          name="comp_name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div className="date-input-wrapper">
              {/* Display date as text when not focused */}
              {!field.isFocused ? (
                <input
                  {...field}
                  className={`input ${errors.comp_name ? "is-danger" : ""}`}
                  type="text"
                  value={currentDate} // Show the current date in "dd-mm-yyyy" format
                  onFocus={(e) => {
                    e.target.type = "date";
                  }}
                  onBlur={(e) => {
                    e.target.type = "text";
                  }}
                  onChange={handleDateChange}
                />
              ) : (
                // Switch to date input when focused
                <input
                  {...field}
                  className={`input ${errors.comp_name ? "is-danger" : ""}`}
                  type="date"
                  value={field.value || ""} // Keep the selected date as a date input value
                  onChange={handleDateChange} // Handle date changes
                />
              )}
              {errors.comp_name && (
                <p className="help is-danger">{errors.comp_name.message}</p>
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
          className={`button is-fullwidth ${isButtonClicked ? "is-primary" : "is-info"}`}
          onClick={handleButtonClick}
        >
          R1 Rejection
          {isIconChanged ? (
            <FontAwesomeIcon icon={faAngleDown} style={{ marginLeft: "10px" }} />
          ) : (
            <FontAwesomeIcon icon={faAngleUp} style={{ marginLeft: "10px" }} />
          )}
        </button>
                    {isDropdownOpen && (
                      <div className="dropdown-content">
                        {/* Render 5 input boxes on the left */}
                        <div className="right-side-div">
                            <label className="dropdown-label">Drain</label>
                          <input
                            // placeholder="Drain"
                            className="dropdown-input"
                          />
                           <label className="dropdown-label">Shrink</label>
                          <input
                            // placeholder="Shrink"
                            className="dropdown-input"
                          />
                           <label className="dropdown-label"> Sand</label>
                          <input
                            // placeholder="Sand"
                            className="dropdown-input"
                          />
                           <label className="dropdown-label">Core Broken</label>
                          <input
                            // placeholder="Core Broken"
                            className="dropdown-input"
                          />
                           <label className="dropdown-label">Short Poured</label>
                          <input
                            // placeholder="Short Poured"
                            className="dropdown-input"
                          />
                        </div>

                        <div className="left-side-div">
                        <label className="dropdown-label">Parting Leek</label>
                          <input
                            // placeholder="Parting Leek"
                            className="dropdown-input"
                          />
                           <label className="dropdown-label">Cold</label>
                          <input
                            // placeholder="Cold"
                            className="dropdown-input"
                          />
                           <label className="dropdown-label">Blow</label>
                          <input
                            // placeholder="Blow"
                            className="dropdown-input"
                          />
                           <label className="dropdown-label">Core Puncture</label>
                          <input
                            // placeholder="Core Puncture"
                            className="dropdown-input"
                          />
                           <label className="dropdown-label">Other</label>
                          <input
                            // placeholder="Other"
                            className="dropdown-input"
                          />
                        </div>

                        {/* Render 5 input boxes on the right */}
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
              <th>Customer Name</th>
              <th>Company Name</th>
              <th>GST Number</th>
              <th>Contact Number</th>
            </tr>
          </thead>
          <tbody>
            {isLoaded ? (
              customers.map((customer, index) => (
                <tr key={customer.uuid}>
                  <td>{index + 1}</td>
                  <td>{customer.cust_name}</td>
                  <td>{customer.comp_name}</td>
                  <td>{customer.gstn_number}</td>
                  <td>{customer.cont_num}</td>
                  <td>
                    <button
                      onClick={() => handleEditCustomer(customer)}
                      className="edit-button"
                    >
                      <i className="fi fi-rr-edit"></i>
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteCustomer(customer)}
                      className="delete-button"
                    >
                      <i className="fi fi-rs-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Loading...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Rejection1Page;
