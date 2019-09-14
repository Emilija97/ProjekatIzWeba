import { from, fromEvent, Subject, interval, Observable, zip } from "rxjs";
import {
    debounceTime,
    switchMap,
    map,
    filter,
    find,
    scan,
    reduce,
    pairwise,
    concatMap
} from "rxjs/operators";
import { Namirnica } from "./namirnica";

let flagEnter = 0;
let flagCat = 0;
let flagGro = 0;
let flagGram = 0;
let flag = 0;
const selectOptions = ["Proteins", "UH", "Calories", "Fats"];
const typeOfFood = ["Fruit", "Vegetable", "Milk", "Fish", "Meat", "Cereals"];

function createLabel(className, innerHTML, parent) {
    let element = document.createElement("label");
    element.className = className;
    element.innerHTML = innerHTML;
    parent.appendChild(element);
}

function createDiv(className, parent) {
    let element = document.createElement("div");
    element.className = className;
    parent.appendChild(element);
}

function createHElement(type, innerHTML, parent) {
    let element = null;
    switch (type) {
        case "h2":
            element = document.createElement("h2");
            break;
        case "h3":
            element = document.createElement("h3");
            break;
        default:
            element = document.createElement("h4");
    }
    element.innerHTML = innerHTML;
    parent.appendChild(element);
}

function createInput(className, value, parent) {
    let element = document.createElement("input");
    element.className = className;
    element.value = value;
    parent.appendChild(element);
}

function createNumber(className, parent) {
    let element = document.createElement("input");
    element.type = "number";
    element.className = className;
    element.defaultValue = 100;
    element.setAttribute("step", 100);
    element.setAttribute("min", 0);
    element.setAttribute("max", 2000);
    parent.appendChild(element);
}

function createButton(className, innerHTML, parent) {
    const button = document.createElement("button");
    button.className = className;
    button.innerHTML = innerHTML;
    parent.appendChild(button);
}

function createTableHead(columnNames, parent) {
    let element = null;
    columnNames.forEach(colName => {
        element = document.createElement("th");
        parent.appendChild(element);
        element.innerHTML = colName;
    });
}

createDiv("leftDiv", document.body);
const leftDiv = document.querySelector(".leftDiv");

createHElement("h2", "Calculating nutritional values", leftDiv);

createDiv("search", leftDiv);
const divSearch = document.querySelector(".search");

function getGrocerie(name) {
    let nameTmp = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    return from(
        fetch(`http://localhost:3000/namirnice?name=${nameTmp}`).then(response =>
            response.json()
        )
    );
}

function postGrocerie(grocerie) {
    return from(
        fetch(`http://localhost:3000/namirnice`, {
            method: "POST",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(grocerie)
        }).then(response => response.json())
    );
}

//getGrocerie("Jagnjetina").subscribe(namirnica => console.log(namirnica));
createLabel("guide", "Enter the name of the desired grocerie: ", divSearch);

createInput("grocerie", "", divSearch);
const inputGrocerie = document.querySelector(".grocerie");

fromEvent(inputGrocerie, "input")
    .pipe(
        debounceTime(500),
        map(ev => ev.target.value && ev.target.value.toLowerCase()),
        filter(text => text.length >= 3),
        switchMap(name => getGrocerie(name))
    )
    .subscribe(result => updateTable(result, divSearch));

function catchChange(klasa) {
    fromEvent(document.querySelector(klasa), "input")
        .pipe(
            debounceTime(500),
            map(ev => ev.target.value && ev.target.value.toLowerCase())
        )
        .subscribe(() => calculateValue());
}

function createTable(parent) {
    const table = document.createElement("table");
    parent.appendChild(table);

    const columnNames = ["Name", "Proteins", "UH", "Kcal", "Fats"];
    createTableHead(columnNames, table);

    flag = 1;

    createButton("delete", "Delete search results", parent);
    const button = document.querySelector(".delete");
    button.onclick = () => deleteResults();
}

function deleteResults() {
    const table = document.querySelector("table");
    table.parentNode.removeChild(table);
    const button = document.querySelector(".delete");
    button.parentNode.removeChild(button);
    const input = document.querySelector(".grocerie");
    input.value = "";
    flag = 0;
}

function createRow(rowData, parent) {
    const row = document.createElement("tr");
    parent.appendChild(row);

    fillRow(rowData.name, row);
    fillRow(rowData.proteins, row);
    fillRow(rowData.UH, row);
    fillRow(rowData.calories, row);
    fillRow(rowData.fats, row);
}

function fillRow(innerHTML, parent) {
    let element = document.createElement("td");
    element.innerHTML = innerHTML;
    parent.appendChild(element);
}

function updateTable(array, parent) {
    if (flag == 0) createTable(parent);
    const table = document.querySelector("table");

    array.forEach(el => {
        createRow(el, table);
    });
}

drawCalculator();

