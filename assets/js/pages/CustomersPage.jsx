
import React , { useEffect , useState}from 'react';
import axios from "axios";
import Pagination from "../components/Pagination";

  const CustomersPage = props =>{
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurentPage] = useState(1); // On gère la page sur laquelle on se trouve par défaut elle est à 1
  const [search,setSearch] = useState("");


    useEffect(() => {
        axios.get("http://localhost:8000/api/customers")
        .then(response => response.data[ 'hydra:member'])
        .then(data => setCustomers(data))
        .catch(error=> console.log(error.response));
        }, []);

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
            setCurentPage(page);
        };

        const handleSearch = Event => { // HandleSearch est une fonction qui va recevoir un évenemnt et ...
            const value = event.currentTarget.value; // Dans l'event je veux prendre la currentTarget et je vais prendre sa value.
            setSearch(value); //setSchearche sera la value que j'ai récupéré
          };

  const itemsPerPage = 10;


  const filteredCustomers = customers.filter(
      c => 
     c.firstName.toLowerCase() .includes((search.toLowerCase()) ||
    c.lastName.toLowerCase() .includes(search.toLowerCase())

   ));

  const paginatedCustomers = Pagination.getData(
      filteredCustomers,
      currentPage,
      itemsPerPage

      );

      return (
        <>
        <h1>Listes des clients</h1>

        <div className="form-group">
            <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher ..."/>
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

            <tbody>
                {paginatedCustomers.map(customer =>  
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

            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length=
            {filteredCustomers.length}
            onPageChanged={handlePageChange} />
        
      </>
    );
};
 

export default CustomersPage;