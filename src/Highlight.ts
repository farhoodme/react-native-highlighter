import type { TextStyle } from 'react-native';

interface HighlightProps {
  keywords?: string[];
  style?: TextStyle;
  onPress?: (keyword: string) => void;
  className?: string;
}

export class Highlight {
  keywords: string[];
  style: TextStyle;
  onPress?: (keyword: string) => void;
  className?: string;
  regexSource: string[];

  constructor({
    keywords = [],
    style = {},
    onPress,
    className = '',
  }: HighlightProps) {
    this.keywords = keywords;
    this.style = style;
    this.onPress = onPress;
    this.className = className;
    this.regexSource = keywords.map(
      (keyword) => `(${keyword.replace(/"/g, '').trim()})`
    );
  }
}
