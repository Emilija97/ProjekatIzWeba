import { Namirnica } from "./namirnica";
import { NamirnicaService } from "./namirnicaService";

const ns = new NamirnicaService();

ns.dodajNamirnicu(new Namirnica("Boranija", 2.1, 2.4, 18, 0.1));
ns.dodajNamirnicu(new Namirnica("Karfiol", 1.77, 4.03, 23, 0.48));
ns.dodajNamirnicu(new Namirnica("Pecurke", 2.2, 5.32, 28, 0.45));
ns.dodajNamirnicu(new Namirnica("Krompir", 2.51, 21.14, 90, 0.17));
ns.dodajNamirnicu(new Namirnica("Govedina", 18.8, 0, 214, 15.4));
ns.dodajNamirnicu(new Namirnica("Jagnjetina", 19, 0, 211, 15));
ns.dodajNamirnicu(new Namirnica("Piletina", 17.6, 0, 230, 17.7));
ns.dodajNamirnicu(new Namirnica("Slanina", 14, 0, 506, 50));
ns.dodajNamirnicu(new Namirnica("Teletina", 19.1, 0, 160, 9.3));
ns.dodajNamirnicu(new Namirnica("Breskva", 0.91, 9.54, 39, 0.25));
ns.dodajNamirnicu(new Namirnica("Kesten", 2, 36, 170, 0));

//console.log(ns.vratiPoslednjeDodatuNamirnicu());
console.log(ns.vratiSveNamirnice());

function getRandomNumber() {
    return parseInt(Math.random() * 10);
}

function uporedi(namirnica1, namirnica2) {
    return namirnica1.proteini > namirnica2.proteini ? namirnica1 : namirnica2;
}

function getByIndexAsync(index) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(ns.getByIndex(index)),
            getRandomNumber() * 1000);
    });
}

//Svi promisi se izvrasavaju paralelno
getByIndexAsync(getRandomNumber())
    .then(console.log(`Paralelni promisi poceli sa radom!`))
    .then(namirnica1 => {
        console.log(`Prva namirnica je `, namirnica1);
        getByIndexAsync(getRandomNumber()).then(namirnica2 => {
            console.log(`Druga namirnica je `, namirnica2);
            console.log(`Namirnica sa vise proteina je: `, uporedi(namirnica1, namirnica2));
        });
    });

//Ceka da se svi promisi zavrse
Promise.all([
        getByIndexAsync(getRandomNumber()),
        getByIndexAsync(getRandomNumber())
    ])
    .then(console.log(`Obradjujem...`))
    .then(namirnice => {
        console.log('1. ', namirnice[0]);
        console.log('2. ', namirnice[1]);
        console.log('Namirnica sa vise proteina je: ', uporedi(namirnice[0], namirnice[1]));
    });