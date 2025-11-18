import { Font } from '@react-pdf/renderer';
import NotoSansKRBlack from '../fonts/NotoSansKR-Black.ttf';
import NotoSansKRBold from '../fonts/NotoSansKR-Bold.ttf';

Font.register({
  family: 'NotoSansKR',
  fonts: [
    { src: NotoSansKRBlack, fontWeight: 'normal' },
    { src: NotoSansKRBold, fontWeight: 'bold' }
  ]
});