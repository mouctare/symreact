import React, {useState} from 'react'
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import UsersAPI from "./services/UsersAPI";


const RegisterPage = ({ history }) => {

    const [user, setUser] =  useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });
    const [errors, setErros] =  useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });
     // Gestion des changements des inputs dans le formulaire formulaire
     const handleChange = ({currentTarget}) => {
        const { name, value } = currentTarget;
        setUser({  ...user, [name]: value });
        };

        // Gestion de la soummission
       const handleSubmit =  async event => {
           event.preventDefault();
           // On ne peut pas utiliser le mot await si la function n'est pas async
           const apiErros = {}; // Il faut partir sur un objet vide car sinon on aura toujour des erreurs
           if(user.password !== user.passwordConfirm) {
               apiErros.passwordConfirm = 
               "Votre confirmation de mot de passe n'est pas conforme avec le mot de passe original";
               setErros(apiErros);
               return;
           }
           
           try {
                await UsersAPI.regiter(user);
               setErros({})
               // TODO : Flash susscess
               history.replace('/login')
              } catch (error){
               console.log(error.response);

               const { violations } = error.response.data;

               if(violations) {
               violations.forEach(violation => {
                   apiErros[violation.propertyPath] =  violation.message;
                   });
                   setErros(apiErros);
                   // Api Errors represente les contraintes que j'ai mis sur le bak
                   // TODO : Flash erreur
               }

           }
           console.log(user);
       };

    return (
       <div className="container"> 
       <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
          <Field 
          name="firstName" 
          label="Prénom" 
          placelholder="Votre prénom" 
          error={errors.firstName} 
          value={user.firstName} 
          onChange={handleChange}
          />
           <Field 
          name="lastName" 
          label="Nom de famille" 
          placelholder="Votre nom de famille" 
          error={errors.lastName} 
          value={user.lastName} 
          onChange={handleChange}
          />
           <Field 
          name="email" 
          label=" Adresse email" 
          placelholder="Votre adresse email" 
          type="email"
          error={errors.email} 
          value={user.email} 
          onChange={handleChange}
          />
           <Field 
          name="password" 
          label="Mot de passe" 
          type="password"
          placelholder="Votre mot de passe" 
          error={errors.password} 
          value={user.password} 
          onChange={handleChange}
          />
           <Field 
          name="passwordConfirm" 
          label="Confirmation de  mot de passe" 
          type="password"
          placelholder="Confirmez votre mot de passe" 
          error={errors.passwordConfirm} 
          value={user.passwordConfirm} 
          onChange={handleChange}
          />
        <div className="form-group">
            <button type="submit" className="btn btn-success">
                Confirmation
                </button>
                 <Link to="/login" className="btn btn-link">
                   j'ai déjà un compte
                 </Link>
             </div>
             </form>
          </div> 
          );
        };



export default RegisterPage;
