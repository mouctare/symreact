import React, {useState,useContext} from 'react';
import AuthAPI from "../services/AuthAPI";
import AuthContext from "../components/contexts/AuthContext";
import Field from "../components/forms/Field";


const  LoginPage = ({ history }) => {
const { setIsAuthenticated } =  useContext(AuthContext)

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    
    const [error, setError] = useState("");

    // Gestion des champs
    const handleChange = ({currentTarget}) => {
        // Je vais prendre le changement qui ya eu de cette input là !
        const {value, name} = currentTarget;
        //const value = currentTarget.value;
        //const name = currentTarget.name;

        setCredentials({...credentials, [name]:  value});
        // Là, je vais changé mes credentials(mon state),
        // Je vais que ça soit tout ce que contient mon state et 
        // je vais l'ecraser avec ma value en mettant name entre crochet on parle de variable
    };
      // Gestion du submit
      const handleSubmit = async event => {
        event.preventDefault();

        try {
        await AuthAPI.authenticate(credentials);
        setError("");
        setIsAuthenticated(true);
        history.replace("/customers");
       } catch(error) {
        setError(
            "Aucun compte ne possède cette adresse  email ou alors les informations ne  corespondent pas !"
            );
        }
        };
    
        return (
            <div className="container">
            <h1>Connexion à l'application</h1>

            <form onSubmit={handleSubmit}>
                <Field 
                label="Adresse email" 
                name="username"  
                value={credentials.username}  
                onChange={handleChange}
                placeholder="Adresse email de connexion"
                error={error} 
                />

               <Field 
               name="password" 
               label="Mot de passe" 
               value={credentials.password} 
                onChange={handleChange}
                type="password"
                error="" 
                    />

                <div className="form-group"><button type="submit" className="btn btn-success">
                je me connecte
                </button>
                </div>
            </form>
                
            </div>
        )
    };


export default LoginPage



