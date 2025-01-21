import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../contexts/AuthContext";
import { myAxios } from '../api/axios';
import { AuthContext } from "../contexts/AuthContext";



export default function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setPasswordConfirmation] = useState("");
    const [errors, setErrors] = useState("");

    const csrf = () => myAxios.get("/sanctum/csrf-cookie");


    const handleSubmit = async (e) => {
        //bejelentkezés kezelése
        e.preventDefault();       
        const adat = {
            email: email,
            password: password,
        };       
        try {
            await myAxios.post("/login", adat );
        } catch (error) {
            console.log(error);
        }
    };


  return (
    <div className="loginpage d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="login-container p-4 rounded shadow">
                <h2 className="text-center">Regisztráció</h2>


                <form onSubmit={handleSubmit}>
                    
                    <div className="input-group mb-3">
                        <input type="name" className="form-control" id="name" value={name} placeholder="Teljes név" name="name" required 
                        onChange={(e) => 
                            setName(e.target.value)}
                        />
                    </div>

                    <div className="input-group mb-3">
                        <input type="email" className="form-control" id="email" value={email} placeholder="Email cím" name="email" required 
                        onChange={(e) => 
                            setEmail(e.target.value)}
                        />
                    </div>
                        {/*ez a error nézés sztem nem kell a regiszter ide*/}
                        <div>
                            {errors.email && (
                                <span className="text-danger">{errors.email[0]}</span>
                            )}
                        </div>


                    <div className="input-group mb-3">
                        <input type="password" value={password} id="password" className="form-control" placeholder="Jelszó" name="password" required 
                        onChange={(e) => 
                            setPassword(e.target.value)}
                        />
                    </div>
                        <div>
                            {errors.email && (
                                <span className="text-danger">{errors.email[0]}</span>
                            )}
                        </div>

                    <div className="input-group mb-3">
                        <input type="password" value={confirmPassword} id="confirmPassword" className="form-control" placeholder="Jelszó újra" name="confirmPassword" required 
                        onChange={(e) => 
                            setPasswordConfirmation(e.target.value)}
                        />
                    </div>
                        <div>
                            {errors.email && (
                                <span className="text-danger">{errors.email[0]}</span>
                            )}
                        </div>


                    <div className="actions text-center">
                        <br />
                        <button type="submit" className="btn btn-primary w-100">Regisztrálok</button>
                    </div>

                </form>

            </div>

            <div className="right-corner">
                Szalézi Ágazati <br /> Képzőközpont
            </div>
        </div>
  )
}
