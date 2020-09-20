export class DoubleData {

    private value: String;
    private label: String;
    private property: String;
    private color?: String;

    constructor(value, label, property, color = null) {
        this.value = value;
        this.label = label;
        this.property = property;
        this.color = color;
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

    public setColor(color: String): void {
        this.color = color;
    }

    public getColor(): String {
        return this.color;
    }

    public toString(): String {
        return this.label;
    }

}
