export class NavigationTab {

    private title : String;
    private URL : String;
    private renderBody : String;
    private content : String;

    constructor(title, url, renderBody, content) {
        this.title = title;
        this.URL = url;
        this.renderBody = renderBody;
        this.content = content;
    }

    public getTitle() : String{
        return this.title;
    }

    public getURL() : String {
        return this.URL;
    }

    public getRenderBody() : String {
        return this.renderBody;
    }

    public setContent(content){
        this.content = content;
    }

    public getContent() : String {
        return this.content;
    }
}