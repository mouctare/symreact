import axios from "axios";

function findAll() {
  return axios
     .get("http://localhost:8000/api/customers")
    .then(response => response.data[ 'hydra:member']);
}

  function deleteCustomers(id) {
    return  axios
          .delete ("http://localhost:8000/api/customers/" + id); // çava supprimer ce customer.
    
}


export default {
    findAll,    //:findAll
    delete: deleteCustomers


};

