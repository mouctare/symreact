
import React, { useState } from "react";
import ReactDom from "react-dom";
import 'bootstrap/dist/css/bootstrap.css';
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";
import '../css/app.css';
import AuthContext from "./components/contexts/AuthContext";
import HomePages from "./components/HomePages";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
import InvoicePage from "./pages/InvoicePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthAPI from "./services/AuthAPI";
import CustomerPage from "./pages/CustomerPage";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast }  from "react-toastify";
 

AuthAPI.setup();

 const App = () => {
  // Il faut qu'on demande à notre AuthAPI si on est connecté ou pas

const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  );

  const NavbarWithRouter = withRouter(Navbar);
  // Je me crée la value du context
 // const contextValue = {
  //  isAuthenticated,
  //  setIsAuthenticated
 // }

return (
  <AuthContext.Provider value={{
    isAuthenticated,
   setIsAuthenticated

  }}>
    <HashRouter>
    <NavbarWithRouter />

    <main className="container.pt -5">
        <Switch>
          <Route path="/login" component={LoginPage}/>
          <Route path="/register" component={RegisterPage}/>
          <PrivateRoute exact path="/invoices/:id" component={InvoicePage}/>
           <PrivateRoute exact path="/invoices" component={InvoicesPage}/>
           <PrivateRoute exact path="/customers/:id" component={CustomerPage}/>
           <PrivateRoute  exact path="/customers" component={CustomersPage}/>
        <Route path="/" component={HomePages}/>
        </Switch>
     </main>
   </HashRouter>
   <ToastContainer position={toast.POSITION.BOTTOM_LEFT}/>
   </AuthContext.Provider>

    );
};


const rootElement = document.querySelector('#app');
ReactDom.render(<App/>,rootElement);
