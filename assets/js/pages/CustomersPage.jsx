
import React, { useEffect, useState } from 'react';
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/CustomersAPI";
import {Link} from "react-router-dom";
import { toast } from 'react-toastify';
import TableLoader from '../loaders/TableLoader';

   const CustomersPage = props =>{
   const [customers, setCustomers] = useState([]);
   const [currentPage, setCurentPage] = useState(1); // On gère la page sur laquelle on se trouve par défaut elle est à 1
   const [search,setSearch] = useState("");
   const [loading, setLoading] = useState(true);

   const fetchCustomers = async () => {
    try {
        const data = await CustomersAPI.findAll()
        setCustomers(data);
        setLoading(false);
      } catch(error) {
     toast.error("Impossible de charger les clients");
    }
   };
  // Au chargement du composant , on va chercher les customers
   useEffect( () => {
       fetchCustomers();
    }, []);

    // Gestion de la suppression d'un client (customers)
        const handleDelete =  async id => {
         const originalCustomers = [...customers];

        setCustomers(customers.filter(customer => customer.id !== id));
            
         try {
          await CustomersAPI.delete(id)
          toast.success("Le client a bine été supprimé");
         } catch(error) {
          setCustomers(originalCustomers);
          toast.error("La suppression du client a échoué");
            }
           
        };
    // Gestion de changement de page
    const handlePageChange = page => setCurentPage(page);

    // Gestion de la recherche    
    const handleSearch = ({currentTarget}) => { 
        setSearch(currentTarget.value); 
        setCurentPage(1);
          };

    const itemsPerPage = 10;

    // Cette condition a pu résoudre le problème de la disparition de ma pagination

    let filteredCustomers 
     if(search === ""){
        filteredCustomers = customers 
    } else {
        filteredCustomers = customers.filter(
            c => 
           c.firstName.toLowerCase().includes((search.toLowerCase()) ||
           c.lastName.toLowerCase().includes(search.toLowerCase()) ||
           c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.company.toLowerCase().includes(search.toLowerCase()) 
          ));

    }
   
    // Pagination des données
   const paginatedCustomers = Pagination.getData(
   filteredCustomers,
     currentPage,
      itemsPerPage
    );

    return (

        <div className="container">
            <div className="mb-3 d-flex justify-content-between align-items-center">
               <h1>Listes des clients</h1>
               <Link to="/customers/new" className="btn btn-primary">
                Créer un client
               </Link>
   
        </div>

        <div className="form-group">
            <input 
            type="text" onChange={handleSearch} 
            value={search} className="form-control" placeholder="Rechercher ..."/>
            <i className="icon-search"></i>
        </div>

     
        <table className="table table-hover">
            <thead>
                <tr>
                <th>Id.</th>
                <th>Client</th>
                <th>Email</th>
                <th>Entrprise</th>
                <th className="text-center">Factures</th>
                <th className="text-center">Montant total</th>
                <th></th>
            </tr>
            </thead>

           {!loading && (
           <tbody>
            {paginatedCustomers.map(customer => (
                <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                 <Link to={"/customers/" + customer.id}>
                {customer.firstName} {customer.lastName}
                </Link>
                </td>
                <td>{customer.email}</td>
                <td>{customer.company}</td>
                <td className="text-center">
                <span className="badge badge-primary">{customer.invoices.length}</span>
                </td>
                <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                <td>
                    <button 
                    onClick={() => handleDelete(customer.id)} // Quand on clik sur ce boutton on va applé cette function.
                    disabled={customer.invoices.length > 0}
                    className="btn btn-sm btn-danger"
                    >
                        Supprimer
                        </button> 
                </td>
               </tr>
                ))}
            </tbody>
            )}
            </table>
          {loading && <TableLoader /> } 

           {itemsPerPage < filteredCustomers.length && (  
           <Pagination 
            currentPage={currentPage} 
            itemsPerPage={itemsPerPage} 
            length={filteredCustomers.length}
            onPageChanged={handlePageChange} 
            />
           )}
           
        </div>
     
        );
};
 

export default CustomersPage;