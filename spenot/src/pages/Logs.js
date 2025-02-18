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
              <button  id="nemkaptaebbenahonapban" onClick={() => handleClick("/api/nem-kaptak-ebben-a-honapban-pdf")}>
                Nem kaptak ebben a hónapban
              </button>
            </div>
            <div className="szuresek">
              <button  id="legutoljarapenzugy" onClick={() => handleClick("/api/ki-mikor-kapott-legutoljara-penzugyi-dokumentumot")}>
                Legutoljára pénzügyi dokumentum
              </button>
            </div>
            <div className="szuresek">
              <button  id="kimaradtkikuldesek" onClick={() => handleClick("/api/aki-kimaradt-kikuldesbol")}>
                Kimaradt a kiküldésből
              </button>
            </div>
            {/* Add more buttons as needed */}
          </div>
          <div className="table-container">
            {loading ? (
                <div className="center">
                <span class="loader">Még tölt...</span>
              </div>
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
