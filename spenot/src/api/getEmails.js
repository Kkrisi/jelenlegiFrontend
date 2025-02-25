import { myAxios } from "./axios";



const csrf = () => myAxios.get("/sanctum/csrf-cookie");


export const getEmails = async (fileDetails) => {
  await csrf();


  try {
    const response = await myAxios.post("/api/get-emails", { fileDetails });
    
    const dataList = response.data.data; // az API válasza egy tömbben érkezik, és ez objektumokat tartalmaz
    
    /* A kiiratáshoz, írjam át hogy csak a lényeget odbja ki*/
    const dataMap = dataList.reduce((map, item) => {       // a tomboket egy objektummá alakitjuk, a d_azon lesz kulcs, a belso objektum nem változik
        map[item.d_azon] = { nev: item.nev, email: item.email };
        return map;
    }, {});


    fileDetails.forEach(({ kod, fileName }) => {
        if (dataMap[kod]) {
            console.log(`Kód: ${kod} (Fájl: ${fileName}) -> Név: ${dataMap[kod].nev}, E-mail: ${dataMap[kod].email}`);
        } else {
            console.log(`Kód: ${kod} (Fájl: ${fileName}) -> Nincs találat az adatbázisban.`);
        }
      });
    } catch (error) {
        console.error("Hiba történt az adatok lekérésekor:", error);
    }
};