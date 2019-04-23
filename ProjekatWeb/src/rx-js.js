import { from } from "rxjs";


function getNamirnica(name) {
    return from(
        fetch(`http://localhost:3000/namirnice?naziv=${name}`)
        .then(response => response.json())
    );
}

getNamirnica("Jagnjetina").subscribe(namirnica => console.log(namirnica));
getNamirnica("Pecurke").subscribe(namirnica => console.log(namirnica));