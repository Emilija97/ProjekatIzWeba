import { from, fromEvent, Subject, interval } from "rxjs";
import { debounceTime, switchMap, map, filter, find, scan, reduce, zip, pairwise } from "rxjs/operators";

let flagUnos = 0;
let flagKat = 0;
let flagNam = 0;
let flagGram = 0;
let red = null;
let flag = 0;

const divPretraga = document.createElement("div");
divPretraga.className = "pretraga";
document.body.appendChild(divPretraga);

function getNamirnica(name) {
    return from(
        fetch(`http://localhost:3000/namirnice?naziv=${name}`)
        .then(response => response.json())
    );
}

//getNamirnica("Jagnjetina").subscribe(namirnica => console.log(namirnica));
const labela = document.createElement("label");
labela.innerHTML = "Unesite naziv zeljene namirnice: ";
divPretraga.appendChild(labela);

const input = document.createElement("input");
input.className = "namirnica";
divPretraga.appendChild(input);

fromEvent(input, "input").pipe(
    debounceTime(500),
    map(ev => ev.target.value),
    filter(text => text.length >= 3),
    switchMap(naziv => getNamirnica(naziv))
).subscribe(rezultat => fillTable(rezultat, divPretraga));

function hvatajPromenu(klasa) {
    fromEvent(document.querySelector(klasa), "input").pipe(
        debounceTime(500),
        map(ev => ev.target.value)
    ).subscribe(() => izracunajVrednost());
}

function kreirajTabelu(div) {
    const tabela = document.createElement("table");
    div.appendChild(tabela);

    const red = document.createElement("tr");
    red.className = "zaglavlje";
    tabela.appendChild(red);

    let el = null;
    const imenaKolona = ["Naziv", "Proteini", "UH", "Kcal", "Masti"];
    imenaKolona.forEach((kolonaNaziv) => {
        el = document.createElement("th");
        red.appendChild(el);
        el.innerHTML = kolonaNaziv;
    });
    flag = 1;
    const button = document.createElement("button");
    button.className = "obrisi";
    button.innerHTML = "Obrisi rezultate pretrage";
    div.appendChild(button);
    button.onclick = () => obrisiRezultate();
}

function obrisiRezultate() {
    const tabela = document.querySelector("table");
    tabela.parentNode.removeChild(tabela);
    const button = document.querySelector("button");
    button.parentNode.removeChild(button);
    const input = document.querySelector("input");
    input.value = "";
    flag = 0;
}

function fillTable(lista, div) {
    if (flag == 0)
        kreirajTabelu(div);
    const proslTabela = document.querySelector("table");
    let podatak = null;
    lista.forEach(element => {
        red = document.createElement("tr");
        podatak = document.createElement("td");
        podatak.innerHTML = element.naziv;
        proslTabela.appendChild(red);
        red.appendChild(podatak);

        podatak = document.createElement("td");
        podatak.innerHTML = element.proteini;
        red.appendChild(podatak);

        podatak = document.createElement("td");
        podatak.innerHTML = element.UH;
        red.appendChild(podatak);

        podatak = document.createElement("td");
        podatak.innerHTML = element.kalorije;
        red.appendChild(podatak);

        podatak = document.createElement("td");
        podatak.innerHTML = element.masti;
        red.appendChild(podatak);
    });
}

iscrtajKalkulator();

function iscrtajKalkulator() {
    const divKalkulator = document.createElement("div");
    divKalkulator.className = "kalkulator";
    document.body.appendChild(divKalkulator);

    let objekat = document.createElement("h3");
    objekat.innerHTML = "Kalkulator";
    divKalkulator.appendChild(objekat);

    kreirajInput("unos", "Namirnica", divKalkulator);
    objekat = document.querySelector(".unos");
    objekat.onchange = () => hvatajPromenu(".unos");
    objekat.onfocus = () => {
        flagUnos = myFocus(".unos", flagUnos);
    }

    kreirajNumber("number", divKalkulator);
    objekat = document.querySelector(".number");
    objekat.onchange = () => hvatajPromenu(".number");

    kreirajInput("kategorija", "proteini, UH, kalorije, masti", divKalkulator);
    objekat = document.querySelector(".kategorija");
    objekat.onchange = () => hvatajPromenu(".kategorija");
    objekat.onfocus = () => {
        flagKat = myFocus(".kategorija", flagKat);
    }

    kreirajLabelu("rezultat", divKalkulator);

    kreirajDugme("izracunaj", "Izracunaj", divKalkulator);
    objekat = document.querySelector(".izracunaj");
    objekat.onclick = () => izracunajVrednost();
}

