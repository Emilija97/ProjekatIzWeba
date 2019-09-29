import { Grocerie } from "./grocerie";
export class NamirnicaService {
    constructor() {
        this.nizNamirnica = [];
    }

    dodajNamirnicu(grocerie) {
        this.nizNamirnica.push(grocerie);
    }

    vratiPoslednjeDodatuNamirnicu() {
        return this.nizNamirnica.pop();
    }

    vratiSveNamirnice() {
        return this.nizNamirnica;
    }

    getByIndex(index) {
        return this.nizNamirnica[index];
    }
}