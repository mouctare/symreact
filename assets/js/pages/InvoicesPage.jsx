import moment from "moment";
import React, { useEffect, useState } from 'react';
import Pagination from "../components/Pagination";
import InvoicesAIP from "../services/InvoicesAPI";


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
    const itemsPerPage = 10;

// Récupération des invoices auprés de l'API


const fetchInvoices = async () => {
    try {
        const data =  await InvoicesAIP.findAll();
        setInvoices(data);

    } catch(error) {
        console.log(error.response);
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

          } catch(error) {
              console.log(error.response);
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
        
         <h1>Listes des factures</h1>

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
             <tbody>
                   
                 {paginatedInvoices.map(invoice => (
                     <tr key={invoice.id}>
                    <td>{invoice.chrono}</td>
                     <td>
                         <a href="#">
                             {invoice.customer.firstName} {invoice.customer.lastName}
                             </a>
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
                         <button className="btn btn-sm btn-primary  mr-1">Editer</button>
                         <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimé</button>
                     </td>
                     </tr>
                ))}
                </tbody>
         </table>
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
