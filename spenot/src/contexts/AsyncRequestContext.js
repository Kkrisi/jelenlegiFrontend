// Kódújraszervezése
// Levégére, annyit, hogy async hívásokat  külön contextbe kezelje,hogy paraméteresen lehessen megadni, pl. useContext... (/api/levelek)
// és csak azokat a Contextet használjuk aszinkron hívásra , hogy ne kelljen mindig újból megírni a GET/PUT/POST/DELETE parancsokat használni

// const AsyncRequestContext = createContext();


// export const AuthProvider = ({ children }) => {


//     useEffect(() => {
//         myAxios.get("/api/dolgozok")
//           .then(response => {
//             setUsers(response.data);
//             setLoading(false);
//           })
//           .catch(error => {
//             console.error('Hiba az adatok betöltésekor:', error);
//             setLoading(false);
//           });
//       }, []);


//  }
//  export default function useAuthContext() {
//     return useContext(AsyncRequestContext);
//   }
