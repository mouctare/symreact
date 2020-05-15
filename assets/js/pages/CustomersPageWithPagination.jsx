
import React , { useEffect , useState}from 'react';
import axios from "axios";
import Pagination from "../components/Pagination";

  const CustomersPageWithPagination = props =>{
  const [customers, setCustomers] = useState([]);
  const [totalItems,setTotalItems] = useState(0);
  const [currentPage, setCurentPage] = useState(1); // On gère la page sur laquelle on se trouve par défaut elle est à 1
  const itemsPerPage = 10;


    useEffect(() => {
        axios.get
        (`http://localhost:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`
        
        )
        .then(response => {
            setCustomers(response.data["hydra:member"]);
            setTotalItems(response.data["hydra:totalItems"]); // Modification du state pour avoir les nouvelles données.
        })
            .catch(error=> console.log(error.response));
        }, [currentPage]);

        const handleDelete = (id) => {
            const originalCustomers = [...customers];
            // 1. L'approche optimiste
            setCustomers(customers.filter(customer => customer.id !== id));
            // 2. L'approche pessimiste
            axios
            .delete("http://localhost:8000/api/customers/" + id) // çava supprimer ce customer.
            .then(response => console.log("ok"))
            .catch(error => {
                setCustomers(originalCustomers);
                console.log(error.response);
            });
        };

        const handlePageChange = page => {
            setCustomers([]);
            setCurentPage(page);
        };

 const paginatedCustomers = Pagination.getData(
      customers,
      currentPage,
      itemsPerPage
      );

      return (
        <div>
        <h1>Listes des clients (pagination)</h1>

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

            <tbody>
                {customers.length === 0 && (
                <tr>
                <td>Chargement...</td>
                </tr>
                )}
                {customers.map(customer =>  
                <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                 <a href="#">{customer.firstName} {customer.lastName}</a>
                </td>
                <td>{customer.email}</td>
                <td>{customer.compagny}</td>
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
               )}
            </tbody>
            </table>

            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} 
           length= {totalItems}
            onPageChanged={handlePageChange} />
        
      </div>
    );
};
 

export default CustomersPageWithPagination;