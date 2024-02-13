// import React, { useEffect, useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import axios from "axios";
// import Autosuggest from "react-autosuggest";
// import { CSVLink } from "react-csv";

// const schema = yup.object().shape({
//   compId: yup.number().required("Company Name is required"),
//   prodId: yup.number().required("Product is required"),
//   Schedule_Date: yup.date().required("Schedule Date is required"),
//   Shedule_Quantity: yup
//     .number()
//     .typeError("Schedule Quantity must be a valid number")
//     .required("Schedule Quantity is required"),
// });

// const AddSchedulePage = () => {
//   const [companies, setCompanies] = useState([]);
//   const [companySuggestions, setCompanySuggestions] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState({});
//   const [products, setProducts] = useState([]);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentScheduleId, setCurrentScheduleId] = useState("");
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   useEffect(() => {
//     fetchCompanies();
//     fetchProducts();
//     fetchData();
//   }, []);

//   const fetchCompanies = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/customers");
//       setCompanies(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // const fetchProducts = async () => {
//   //   try {
//   //     const response = await axios.get("http://localhost:5000/products");
//   //     setProducts(response.data);
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };



//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/products");
//       setProducts(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };



//   const fetchProductName = async (productId) => {
//     try {
//       const response = await axios.get(`http://localhost:5000/products/${productId}`);
//       return response.data.prod_name; // Assuming the product name is provided in the API response
//     } catch (error) {
//       console.log(error);
//       return "Product Name Not Found"; // Default value in case of an error
//     }
//   };






  
  
  



//   const fetchData = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/schedules");

//       const sortedData = response.data.sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       )

//       // Fetch the product data from the products endpoint
//       const productResponse = await axios.get("http://localhost:5000/products");
//       const productsData = productResponse.data.reduce(
//         (acc, product) => ({
//           ...acc,
//           [product.prodId]: product.prod_name,
//         }),
//         {}
//       );

//       // Map the schedules and include the product name in each schedule
//       const filteredData = response.data.map((schedule) => ({
//         ...schedule,
//         prod_name: productsData[schedule.prodId] || "N/A",
//       }));

//       setFilteredProducts(filteredData);
//       setIsLoaded(true);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const onSubmit = async (data) => {
//     try {
//       // If editing, update the schedule
//       if (isEditing) {
//         const confirmUpdate = window.confirm(
//           "Are you sure you want to update this Schedule?"
//         );
//         if (confirmUpdate) {
//           await updateSchedule(data);
//           setIsEditing(false);
//         }
//       } else {
//         // If adding, create a new schedule
//         await addSchedule(data);
//       }

//       reset();
//       setCurrentScheduleId("");
//       setIsLoaded(false);
//       fetchData();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const addSchedule = async (data) => {
//     try {
//       await axios.post("http://localhost:5000/schedules", data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const updateSchedule = async (data) => {
//     try {
//       const scheduleId = currentScheduleId;
//       await axios.patch(`http://localhost:5000/schedules/${scheduleId}`, data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleDeleteSchedule = async (id) => {
//     try {
//       const confirmDelete = window.confirm(
//         "Are you sure you want to delete this schedule?"
//       );
//       if (confirmDelete) {
//         await axios.delete(`http://localhost:5000/schedules/${id}`);
//         setIsLoaded(false);
//         fetchData();
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleEditSchedule = (schedule) => {
//     reset({
//       compId: schedule.compId,
//       prodId: schedule.prodId,
//       Schedule_Date: schedule.Schedule_Date,
//       Shedule_Quantity: schedule.Shedule_Quantity,
//     });

//     setSelectedCompany({ compId: schedule.compId, comp_name: schedule.comp_name });
//     setCurrentScheduleId(schedule.id);

//     setIsEditing(true);
//   };

//   const handleExportCSV = () => {
//     const csvData = filteredProducts.map((schedule) => ({
//       Company_Name: schedule.comp_name,
//       Product_Name: schedule.prod_name,
//       Schedule_Date: schedule.Schedule_Date,
//       Schedule_Quantity: schedule.Shedule_Quantity,
//     }));

//     return (
//       <CSVLink
//         data={csvData}
//         filename={`schedules-${new Date().toISOString()}.csv`}
//       >
//         Export CSV
//       </CSVLink>
//     );
//   };

//   const handleCompanySearch = (value) => {
//     const suggestions = companies.filter((company) =>
//       company.comp_name.toLowerCase().includes(value.toLowerCase())
//     );
//     setCompanySuggestions(suggestions);
//   };

//   const handleCompanySelect = (company) => {
//     setSelectedCompany(company);
  
//     if (company.compId) {
//       // If company.compId exists, filter products based on the selected company ID (compId)
//       const filteredProducts = products.filter(
//         (product) => product.compId === company.compId
//       );
//       setFilteredProducts(filteredProducts);
//     } else if (company.comp_name) {
//       // If company.comp_name exists, filter products based on the selected company name (comp_name)
//       const filteredProducts = products.filter(
//         (product) => product.comp_name === company.comp_name
//       );
//       setFilteredProducts(filteredProducts);
//     }
//   };
  
  

//   const handleCompanyChange = (event, { newValue }) => {
//     if (!newValue) {
//       // If newValue is empty, reset the selectedCompany state
//       setSelectedCompany({});
//       // Reset the filtered products to show all products
//       setFilteredProducts(products);
//     } else {
//       // If newValue is not empty, set compId to null and only set comp_name
//       setSelectedCompany({ compId: null, comp_name: newValue });
//       // Filter the products based on the entered company name (comp_name)
//       const filteredProducts = products.filter(
//         (product) => product.comp_name === newValue
//       );
//       setFilteredProducts(filteredProducts);
//     }
//   };
  
  

//   const getSuggestionValue = (company) => {
//     return company.comp_name;
//   };

//   const renderSuggestion = (company) => {
//     return <div>{company.comp_name}</div>;
//   };

//   const inputProps = {
//     placeholder: "Search Company",
//     value: selectedCompany?.comp_name || "", // Use optional chaining to safely access comp_name
//     onChange: handleCompanyChange,
//   };
  


//   return (
//     <>
//       <div className="hero-body">
//         <div className="container">
//           <div className="columns is-centered">
//             <div className="column is-6">
//               <form
//                 className="p-8 rounded-s-md"
//                 style={{ backgroundColor: "#CAFFF0" }}
//                 onSubmit={handleSubmit(onSubmit)}
//               >
//                 <h2
//                   className="text-center m-5 text-header-add"
//                   style={{
//                     color: "#006A4D",
//                     fontFamily: "Inter",
//                     fontSize: "28px",
//                     fontStyle: "normal",
//                     fontWeight: 600,
//                     lineHeight: "normal",
//                   }}
//                 >
//                    Schedule Plan 
//                 </h2>
//                 <div className="field field-equal-width">
//   <div className="control">
//     <label className="label">Company Name</label>
//     <Autosuggest
//       suggestions={companySuggestions}
//       onSuggestionsFetchRequested={({ value }) =>
//         handleCompanySearch(value)
//       }
//       onSuggestionsClearRequested={() =>
//         setCompanySuggestions([])
//       }
//       getSuggestionValue={getSuggestionValue}
//       renderSuggestion={renderSuggestion}
//       inputProps={{
//         ...inputProps,
//         style: {
//           width: '100%', // Default width for all devices
//           maxWidth: '400px', // Maximum width for larger screens
//           margin: '0 auto', // Center the input field
//           padding: '6px', // Add some padding for better appearance
//           boxSizing: 'border-box', // Ensure padding is included in the total width
//           border: '0.5px ridge #D8D8D8', // Remove the border
//         }
//       }}
//       onSuggestionSelected={(_, { suggestion }) =>
//         handleCompanySelect(suggestion)
//       }
//       value={selectedCompany}
//     />

//     {errors.comp_name && (
//       <p className="help is-danger">
//         {errors.comp_name.message}
//       </p>
//     )}
//   </div>
// </div>
                




// <div className="field">
//   <div className="control">
//     <label className="label">Product Name</label>
//     <Controller
//       name="prodId"
//       control={control}
//       defaultValue=""
//       render={({ field }) => (
//         <select
//           {...field}
//           className={`input ${errors.prodId ? "is-danger" : ""}`}
//         >
//           <option value="">Select Product</option>
//           {filteredProducts.map((product) => {
//             console.log(product); // Log the entire product object
//             console.log(product.prodId, product.prod_name); // Log the values for each product
//             return (
//               <option key={product.prodId} value={product.prodId}>
//                 {product.prod_name}
//               </option>
//             );
//           })}
//         </select>
//       )}
//     />
//     {errors.prodId && (
//       <p className="help is-danger">{errors.prodId.message}</p>
//     )}
//   </div>
// </div>






//                 <div className="field">
//                   <div className="control">
//                     <label className="label">Schedule Date</label>
//                     <Controller
//                       name="Schedule_Date"
//                       control={control}
//                       render={({ field }) => (
//                         <input
//                           {...field}
//                           className={`input ${
//                             errors.Schedule_Date ? "is-danger" : ""
//                           }`}
//                           type="date"
//                           placeholder="Enter Schedule Date"
//                         />
//                       )}
//                     />
//                     {errors.Schedule_Date && (
//                       <p className="help is-danger">
//                         {errors.Schedule_Date.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Schedule Quantity */}
//                 <div className="field">
//                   <div className="control">
//                     <label className="label">Schedule Quantity</label>
//                     <Controller
//                       name="Shedule_Quantity"
//                       control={control}
//                       defaultValue=""
//                       render={({ field }) => (
//                         <input
//                           {...field}
//                           className={`input ${
//                             errors.Shedule_Quantity ? "is-danger" : ""
//                           }`}
//                           type="number"
//                           placeholder="Enter Schedule Quantity"
//                         />
//                       )}
//                     />
//                     {errors.Shedule_Quantity && (
//                       <p className="help is-danger">
//                         {errors.Shedule_Quantity.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//                 <center>
//                   <div className="field">
//                     <div className="control">
//                       <button type="submit" className="button is-success">
//                         {isEditing ? "Update" : "Save"}
//                       </button>
//                     </div>
//                   </div>
//                 </center>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mt-5">
//         <table className="table is-striped is-bordered is-fullwidth">
//           <thead>
//             <tr>
//             <th>Sr. No</th>
//               <th>Company Name</th>
//               <th>Product Name</th>
//               <th>Schedule Date</th>
//               <th>Schedule Quantity</th>
//               <th>Date Created</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {isLoaded ? (
//               filteredProducts.map((schedule, index) => (
//                 <tr key={schedule.id}>
//                   <td>{index + 1}</td>
//                   <td>{schedule.comp_name}</td>
//                   <td>{schedule.prod_name}</td>
//                   <td>{schedule.Schedule_Date}</td>
//                   <td>{schedule.Shedule_Quantity}</td>
// <td>{new Date(schedule.createdAt).toLocaleDateString()}</td>
//                   <td>
//                     <button
//                       className="edit-button ml-1"
//                       onClick={() => handleEditSchedule(schedule)}
//                     >
//                       <i className="fi fi-rr-edit"></i>
//                     </button>{" "}
//                     <button
//                       className="delete-button ml-2"
//                       onClick={() => handleDeleteSchedule(schedule.id)}
//                     >
//                        <i className="fi fi-rs-trash"></i>
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="has-text-centered">
//                   Loading...
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// };

// export default AddSchedulePage;







import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Autosuggest from "react-autosuggest";
import { CSVLink } from "react-csv";

const schema = yup.object().shape({
  comp_name: yup.object(), // Change to compId
  prod_name: yup.string().required("Product is required"),
  Schedule_Date: yup.date().required("schedule Date is required"),
  Shedule_Quantity: yup
    .number()
    .typeError("schedule Quantity must be a valid number")
    .required("schedule Quantity is required"),
});

const AddSchedulePage = () => {
  const [companies, setCompanies] = useState([]);
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState({});
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [scheduleList, setScheduleList] = useState([])
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentScheduleId, setCurrentScheduleId] = useState("");
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
      const response = await axios.get("http://localhost:5000/schedules");

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

      // Map the dispatches and include the product name in each schedule
      const uniqueCompIds = new Set();
      const uniqueProdIds = new Set();
      
      const filteredData = response.data.reduce((acc, schedule) => {
        if (!uniqueCompIds.has(schedule.compId) && !uniqueProdIds.has(schedule.prodId)) {
          uniqueCompIds.add(schedule.compId);
          uniqueProdIds.add(schedule.prodId);
      
          return [
            ...acc,
            {
              ...schedule,
              comp_name: productsData[schedule.compId] || "N/A",
              prod_name: productsData[schedule.prodId] || "N/A",
            },
          ];
        }
        return acc;
      }, []);

      setFilteredProducts(filteredData);
      setScheduleList(response.data)
      
      setIsLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitData =  async (data) => {
    console.log("function called");
    try {
      // Set the selected company name and product name in the data object
      data.comp_name = selectedCompany.comp_name;
      data.prod_name = data.prod_name.trim(); // Trim any leading/trailing spaces

      // If editing, update the product
      if (isEditing) {
        const confirmUpdate = window.confirm(
          "Are you sure you want to update this Product?"
        );
        if (confirmUpdate) {
          await updateSchedule(data);
          setIsEditing(false);
        }
      } else {
        // If adding, create a new product
        await AddSchedule(data);

        // Fetch the updated data after adding the new product
        setIsLoaded(false);
        await fetchData();

        // Reset the form fields
        reset();
        setSelectedCompany(""); // Reset the selected company
      }
    } catch (error) {
      console.log(error);
    }
  };

  const AddSchedule = async (data) => {
    try {
      await axios.post(`http://localhost:5000/schedules`, data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateSchedule = async (data) => {
    try {
      const scheduleId = currentScheduleId;
      await axios.patch(`http://localhost:5000/schedules/${scheduleId}`, data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this schedule?"
      );
      if (confirmDelete) {
        await axios.delete(`http://localhost:5000/schedule/${id}`);
        setIsLoaded(false);
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
    
  };

  const handleEditSchedule = (schedule) => {
    reset({
      comp_name: schedule.comp_name,
      prod_name: schedule.prod_name,
      Schedule_Date: schedule.Schedule_Date,
      Shedule_Quantity: schedule.Shedule_Quantity,
    });

    setSelectedCompany({
      compId: schedule.compId,
      comp_name: schedule.comp_name,
    });
    setCurrentScheduleId(schedule.id);

    setIsEditing(true);
  };

  const handleExportCSV = () => {
    const csvData = filteredProducts.map((schedule) => ({
      Company_Name: schedule.comp_name,
      Product_Name: schedule.prod_name,
      Schedule_Date: schedule.Schedule_Date,
      Shedule_Quantity: schedule.Shedule_Quantity,
    }));

    return (
      <CSVLink
        data={csvData}
        filename={`dispatches-${new Date().toISOString()}.csv`}
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
                onSubmit={
                  handleSubmit(onSubmitData)
                }
              >
                <h2
                  className="text-center m-5 text-header-add"
                  style={{
                    color: "#006A4D",
                    fontFamily: "Inter",
                    fontSize: "28px",
                  }}
                >
                  Add New Schedule
                </h2>

                <div className="field">
                  <div className="control">
                    <label className="label">schedule Date</label>
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
                        name:"comp_name",
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
                      name="prod_name"
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

                {/* schedule Quantity */}
                <div className="field">
                  <div className="control">
                    <label className="label">schedule Quantity</label>
                    <Controller
                      name="Shedule_Quantity"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <input
                          {...field}
                          className={`input ${
                            errors.Shedule_Quantity ? "is-danger" : ""
                          }`}
                          type="number"
                          placeholder="Enter schedule Quantity"
                        />
                      )}
                    />
                    {errors.Shedule_Quantity && (
                      <p className="help is-danger">
                        {errors.Shedule_Quantity.message}
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
              <th>schedule Date</th>
              <th>schedule Quantity</th>
              <th>Date Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoaded ? (
              scheduleList.map((schedule, index) => (
                <tr key={schedule.id}>
                  <td>{index + 1}</td>
                  <td>{schedule.comp_name}</td>
                  <td>{schedule.prod_name}</td>
                  <td>{schedule.Schedule_Date}</td>
                  <td>{schedule.Shedule_Quantity}</td>
                  <td>{new Date(schedule.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="edit-button ml-1"
                      onClick={() => handleEditSchedule(schedule)}
                    >
                      <i className="fi fi-rr-edit"></i>
                    </button>{" "}
                    <button
                      className="delete-button ml-2"
                      onClick={() => handleDeleteSchedule(schedule.id)}
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

export default AddSchedulePage;
