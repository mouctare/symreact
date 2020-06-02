import moment from "moment";
import React, { useEffect, useState } from 'react';
import Pagination from "../components/Pagination";
import InvoicesAIP from "../services/InvoicesAPI";
import {Link} from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../loaders/TableLoader";


// Cette constate sert à mettre le status à différend couleur !
const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"

};
// Pour labeliser le status
const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyer",
    CANCELLED: "Annulée"
}




const InvoicesPage = props => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search,setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

// Récupération des invoices auprés de l'API


const fetchInvoices = async () => {
    try {
        const data =  await InvoicesAIP.findAll();
        setInvoices(data);
        // Quand on a fini de fecther les factures , on est plus entrain de loader
        setLoading(false);
     } catch(error) {
        toast.error("Une erreur est survenue  lors du chargement des factures !");
    } 
    
};

// Charger les invoices au chargement du composant
useEffect(() => {
    fetchInvoices();

}, []);

// Gestion de changement de page
const handlePageChange = page => setCurrentPage(page);

// Gestion de la recherche    
const handleSearch = ({currentTarget}) => { 
    setSearch(currentTarget.value); 
    setCurentPage(1);
      };

      // Gestion de la suppression

    const handleDelete =  async id => {
          // La prémière des choses ,je vais copié mon tableau auriginal comme ça en de souci !
          const orginalInvoices = [...invoices];
          // C'est ici que je vais supprimé mes invoices

          setInvoices(invoices.filter(invoice => invoice.id !== id));

          try {
             await InvoicesAIP.delete(id);
             toast.success("La facture a bine été supprimée");
         } catch(error) {
            toast.error("Une erreur est survenue")
              // Je vais ici remettre mes originals.
              setInvoices(orginalInvoices);
          }

      };
  // Gestion de format de date avec la librairie momment.js
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');
    


// Gestion de la recherche :

const filteredInvoices = invoices.filter(
    i =>
     i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
     i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
     i.amount.toLocaleString().startsWith(search.toLowerCase()) ||
     STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())

     );

// Pagination des données
const paginatedInvoices = Pagination.getData(
    filteredInvoices,
      currentPage,
       itemsPerPage
     );



    return ( 
        <div className="container">
     <div className="mb-3 d-flex justify-content-between align-items-center">
               <h1>Listes des factures</h1>
               <Link  className="btn btn-primary" to="/invoices/new" >
                Créer un facture
               </Link>
          </div>

       <div className="form-group">
            <input 
            type="text" onChange={handleSearch} 
            value={search} className="form-control" placeholder="Rechercher ..."
            />
        </div>

         <table className="table hover">
             <thead>
                 <tr>
                     <th>Numéro</th>
                     <th>Client</th>
                     <th className="text-center" >Date d'envoi</th>
                     <th className="text-center">Statut</th>
                     <th className="text-center">Montant</th>
                     <th></th>
                 </tr>
             </thead>
             {!loading && (
           <tbody>
                   
                 {paginatedInvoices.map(invoice => (
                     <tr key={invoice.id}>
                    <td>{invoice.chrono}</td>
                     <td>
                         <Link to={"/customers/" + invoice.customer.id}>
                         {invoice.customer.firstName} {invoice.customer.lastName}
                        </Link>
                       </td>
                     <td className="text-center">{formatDate(invoice.sentAt)}
                     </td>
                     <td className="text-center">
                    <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                    >
                        {STATUS_LABELS[invoice.status]}
                        </span>
                     </td>
                     <td className="text-center">
                         {invoice.amount.toLocaleString()} €
                    </td>
                     <td>
                         <Link 
                         to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary  mr-1">Editer
                         </Link>
                         <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimé</button>
                     </td>
                     </tr>
                ))}
                </tbody>
             )}
         </table>
        
         {loading && <TableLoader />} 

         <Pagination  
          currentPage={currentPage} 
          itemsPerPage={itemsPerPage} 
          onPageChanged={handlePageChange}
          length={filteredInvoices.length} 
         />
         </div>



        
    );
};

export default InvoicesPage;
