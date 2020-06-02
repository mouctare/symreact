import axios from "axios";
import Cache from "./cache";

 async function findAll() {
  const cachedCustomers = await Cache.get("customers");
  // Si cached customers est différend de null, alors return.
  if(cachedCustomers) return cachedCustomers;

  return axios
     .get("http://localhost:8000/api/customers")
    .then(response => {
      const customers = response.data[ 'hydra:member'];
      Cache.set("customers", customers);
      return customers;
      });
    }

function find(id) {
  return axios
   .get("http://localhost:8000/api/customers/" + id) 
  .then(response => response.data);
}

  function deleteCustomers(id) {
   
    return  axios.delete ("http://localhost:8000/api/customers/" + id).then( async   response => {
      const cachedCustomers = await Cache.get("customers");

   if(cachedCustomers) {
     Cache.set("customers", cachedCustomers.filter(c => c.id !== id));
   }
   return response;
    });
    }

function update(id, customer) {
  return axios
  .put("http://localhost:8000/api/customers/" + id, customer)
  .then(async response => {
    const cachedCustomers = await Cache.get("customers");

    if(cachedCustomers) {
      // S j'ai quelque chose dans cachedcustomers , je vais trouvé l'index de la personne
     
      const index = cachedCustomers.findIndex(c => c.id === +id);
       // Je vais crée un nouvel objet 
      const newCachedCustomers = response.data;
       // Je vais remplacé c'est qu'il yavais dans cet index par le nouveau customer
      
      cachedCustomers[index] = newCachedCustomer;
  
     Cache.set("customers", cachedCustomers);
     // Au lié de donner tous mes customers , je vais donné tout simplement mon nouveau customer (cachedCustomers) puisque je l'ai modifié
      
      }
      return response;
     });
}

function create(customer) {
  return axios
  .post("http://localhost:8000/api/customers", customer)
  .then( async response => {
    // Si j'ai réussi cette requet(.then), voila c'est que je veux faire (response)
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

