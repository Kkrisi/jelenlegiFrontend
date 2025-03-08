import { myAxios } from "./axios";




const csrf = () => myAxios.get("/sanctum/csrf-cookie");

export const getEmails = async (fileDetails) => {

    await csrf();
  
    try {
      const response = await myAxios.post("/api/get-emails", { fileDetails });
      
      const dataList = response.data.data;
  
      const dataMap = {};
      dataList.forEach(item => {
        dataMap[item.d_azon] = { nev: item.nev, email: item.email };
      });
  
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
  
  
