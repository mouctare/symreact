import React,{useState,useEffect} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import CustomersAPI from "../services/CustomersAPI";
import { toast } from 'react-toastify';
import FormContentLoader from "../loaders/FormContentLoader";


const CustomerPage = ({history,match}) => {
    // Je vais sortir l'identifiant de mes params.
    const { id = "new" } = match.params;

    const [customer, setCustomer]  = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });
    const [loading, setLoading] = useState(false); 
    const [editing, setEditing] = useState(false);

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
        
    });    
    
    // Récupération du customer en fonction de l'identifiant
    const fetchCustomer = async id => {
        try {
            const { firstName,lastName,email, company} =  await CustomersAPI.find(id);
            // Ici, je récupère que ces propriétée et je les donnes à mon nouveau customer  setCustomer({ firstName, lastName,email,company});
                setCustomer({ firstName, lastName,email,company});
                setLoading(false);
            } catch (error) {
                // TODO : Notification flash d'une erreur
                toast.error("Le clinent n'a pas pu étre chargé");
                history.replace("/customers");
            }
            
        }
        
        // Chargement du customer du customer si besoin au chargement du composant ou au chargement de l'identifiant
        useEffect(() =>{
            // Si id est différent de new, je suis entrain d'editer
            if(id !== "new") {
                setLoading(true);
                setEditing(true);
                fetchCustomer(id);
            }            
        }, [id]);
        
        // Gestion des changements des inputs dans le formulaires
        const handleChange = ({currentTarget}) => {
            const {name, value} = currentTarget;
            setCustomer({...customer,[name]: value});
        };
        // Gestion de la soummisssion du formulaire
        const handleSubmit = async event => {
            event.preventDefault();            
            try {
                setErrors({});                
            if(editing) {
                // Si je suis en mode édition, je vais applé cette methode put
                 await CustomersAPI.update(id, customer)                
                    // TODO : flash notification de succés
                    toast.success("Le client a bien été modifié");
            } else {
             await CustomersAPI.create(customer);
               // TODO : flash notification de succés
               toast.success("Le client a bien été crée");
              history.replace("/customers");
            }
          setErrors({})  
        }catch ({ response }) {
            
            const { violations } = response.data;
           if(violations) {
               const apiErros = {};
               violations.forEach(({propertyPath, message}) => {
                   apiErros[propertyPath] = message;
                   });
               setErrors(apiErros);
               // TODO : flash notification d'erreurs
               toast.error("Des erreurs dans votre formulaire");
           }
        }
        
    };

    return (
        <div className="container">
             {!editing && <h1>Création d'un client</h1> || <h1>Modification du client</h1>}

             {loading && <FormContentLoader />}

              {!loading && <form onSubmit={handleSubmit}>                          
                 <Field 
                 name="lastName" 
                 placelholder="Nom de famille du client"                  
                 label="Nom de famille" 
                 onChange={handleChange}
                 value={customer.lastName}               
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
                  name="company" 
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
              }              
              </div>
    );    
};


export default CustomerPage;

