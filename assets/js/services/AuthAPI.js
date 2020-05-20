import axios from "axios";
import jwtDecode from "jwt-decode";

/**
 *  Déconnexion (suppression du token du localStorage et sur Axios)
 */

function logout(){
    window.localStorage.removeItem("authToken");
     axios.defaults.headers 
    delete axios.defaults.headers["Authorization"];
    
    } 
    /**
     * Reque HTTP d'authentification et stokage du token dans le storage et sur Axios
     */

 function authenticate(credentials){
  return axios
    .post("http://localhost:8000/api/login_check", credentials)
    // Quand je reçois la reponse c'est que je vais extraire c'est response.data.token
     .then(response => response.data.token)
    .then(token => {
       // Pour stoker le mot de passe dans le navigateur
       window.localStorage.setItem("authToken", token);
       // On previent Axios qu'on a maintenant un header par défaut sur toutes nos futures requetes HTTP
      // axios.defaults.headers["Authorization"] = "Bearer " + token;
      setAxiosToken(token);
      

       
      
    });
  }
  /**
   * Positionne le token JWT sur Axios
   * @param {string} token Le token JWT
   */
  function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;

  }

  /**
   * Mise en place lors du chargement de l'application
   */
    function setup() {
      // 1. Voir si on a un token ?
      const token = window.localStorage.getItem("authToken");

      // 2. Si le token est encor valide
      if(token) {
        const {exp : expiration}= jwtDecode(token);
        if(expiration * 1000 > new Date().getTime()) {  // Afin détre connecté un moment sans avoir à
          // se reconnecter à chaque rechargement de page
         // axios.defaults.headers["Authorization"] = "Bearer " + token;
         setAxiosToken(token);
         } 
        }
      }

      /**
       * Permet de savoir si on est authentifié ou pas
       * @returns boolean
       */

  function isAuthenticated() {
    // 1. Voir si on a un token ?
    const token = window.localStorage.getItem("authToken");
     // 2. Si le token est encor valide
    if(token) {
      const {exp : expiration}= jwtDecode(token);
      if(expiration * 1000 > new Date().getTime()) {  
         return true
    }
    return false;
  }

 return false;

  }
    // Donner le token à axios
    
     export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
    

};
