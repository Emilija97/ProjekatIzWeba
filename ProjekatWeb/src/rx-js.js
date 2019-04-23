import { from } from "rxjs";


function getNamirnica(name) {
    return from(
        fetch(`http://localhost:3000/namirnice?naziv=${name}`)
        .then(response => response.json())
    );
}

getNamirnica("Govedina").subscribe(namirnica => console.log(namirnica));
getNamirnica("Breskva").subscribe(namirnica => console.log(namirnica));