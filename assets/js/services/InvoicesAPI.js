import axios from "axios";

function findAll() {
  return axios
     .get("http://localhost:8000/api/invoices")
    .then(response => response.data[ 'hydra:member']);
}

  function deleteinvoices(id) {
    return  axios
          .delete ("http://localhost:8000/api/invoices/" + id); // çava supprimer ce customer.
    
}


export default {
    findAll,    //:findAll
    delete: deleteinvoices


};

