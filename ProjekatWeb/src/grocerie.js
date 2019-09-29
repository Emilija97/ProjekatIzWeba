export class Grocerie {
    constructor(name, proteins, UH, calories, fats, type) {
        this.name = name;
        this.proteins = proteins;
        this.UH = UH;
        this.calories = calories;
        this.fats = fats;
        this.type = type;
    }

    getCategory(category) {
        switch (category) {
            case "UH":
                return this.UH;
                // break;
            case "Proteins":
                return this.proteins;
                // break;
            case "Fats":
                return this.fats;
                // break;
            default:
                return this.calories;
        }
    }
}