import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import '../App.css';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);



  // adatbazisbol dolgozok lekérése axios-al, majd a useState-ban elraktározzuk,
  //  a [] azt jelenti hogy csak egyszer fut le, amikor az oldal betöltödik
  useEffect(() => {
    axios.get('https://your-api-endpoint.com/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Hiba az adatok betöltésekor:', error));
  }, []);



  const handleEdit = (user) => setEditingUser(user);  // aide rakjuk a szerkesztés altt levő adatokat

  // a megváltoztatott adatokat elkuldi az adatbazisnak
  const handleSave = () => {
    axios.put(`https://your-api-endpoint.com/users/${editingUser.d_azon}`, editingUser)
      .then(() => {
        setUsers(users.map(user => (user.d_azon === editingUser.d_azon ? editingUser : user)));
        setEditingUser(null);
      })
      .catch(error => console.error('Hiba a mentésnél:', error));
  };

  return (
    <div className="usersmanagement">
      <main>
        <article>
          <h1>Felhasználó kezelés</h1>
          <div className="table-container">
            <Table striped bordered hover responsive variant="dark">
              <thead>
                <tr>
                  <th>d_azon</th>
                  <th>Név</th>
                  <th>Email</th>
                  <th>SzülNév</th>
                  <th>SzülHely</th>
                  <th>SzülIdő</th>
                  <th>AnyjaNeve</th>
                  <th>Tajszám</th>
                  <th>Adószám</th>
                  <th>GondviselőNeve</th>
                  <th>Telefonszám</th>
                  <th>IskolaAzon</th>
                  <th>GyakhelyAzon</th>
                  <th>Megjegyzés</th>
                </tr>
              </thead>
              <tbody>
                {/* a users tömbön végigmegyünk, minden felhasznalo kap egy tr-t*/}
                {users.map(user => (
                  <tr key={user.d_azon}>
                    <td>{user.d_azon}</td>
                    <td>
                      {editingUser?.d_azon === user.d_azon ? (
                        <Form.Control type="text" value={editingUser.nev} onChange={(e) => setEditingUser({ ...editingUser, nev: e.target.value })} />
                      ) : (
                        user.nev
                      )}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.telefonszam}</td>
                    <td>
                      {editingUser?.d_azon === user.d_azon ? (
                        <Button variant="success" size="sm" onClick={handleSave}>Mentés</Button>
                      ) : (
                        <Button variant="warning" size="sm" onClick={() => handleEdit(user)}>Szerkesztés</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </article>
      </main>
    </div>
  );
}