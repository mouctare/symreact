import React,{useState,useEffect} from 'react';
import {Link} from "react-router-dom";
import Field from "../components/forms/Field";
import axios from "axios";



const CustomerPage = (props) => {
    // Je vais sortir l'identifiant de mes params.
    const { id = "new" } = props.match.params;

    const [customer, setCustomer]  = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });
   
    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
        
    });
    
    const [editing, setEditing] = useState(false);

    const fetchCustomer = async id => {
        try {
            const data =  await axios
            .get("http://localhost:8000/api/customers/" + id) 
            .then(response => response.data);
            const { firstName,lastName,email, company} = data;

            setCustomer({ firstName, lastName,email,company});
         } catch (error) {
             console.log(error.response);
         }
            
    }



    useEffect(() =>{
        // Si id est différent de new, je suis entrain d'editer
        if(id !== "new") {
        setEditing(true);
        fetchCustomer(id);
       }

    }, [id]);


    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setCustomer({...customer,[name]: value});
    };

    const handleSubmit = async event => {
        event.preventDefault();

        try {

            if(editing) {
                // Si je suis en mode édition, je vais applé cette methode put
                const response = await axios.put(
                    "http://localhost:8000/api/customers/" + id, 
                    customer
                    );
                
                    // TODO : flash notification de succés
            } else {
                // Si je suis pas en mode edition , 
                // je vais applé la methode post car dans ce cas je suis entrain de créer un customer
                const response = await axios.post(
                    "http://localhost:8000/api/customers", 
                customer
                );
              // Quand on ajoute quelquin , on fait une redirection vers les customers
              // TODO : flash notification de succés
              props.history.replace("/customers");

            }

           setErrors({});
            }catch(error) {
           if(error.response.data.violations) {
               const apiErros = {};
               error.response.data.violations.forEach(violation => {
                   apiErros[violation.propertyPath] = violation.message;
                   
               });
               setErrors(apiErros);
               // TODO : flash notification de succés
           }
        }
        
    }

    return (
        <div className="container">
             {!editing && <h1>Création d'un client</h1> || <h1>Modification du client</h1>}

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
                  value={customer.company}
                  onChange={handleChange}
                  error={errors.company}
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

