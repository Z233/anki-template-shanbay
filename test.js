const fs = require('fs');
const AnkiExport = require('anki-apkg-export').default;

const apkg = new AnkiExport('deck-name');

apkg.addCard('card #1 front', 'card #1 back');
apkg.addCard('card #2 front', 'card #2 back', { tags: ['nice', 'better card'] });
apkg.addCard('card #3 with image <img src="anki.png" />', 'card #3 back');

apkg
  .save()
  .then(zip => {
    fs.writeFileSync('./output.apkg', zip, 'binary');
    console.log(`Package has been generated: output.pkg`);
  })
  .catch(err => console.log(err.stack || err));