import { Namirnica } from "./namirnica";
export class NamirnicaService {
    constructor() {
        this.nizNamirnica = [];
    }

    dodajNamirnicu(namirnica) {
        this.nizNamirnica.push(namirnica);
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