import { myAxios } from "./axios";




const csrf = () => myAxios.get("/sanctum/csrf-cookie");

export const getEmails = async (fileDetails) => {
    // CSRF token lekérése (ez szükséges az API hívásokhoz)
    await csrf();
  
    try {
      // API hívás, amely visszaadja a fájlokhoz tartozó adatokat (pl. név, email)
      const response = await myAxios.post("/api/get-emails", { fileDetails });
      
      // Az API válasza egy tömb, ami az egyes adatokat tartalmazza
      const dataList = response.data.data;
  
      // Ezt a tömböt egy objektummá alakítjuk, ahol a kulcsok a kódok
      const dataMap = {};
      dataList.forEach(item => {
        dataMap[item.d_azon] = { nev: item.nev, email: item.email };
      });
  
      // Számlálók a sikeres és sikertelen találatokhoz
      let sikeresCount = 0;
      let sikertelenCount = 0;
      let sikertelenAdatok = []; // A sikertelen adatok tárolása
      let sikeresAdatok = []; // A sikeres adatok tárolása
  
      // A fájlokat végigiteráljuk és ellenőrizzük, hogy van-e hozzá email cím
      fileDetails.forEach(({ kod, fileName }) => {
        if (dataMap[kod]) {
          // Ha van email cím, sikeres
          sikeresCount++;
          sikeresAdatok.push({ fileName, kod });
        } else {
          // Ha nincs email cím, sikertelen
          sikertelenCount++;
          sikertelenAdatok.push({ fileName, kod });
          
          // Logoljuk a hibás adatokat
          console.log(`Kód: ${kod} (Fájl: ${fileName}) -> Nincs találat az adatbázisban.`);
        }
      });
  
      // Visszaadjuk a sikeres és sikertelen találatok számát, valamint a sikertelen adatokat
      return { sikeresCount, sikertelenCount, sikertelenAdatok, sikeresAdatok };
  
    } catch (error) {
      console.error("Hiba történt az adatok lekérésekor:", error);
    }
  };
  
  
