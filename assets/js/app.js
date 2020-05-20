
import React, {useState} from "react";
import ReactDom from "react-dom";
import Navbar from "./components/Navbar";
import HomePages from "./components/HomePages";
import {HashRouter,Switch,Route, withRouter,Redirect} from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
import CustomersPageWithPagination from "./pages/CustomersPageWithPagination";
import LoginPage from "./pages/LoginPage";
import '../css/app.css';
import AuthAPI from "./services/AuthAPI";




AuthAPI.setup();

const PrivateRoute = ({path,isAuthenticated,component}) => 
   isAuthenticated ? (
  <Route path={path} component={component} /> 
  ) : ( 
    <Redirect to="/login" />
  );

const App = () => {
  // Il faut qu'on demande à notre AuthAPI si on est connecté ou pas

const [isAuthenticated, setIsAuthenticated] = useState(
    AuthAPI.isAuthenticated()
  );

  const NavbarWithRouter = withRouter(Navbar);

return (
    <HashRouter>
    <NavbarWithRouter 
    isAuthenticated={isAuthenticated} 
    onLogout={setIsAuthenticated} 
    />
    <main className="container.pt -5">
        <Switch>
          <Route 
          path="/login" 
          render={props => ( 
           <LoginPage onLogin= {setIsAuthenticated} {...props} />
            )}
         />
        <PrivateRoute 
        path="/invoices" 
        isAuthenticated={isAuthenticated}
        component={InvoicesPage}
        />
        
       <PrivateRoute 
        path="/customers" 
        isAuthenticated={isAuthenticated}
         component={CustomersPage} 
         />
        <Route path="/" component={HomePages}/>
        </Switch>
     </main>
   </HashRouter>

    );
};


const rootElement = document.querySelector('#app');
ReactDom.render(<App/>,rootElement);
