import { from, fromEvent, Subject } from "rxjs";
import { debounceTime, switchMap, map, filter, find } from "rxjs/operators";

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

function iscrtajKalkulator() {
    const divKalkulator = document.createElement("div");
    divKalkulator.className = "kalkulator";
    document.body.appendChild(divKalkulator);

    let objekat = document.createElement("h3");
    objekat.innerHTML = "Kalkulator";
    divKalkulator.appendChild(objekat);

    objekat = document.createElement("input");
    objekat.className = "unos";
    objekat.value = "Namirnica";
    objekat.onfocus = () => myFocus(".unos");
    divKalkulator.appendChild(objekat);

    objekat = document.createElement("input");
    objekat.type = "number";
    objekat.className = "number";
    objekat.defaultValue = 0;
    objekat.setAttribute("min", 0);
    objekat.setAttribute("max", 2000);
    divKalkulator.appendChild(objekat);

    objekat = document.createElement("input");
    objekat.className = "kategorija";
    objekat.value = "proteini, UH, kalorije, masti";
    objekat.onfocus = () => myFocus(".kategorija");
    divKalkulator.appendChild(objekat);

    objekat = document.createElement("label");
    objekat.className = "rezultat";
    //objekat.innerHTML = "Ja sam tu!";
    divKalkulator.appendChild(objekat);

    objekat = document.createElement("button");
    objekat.className = "izracunaj";
    objekat.innerHTML = "Izracunaj";
    objekat.onclick = () => izracunajVrednost();
    divKalkulator.appendChild(objekat);
}

function myFocus(klasa) {
    document.querySelector(klasa).value = "";
}

iscrtajKalkulator();

const subject$ = new Subject();

function izracunajVrednost() {
    const namirnica = document.querySelector(".unos").value;
    const gramaza = document.querySelector(".number").value;
    const kategorija = document.querySelector(".kategorija").value;

    console.log(kategorija);

    getNamirnica(namirnica).subscribe(obj => ispisiPodatke(obj, gramaza, kategorija));
}

function ispisiPodatke(lista, gramaza, kategorija) {
    let value = 0;
    const labela = document.querySelector(".rezultat");

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

}