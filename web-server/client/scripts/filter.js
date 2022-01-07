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
        return `s1${sign}s1`;
      });
  } catch (err) {
    console.log(err);
  }
};

const filterG = (code, index) => {
  try {
    return code
      .replace(/container\:\s+'\w+',/g, `container: 'container-${index}',`)
      .replace(
        /.getElementById\('container'\);/g,
        `.getElementById('container-${index}');`
      )
      .replace(/`/g, '(**)')
      .replace(/\_gCanvas\./g, 'G.Canvas2D.')
      .replace(/\_gWebgl\./g, 'G.WebGL.')
      .replace(/\_gSvg\./g, 'G.SVG.')
      .replace(/\_gPlugin3d\./g, `G['3D'].`)
      .replace(/\_gPluginCssSelect\./g, 'G.CSSSelect.')
      .replace(/\_gPluginControl\./g, 'G.Control.')
      .replace(/\_gComponents\./g, 'G.Components.')
      .replace(/\_stats\.default/g, 'Stats')
      .replace(/\_hammerjs\.default/g, 'Hammer')
      .replace(/\_interactjs\.default/g, 'interact')
      .replace(/\_g\./g, 'G.')
      .replace(/\\n/g, '(_*_)')
      .replace(/\\/g, '(_**_)')
      .replace(/\$\{(\S*|\S*\/S*)\}/g, function (_, sign) {
        return `s1${sign}s1`;
      });
  } catch (err) {
    console.log(err);
  }
};

const filterAntDesignCharts = (code, index) => {
  try {
    return code
      .replace(
        /getElementById\('container'\)/g,
        `getElementById('container-${index}')`
      )
      .replace(/`/g, '(**)')
      .replace(/\_maps\./g, 'Maps.')
      .replace(/\_graphs\./g, 'Graphs.')
      .replace(/\_plots\./g, 'Plots.')
      .replace(/\_flowchart\./g, 'Flowchart.')
      .replace(/fetch\(/g, 'window.fetch(')
      .replace(/\_react\.default\./g, 'React.')
      .replace(/\_react\./g, 'React.')
      .replace(/\_reactDom\.default\./g, 'ReactDOM.')
      .replace(/\_dataSet\./g, 'DataSet.')
      .replace(/\\n/g, '(_*_)')
      .replace(/\\/g, '(_**_)')
      .replace(/\$\{(\S*|\S*\/S*)\}/g, function (_, sign) {
        return `s1${sign}s1`;
      });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  filterG2Plot,
  filterG2,
  filterG,
  filterAntDesignCharts,
};
