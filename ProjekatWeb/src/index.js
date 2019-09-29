import { Grocerie } from "./grocerie";
import { NamirnicaService } from "./namirnicaService";

const ns = new NamirnicaService();

ns.dodajNamirnicu(new Grocerie("Boranija", 2.1, 2.4, 18, 0.1));
ns.dodajNamirnicu(new Grocerie("Karfiol", 1.77, 4.03, 23, 0.48));
ns.dodajNamirnicu(new Grocerie("Pecurke", 2.2, 5.32, 28, 0.45));
ns.dodajNamirnicu(new Grocerie("Krompir", 2.51, 21.14, 90, 0.17));
ns.dodajNamirnicu(new Grocerie("Govedina", 18.8, 0, 214, 15.4));
ns.dodajNamirnicu(new Grocerie("Jagnjetina", 19, 0, 211, 15));
ns.dodajNamirnicu(new Grocerie("Piletina", 17.6, 0, 230, 17.7));
ns.dodajNamirnicu(new Grocerie("Slanina", 14, 0, 506, 50));
ns.dodajNamirnicu(new Grocerie("Teletina", 19.1, 0, 160, 9.3));
ns.dodajNamirnicu(new Grocerie("Breskva", 0.91, 9.54, 39, 0.25));
ns.dodajNamirnicu(new Grocerie("Kesten", 2, 36, 170, 0));

//console.log(ns.vratiPoslednjeDodatuNamirnicu());
console.log(ns.vratiSveNamirnice());

var getRandomNumber = () => parseInt(Math.random() * 10);
// function getRandomNumber() {
//     return parseInt(Math.random() * 10);
// }

function uporedi(namirnica1, namirnica2) {
    return namirnica1.proteins > namirnica2.proteins ? namirnica1 : namirnica2;
}

function getByIndexAsync(index) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(ns.getByIndex(index)), getRandomNumber() * 1000);
    });
}

//Svi promisi se izvrasavaju paralelno
getByIndexAsync(getRandomNumber())
    .then(console.log(`Paralelni promisi poceli sa radom!`))
    .then(namirnica1 => {
        console.log(`Prva grocerie je `, namirnica1);
        getByIndexAsync(getRandomNumber()).then(namirnica2 => {
            console.log(`Druga grocerie je `, namirnica2);
            console.log(`Grocerie sa vise proteina je: `, uporedi(namirnica1, namirnica2));
        });
    });

//Ceka da se svi promisi zavrse
Promise.all([getByIndexAsync(getRandomNumber()), getByIndexAsync(getRandomNumber())])
    .then(console.log(`Obradjujem...`))
    .then(groceries => {
        console.log("1. ", groceries[0]);
        console.log("2. ", groceries[1]);
        console.log("Grocerie sa vise proteina je: ", uporedi(groceries[0], groceries[1]));
    });