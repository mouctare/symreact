import React, {useState, useEffect} from 'react'
import Field from "../components/forms/Field";
import Select from "../components/forms/Select"
import {Link} from "react-router-dom";
import CustomersAPI from "../services/CustomersAPI";
import axios from "axios";



const InvoicePage = ({ history, match }) => {
    // Le macth c'est pour faire de la discrimination car sinon 
    // je reçois un meme nom de facture pour toutes les facture quand je veut editer

    const { id = "new"} = match.params;

    const [invoice, setInvoice] = useState({
          amount: "",
          customer: "",
          status: ""
      });

      const [customers, setCustomers] = useState([]);
      const [editing, setEditing] = useState(false);
    
      const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
          
      })
      const fetchCustomers = async () => {
          try {
              const data = await CustomersAPI.findAll();
              setCustomers(data);
              // Si le customer est vide, on va changer notre invoice , 
              //on va mettre dedans une copie de notre invoice , 
              //mais dans laquelle on va mettre c'est égal à lindex 0 c'est à le premier qu'on va charger
              if(!invoice.customer) setInvoice({...invoice, customer:data[0].id });

          } catch(error) {
              console.log(error.response);
          }
      }
      // Cette function prend en parametre un id
    const fetchInvoice = async id => {
        try {
          const data = await axios
          .get("http://localhost:8000/api/invoices/" + id)
          .then(response => response.data);
          // Pour ne pas avoir toutes données , on extrait celles qui nous interessent
          // Je vais sortir ces propriétés de mon data
          const { amount, status, customer} = data;
          // customer: customer  avoir un seul customer au lieu de tout l'objet customer.
          setInvoice({ amount, status, customer: customer.id});
        } catch (error) {
            console.log(error.response)
        }
    }
      useEffect(() => {
          fetchCustomers();
      }, []);
     // Cet effet dépend de la variable id c'est à dire si l'id est amené à changer il faut le prendre en compte
      useEffect(() => {
      if(id !== "new") {
          setEditing(true);
          fetchInvoice(id);
      }
    }, [id]);
      // Gestion des changements des inputs dans le formulaire formulaire
      const handleChange = ({currentTarget}) => {
      const { name,value } = currentTarget;
      setInvoice({  ...invoice, [name]: value });
      }

      const handleSubmit = async event  => {
          event.preventDefault();

          try {
                  if(editing) {
                      const response = await axios.put("http://localhost:8000/api/invoices/" + id , { ...invoice, 
                      customer: `/api/customers/${invoice.customer}`}
                      );
                      // TODO : Flash notification success
                      console.log(response);
                } else {
                      const response = await axios.post("http://localhost:8000/api/invoices", {
                      ...invoice,
                       customer: `/api/customers/${invoice.customer}`
                      });
                      // TODO : Flash notification success
                      //console.log(response);
                      history.replace("/invoices");
                }
           } catch({response}) {
            const { violations } = response.data;

           if(violations) {
           const apiErros = {};
           violations.forEach(({propertyPath, message}) => {
               apiErros[propertyPath] = message;
               });
           setErrors(apiErros);
           // TODO : flash notification de succés
       }
    

     } 
      };

        return (
            <div className="container">
          {!editing && <h1>Création d'une facture</h1> || <h1>Modification d'une facture</h1>}
            <form onSubmit={handleSubmit}>
            <Field 
            name="amount" 
            type="number" 
            placeholder="Montant de la facture"
             label="Montant" onChange={handleChange} 
            value={invoice.amount} 
            errors={errors.amount} 
            />

            <Select 
            name="customer"
             label="client" 
             value={invoice.customer}
            error={errors.customer}
            onChange={handleChange}
            >
            
        {customers.map(customer => ( 
        <option key={customer.id}
         value={customer.id}>
          {customer.firstName} {customer.lastName}
        </option>
            ))}
          </Select>

         <Select
          name="stauts" 
          label="Status"
           value={invoice.status} 
           errors={errors.status} 
           onChange={handleChange}
           >
             <option value="SENT">Envoyée</option>
             <option value="PAID">Payée</option>
             <option value="CANCELLD">Annulée</option>
        </Select>
        <div className="form-group">
            <button type="submit" className="btn btn-success">
                Enregistrer
            </button>
            <Link to="/invoices" className="btn btn-link">
                Retour aux factures
            </Link>
            </div>
        </form> 
        </div>
        );
    };

export default InvoicePage;