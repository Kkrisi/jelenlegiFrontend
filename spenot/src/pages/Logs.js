import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import '../App.css';
import { useLogs } from '../contexts/LogsContext';  // Importáljuk az AsyncRequestContext-ből származó hook-ot

export default function Logs() {
  const { letters, loading, LegutoljaraKuldott } = useLogs();  // Kihívjuk a get metódust a context-ből


  const [searchTermName, setSearchTermName] = useState("");
  const [searchTermPdf, setSearchTermPdf] = useState("");
  
 
  
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
            <div className='nevSzures'>
              <input className='nszInput'
                type="text"
                placeholder="Név.."
                value={searchTermName}
                onChange={(e) => setSearchTermName(e.target.value)}
              />
            </div>


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
                onClick={() => LegutoljaraKuldott()}
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
