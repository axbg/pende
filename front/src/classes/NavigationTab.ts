export class NavigationTab {

    private id: number;
    private title: String;
    private content: String;
    private index: number;
    private cursorLine: number;
    private cursorColumn: number;
    private modified: boolean;

    //will have to keep a list of breakpoints here as well...

    constructor(id, title, content, index) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.index = index;
        this.cursorLine = 0;
        this.cursorColumn = 0;
        this.modified = false;
    }

    public getId(): number {
        return this.id;
    }

    public getTitle(): String {
        return this.title;
    }

    public setContent(content) {
        this.content = content;
    }

    public getContent(): String {
        return this.content;
    }

    public getIndex(): number {
        return this.index;
    }

    public setIndex(index: number) {
        this.index = index;
    }

    public getCursorLine(): number {
        return this.cursorLine;
    }

    public getCursorColumn(): number {
        return this.cursorColumn;
    }

    public setCursor(line: number, column: number) {
        this.cursorLine = line;
        this.cursorColumn = column;
    }

    public getModified(): boolean {
        return this.modified;
    }

    public setModified(modified: boolean) {
        this.modified = modified;
    }
}