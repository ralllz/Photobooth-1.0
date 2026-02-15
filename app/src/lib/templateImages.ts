// Import all template images explicitly to ensure they're bundled for production
import strip4 from '../../public/templates/strip4.png';
import polaroid from '../../public/templates/polaroid.png';
import filmstrip from '../../public/templates/filmstrip.png';
import scrapbook from '../../public/templates/scrapbook.png';
import pastel from '../../public/templates/pastel.png';
import newspaper from '../../public/templates/newspaper.png';
import love from '../../public/templates/love.png';
import birthday from '../../public/templates/birthday.png';
import sakura from '../../public/templates/sakura.png';
import unicorn from '../../public/templates/unicorn.png';
import summer from '../../public/templates/summer.png';
import catpaw from '../../public/templates/catpaw.png';
import galaxy from '../../public/templates/galaxy.png';
import scrap5 from '../../public/templates/scrap5.png';
import dreamy3 from '../../public/templates/dreamy3.png';
import retro90s from '../../public/templates/retro90s.png';
import cottagecore from '../../public/templates/cottagecore.png';
import y2k from '../../public/templates/y2k.png';

export const templateImageMap: Record<string, string> = {
  'strip4.png': strip4,
  'polaroid.png': polaroid,
  'filmstrip.png': filmstrip,
  'scrapbook.png': scrapbook,
  'pastel.png': pastel,
  'newspaper.png': newspaper,
  'love.png': love,
  'birthday.png': birthday,
  'sakura.png': sakura,
  'unicorn.png': unicorn,
  'summer.png': summer,
  'catpaw.png': catpaw,
  'galaxy.png': galaxy,
  'scrap5.png': scrap5,
  'dreamy3.png': dreamy3,
  'retro90s.png': retro90s,
  'cottagecore.png': cottagecore,
  'y2k.png': y2k,
};

export const getTemplateImage = (filename: string): string => {
  return templateImageMap[filename] || `/templates/${filename}`;
};
