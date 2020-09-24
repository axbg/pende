import { DoubleData } from 'src/classes/DoubleData';

export class SettingsConstants {
  private static themes: DoubleData[] = [
    new DoubleData('eclipse', 'Eclipse', 'theme', 'white'),
    new DoubleData('twilight', 'Twilight', 'theme', 'black'),
  ];
  private static cursors: DoubleData[] = [
    new DoubleData('', 'Default', 'cursor'),
    new DoubleData('ace/keyboard/vim', 'Vim', 'cursor'),
    new DoubleData('ace/keyboard/emacs', 'Emacs', 'cursor'),
  ];

  constructor() {}

  public static getThemes(): DoubleData[] {
    return SettingsConstants.themes;
  }

  public static getCursors(): DoubleData[] {
    return SettingsConstants.cursors;
  }
}
