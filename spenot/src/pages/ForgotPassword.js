import React, { useState, useEffect, useContext } from 'react';
import { myAxios } from '../api/axios';
import useButtonContext from '../contexts/ButtonContext';
import { useForgotPassword } from '../contexts/ForgotPasswordContext';



export default function ForgotPassword() {
    const{handleSubmit,email,setEmail,message} = useForgotPassword();

    return (
        <div className="loginpage d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="login-container p-4 rounded shadow">
                <h2 className="text-center">Elfelejtett jelszó esetén</h2>
                <p id="forgotText">Kiküldünk önnek egy emailt, ami segít helyreállítani.</p>
                <br />
                <form id="forgotpasswordForm" onSubmit={handleSubmit}>
                    <div className="input-group mb-3">
                        <input 
                            type="email" 
                            id="email" 
                            className="form-control" 
                            placeholder="Email cím"  
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="actions text-center">
                        <button type="submit" className="btn btn-primary w-100">Küldés</button>
                    </div>
                </form>
                {message && <p className="text-center mt-3 elfelejtettValasz">{message}</p>}    
                <div className="links text-center mt-3">
                    <p>Nem érkezett meg?</p>
                    <p className='varakozoSzoveg'>Várj 5 percet és próbálkozz újra.</p>
                    {/*<a href="#" className="d-block">Email újraküldése</a>*/}
                </div>
            </div>

            <div className="right-corner">
                <img src="favicon2.ico" alt="School Icon"/>
            </div>
        </div>
    );
}
