const asset = name => `${process.env.PUBLIC_URL}/experience/${name}`;

export const worldAssets = {
  cleaner: asset('cleaner-media-atlas.webp'),
  resumes: ['atlas', 'verso', 'oxford', 'chronicle'].map(name => asset(`resume-${name}.webp`)),
  gameplay: asset('sugarshifts-gameplay.webp'),
};

export const showcases = {
  resumestudio: {
    title: 'ResumeStudio templates',
    action: 'View sample résumés',
    images: ['Atlas', 'Verso', 'Oxford', 'Chronicle'].map((name, index) => ({
      src: worldAssets.resumes[index],
      alt: `${name} résumé template, rendered by ResumeStudio with Avery Sample’s fictional career profile`,
      caption: `${name} · Sample résumé`,
      width: 640,
      height: 905,
    })),
  },
  sugarshifts: {
    title: 'SugarShifts gameplay',
    action: 'View gameplay',
    images: [{
      src: worldAssets.gameplay,
      alt: 'SugarShifts gameplay in Gummy Glasshouse, with a shaped fruit board, goals, moves and boosters',
      caption: 'Gummy Glasshouse · In-app capture',
      width: 720,
      height: 1565,
    }],
  },
};
