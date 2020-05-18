import React, {useState} from 'react';
import axios from 'axios';

const  LoginPage = (props) => {
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    
    const [error, setError] = useState("");

    const handleChange = (event) => {
        // Je vais prendre le changement qui ya eu de cette input là !
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;

        setCredentials({...credentials, [name]:  value});
        // Là, je vais changé mes credentials(mon state),
        // Je vais que ça soit tout ce que contient mon state et 
        // je vais l'ecraser avec ma value en mettant name entre crochet on parle de variable
    };

    const handleSubmit = async event => {
        event.preventDefault();

        try {
        const token =   await axios
            .post("http://localhost:8000/api/login_check", credentials)
            // Quand je reçois la reponse c'est que je vais extraire c'est response.data.token
            .then(response => response.data.token);
            setError("");

            // Pour stoker le mot de passe dans le navigateur
            window.localStorage.setItem("authToken",token);
            // On previent Axios qu'on a maintenant un header par défaut sur toutes nos futures requetes HTTP
            axios.defaults.headers["Authorization"] = "Bearer " + token;
           
            } catch(error) {
        setError(
            "Aucun compte ne possède cette adresse  email ou alors les informations ne  corespondent pas !"
            );
        }
        

        console.log(credentials);

    };
    
        return (
            <div className="container">
            <h1>Connexion à l'application</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Adresse </label>
                    <input 
                    value={credentials.username}
                    onChange={handleChange}
                    type="email" 
                    placeholder="Adresse email de connexion" 
                    name="username" 
                    id="username" 
                    className={"form-control" + (error && " is-invalid")}
                    />
                  {error && <p className="invalid-feedback">{error}</p>}
                    </div>
                   <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input 
                    value={credentials.password}
                    onChange={handleChange}
                    type="password"
                     placeholder="Mot de passe" 
                     name="password" id="password" 
                    className="form-control"
                    />
                    </div>
                    <div className="form-group"><button type="submit" className="btn btn-success">je me connecte</button></div>
                    </form>
                
            </div>
        )
    };


export default LoginPage



