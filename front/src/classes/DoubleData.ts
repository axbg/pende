export class DoubleData {

    private value: String;
    private label: String;
    private property: String;

    constructor(value, label, property) {
        this.value = value;
        this.label = label;
        this.property = property;
    }

    public getValue(): String {
        return this.value;
    }

    public getDisplay(): String {
        return this.label;
    }

    public getProperty(): String {
        return this.property;
    }

    public toString(): String {
        return this.label;
    }

}
