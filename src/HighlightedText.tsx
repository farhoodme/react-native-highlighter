import React from 'react';
import { Text, Pressable } from 'react-native';
import { splitText } from './utils';
import type { HighlighterProps } from './utils';
import {
  mentionRegexTester,
  hashtagRegexTester,
  emailRegexTester,
  urlRegexTester,
} from './regexes';
import type { TextStyle, TextProps } from 'react-native';

interface HighlightTextProps extends HighlighterProps, TextProps {
  hashtagStyle?: TextStyle;
  onHashtagPress?: (hashtag: string) => void;
  mentionStyle?: TextStyle;
  onMentionPress?: (mention: string) => void;
  emailStyle?: TextStyle;
  onEmailPress?: (email: string) => void;
  linkStyle?: TextStyle;
  onLinkPress?: (link: string) => void;
}

const renderChunk = (chunk: string, index: number, style: TextStyle, onPress?: (text: string) => void) => {
  if (onPress && onPress !== (() => {})) {
    return (
      <Pressable key={index} onPress={() => onPress(chunk)}>
        <Text style={style}>{chunk}</Text>
      </Pressable>
    );
  }
  return <Text key={index} style={style}>{chunk}</Text>;
};

const HighlightedText = ({
  children,
  highlights,
  caseSensitive,
  hashtags,
  hashtagStyle = { color: 'blue' },
  onHashtagPress,
  mentions,
  mentionStyle = { color: 'blue' },
  onMentionPress,
  emails,
  emailStyle = { color: 'blue' },
  onEmailPress,
  links,
  linkStyle = { color: 'blue' },
  onLinkPress,
  ...props
}: HighlightTextProps) => {
  let text = '';
  React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      text += child;
    }
  });
  const chunks = splitText({
    text,
    highlights,
    caseSensitive,
    hashtags,
    mentions,
    emails,
    links,
  });

  return (
    <Text {...props}>
      {chunks.map((chunk, index) => {
        let keyword: React.ReactNode | null = null;
        if (highlights) {
          highlights.forEach((item) => {
            const itemRegex = item.regexSource.length > 0
              ? new RegExp(`^${item.regexSource.join('|')}$`, caseSensitive ? 'gm' : 'gmi')
              : null;

            if (itemRegex && itemRegex.test(chunk)) {
              keyword = renderChunk(chunk, index, item.style, item.onPress);
            }
          });
        }
        if (hashtags && hashtagRegexTester.test(chunk)) {
          return renderChunk(chunk, index, hashtagStyle, onHashtagPress);
        }
        if (mentions && mentionRegexTester.test(chunk)) {
          return renderChunk(chunk, index, mentionStyle, onMentionPress);
        }
        if (emails && emailRegexTester.test(chunk)) {
          return renderChunk(chunk, index, emailStyle, onEmailPress);
        }
        if (links && urlRegexTester.test(chunk)) {
          return renderChunk(chunk, index, linkStyle, onLinkPress);
        }
        if (keyword) {
          return keyword;
        }
        return <Text key={index}>{chunk}</Text>;
      })}
    </Text>
  );
};

export default HighlightedText;
