function iscrtajKalkulator() {
    const divKalkulator = document.createElement("div");
    divKalkulator.className = "kalkulator";
    document.body.appendChild(divKalkulator);

    let objekat = document.createElement("h3");
    objekat.innerHTML = "Kalkulator";
    divKalkulator.appendChild(objekat);

    objekat = document.createElement("input");
    objekat.id = "unos";
    objekat.value = "Namirnica";
    objekat.onfocus = () => myFocus();
    divKalkulator.appendChild(objekat);

    function myFocus() {
        document.getElementById("unos").value = " ";
    }

    objekat = document.createElement("input");
    objekat.type = "number";
    objekat.className = "number";
    objekat.setAttribute("min", 0);
    objekat.setAttribute("max", 2000);
    divKalkulator.appendChild(objekat);

    objekat = document.createElement("input");
    objekat.className = "kategorija";
    divKalkulator.appendChild(objekat);
}