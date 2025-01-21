import React from 'react'



export default function ForgotPassword() {


  return (
    <div className="loginpage d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="login-container p-4 rounded shadow">
                <h2 className="text-center">Elfelejtett jelszó esetén</h2>
                <p id="forgotText">Kiküldünk egy emailt önnek amiben kap egy új átmeneti jelszót</p>
                <br />
                <form id="forgotpasswordForm">
                    <div className="input-group mb-3">
                        <input type="email" id="email" className="form-control" placeholder="Email cím" required />
                    </div>
                    <div className="actions text-center">
                        <button type="submit" className="btn btn-primary w-100">Küldés</button>
                    </div>
                </form>
                <div className="links text-center mt-3">
                    <p>Nem érkezett meg?</p>
                    <a href="#" className="d-block">Email újraküldése</a>
                </div>
            </div>

            <div className="right-corner">
                Szalézi Ágazati <br /> Képzőközpont
            </div>
        </div>
  )
}
