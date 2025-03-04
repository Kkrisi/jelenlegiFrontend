
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

  const [searchQuery, setSearchQuery] = useState(""); 








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



  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); 
  };

  /*A kódban a filteredUsers a users tömböt szűri le annak alapján, 
  hogy van-e olyan adat a felhasználók között, amely tartalmazza a keresett szót (searchQuery*/
  const filteredUsers = users.filter(user => {
    return Object.values(user).some(value => 
      value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });


  

  return (
    <div className="studentsmanagement">
      <main>
        <article>
        <h1>Diákok kezelés</h1>

          {/* Keresőmező */}
          <div className="search-container">
            <Form.Control
              type="text"
              placeholder="Keresés..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="table-container">
            {/* Ha még töltjük az adatokat, akkor jelenítse meg a "Még tölt" üzenetet */}
            {loading ? (
              <div className="center">
                <span className="loader">Még tölt...</span>
              </div>
            ) : (
              <>
                {filteredUsers.length > 0 ? (
                  <Table striped bordered hover responsive variant="dark">
                    <thead className="sticky-top">
                      <tr>
                        <th>d_azon</th>
                        <th>Név</th>
                        <th>Email</th>
                        <th>Születési név</th>
                        <th>Születési hely</th>
                        <th>Születési idő</th>
                        <th>Anyja neve</th>
                        <th>TAJ szám</th>
                        <th>Adó szám</th>
                        <th>Gondviselő neve</th>
                        <th>Telefonszám</th>
                        <th>Csoport_azon</th>
                        <th>Osztály</th>
                        <th>ÁKK csoport</th>
                        <th>Iskola azonosító</th>
                        <th>Gyakhely azonosító</th>
                        <th>Megjegyzés</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.d_azon}>
                          {[
                            'd_azon', 'nev', 'email', 'szul_nev', 'születesi_hely', 'születesi_ido',
                            'anyaja_neve', 'taj_szam', 'ado_szam', 'gondviselo_nev', 'telefonszam',
                            'csoport_azon', 'isk_osztály', 'akk_csoport',
                            'iskola_azon', 'gyakhely_azon', 'megjegyzes'
                          ].map((field) => (
                            <td key={field} onDoubleClick={() => handleEdit(user, field)}>
                              {editingUser?.d_azon === user.d_azon && editingField === field ? (
                                <input
                                  type="text"
                                  value={editingUser[editingField] || ""}
                                  onChange={handleChange}
                                  onKeyDown={handleKeyDown}
                                  autoFocus
                                />
                              ) : (
                                user[field]
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>Nincs találat</p> 
                )}
              </>
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