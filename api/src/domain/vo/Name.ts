export default class Name {
    private value: string;

    constructor(name: string){
        if (!this.isValidName(name)) throw new Error("Invalid name");
        this.value=name;
    }

    getValue(){
        return this.value;
    }

    isValidName(name: string) {
        return name.match(/[a-zA-Z] [a-zA-Z]+/);
    }
}