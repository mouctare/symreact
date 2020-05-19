import React from 'react';
import AuthAPI from "../services/AuthAPI";
import { NavLink } from 'react-router-dom';




const Navbar = props => {

  const handleLogout = () => {
    AuthAPI.logout();
    
  };
     return (
     <nav className="navbar navbar-expand-lg navbar-light bg-light">
     <NavLink className="navbar-brand" to="/">
         SymReact !
     </NavLink>
     <button
      className="navbar-toggler"
      type="button"
       data-toggle="collapse" 
       data-target="#navbarColor03" 
       aria-controls="navbarColor03" 
       aria-expanded="false" 
       aria-label="Toggle navigation"
       >
       <span className="navbar-toggler-icon"></span>
     </button>
   
     <div className="collapse navbar-collapse" id="navbarColor03">
       <ul className="navbar-nav mr-auto">
        <li className="nav-item">
           <NavLink className="nav-link" to="/customers">
             Clients
             </NavLink>
         </li>
         <li className="nav-item">
           <NavLink className="nav-link" to="/invoices">
               Factures
               </NavLink>
               </li>
         </ul>
          <ul className="navbar -nav ml -auto">
          <li className="nav-item">
            <NavLink to="/register" className="nav-link">
                Inscription
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/login" className="btn btn-success">
                Connexion !
            </NavLink>
          </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-danger">
                  Decoonexion
              </button>
          </li>
       </ul>
     </div>
   </nav>
   );
}


export default Navbar;