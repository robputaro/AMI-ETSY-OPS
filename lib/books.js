// First standalone Etsy product master. Artwork URLs stay empty until an approved character edition is loaded.
export const BOOKS = [{
  id: 'BOOK_001',
  slug: 'hidden-door',
  titleTemplate: '[CHILD_NAME] and the Hidden Door',
  catalogTitle: 'The Hidden Door',
  trim: '8.5x8.5',
  audience: 'Ages 3–6',
  manuscriptVersion: 'v1.0',
  characters: [{ id:'A01', label:'Curly Blonde', status:'development' }],
  pages: [
    ` [CHILD_NAME] noticed the door while looking for a missing garden glove.\n\nIt was tucked beneath the lavender, where there had only ever been dirt and roots before.\n\nThe door was green.\n\nThe handle was brass.\n\nAnd it was just big enough for Pip.\n\n“Was that there yesterday?” [CHILD_NAME] asked.\n\nPip stared at it.\n\n“No.”`,
    `They crouched beside it.\n\nFrom somewhere on the other side came the faintest sound.\n\nMusic.\n\nThen laughter.\n\nThen something that sounded very much like a bell.\n\nPip tilted his head.\n\n“We probably shouldn’t open mysterious little doors.”\n\n[CHILD_NAME] reached for the handle.\n\n“Probably not.”`,
    `The door swung inward.\n\nWarm light spilled through the lavender.\n\n[CHILD_NAME] leaned closer—\n\nand the garden disappeared.\n\nFor one strange second there was nothing but wind and golden light.\n\nThen both feet landed softly on a stone path.\n\nPip landed beside them.\n\nNeither of them said anything.\n\nThere was too much to look at.`,
    `Tiny houses climbed the roots of enormous trees.\n\nNarrow bridges crossed a stream no wider than a sidewalk.\n\nBright ribbons stretched from rooftop to rooftop.\n\nLanterns hung everywhere—above windows, along paths, even from the little boats drifting past.\n\nPip looked up at [CHILD_NAME].\n\n“Did you know this was here?”\n\n“No.”\n\n“Good.”\n\nPip looked around again.\n\n“Me neither.”`,
    `They followed the stone path toward the music.\n\nEveryone they passed seemed to be carrying something.\n\nBaskets of bread.\n\nBundles of flowers.\n\nPainted signs.\n\nLong strings of paper stars.\n\nA small woman balancing six lanterns stopped when she saw them.\n\n“Oh!” she said. “Visitors.”\n\nThen she smiled.\n\n“You picked a very good day.”`,
    `“Tonight is the Great Gathering,” she explained.\n\n“Once a year, everyone comes in from the hills, the gardens, the stream, everywhere.”\n\nShe pointed toward a wide square ahead.\n\nAt its center stood a lantern made from hundreds of colored pieces of glass.\n\nIt was beautiful.\n\nAnd completely dark.\n\nThe woman’s smile faded.\n\n“Although we do have one problem.”`,
    `“The First Lantern is always lit before sunset,” she said.\n\n“Once it shines, every lantern road leading here is lit from one end to the other.”\n\n“And tonight?” [CHILD_NAME] asked.\n\n“We can’t find Moss.”\n\n“Moss?” said Pip.\n\n“The lantern keeper.”\n\nThe woman glanced toward the sinking sun.\n\n“He was here this morning.”`,
    `A man carrying a fiddle remembered seeing Moss near the bridge.\n\nThe baker had seen him pass the ovens after that.\n\nSomeone else thought he had headed toward the stream.\n\nBut [CHILD_NAME] noticed something none of them mentioned.\n\nAt the edge of the square, one lantern was dark.\n\nSo was the next one.\n\nAnd the next.\n\nA line of unlit lanterns disappeared around the corner.`,
    `[CHILD_NAME] pointed.\n\n“Maybe Moss went that way.”\n\nPip looked at the dark lanterns.\n\nThen at [CHILD_NAME].\n\n“That makes more sense than asking everyone again.”\n\nThey followed the unlit road out of the square.\n\nPast little shops with open windows.\n\nAcross a bright red bridge.\n\nAlong the stream, where tiny boats were being tied up for the evening.`,
    `The farther they went, the quieter it became.\n\nSoon the music was only a small sound behind them.\n\nThe dark lanterns curved through a meadow and toward a low hill.\n\nAnd there, beside the path, they finally found Moss.\n\nHe wore muddy boots and a green coat.\n\nHis hair stuck out in every direction.\n\nHe was standing with both hands on his hips, staring at a fallen tree branch.`,
    `The branch had crashed across the lantern road.\n\nTwo posts were bent.\n\nOne lantern had fallen into the grass.\n\nBeyond them, the road continued over the hill toward a cluster of little homes in the distance.\n\nMoss looked surprised to see them.\n\n“Are you here for the Gathering?”\n\n“We were,” said Pip.\n\n“Everyone is looking for you.”\n\nMoss blinked.\n\n“Oh.”`,
    `Moss had been repairing the lanterns since morning.\n\n“If this road stays dark,” he explained, “the families beyond the hill won’t know the way once the sun goes down.”\n\nHe had fixed almost everything.\n\nAlmost.\n\nThe branch was simply too heavy.\n\nMoss pushed against it again.\n\nIt did not move.\n\n[CHILD_NAME] stepped beside him.\n\n“Can I try?”`,
    `For Moss, the branch was enormous.\n\nFor [CHILD_NAME], it was still heavy—but not impossible.\n\nPip wedged himself beside a smaller limb.\n\nMoss grabbed the other end.\n\n“One, two, three!”\n\nThey pushed.\n\nThe branch scraped across the grass.\n\nA little farther.\n\nA little farther—\n\nuntil the lantern road was clear.`,
    `Moss worked quickly.\n\nHe straightened the last post and lifted the fallen lantern back onto its hook.\n\nThen he touched a tiny flame to the wick.\n\nOne lantern glowed.\n\nThen the next.\n\nThen another.\n\nWarm lights stretched over the hill, one after another, until the distant houses began opening their doors.\n\nMoss grinned.\n\n“Now we can go.”`,
    `They reached the square just as the sun slipped behind the trees.\n\nThe crowd grew quiet as Moss stepped toward the great glass lantern.\n\nHe raised the little flame.\n\nAnd the First Lantern came alive.\n\nGold and green and red light spilled across the square.\n\nMusic started.\n\nThe bridges glowed.\n\nLanterns floated along the stream.\n\nAnd from every road, more people came walking toward the Great Gathering.`,
    `Much later, [CHILD_NAME] and Pip found the little green door again.\n\nThey stepped through—\n\nand landed beneath the lavender.\n\nThe garden looked exactly the same.\n\nAlmost.\n\nBeside the missing glove lay a tiny glass lantern, no bigger than an acorn.\n\nPip picked up the glove.\n\n[CHILD_NAME] picked up the lantern.\n\n“Think the door will come back?”\n\nPip looked toward the lavender.\n\n“I hope so.”\n\nAnd from somewhere very far away, a little bell rang.`
  ].map((text,i)=>({ pageNumber:i+1, text:text.trim(), textZone: i % 3 === 0 ? 'upper-right' : i % 3 === 1 ? 'upper-left' : 'lower-left' }))
}];

export function getBook(slug='hidden-door') { return BOOKS.find(b=>b.slug===slug) || null; }
export function personalize(text, order) {
  return String(text || '').replaceAll('[CHILD_NAME]', order.child_name || '[CHILD_NAME]');
}
