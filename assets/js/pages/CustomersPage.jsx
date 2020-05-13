import React , { useEffect , useState}from 'react';
import axios from "axios";

  const CustomersPage = props =>{
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurentPage] = useState(1); // On gère la page sur laquelle on se trouve par défaut elle est à 1


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
        }

        const itemsPerpage = 10;
        const pagesCount =  Math.ceil(customers.length / itemsPerpage); // ici on fait une division
        const pages = [];

        for(let i = 1; i <= pagesCount; i++) {
            pages.push(i);
        }
        
        // Pour gerer la pagination, il faut savoir d'ou on part (start), pendant combier (itemPerPage)
       // Pour cela , la methode slice permet de decouper un tableau
       const start = currentPage * itemsPerpage - itemsPerpage;
       // exemple 3 *10 - 10 = 20 
       const paginatedCustomers = customers.slice(start, start + itemsPerpage); // Je vais partir de start 

      return (
        <>
        <h1>Listes des clients</h1>

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
               </tr>)}
                </tbody>
            
        </table>
        <pagination currentPage={currentPage} itemsPerpage={itemsPerpage} length={customers.length}
        onPageChanged={handlePageChange} />
        
       <div>
         <ul className="pagination pagination-sm">
         <li className={"page-item" + (currentPage === 1 && "disabled")} 
         // si la page actuelle est a  la premiére page, je vais désactivé le boutton
         > 
         <button 
           className="page-link"
            onClick={() => handlePageChange(currentPage - 1)}
            >
          &laquo;
          </button>
          </li> 
          {pages.map(page => ( 
          <li key={page} className={"page-item" + (currentPage === page && " active")}>
          <button className="page-link" 
          onClick={() => handlePageChange(page)}
          >
          {page}
          </button>
        </li>
          ))}
          
      <li className={"page-item" + (currentPage === pagesCount && "disabled")} 
       // si la page actuelle est a 10, je vais désactivé le boutton
      > 
      <button className="page-link" 
      onClick={() => handlePageChange(currentPage + 1)}>
          &raquo;
          </button>
   </li> 
  </ul>
</div>

</>
    );
};
 

export default CustomersPage;