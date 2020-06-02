import axios from "axios";

function findAll() {
  return axios
     .get("http://localhost:8000/api/customers")
    .then(response => response.data[ 'hydra:member']);
}

function find(id) {
  return axios
   .get("http://localhost:8000/api/customers/" + id) 
  .then(response => response.data);
}

  function deleteCustomers(id) {
    return  axios
          .delete ("http://localhost:8000/api/customers/" + id); // çava supprimer ce customer.
    
}

function update(id, customer) {
  return axios.put("http://localhost:8000/api/customers/" + id, customer);
}

function create(customer) {
  return axios.post("http://localhost:8000/api/customers", customer);
}


export default {
    findAll,    //:findAll
    find,
    create,
    update,
    delete: deleteCustomers


};

