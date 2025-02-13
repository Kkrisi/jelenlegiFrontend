import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import '../App.css';
import { myAxios } from '../api/axios';




export default function Logs() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");






  useEffect(() => {
    myAxios.get("/api/levelek")
      .then(response => {
        setLetters(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Hiba az adatok betöltésekor:', error);
        setLoading(false);
      });
  }, []);










  return (
    <div className="logspage">
      <main>
        <article>
          <h1>Kiküldött levelek</h1>
          <div className="table-container">

            {loading ? (
              <h2>Még tölt...</h2>
            ) : (



              <Table striped bordered hover responsive variant="dark">
              <thead>
                <tr>
                  <th>Küldött Azon</th>
                  <th>Dolgozó Azon</th>
                  <th>PDF fájl neve</th>
                  <th>Küldés dátuma</th>
                </tr>
              </thead>

              <tbody>
                {letters.map((letter) => (
                  <tr key={letter.kikuldott_azon}>

                    {Object.keys(letter).map((field) => (
                      <td key={field}>{letter[field]}</td>
                    ))}

                  </tr>
                ))}
              </tbody>
            </Table>



          )}

        </div>
        </article>
      </main>
    </div>
  );
}
