import React, {useState, useEffect} from 'react'
import Field from "../components/forms/Field";
import Select from "../components/forms/Select"
import {Link} from "react-router-dom";
import CustomersAPI from "../services/CustomersAPI";
import InvoicesAPI from "../services/InvoicesAPI";
import { toast } from 'react-toastify';
import FormContentLoader from "../loaders/FormContentLoader";




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
          
      });
      const [loading, setLoading] = useState(true);
       // Récupération des clients à chaque chargement
      const fetchCustomers = async () => {
    try {
       const data = await CustomersAPI.findAll();
        setCustomers(data);
        setLoading(false);
        // Si le customer est vide, on va changer notre invoice , 
        //on va mettre dedans une copie de notre invoice , 
        //mais dans laquelle on va mettre c'est égal à lindex 0 c'est à le premier qu'on va charger
     if(!invoice.customer) setInvoice({...invoice, customer:data[0].id });

         } catch(error) {
            history.replace('/invoices');
             // TODO : Flash notification erreur
             toast.error("Impossible de charger les clients")
          }
      };
      // Cette function prend en parametre un id
      // Récupération d'une facture à chaque chargement
    const fetchInvoice = async id => {
        try {
            const { amount, status, customer}  = await InvoicesAPI.find(id);
          // Pour ne pas avoir toutes données , on extrait celles qui nous interessent
          // Je vais sortir ces propriétés de mon data
           // customer: customer  avoir un seul customer au lieu de tout l'objet customer.
          setInvoice({ amount, status, customer: customer.id});
          setLoading(false);
        } catch (error) {
            // TODO : Flash notification erreur
            toast.error("Impossible de charger la facture demandée")
            history.replace('/invoices');
        }
    }
    // Récupération de la liste à chaque changement du composant
      useEffect(() => {
          fetchCustomers();
      }, []);
     // Cet effet dépend de la variable id c'est à dire si l'id est amené à changer il faut le prendre en compte
     // Récupération de la bonne facture quand l'identifiant de l'URL change
      useEffect(() => {
      if(id !== "new") {
          setEditing(true);
          fetchInvoice(id);
      }
    }, [id]);
      // Gestion des changements des inputs dans le formulaire formulaire
      const handleChange = ({currentTarget}) => {
      const { name, value } = currentTarget;
      setInvoice({  ...invoice, [name]: value });
      };
  // Gestion de la soummission du formulaire
      const handleSubmit = async event  => {
     event.preventDefault();

     try {
        if(editing) {
        await InvoicesAPI.update(id, invoice);
        // TODO : Flash notification success
        toast.success("La facture a bien été modifiée");
         } else {
        await InvoicesAPI.create(invoice)
        // TODO : Flash notification suuces
        //console.log(response);
         toast.success("La facture a bien été crée");
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
           // TODO : flash notification erreur
           toast.error("Des erreurs dans votre formulaire")
       }
    

     } 
      };

        return (
            <div className="container">
          {!editing && <h1>Création d'une facture</h1> || <h1>Modification d'une facture</h1>}
            {loading && <FormContentLoader />} 

         {!loading && <form onSubmit={handleSubmit}>
            <Field 
            name="amount" 
            type="number" 
            placeholder="Montant de la facture"
            label="Montant" 
             onChange={handleChange} 
            value={invoice.amount} 
            error={errors.amount} 
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
          name="status" 
          label="Status"
           value={invoice.status} 
           errors={errors.status} 
           onChange={handleChange}
           >
             <option value="SENT">Envoyée</option>
             <option value="PAID">Payée</option>
             <option value="CANCELLED">Annulée</option>
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
      }
        </div>
        );
    };

export default InvoicePage;