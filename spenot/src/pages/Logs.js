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

  const handleClick = (endpoint) => {
    setLoading(true);
    myAxios.get(endpoint)
      .then(response => {
        setLetters(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Hiba az adatlekérés során:', error);
        setLoading(false);
      });
  };

  return (
    <div className="logspage">
      <main>
        <article>
          <h1>Kiküldött levelek</h1>
          <div className='szures'>
            <div className="szuresek">
              <button  id="legutoljarapenzugy" onClick={() => handleClick("/api/ki-mikor-kapott-legutoljara-penzugyi-dokumentumot")}>
                Legutoljára pénzügyi dokumentum
              </button>
            </div>
            {/* Add more buttons as needed */}
          </div>
          <div className="table-container">
            {loading ? (
                <div className="center">
                <span className="loader">Még tölt...</span> {/* átrakva classname-re*/}
              </div>
            ) : (
              <Table striped bordered hover responsive variant="dark">
                <thead>
                  <tr>
                    <th>Név</th>
                    <th>Küldött Azon</th>
                    <th>Dolgozó Azon</th>
                    <th>PDF fájl neve</th>
                    <th>Küldés dátuma</th>
                  </tr>
                </thead>
                <tbody>
          {letters.map((letter) => (
            <tr key={letter.kikuldott_azon}>
              <td>{letter.nev}</td>
              <td>{letter.kikuldott_azon}</td>
              <td>{letter.dolgozo_azon}</td>
              <td>{letter.pdf_fajl_neve}</td>
              <td>{letter.kuldes_datuma}</td>
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
