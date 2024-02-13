import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getMe } from "../features/authSlice";
import axios from "axios";
import { CSVLink } from "react-csv";

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
});

const Production = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);

  const [customers, setCustomers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);

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

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/customers");
      console.log(response.data);
      const sortedData = response.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setCustomers(sortedData);
      setIsLoaded(true);
      setFilteredCustomers(sortedData);
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

  const handleDeleteCustomer = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this customer?"
      );
      if (confirmDelete) {
        await axios.delete(`http://localhost:5000/customers/${id}`);
        setIsLoaded(false);
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditCustomer = (customer) => {
    reset({
      cust_name: customer.cust_name,
      comp_name: customer.comp_name,
      comp_add: customer.comp_add,
      gstn_number: customer.gstn_number,
      cont_num: customer.cont_num,
    });

    setCurrentCustomerId(customer.id);

    setIsEditing(true);
  };

  const onSubmit = async (data) => {
    try {
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

 

  
  const handleExportCSV = () => {
    const csvData = filteredCustomers.map((customer) => ({
      "Customer Name": customer.cust_name,
      "Company Name": customer.comp_name,
      "Company Address": customer.comp_add,
      "GST Number": customer.gstn_number,
      "Contact Number": customer.cont_num,
      "Created At": new Date(customer.createdAt).toLocaleDateString(),
    }));

    const headers = [
      { label: "Customer Name", key: "Customer Name" },
      { label: "Company Name", key: "Company Name" },
      { label: "Company Address", key: "Company Address" },
      { label: "GST Number", key: "GST Number" },
      { label: "Contact Number", key: "Contact Number" },
      { label: "Created At", key: "Created At" },
    ];

    return (
      <div className="export-csv-container">
        <CSVLink
          data={csvData}
          headers={headers}
          filename={"customers.csv"}
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
              {/* Customer Form */}
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
                  Add New Customer
                </h2>

                {/* Form fields... */}
                <div className="field">
                  <div className="control">
                    <label className="label">Customer Name</label>
                    <Controller
                      name="cust_name"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <input
                          {...field}
                          className={`input ${
                            errors.cust_name ? "is-danger" : ""
                          }`}
                          type="text"
                          placeholder="Enter Customer Name"
                        />
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
                    <label className="label">Company Name</label>
                    <Controller
                      name="comp_name"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <input
                          {...field}
                          className={`input ${
                            errors.comp_name ? "is-danger" : ""
                          }`}
                          type="text"
                          placeholder="Enter Company Name"
                        />
                      )}
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
                    <label className="label">Company Address</label>
                    <Controller
                      name="comp_add"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <input
                          {...field}
                          className={`input ${
                            errors.comp_add ? "is-danger" : ""
                          }`}
                          type="text"
                          placeholder="Enter Company Address"
                        />
                      )}
                    />
                    {errors.comp_add && (
                      <p className="help is-danger">
                        {errors.comp_add.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="field">
                  <div className="control">
                    <label className="label">GST Number</label>
                    <Controller
                      name="gstn_number"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <input
                          {...field}
                          className={`input ${
                            errors.gstn_number ? "is-danger" : ""
                          }`}
                          type="text"
                          placeholder="Enter GST Number"
                        />
                      )}
                    />
                    {errors.gstn_number && (
                      <p className="help is-danger">
                        {errors.gstn_number.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="field">
                  <div className="control">
                    <label className="label">Contact Number</label>
                    <Controller
                      name="cont_num"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <input
                          {...field}
                          className={`input ${
                            errors.cont_num ? "is-danger" : ""
                          }`}
                          type="text"
                          placeholder="Enter Contact Number"
                        />
                      )}
                    />
                    {errors.cont_num && (
                      <p className="help is-danger">
                        {errors.cont_num.message}
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
        {/* Date Filter */}
        <div className="date-filter-container">
          <div
            className="field"
            style={{
              padding: "10px",
              justifyContent: "space-between",
              alignItems: "center",
              display: "flex",
            }}
          >
            <div className="w-auto" style={{ display: "flex", gap: "10px" }}>
              <div className="field">
                <label className="label">Start Date:</label>
                <div className="control">
                  <input
                    type="date"
                    className="input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">End Date:</label>
                <div className="control">
                  <input
                    type="date"
                    className="input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              {/* <div className="field">
                      <div className="control">
                        <button
                          className="button is-primary"
                          onClick={handleDateFilter}
                        >
                          Filter
                        </button>
                      </div>
                    </div> */}
            </div>
            {/* Export CSV Button */}
            {handleExportCSV()}
          </div>
        </div>
        <table className="table is-striped is-bordered is-fullwidth">
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Customer Name</th>
              <th>Company Name</th>
              <th>GST Number</th>
              <th>Contact Number</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoaded ? (
              customers.map((customer, index) => {
                const createdAtDate = new Date(
                  customer.createdAt
                ).toLocaleDateString(); // Extract the date and format it

                return (
                  <tr key={customer.id}>
                    <td>{index + 1}</td>
                    <td>{customer.cust_name}</td>
                    <td>{customer.comp_name}</td>
                    <td>{customer.gstn_number}</td>
                    <td>{customer.cont_num}</td>
                    <td>{createdAtDate}</td> {/* Display the formatted date */}
                    <td>
                      {user && (
                        <>
                          {user.role === "admin" || user.role === "dispatch" ? (
                            <>
                              <button
                                onClick={() => handleEditCustomer(customer)}
                                className="edit-button ml-1"
                              >
                                <i className="fi fi-rr-edit"></i>
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteCustomer(customer.id)
                                }
                                className="delete-button ml-2"
                              >
                                <i className="fi fi-rs-trash"></i>
                              </button>
                            </>
                          ) : (
                            <span>No actions</span>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
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

export default Production;
