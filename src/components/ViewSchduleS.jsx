
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { getMe } from "../features/authSlice";
import Autosuggest from "react-autosuggest";
import { CSVLink } from "react-csv";

const ViewSchduleS = () => {

  const [isLoaded, setIsLoaded] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);





  return (
    <div className="container mt-5">
      <h1 className=" text-center mb-5">View Schedule</h1>
    <table className="table is-striped is-bordered is-fullwidth">
      <thead>
        <tr>
          <th>Sr. No</th>
          <th>Company Name</th>
          <th>Product Name</th>
          <th>Compony Stock</th>
          <th>Production</th>
          <th>Rejection</th>
          <th>Dispatch</th>
         
        </tr>
      </thead>
      <tbody>
        {isLoaded ? (
          filteredProducts.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.comp_name}</td>
              <td>{product.prod_name}</td>
              <td>{product.grade_name}</td>
              <td>{product.No_of_casting_in_mould}</td>
              <td>{product.Casting_Weight}</td>
              <td>{new Date(product.createdAt).toLocaleDateString()}</td>
            
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="has-text-centered">
              Loading...
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  )
}

export default ViewSchduleS