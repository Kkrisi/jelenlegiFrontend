import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import '../App.css';
import { myAxios } from '../api/axios';





export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingField, setEditingField] = useState(""); 
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);







  useEffect(() => {
    myAxios.get("/api/felhasznalok")
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Hiba az adatok betöltésekor:', error);
        setLoading(false);
      });
  }, []);













  const handleEdit = (user, field) => {
    setEditingUser({ ...user });
    setEditingField(field);
  };





  const handleChange = (e) => {
    setEditingUser((prevUser) => ({
      ...prevUser,
      [editingField]: e.target.value,
    }));
  };






  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditingUser(null);
      setEditingField("");
    }
  };






  const handleSave = () => {
    setIsSaving(true); 
    setShowModal(true); 

    myAxios.put(`/api/felhasznalok/${editingUser.id}`, editingUser)
      .then(() => {
        setUsers(users.map(user => user.id === editingUser.id ? editingUser : user));
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
    <div className="usersmanagement">
      <main>
        <article>
          <h1>Felhasználó kezelés</h1>
          <div className="table-container">
          
            {loading ? (
              <h2>Az oldal még tölt...</h2>
            ) : (



              <Table striped bordered hover responsive variant="dark">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Név</th>
                  <th>Email</th>
                  <th>Jelszó</th>
                  <th>Jogosultság</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    {Object.keys(user).map((field) => (
                      <td key={field} onDoubleClick={() => handleEdit(user, field)}>
                        {editingUser?.id === user.id && editingField === field ? (
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