function drawCalculator() {
    createDiv("calculator", leftDiv);
    const divCalculator = document.querySelector(".calculator");

    createHElement("h3", "Calculator", divCalculator);

    createInput("enter", "Grocerie", divCalculator);

    createNumber("number", divCalculator);

    createSelect("category", selectOptions, divCalculator);

    createLabel("result", "", divCalculator);

    createButton("calculate", "Calculate", divCalculator);

    callAction();
}

function callAction() {
    let element = null;

    element = document.querySelector(".enter");
    element.onchange = () => catchChange(".enter");
    checkFocus(".enter", flagEnter);

    element = document.querySelector(".number");
    element.onchange = () => catchChange(".number");

    checkClick(".category", calculateValue);
    checkFocus(".category", flagCat);

    checkClick(".calculate", calculateValue);
}

function createSelect(className, selectOptions, parent) {
    const select = document.createElement("select");
    select.className = className;
    parent.appendChild(select);

    initializeSelect(selectOptions, select);
}

function initializeSelect(selectOptions, parent) {
    let element = null;
    selectOptions.forEach((option, index) => {
        element = document.createElement("option");
        element.innerHTML = option;
        element.value = index;
        parent.appendChild(element);
    });
}

function myFocus(klasa, flag) {
    if (flag == 0) {
        document.querySelector(klasa).value = "";
        return (flag = 1);
    }
}

function calculateValue() {
    const grocerie = document.querySelector(".enter").value;
    const grams = document.querySelector(".number").value;
    let category = selectOptions[document.querySelector("select").selectedIndex];

    getGrocerie(grocerie)
        .pipe(concatMap(res => res))
        .subscribe(result => printData(result, grams, category));
}

function printData(grocerie, grams, category) {
    const label = document.querySelector(".result");

    calculate(grocerie, grams, category, label);
}

function calculate(grocerie, grams, category, label) {
    let value = 0;
    switch (category) {
        case "UH":
            {
                value = grocerie.UH * (grams / 100);
                label.innerHTML =
                "The amount of UHs per " + grams + "g is " + value + ".";
            }
            break;
        case "Proteins":
            {
                value = grocerie.proteins * (grams / 100);
                label.innerHTML =
                "The amount of proteins per " + grams + "g is " + value + ".";
            }
            break;
        case "Fats":
            {
                value = grocerie.fats * (grams / 100);
                label.innerHTML =
                "The amount of fats per " + grams + "g is " + value + ".";
            }
            break;
        default:
            {
                value = grocerie.calories * (grams / 100);
                label.innerHTML =
                "The amount of calories per " + grams + "g is " + value + ".";
            }
    }
    return value;
}

drawDailyCalculator();

function createRadioButton(value, name, className, parent) {
    const radioButton = document.createElement("input");
    radioButton.setAttribute("type", "radio");
    radioButton.setAttribute("value", value);
    radioButton.setAttribute("name", name);
    radioButton.className = className;
    parent.appendChild(radioButton);
}

function drawCategory(parent) {
    let divCategory = null;

    selectOptions.forEach((option, index) => {
        divCategory = document.createElement("div");
        divCategory.className = "divCategory";
        parent.appendChild(divCategory);

        createRadioButton(option, "radioBtn", "radio", divCategory);

        createLabel("labela", option, divCategory);
    });
}

function drawDailyCalculator() {
    createDiv("dailyCalculator", leftDiv);
    let dailyCalculator = document.querySelector(".dailyCalculator");

    createHElement("h3", "Daily calculator", dailyCalculator);

    createHElement("h4", "Categories:", dailyCalculator);

    drawCategory(dailyCalculator);

    drawInput(dailyCalculator);

    dailyActions();
    createLabel("zipLab", "", dailyCalculator);
}

function drawInput(parent) {
    createDiv("divInput", parent);
    let divInput = document.querySelector(".divInput");

    createLabel("guide", "Specify eaten grocerie", divInput);
    createInput("dailyInput", "Grocerie", divInput);

    createLabel(
        "guide",
        "Specify the desired daily entry for the selected category",
        divInput
    );
    createNumber("limit", divInput);

    createLabel("guide", "Eaten food quantity in grams", divInput);
    createInput("gramsInput", "Quantity in grams", divInput);

    createLabel("dailyLabel", "", divInput);

    createButton("calculateDailyInput", "Calculate daily input", divInput);

    createLabel("display", "", divInput);

    createHElement("h4", "Entered groceries and theirs quantity", divInput);

    createList("listEatenGroceries", "ol", divInput);
}

function checkFocus(className, flag) {
    let element = document.querySelector(className);
    element.onfocus = () => {
        flag = myFocus(className, flag);
    };
}

function checkClick(className, callFunction) {
    let button = document.querySelector(className);
    button.onclick = () => callFunction();
}

function dailyActions() {
    checkFocus(".dailyInput", flagGro);
    let element = null;
    element = document.querySelector(".limit");
    element.onchange = () => catchChange(".limit");

    checkFocus(".gramsInput", flagGram);

    checkClick(".calculateDailyInput", writeCalculation);
}

