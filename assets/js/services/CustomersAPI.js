import axios from "axios";
import Cache from "./cache";
import { CUSTOMERS_API } from "../config";

 async function findAll() {
  const cachedCustomers = await Cache.get("customers");
  // Si cached customers est différend de null, alors return.
  if(cachedCustomers) return cachedCustomers;

  return axios
     .get(CUSTOMERS_API).then(response => {
      const customers = response.data[ 'hydra:member'];
      Cache.set("customers", customers);
      return customers;
      });
    }

 async function find(id) {
  const cachedCustomers = await Cache.get("customers." + id);
  if(cachedCustomers) return cachedCustomer;

  return axios
   .get(CUSTOMERS_API + "/" + id) 
   .then(response => {
     const customer = response.data

     Cache.set("customer." + id, customer);
 
     return customer;
  });
}  

  function deleteCustomers(id) {
   
    return  axios.delete (CUSTOMERS_API + "/" + id).then( async   response => {
      const cachedCustomers = await Cache.get("customers");

   if(cachedCustomers) {
     Cache.set("customers", cachedCustomers.filter(c => c.id !== id));
   }
   return response;
    });
    }

function update(id, customer) {
  return axios
  .put(CUSTOMERS_API + "/"  + id, customer)
  .then(async response => {
    const cachedCustomers = await Cache.get("customers");
    const cachedCustomer = await Cache.get("customers." + id);

    if(cachedCustomer) {
      Cache.set("customers." + id, response.data);

    }
    


    if(cachedCustomers) {
      // S j'ai quelque chose dans cachedcustomers , je vais trouvé l'index de la personne
     
      const index = cachedCustomers.findIndex(c => c.id === id);
       // Je vais crée un nouvel objet 
      const newCachedCustomers = response.data;
       // Je vais remplacé c'est qu'il yavais dans cet index par le nouveau customer
      
      cachedCustomers[index] = response.data;
  
    // Cache.set("customers", cachedCustomers);
     // Au lié de donner tous mes customers , je vais donné tout simplement mon nouveau customer (cachedCustomers) puisque je l'ai modifié
      
      }
      return response;
     });
}

function create(customer) {
  return axios.post(CUSTOMERS_API, customer).then( async response => {
    // Si j'ai réussi cette requet(.then), voila c'est que je veux faire (response)
    // Pas comme ça CUSTOMERS_API + "/" + id, customer
    const cachedCustomers = await Cache.get("customers");

    if(cachedCustomers) {
      Cache.set("customers", [...cachedCustomers, response.data]);
    }
    return response;
  })
}


export default {
    findAll,    //:findAll
    find,
    create,
    update,
    delete: deleteCustomers


};

