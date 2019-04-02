export class NavigationTab {

    private id: number;
    private title: String;
    private content: String;
    private index: number;
    private path: String;
    private cursorLine: number;
    private cursorColumn: number;
    private modified: boolean;
    private breakpoints: number[] = [];

    constructor(id, title, content, path, index) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.path = path;
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

    public getPath(): String {
        return this.path;
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
    
    public getBreakpoints() : number[]{
        return this.breakpoints;
    }

    public setBreakpoints(breakpoints: number[]){
        this.breakpoints = breakpoints;
    }

    public addBreakpoint(breakpoint: number){
        this.breakpoints.push(breakpoint);
    }

    public removeBreakpoint(breakpoint: number){
        this.breakpoints.splice(this.breakpoints.indexOf(breakpoint), 1);
    }
}