function kreirajNumber(tekst, div) {
    let objekat = document.createElement("input");
    objekat.type = "number";
    objekat.className = tekst;
    objekat.defaultValue = 100;
    objekat.setAttribute("step", 100);
    objekat.setAttribute("min", 0);
    objekat.setAttribute("max", 2000);
    div.appendChild(objekat);
    // objekat.onchange = () => hvatajPromenu(".number");
}

function kreirajDugme(tekst, sadrzaj, div) {
    let objekat = document.createElement("button");
    objekat.className = tekst;
    objekat.innerHTML = sadrzaj;
    div.appendChild(objekat);
}

function kreirajLabelu(tekst, div) {
    let objekat = document.createElement("label");
    objekat.className = tekst;
    div.appendChild(objekat);
}

function kreirajInput(tekst, vrednost, div) {
    let objekat = document.createElement("input");
    objekat.className = tekst;
    objekat.value = vrednost;
    div.appendChild(objekat);
}

function myFocus(klasa, flag) {
    if (flag == 0) {
        document.querySelector(klasa).value = "";
        return flag = 1;
    }
}

function izracunajVrednost() {
    const namirnica = document.querySelector(".unos").value;
    const gramaza = document.querySelector(".number").value;
    const kategorija = document.querySelector(".kategorija").value;

    getNamirnica(namirnica).subscribe(obj => ispisiPodatke(obj, gramaza, kategorija));
}

function ispisiPodatke(lista, gramaza, kategorija) {
    let value = 0;
    const labela = document.querySelector(".rezultat");

    value = izracunaj(lista, gramaza, kategorija, labela);
}

function izracunaj(lista, gramaza, kategorija, labela) {
    let value = 0;
    lista.forEach(el => {
        if (kategorija == "UH") {
            value = el.UH * (gramaza / 100);
            labela.innerHTML = "Kolicina UH-a na " + gramaza + "g iznosi " + value + ".";
        } else if (kategorija == "proteini") {
            value = el.proteini * (gramaza / 100);
            labela.innerHTML = "Kolicina proteina na " + gramaza + "g iznosi " + value + ".";
        } else if (kategorija == "masti") {
            value = el.masti * (gramaza / 100);
            labela.innerHTML = "Kolicina masti na " + gramaza + "g iznosi " + value + ".";
        } else {
            value = el.kalorije * (gramaza / 100);
            labela.innerHTML = "Kolicina kalorija na " + gramaza + "g iznosi " + value + ".";
        }
    });
    return value;
}

crtajDnevniKalkulator();

