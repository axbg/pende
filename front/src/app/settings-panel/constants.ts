import { DoubleData } from 'src/classes/DoubleData';

export class SettingsConstants {

    private static themes: DoubleData[] = [new DoubleData("eclipse", "Eclipse", "theme"), new DoubleData("dracula", "Dracula", "theme"), new DoubleData("ambiance", "Ambiance", "theme"), new DoubleData("chrome", "Chrome", "theme"), new DoubleData("cobalt", "Cobalt", "theme"), new DoubleData("xcod", "XCode", "theme"), new DoubleData("twilight", "Twilight", "theme")];
    private static cursors: DoubleData[] = [new DoubleData("", "Ace", "cursor"), new DoubleData("ace/keyboard/vim", "Vim", "cursor"), new DoubleData("ace/keyboard/emacs", "Emacs", "cursor")];

    constructor() {
    }

    public static getThemes(): DoubleData[] {
        return SettingsConstants.themes;
    }

    public static getCursors() : DoubleData[] {
        return SettingsConstants.cursors;
    }
}