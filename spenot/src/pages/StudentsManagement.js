
import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import '../App.css';
import { myAxios } from '../api/axios';





export default function StudentsManagement() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingField, setEditingField] = useState(""); 
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);








  // adatbazisbol dolgozok lekérése axios-al, majd a useState-ban elraktározzuk,
  //  a [] azt jelenti hogy csak egyszer fut le, amikor az oldal betöltödik
  useEffect(() => {
    myAxios.get("/api/dolgozok")
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Hiba az adatok betöltésekor:', error);
        setLoading(false);
      });
  }, []);












  // szerkesztésnél, user egy objektum, field az objektum egyik tulajdonság neve pl tajszám
  const handleEdit = (user, field) => {
    setEditingUser({ ...user });
    setEditingField(field);
  };




  // az input mező változása
  const handleChange = (e) => {
    setEditingUser((prevUser) => ({
      ...prevUser,
      [editingField]: e.target.value, // A megfelelő mezőt frissítjük
    }));
  };





  // Enter lenyomásakor mentés, escape megnyomásakor kilépés változatlanul hagyva
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditingUser(null);  // ha Escape-t nyomunk, állítsuk vissza az eredeti adatot
      setEditingField("");  // töröljük a szerkesztett mezőt
    }
  };





  const handleSave = () => {
    setIsSaving(true);
    setShowModal(true);

    myAxios.put(`/api/dolgozok/${editingUser.d_azon}`, editingUser)
      .then(() => {
        // meglévő users tömbben kicseréljük az egyik felhasználót (editingUser), miközben a többi elemet változatlanul hagyjuk
        // ha az aktuális user d_azon értéke megegyezik az editingUser.d_azon értékével, akkor az új verzióját (editingUser) helyettesíti be
        setUsers(users.map(user => user.d_azon === editingUser.d_azon ? editingUser : user));

        setEditingUser(null);
        setEditingField("");
          setIsSaving(false);
          setShowModal(false); 
      })
      .catch(error => {
        console.error('Hiba a mentésnél:', error);
          setIsSaving(false);
          setShowModal(false);
      });
  };






  return (
    <div className="studentsmanagement">
      <main>
        <article>
          <h1>Diák kezelés</h1>
          <div className="table-container">

            {/* Ha még töltjük az adatokat, akkor jelenítse meg a "Még tölt" üzenetet */}
            {loading ? (
              <h2>Még tölt...</h2>
            ) : (



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

              {/*Dinamikus táblázat generálása*/}
              <tbody>
                {users.map((user) => (  // a users tömbön végigmegy a map() függvény, és minden user objektumhoz létrehoz egy <tr> (sor) elemet
                  <tr key={user.d_azon}>

                    {/*Az aktuális user objektum összes kulcsán (nev, tajszam, stb.) végigmegy, és minden kulcsból egy <td> (cellát) hoz létre.
                      A cella dupla kattintásra (onDoubleClick) meghívja a handleEdit(user, field) függvényt.*/}
                    {Object.keys(user).map((field) => (   // a field egy string ami lehet a "nev", "tajszam", stb
                      <td key={field} onDoubleClick={() => handleEdit(user, field)}>

                        {/*Ez a rész azt ellenőrzi, hogy a cella szerkesztési módban van-e:
                        Ha igen:
                        Egy <input> mezőt jelenít meg a cellában.
                        A beírt érték (value) az editingUser[editingField] (a szerkesztett adat).
                        onChange={handleChange} → frissíti az értéket a gépelés során.*/}
                        {editingUser?.d_azon === user.d_azon && editingField === field ? (
                          <input
                          type="text"
                          value={editingUser[editingField] || ""}  // Használj condition-t a value frissítésére
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          autoFocus
                        />                        
                        ) : (
                          // ha nem szerkesztünk akkor egyszerűen a user[field] értéket (pl. a név vagy TAJ-szám) jeleníti meg
                          user[field]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>


            </Table>



          )}

        </div>
      </article>
    </main>


    <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Mentés folyamatban... 🚀</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Az adatok mentése folyamatban van. Kérlek, várj egy pillanatot.</p>
        </Modal.Body>
    </Modal>


  </div>
  );
}