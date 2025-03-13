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
      let sikertelenAdatok = [];
      let sikeresAdatok = [];
  
      fileDetails.forEach(({ kod, fileName }) => {
        if (dataMap[kod]) {
          sikeresCount++;
          sikeresAdatok.push({ fileName, kod, email: dataMap[kod].email });
        } else {
          sikertelenCount++;
          sikertelenAdatok.push({ fileName, kod });
          
          console.log(`Kód: ${kod} (Fájl: ${fileName}) -> Nincs találat az adatbázisban.`);
        }
      });
  
      return { sikeresCount, sikertelenCount, sikertelenAdatok, sikeresAdatok };
  
    } catch (error) {
      console.error("Hiba történt az adatok lekérésekor:", error);
    }
  };
  
  
