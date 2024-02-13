import React, { useEffect } from 'react'
import Layout from './Layout';
import Welcome from "../components/Welcome";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../features/authSlice';

const Dashboard = () => {
  const dispatches = useDispatch();
  const navigate = useNavigate();
  const {isError} = useSelector((state => state.auth));

  useEffect(()=>{
    dispatches(getMe());
  }, [dispatches]);

  useEffect(()=>{
    if(isError){
      navigate("/")
    }
  }, [isError, navigate]);

  return (
    <Layout>
      <Welcome/>
    </Layout>
  )
}

export default Dashboard