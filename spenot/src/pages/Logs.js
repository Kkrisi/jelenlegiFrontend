import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import '../App.css';
import { useAsyncRequest } from '../contexts/AsyncRequestContext';  // Importáljuk az AsyncRequestContext-ből származó hook-ot

export default function Logs() {
  const { get } = useAsyncRequest();  // Kihívjuk a get metódust a context-ből
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Separate states for name and pdf search terms
  const [searchTermName, setSearchTermName] = useState("");
  const [searchTermPdf, setSearchTermPdf] = useState("");

  useEffect(() => {
    // Az API hívás az AsyncRequestContext-ből jön
    get("/api/levelek")
      .then(responseData => {
        setLetters(responseData);  // Az adatokat a válaszból kapjuk
        setLoading(false);
      })
      .catch(error => {
        console.error('Hiba az adatok betöltésekor:', error);
        setLoading(false);
      });
  }, [get]);  // A get metódust a hook-ból biztosítjuk, így azt is figyelembe vesszük a dependency listában.

  const handleClick = (endpoint) => {
    setLoading(true);
    get(endpoint)  // Használjuk a contextből kapott get metódust
      .then(responseData => {
        setLetters(responseData);  // Az adatokat a válaszból kapjuk
        setLoading(false);
      })
      .catch(error => {
        console.error('Hiba az adatlekérés során:', error);
        setLoading(false);
      });
  };

  // Filter the letters based on both name and pdf file name
  const filteredLetters = letters.filter(letter => 
    letter.nev.toLowerCase().includes(searchTermName.toLowerCase()) && 
    letter.pdf_fajl_neve.toLowerCase().includes(searchTermPdf.toLowerCase())
  );

  return (
    <div className="logspage">
      <main>
        <article>
          <h1>Kiküldött levelek</h1>
          <div className='szures'>
            {/* Name filter input */}
            <div className='nevSzures'>
              <input className='nszInput'
                type="text"
                placeholder="Név.."
                value={searchTermName}
                onChange={(e) => setSearchTermName(e.target.value)}
              />
            </div>

            {/* PDF file name filter input */}
            <div className='nevSzures'>
              <input className='nszInput'
                type="text"
                placeholder="Pdf.."
                value={searchTermPdf}
                onChange={(e) => setSearchTermPdf(e.target.value)}
              />
            </div>

            <div className="szuresek">
              <button
                id="legutoljarapenzugy"
                onClick={() => handleClick("/api/ki-mikor-kapott-legutoljara-penzugyi-dokumentumot")}
              >
                Legutoljára kiküldött emailek
              </button>
            </div>
          </div>
          <div className="table-container">
            {loading ? (
              <div className="center">
                <span className="loader">Még tölt...</span>
              </div>
            ) : (
              <Table striped bordered hover responsive variant="dark" id='tableLogs'>
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
                  {filteredLetters.map((letter) => (
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
