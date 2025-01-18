import React from "react";


export default function EmailSend() {
  const recipients = [
    { email: "olaj123@email.com", name: "Olajos Zsolt", role: "tanár" },
    { email: "pity2009@email.com", name: "Kovács István Gábor", role: "diák" },
    { email: "olaj123@email.com", name: "Olajos Zsolt", role: "tanár" },
    { email: "olaj123@email.com", name: "Olajos Zsolt", role: "tanár" },
  ];

  const logs = [
    { email: "MindenOK@gmail.com", status: "success", message: "Sikeresen elküldve" },
    { email: "NemJo-ska@gmail.com", status: "error", message: "Hiba: nem jó emailcím" },
    { email: "MarieCurie@gmail.com", status: "error", message: "Hiba: Error(53)" },
  ];

  return (
    <div className="emailoutsendpage">
      <div className="container">
        {/* Email Section */}
        <div className="email-section">
          <h2>Email kiküldés</h2>
          <button className="browse-btn tallozas">Tallózás</button>

          <div className="email-list">
            <h4>Címzett:</h4>
            {recipients.map((recipient, index) => (
              <div key={index} className="email-entry">
                <p>{recipient.email}</p>
                <p>Név: {recipient.name}</p>
                <p>Rang: {recipient.role}</p>
              </div>
            ))}
          </div>

          <button className="send-btn kuldes">Küldés</button>
        </div>

        {/* Error Log Section */}
        <div className="error-log">
          <h2>Hibajegyzék</h2>

          <div className="elkuldottek">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`log-entry ${log.status === "success" ? "success" : "error"}`}
              >
                <p>{log.email}</p>
                <p>{log.message}</p>
                <div
                  className={`status-icon ${
                    log.status === "success" ? "success-icon" : "error-icon"
                  }`}
                >
                  {log.status === "success" ? "✔" : "✖"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
