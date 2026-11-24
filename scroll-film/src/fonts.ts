import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Google Fonts (OFL), bundled locally in public/fonts so renders never depend on the network.
export const HAND = 'Gochi Hand';
export const SERIF = 'Cormorant Garamond';

loadFont({family: HAND, url: staticFile('fonts/GochiHand.woff2'), weight: '400'});
loadFont({family: SERIF, url: staticFile('fonts/Cormorant-400.woff2'), weight: '400'});
loadFont({family: SERIF, url: staticFile('fonts/Cormorant-600.woff2'), weight: '600'});
loadFont({family: SERIF, url: staticFile('fonts/Cormorant-400i.woff2'), weight: '400', style: 'italic'});
