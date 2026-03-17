import 'react-native';

declare module 'react-native' {
  interface TextProps {
    /** Android-specific prop to include extra font padding. */
    includeFontPadding?: boolean;
  }
}
