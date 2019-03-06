export class NavigationTab {

    private title: String;
    private URL: String;
    private content: String;
    private index: number;
    private cursorLine: number;
    private cursorColumn: number;

    constructor(title, url, content, index) {
        this.title = title;
        this.URL = url;
        this.content = content;
        this.index = index;
    }

    public getTitle(): String {
        return this.title;
    }

    public getURL(): String {
        return this.URL;
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
}