function createList(className, type, parent) {
    let element = null;
    if (type == "ol") {
        element = document.createElement("ol");
    } else {
        element = document.createElement("ul");
    }
    element.className = className;
    parent.appendChild(element);
}

let grocerieList$ = new Subject();

function writeCalculation() {
    const grocerie = document.querySelector(".dailyInput").value;
    const chosenCategory = document.querySelectorAll(".radio");

    getGrocerie(grocerie)
        .pipe(
            concatMap(res => res) //da napravi jednu vrednost
        )
        .subscribe(result => fillTheList(result, chosenCategory));
}

function fillTheList(grocerie, category) {
    let flagButton = 0;
    category.forEach(button => {
        if (button.checked) {
            flagButton = 1;
        }
    });

    const list = document.querySelector(".listEatenGroceries");
    if (flagButton == 1) {
        grocerieList$.next(grocerie);
        let name = document.querySelector(".dailyInput").value;
        let itemHTML =
            name.charAt(0).toUpperCase() +
            name.slice(1).toLowerCase() +
            " " +
            document.querySelector(".gramsInput").value +
            "g";
        createListItem(itemHTML, list);
    } else alert("You have to chose category for calculation!");
}

function createListItem(innerHTML, parent) {
    let element = document.createElement("li");
    element.innerHTML = innerHTML;
    parent.appendChild(element);
}

//Jedna labela prikazuje ukupnu sumu, a to je prikaz iz promise-a, a druga za svaku unetu namirnicu posebno
const dailyDisplay = document.querySelector(".dailyLabel");
const label = document.querySelector(".display");

grocerieList$
    .pipe(scan((acc, grocerie) => acc + getValue(grocerie), 0))
    .subscribe(result => subscribeFunc(result, dailyDisplay));

function getValue(grocerie) {
    let tmp = 0;

    const grams = document.querySelector(".gramsInput").value;
    const chosenCategory = document.querySelectorAll(".radio");
    chosenCategory.forEach(button => {
        if (button.checked) {
            tmp = calculate(grocerie, grams, button.value, dailyDisplay);
        }
    });

    label.innerHTML =
        "The nutritional value of a given grocerie for a given amount is: " + tmp;
    return tmp;
}

function subscribeFunc(result, dailyDisplay) {
    promiseFunc(result, dailyDisplay).catch(() => {
        alert("You got your daily desired input!");
    });
}

function promiseFunc(result, dailyDisplay) {
    return new Promise((resolve, reject) => {
        const limit = document.querySelector(".limit").value;
        setTimeout(
            () =>
            limit > result ?
            resolve((dailyDisplay.innerHTML = "The entry so far is " + result)) :
            reject("Entry crossed"),
            100
        );
    });
}

const timer$ = interval(10000);

//ovde se izvrsava zip fja
zip(grocerieList$, timer$).subscribe(grocerie => showElement(grocerie));

function showElement(grocerie) {
    let lab = document.querySelector(".zipLab");
    lab.innerHTML = grocerie[0].name;
    console.log(grocerie[0].name);
}

//Mogucnost dodavanja u bazu
createDiv("rightDiv", document.body);
const rightDiv = document.querySelector(".rightDiv");

createHElement("h2", "Add new grocerie in database", rightDiv);

drawForm();

function drawForm() {
    createDiv("form", rightDiv);
    const form = document.querySelector(".form");

    createLabel("propertyLabel", "Name of grocerie", form);
    createInput("property", "", form);
    createLabel("propertyLabel", "Proteins", form);
    createInput("property", "", form);
    createLabel("propertyLabel", "UHs", form);
    createInput("property", "", form);
    createLabel("propertyLabel", "Calories", form);
    createInput("property", "", form);
    createLabel("propertyLabel", "Fats", form);
    createInput("property", "", form);

    createLabel("propertyLabel", "Type", form);
    createSelect("type", typeOfFood, form);

    createButton("confirm", "Add in database", form);

    const button = document.querySelector(".confirm");
    button.onclick = () => createGrocerieObject();
}

function createGrocerieObject() {
    let elements = document.querySelectorAll(".property");
    let type = typeOfFood[document.querySelector(".type").selectedIndex];

    const grocerie = new Namirnica(
        elements[0].value,
        elements[1].value,
        elements[2].value,
        elements[3].value,
        elements[4].value,
        type
    );
    postGrocerie(grocerie);
}

function transformType(type) {
    let tmp = null;
    switch (type) {
        case "Fruit":
            tmp = "voce";
            break;
        case "Vegetable":
            tmp = "povrce";
            break;
        case "Milk":
            tmp = "mleko";
            break;
        case "Fish":
            tmp = "riba";
            break;
        case "Meat":
            tmp = "meso";
            break;
        default:
            tmp = "zitarice";
    }

    return tmp;
}