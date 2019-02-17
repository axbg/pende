export class NavigationTab {

    private title : String;
    private URL : String;
    private content : String;

    constructor(title, url, content) {
        this.title = title;
        this.URL = url;
        this.content = content;
    }

    public getTitle() : String{
        return this.title;
    }

    public getURL() : String {
        return this.URL;
    }

    public setContent(content){
        this.content = content;
    }

    public getContent() : String {
        return this.content;
    }
}