
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

  const [searchQuery, setSearchQuery] = useState(""); 








  {/*--------------------------------------------- Adatlekérés kezdete ------------------------------------------------*/}
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
  {/*--------------------------------------------- Adatlekérés vége ------------------------------------------------*/}













  //--------------------------------------------- Szerkesztés logika kezdete ------------------------------------------------
  const handleEdit = (user, field) => {
    // szerkesztésnél, user egy objektum, field az objektum egyik tulajdonság neve pl tajszám
    setEditingUser({ ...user });
    setEditingField(field);
  };
  //--------------------------------------------- Szerkesztés logika vége ------------------------------------------------





  

  //--------------------------------------------- Adatváltozás kezdete ------------------------------------------------
  const handleChange = (e) => {
    setEditingUser((prevUser) => ({
      ...prevUser,
      [editingField]: e.target.value, // az adott kijelolt mezot frissitjuk
    }));
  };
  //--------------------------------------------- Adatváltozás vége ------------------------------------------------








  //--------------------------------------------- Gombnyomások kezdete ------------------------------------------------
  const handleKeyDown = (e) => {
    // ! Enter lenyomásakor mentés, escape megnyomásakor kilépés változatlanul hagyva
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditingUser(null);  // ha Escape-t nyomunk, állítsuk vissza az eredeti adatot
      setEditingField("");  // töröljük a szerkesztett mezőt
    }
  };
  //--------------------------------------------- Gombnyomások vége ------------------------------------------------








  //--------------------------------------------- Szerkesztés mentése kezdete ------------------------------------------------
  const handleSave = () => {
    setShowModal(true);

    myAxios.put(`/api/dolgozok/${editingUser.d_azon}`, editingUser)
      .then(() => {
        // meglévő users tömbben kicseréljük az egyik felhasználót (editingUser), miközben a többi elemet változatlanul hagyjuk
        // ha az aktuális user d_azon értéke megegyezik az editingUser.d_azon értékével, akkor az új verzióját (editingUser) helyettesíti be
        setUsers(users.map(user => user.d_azon === editingUser.d_azon ? editingUser : user));

        setEditingUser(null);
        setEditingField("");
        setShowModal(false);
      })
      .catch(error => {
        console.error('Hiba a mentésnél:', error);
        setShowModal(false);
      });
  };
  //--------------------------------------------- Szerkesztés mentése vége ------------------------------------------------








  //--------------------------------------------- Kereső mező kezdete ------------------------------------------------
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); 
  };



  const filteredUsers = users.filter(user => {
    for (let key in user) {
      // a key az adott mező, pl név, születésihely, tajszám, suli
      let value = user[key];
      
      if (value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())) {
        // ha tartalmazza a személy adata a keresett szót akkor hozzá adja a szűrt listához, ha nem akkor false
        return true;
      }
    }
    return false;
  });
  //--------------------------------------------- Kereső mező vége ------------------------------------------------










  //--------------------------------------------- Dolgozó törlése kezdete ------------------------------------------------
  const handleDelete = (d_azon) => {
    if (window.confirm("Biztosan törölni szeretnéd ezt a diákot?")) {
      myAxios.delete(`/api/dolgozok/${d_azon}`)
        .then(() => {
          // a tablazatot frissitjuk
          setUsers(users.filter(user => user.d_azon !== d_azon));  
        })
        .catch(error => {
          console.error("Hiba a törlés közben:", error);
        });
    }
  };
  //--------------------------------------------- Dolgozó törlése vége ------------------------------------------------
  
  




  

  return (
    <div className="studentsmanagement">
      <main>
        <article>
        <h1>Diákok kezelés</h1>

          <div className="search-container">
            <Form.Control
              type="text"
              placeholder="Keresés..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="table-container">

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
                      {/*vegigmegyunk a szurt embereken és minden diak d_azonjanak egy uj tr-t (sor) hozunk létre*/}
                      {filteredUsers.map((user) => (
                        <tr key={user.d_azon}>

                          {/*vegigmegyunk a diak adatain és mindegyik kap kulon td-t (cella)*/}
                          {[
                            'd_azon', 'nev', 'email', 'szul_nev', 'születesi_hely', 'születesi_ido',
                            'anyaja_neve', 'taj_szam', 'ado_szam', 'gondviselo_nev', 'telefonszam',
                            'csoport_azon', 'isk_osztály', 'akk_csoport',
                            'iskola_azon', 'gyakhely_azon', 'megjegyzes'
                          ].map((field) => (
                            <td key={field} onDoubleClick={() => handleEdit(user, field)}>

                              {/*ha kattintottunk a mezőre, akkor szerkesztésbe vagyunk és egy input mező jelenik meg az aktuális beírt adattal
                              ha nem vagyunk szerkesztésbe, akkor csak a sima adatot mutatja*/}
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

                          <td>
                            <Button variant="danger" onClick={() => handleDelete(user.d_azon)}>🗑️ Törlés</Button>
                          </td>

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