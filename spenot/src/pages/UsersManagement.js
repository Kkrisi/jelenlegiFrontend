import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, DropdownButton, Dropdown, Form } from 'react-bootstrap';
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

  const handleRadioButtonChange = (userId, selectedRole) => {
    const updatedUser = users.map((user) =>
      user.id === userId ? { ...user, Jogosultság: selectedRole, jogosultsag_azon: selectedRole } : user
    );

    setUsers(updatedUser);
    setEditingUser(updatedUser.find((user) => user.id === userId));
    setEditingField("Jogosultság");

    const updatedUserData = {
      ...updatedUser.find((user) => user.id === userId),
      jogosultsag_azon: selectedRole,
    };

    console.log('Changes made:', updatedUserData);

    setIsSaving(true);
    setShowModal(true);

    myAxios.put(`/api/felhasznalok/${userId}`, updatedUserData)
      .then(() => {
        setUsers(users.map(user => user.id === userId ? updatedUserData : user));
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

  const handleChange = (e) => {
    setEditingUser((prevUser) => ({
      ...prevUser,
      [editingField]: e.target.value,
    }));
  };

  const handleDelete = async (userId) => {
    myAxios.delete(`/api/felhasznalok/${userId}`);
    console.log(`${userId} kitörölve`)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditingUser(null);
      setEditingField("");
    }
  };

  const handleSave = () => {
    const updatedUser = {
      ...editingUser,
      jogosultsag_azon: editingUser.jogosultsag_azon
    };

    console.log('Changes made:', updatedUser);

    setIsSaving(true);
    setShowModal(true);

    myAxios.put(`/api/felhasznalok/${editingUser.id}`, updatedUser)
      .then(() => {
        setUsers(users.map(user => user.id === editingUser.id ? updatedUser : user));
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
                      <div className="center">
                      <span class="loader">Betöltés</span> 
                    </div>
            ) : (
              <Table striped bordered hover responsive variant="dark">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Név</th>
                    <th>Email</th>
                    <th>Jelszó</th>
                    <th>Jogosultság megváltoztatása</th>
                    <th>Törlés</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      {Object.keys(user).map((field) => (
                        field !== "jogosultsag_azon" && (
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
                        )
                      ))}
                      <td>
                        <Form.Check
                          type="radio"
                          label="Admin"
                          name={`user-${user.id}-role`}
                          checked={user.jogosultsag_azon === 2}
                          onChange={() => handleRadioButtonChange(user.id, 2)}
                        />
                        <Form.Check
                          type="radio"
                          label="Felhasználó"
                          name={`user-${user.id}-role`}
                          checked={user.jogosultsag_azon === 1}
                          onChange={() => handleRadioButtonChange(user.id, 1)}
                        />
                        <Form.Check
                          type="radio"
                          label="Nem engedélyezett"
                          name={`user-${user.id}-role`}
                          checked={user.jogosultsag_azon === 4}
                          onChange={() => handleRadioButtonChange(user.id, 4)}
                        />
                      </td>

                      <td>
                      {(user.id === 1 || user.jogosultsag_azon === 2) && (<p>Admin nem törölhető!</p>)}

                        {(user.id > 1 && user.jogosultsag_azon !=2) && ( //többi admin törlését megakadályozza
                          <Button variant="danger" onClick={() => handleDelete(user.id)}>
                            Felhasználó törlése
                          </Button>
                        )}
                      </td>


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
