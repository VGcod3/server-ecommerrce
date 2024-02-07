const translit = (str: string) => {
  const ua =
    `A-Б-В-Г-Д-Е-Є-Ж-З-И-І-Ї-Й-К-Л-М-Н-О-П-Р-С-Т-У-Ф-Х-Ц-Ч-Ш-Щ-Ь-Ю-Я-а-б-в-г-д-е-є-ж-з-и-і-ї-й-к-л-м-н-о-п-р-с-т-у-ф-х-ц-ч-ш-щ-ь-ю-я`.split(
      `-`,
    );

  const en =
    `A-B-V-G-D-E-E-Zh-Z-I-I-J-K-L-M-N-O-P-R-S-T-U-F-Kh-C-Ch-Sh-Shch-Yu-Ya-a-b-v-g-d-e-je-zh-z-i-i-j-k-l-m-n-o-p-r-s-t-u-f-kh-c-ch-sh-shch-yu-ya`.split(
      `-`,
    );

  let res = '';

  for (let i = 0, l = str.length; i < l; i++) {
    const s = str.charAt(i),
      n = ua.indexOf(s);

    if (n >= 0) {
      res += en[n];
    } else {
      res += s;
    }
  }

  return res;
};

export const generateSlug = (str: string) => {
  let url: string = str.replace(/[\s]+/gi, '-');

  url = translit(url);

  url = url
    .replace(/[^0-9a-z_\-]+/gi, '')
    .replace('---', '-')
    .replace('--', '-')
    .toLowerCase();

  return url;
};
