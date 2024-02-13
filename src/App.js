import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './components/Login';
import AddCust from './pages/AddCust';
import Dispatch from "./pages/Dispatch"
import Rejection3 from './pages/Rejection3';
import SchedulePlan from "./pages/SchedulePlan"
import AddProduct from "./pages/AddProduct"
import ProductionLayout from "./pages/ProductionLayout"
import HeatsLayout from "./pages/HeatsLayout";
import Rejection1Layout from './pages/Rejection1Layout';
import Rejection2Layout from './pages/Rejection2Layout';
import ViewSchdule from "./pages/ViewSchdule"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-customer" element={<AddCust/>} />
        <Route path='/dispatch' element={<Dispatch/>}/>
        <Route path='/rejection3' element={<Rejection3/>}/>
        <Route path='/schedule-plan' element={<SchedulePlan/>}/>
        <Route path='/add-product' element={<AddProduct/>}/>
        <Route path='/production' element= {<ProductionLayout/>}/>
        <Route path='/heats' element={<HeatsLayout/>}/>
        <Route path='/rejection1' element={<Rejection1Layout/>}/>
        <Route path='/rejection2' element={<Rejection2Layout/>}/>
        <Route path='/view-schedule' element={<ViewSchdule/>}/>
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
