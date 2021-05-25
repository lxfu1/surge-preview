const filterG2Plot = (code, index) => {
  return code
    .replace(`('container',`, `('container-${index}',`)
    .replace(/`/g, '(**)')
    .replace(/new\s+_g2plot\./g, 'new G2Plot.')
    .replace(/_g2plot\.G2\./g, 'G2Plot.G2.')
    .replace(/_g2plot\./g, 'G2Plot.')
    .replace(/\\n/g, '(_*_)')
    .replace(/\\/g, '(_**_)')
    .replace(`('container')`, `('container-${index}')`)
    .replace(/\$\{(\S*|\S*\/S*)\}/g, function (_, sign) {
      console.log(`s1${sign}s1`);
      return `s1${sign}s1`;
    });
};

const filterG2 = (code, index) => {
  try {
    return code
      .replace(/container\:\s+'\w+',/g, `container: 'container-${index}',`)
      .replace(
        /.getElementById\('container'\);/g,
        `.getElementById('container-${index}');`
      )
      .replace(/`/g, '(**)')
      .replace(/_g\./g, 'G2.')
      .replace(/\\n/g, '(_*_)')
      .replace(/\\/g, '(_**_)')
      .replace(/\$\{(\S*|\S*\/S*)\}/g, function (_, sign) {
        console.log(`s1${sign}s1`);
        return `s1${sign}s1`;
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  filterG2Plot,
  filterG2,
};