function crtajDnevniKalkulator() {
    const noviKalkulator = document.createElement("div");
    noviKalkulator.className = "dnevniKalkulator";
    document.body.appendChild(noviKalkulator);

    let objekat = document.createElement("h3");
    objekat.innerHTML = "Dnevni kalkulator";
    noviKalkulator.appendChild(objekat);

    let kategorije = ["proteini", "UH", "masti", "kalorije"];
    let labela = null;

    kategorije.forEach((el, index) => {
        const divKategorije = document.createElement("div");
        divKategorije.className = "divKategorije";
        noviKalkulator.appendChild(divKategorije);

        const radioDugme = document.createElement("input");
        radioDugme.setAttribute("type", "radio");
        radioDugme.setAttribute("value", kategorije[index]);
        radioDugme.setAttribute("name", "dugme");
        radioDugme.className = "radio";
        divKategorije.appendChild(radioDugme);

        labela = document.createElement("label");
        labela.innerHTML = kategorije[index].charAt(0).toUpperCase() + kategorije[index].slice(1);
        labela.className = "labela";
        divKategorije.appendChild(labela);
    });

    const divUnos = document.createElement("div");
    divUnos.className = "divUnos";
    noviKalkulator.appendChild(divUnos);

    kreirajInput("dnevniUnos", "Namirnica", divUnos);
    objekat = document.querySelector(".dnevniUnos");
    objekat.onfocus = () => {
        flagNam = myFocus(".dnevniUnos", flagNam);
    }

    kreirajNumber("limit", divUnos);
    objekat = document.querySelector(".limit");
    objekat.onchange = () => hvatajPromenu(".limit");

    kreirajInput("gramazaUnos", "Kolicina u gramima", divUnos);
    objekat = document.querySelector(".gramazaUnos");
    objekat.onfocus = () => {
        flagGram = myFocus(".gramazaUnos", flagGram);
    }

    kreirajLabelu("dnevnaLabela", divUnos);

    kreirajDugme("izracunajDnevniUnos", "Izracunaj dnevni unos", divUnos);
    objekat = document.querySelector(".izracunajDnevniUnos");
    objekat.onclick = () => ispisiRacunicu();

    kreirajLabelu("prikaz", divUnos);

    objekat = document.createElement("h4");
    objekat.innerHTML = "Unete namirnice i njihova kolicina";
    divUnos.appendChild(objekat);

    objekat = document.createElement("ol");
    objekat.className = "listaPojedenihNamirnica";
    divUnos.appendChild(objekat);
}

const listaNamirnica$ = new Subject();

function ispisiRacunicu() {
    const nam = document.querySelector(".dnevniUnos").value;
    const izabranaKategorija = document.querySelectorAll(".radio");

    getNamirnica(nam).subscribe(obj => popuniListu(obj, izabranaKategorija));
}

function popuniListu(obj, izabranaKategorija) {
    let flagDugme = 0;
    izabranaKategorija.forEach(dugme => {
        if (dugme.checked) {
            flagDugme = 1;
        }
    });

    const lista = document.querySelector(".listaPojedenihNamirnica");
    let objekat = null;
    if (flagDugme == 1) {
        listaNamirnica$.next(obj);
        objekat = document.createElement("li");
        objekat.innerHTML = document.querySelector(".dnevniUnos").value + " " + document.querySelector(".gramazaUnos").value + "g";
        lista.appendChild(objekat);
    } else
        alert("Morate da oznacite po kom kriterijumu se vrsi obrada podataka!");
}

//Jedna labela prikazuje ukupnu sumu, a to je prikaz iz promise-a, a druga za svaku unetu namirnicu posebno
const prikaz = document.querySelector(".dnevnaLabela");
const label = document.querySelector(".prikaz");

listaNamirnica$.pipe(
    scan((acc, el) => acc + sracunajKomplikovano(el), 0)
).subscribe(rezultat => subscribeFunc(rezultat, prikaz));

function sracunajKomplikovano(el) {
    let pom = 0;

    const grami = document.querySelector(".gramazaUnos").value;
    const izabranaKategorija = document.querySelectorAll(".radio");
    izabranaKategorija.forEach(dugme => {
        if (dugme.checked) {
            pom = izracunaj(el, grami, dugme.value, prikaz);
        }
    });

    label.innerHTML = "Nutritivna vrednost date namirnice za zadatu kolicinu iznosi: " + pom;
    return pom;
}

function subscribeFunc(rezultat, prikaz) {
    promiseFunc(rezultat, prikaz).catch(() => {
        alert("Cestitamo, vas dnevni unos je prekoracen!");
    });
}

function promiseFunc(rezultat, prikaz) {
    return new Promise((resolve, reject) => {
        const limit = document.querySelector(".limit").value;
        setTimeout(() => limit > rezultat ?
            resolve(prikaz.innerHTML = "Dosadasnji unos iznosi " + rezultat) :
            reject("Unos je predjen"), 100);
    });
}