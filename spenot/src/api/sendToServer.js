import axios from 'axios';


export const sendToServer = async (chunk) => {
  try {

    await axios.get("http://localhost:8000/sanctum/csrf-cookie", { withCredentials: true });  // CSRF token lekérése

    const csrfToken = document.cookie
      .split("; ")
      .find(row => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    const response = await axios.post(
      "http://localhost:8000/save-json-to-database",
      { json: chunk },
        {
            headers: {
            "X-XSRF-TOKEN": csrfToken // A CSRF token
            },
            withCredentials: true // Engedélyezi a cookie-k küldését
        }
    )

    console.log("Sikeresen mentve:", response.data);
    return response.data;
  } catch (error) {
    console.error("Hiba az adatküldés során:", error);
    throw error;
  }
};
