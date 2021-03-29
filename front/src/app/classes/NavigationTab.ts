export class NavigationTab {
  private id: String;
  private title: String;
  private content: String = "";
  private index: number;
  private path: String;
  private cursorLine: number;
  private cursorColumn: number;
  private modified: boolean;
  private breakpoints: number[] = [];

  constructor(id: String, title: string, content: String, path: String, index: number) {
    this.id = id;
    this.title = title;
    this.setContent(content);
    this.path = path;
    this.index = index;
    this.cursorLine = 0;
    this.cursorColumn = 0;
    this.modified = false;
  }

  public getId(): String {
    return this.id;
  }

  public getTitle(): string {
    return this.title.toString();
  }

  public setContent(content: String) {
    if (!content.includes('setbuf(stdout, NULL);')) {
      content = this.addSetBuf(content);
    }

    this.content = content;
  }

  public getContent(): String {
    return this.content;
  }

  public getContentForDisplay(): String {
    return this.removeSetBuf(this.content);
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

  public getBreakpoints(): number[] {
    return this.breakpoints;
  }

  public setBreakpoints(breakpoints: number[]) {
    this.breakpoints = breakpoints;
  }

  public addBreakpoint(breakpoint: number) {
    this.breakpoints.push(breakpoint);
  }

  public removeBreakpoint(breakpoint: number) {
    this.breakpoints = this.breakpoints.filter(
      (element) => element !== breakpoint
    );
  }

  public getEssentialData(): Object {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      path: this.path,
    };
  }

  private addSetBuf(content: any) {
    const main = content.indexOf('main()');
    const substring = content.substring(main, content.indexOf('{', main) + 1);

    return content.replace(substring, substring + ' setbuf(stdout, NULL);');
  }

  private removeSetBuf(content: any) {
    return content.replace(' setbuf(stdout, NULL);', '');
  }
}
