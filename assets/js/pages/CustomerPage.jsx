import React,{useState} from 'react';
import {Link} from "react-router-dom";
import Field from "../components/forms/Field";
import axios from "axios";



const CustomerPage = (props) => {
    const [customer, setCustomer]  = useState({
        lastName: "Chamla",
        firstName: "",
        email: "",
        compagny: ""
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        compagny: ""

    });

    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setCustomer({...customer,[name]: value});
    };

    const handleSubmit = async event => {
        event.preventDefault();

        try {
           const response = await axios.post("http://localhost:8000/api/customers", customer)
           console.log(response.data);

        }catch(error) {
            console.log(error.response);
        }
        
    }

    return (
        <div className="container">
              <h1>Création d'un client</h1>

              <form onSubmit={handleSubmit}>
                 <Field 
                 name="lastName" 
                 label="Nom de famille" 
                 placelholder="Nom de famille du client" 
                 value={customer.lastName}
                 onChange={handleChange}
                 error={errors.lastName}
                 />
                 <Field 
                 name="firstName" 
                 label="Prénom" 
                 placelholder="Prénom  du client" 
                 value={customer.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                 />
                 
                 <Field 
                 name="email" 
                 label="Email" placelholder="Adresse email du client"   
                  type="email" 
                       value={customer.email}
                       onChange={handleChange}
                       error={errors.email}
                  />
                 <Field
                  name="compagny" 
                  label="Entrprise" 
                  placelholder="Entreprise du client" 
                  value={customer.compagny}
                  onChange={handleChange}
                  error={errors.compagny}
                   />
                 <div className="form-group">
                     <button type="submit" className="btn btn-success">Enregistrer</button>
                     <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
                 </div>
              </form>
    
    
    
    
    </div>
    );

};


export default CustomerPage;

