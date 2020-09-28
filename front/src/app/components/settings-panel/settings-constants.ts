import {SettingData } from 'src/app/classes/SettingData';

export class SettingsConstants {
  private static themes: SettingData[] = [
    new SettingData('eclipse', 'Eclipse', 'theme', 'white'),
    new SettingData('twilight', 'Twilight', 'theme', 'black'),
  ];
  private static cursors: SettingData[] = [
    new SettingData('', 'Default', 'cursor'),
    new SettingData('ace/keyboard/vim', 'Vim', 'cursor'),
    new SettingData('ace/keyboard/emacs', 'Emacs', 'cursor'),
  ];

  constructor() {}

  public static getThemes(): SettingData[] {
    return SettingsConstants.themes;
  }

  public static getCursors(): SettingData[] {
    return SettingsConstants.cursors;
  }
}
