export interface EmotionalProfile {
  joy: number;
  sadness: number;
  anger: number;
  anxiety: number;
  gratefulness: number;
  confidence: number;
  neutral: number;
}

export interface SentimentResult {
  polarity: number; // -100 to +100
  label: string;
  emotions: EmotionalProfile;
  totalTokens: number;
}

// Lexical Dictionaries (Case-insensitive matching)
const JOY_WORDS = new Set([
  'happy',
  'joy',
  'love',
  'good',
  'great',
  'awesome',
  'wonderful',
  'amazing',
  'best',
  'nice',
  'beautiful',
  'cool',
  'thanks',
  'thank',
  'glad',
  'laugh',
  'haha',
  'lol',
  'lmfao',
  'rofl',
  'hehe',
  'superb',
  'excited',
  'exciting',
  'fantastic',
  'congrats',
  'congratulations',
  'perfect',
  'sweet',
  'yay',
  'hurray',
  'yippee',
  'win',
  'winning',
  'excellent',
  'fun',
  'funny',
  'pleased',
  'gladly',
  'celebrate',
  'celebrating',
  'party',
  'cheer',
  'cheerful',
  'smile',
  'smiling',
  'lovely',
  'wonderful',
  'dream',
  'dreamy',
  'hilarious',
]);

const SADNESS_WORDS = new Set([
  'sad',
  'sadder',
  'saddest',
  'hurt',
  'cry',
  'crying',
  'pain',
  'bad',
  'worst',
  'sorry',
  'unfortunately',
  'miss',
  'missing',
  'lonely',
  'broken',
  'tear',
  'tears',
  'upset',
  'hate',
  'die',
  'death',
  'lose',
  'lost',
  'losing',
  'fail',
  'failed',
  'failing',
  'failure',
  'weep',
  'weeping',
  'depressed',
  'depressing',
  'depression',
  'gloomy',
  'sorrow',
  'grief',
  'alone',
  'hurtful',
  'down',
  'terrible',
  'awful',
  'painful',
  'sadly',
  'regret',
  'regretful',
  'sigh',
]);

const ANGER_WORDS = new Set([
  'mad',
  'angry',
  'anger',
  'hate',
  'annoy',
  'annoyed',
  'annoying',
  'stupid',
  'dumb',
  'idiot',
  'wtf',
  'hell',
  'shut',
  'stop',
  'ugly',
  'aggressive',
  'fight',
  'fighting',
  'argue',
  'arguing',
  'argument',
  'crazy',
  'ridiculous',
  'crap',
  'shit',
  'damn',
  'hates',
  'hated',
  'furious',
  'rage',
  'pissed',
  'suck',
  'sucks',
  'fool',
  'garbage',
  'trash',
  'bullshit',
  'annoyance',
]);

const ANXIETY_WORDS = new Set([
  'worry',
  'worried',
  'worrying',
  'anxious',
  'anxiety',
  'nervous',
  'scare',
  'scared',
  'scaring',
  'afraid',
  'fear',
  'doubt',
  'doubting',
  'doubtful',
  'stress',
  'stressed',
  'stressful',
  'panic',
  'confused',
  'confuse',
  'confusion',
  'guess',
  'guessing',
  'maybe',
  'perhaps',
  'unsure',
  'trouble',
  'troubled',
  'scary',
  'spooky',
  'dread',
  'dreading',
  'dreadful',
  'shaking',
  'paranoid',
  'uncertain',
  'hesitant',
]);

const GRATEFULNESS_WORDS = new Set([
  'thank',
  'thanks',
  'thankful',
  'grateful',
  'appreciate',
  'appreciated',
  'appreciating',
  'appreciation',
  'kind',
  'kindness',
  'sweet',
  'love',
  'loved',
  'loving',
  'lovely',
  'help',
  'helped',
  'helping',
  'helpful',
  'supportive',
  'care',
  'cared',
  'caring',
  'bless',
  'blessed',
  'blessing',
  'blessings',
  'thoughtful',
  'generous',
  'warm',
  'warmth',
  'heartfelt',
]);

const CONFIDENCE_WORDS = new Set([
  'sure',
  'surely',
  'absolutely',
  'definitely',
  'clearly',
  'clear',
  'agree',
  'agreed',
  'agreeing',
  'true',
  'correct',
  'exactly',
  'fact',
  'facts',
  'proof',
  'resolve',
  'resolved',
  'will',
  'must',
  'know',
  'standard',
  'standards',
  'indeed',
  'certainly',
  'certain',
  'undoubtedly',
  'obviously',
  'positive',
  'convinced',
  'confirm',
  'confirmed',
]);

// Emoji maps
const EMOJI_TO_EMOTION: Record<
  string,
  keyof Omit<EmotionalProfile, 'neutral'>
> = {
  // Joy / Positive
  '😂': 'joy',
  '❤️': 'joy',
  '😍': 'joy',
  '😊': 'joy',
  '👍': 'joy',
  '😁': 'joy',
  '😆': 'joy',
  '😅': 'joy',
  '🥰': 'joy',
  '😘': 'joy',
  '🙌': 'joy',
  '🎉': 'joy',
  '😎': 'joy',
  '🤣': 'joy',
  '😃': 'joy',
  '😄': 'joy',
  '😋': 'joy',
  '😛': 'joy',
  '😜': 'joy',
  '🤪': 'joy',
  '🥳': 'joy',
  '😺': 'joy',
  '😸': 'joy',
  '😹': 'joy',
  '👌': 'joy',
  '🔥': 'joy',
  '✨': 'joy',
  '🌈': 'joy',
  '🎈': 'joy',
  '🍻': 'joy',
  '🤩': 'joy',
  '🌟': 'joy',
  '💕': 'joy',
  '💖': 'joy',
  '💗': 'joy',
  '💘': 'joy',

  // Sadness
  '😢': 'sadness',
  '😭': 'sadness',
  '😞': 'sadness',
  '😔': 'sadness',
  '💔': 'sadness',
  '😿': 'sadness',
  '😟': 'sadness',
  '🥺': 'sadness',
  '🙁': 'sadness',
  '☹️': 'sadness',
  '😩': 'sadness',
  '😫': 'sadness',
  '🥀': 'sadness',
  '🌧️': 'sadness',

  // Anger
  '😠': 'anger',
  '😡': 'anger',
  '🤬': 'anger',
  '👿': 'anger',
  '😤': 'anger',
  '😒': 'anger',
  '🙄': 'anger',
  '🖕': 'anger',
  '👊': 'anger',
  '👎': 'anger',

  // Anxiety / Worry / Doubt
  '😰': 'anxiety',
  '😨': 'anxiety',
  '😱': 'anxiety',
  '😬': 'anxiety',
  '😐': 'anxiety',
  '😕': 'anxiety',
  '🤔': 'anxiety',
  '😓': 'anxiety',
  '👻': 'anxiety',
  '🫣': 'anxiety',
  '🫨': 'anxiety',
  '🫠': 'anxiety',
  '❓': 'anxiety',

  // Gratefulness
  '🙏': 'gratefulness',
  '🌹': 'gratefulness',
  '🤝': 'gratefulness',
  '💝': 'gratefulness',
  '💌': 'gratefulness',

  // Confidence
  '💯': 'confidence',
  '✅': 'confidence',
  '💪': 'confidence',
  '🎯': 'confidence',
  '👑': 'confidence',
  '⭐': 'confidence',
  '🧿': 'confidence',
};

export function analyzeMessageSentiment(text: string): {
  joy: number;
  sadness: number;
  anger: number;
  anxiety: number;
  gratefulness: number;
  confidence: number;
  posWords: number;
  negWords: number;
} {
  const result = {
    joy: 0,
    sadness: 0,
    anger: 0,
    anxiety: 0,
    gratefulness: 0,
    confidence: 0,
    posWords: 0,
    negWords: 0,
  };

  if (!text) return result;

  // Clean and parse text tokens
  const cleanText = text.toLowerCase();
  const tokens = cleanText
    .replace(/[^\w\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  tokens.forEach(tok => {
    if (JOY_WORDS.has(tok)) {
      result.joy += 1;
      result.posWords += 1;
    }
    if (SADNESS_WORDS.has(tok)) {
      result.sadness += 1;
      result.negWords += 1;
    }
    if (ANGER_WORDS.has(tok)) {
      result.anger += 1;
      result.negWords += 1;
    }
    if (ANXIETY_WORDS.has(tok)) {
      result.anxiety += 1;
    }
    if (GRATEFULNESS_WORDS.has(tok)) {
      result.gratefulness += 1;
      result.posWords += 1;
    }
    if (CONFIDENCE_WORDS.has(tok)) {
      result.confidence += 1;
      result.posWords += 1;
    }
  });

  // Check code points for emojis (using regex or char scanner)
  // Let's iterate over characters and substrings of the original text
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    // Check single character emoji
    if (EMOJI_TO_EMOTION[char]) {
      const category = EMOJI_TO_EMOTION[char];
      result[category] += 1.5; // Emojis are weighted slightly higher
      if (
        category === 'joy' ||
        category === 'gratefulness' ||
        category === 'confidence'
      ) {
        result.posWords += 1.5;
      } else if (category === 'sadness' || category === 'anger') {
        result.negWords += 1.5;
      }
    }
    // Check surrogate pairs (common for newer emojis)
    if (i < text.length - 1) {
      const surrogatePair = text.substring(i, i + 2);
      if (EMOJI_TO_EMOTION[surrogatePair]) {
        const category = EMOJI_TO_EMOTION[surrogatePair];
        result[category] += 1.5;
        if (
          category === 'joy' ||
          category === 'gratefulness' ||
          category === 'confidence'
        ) {
          result.posWords += 1.5;
        } else if (category === 'sadness' || category === 'anger') {
          result.negWords += 1.5;
        }
        i += 1; // skip next character
      }
    }
  }

  return result;
}

export function computeOverallSentiment(
  posCount: number,
  negCount: number,
): { polarity: number; label: string } {
  const sum = posCount + negCount;
  if (sum === 0) return { polarity: 0, label: 'Neutral & Balanced' };

  // Polarity from -100 to +100
  const polarity = Math.round(((posCount - negCount) / sum) * 100);

  let label = 'Balanced';
  if (polarity > 60) label = 'Highly Positive';
  else if (polarity > 20) label = 'Mostly Positive';
  else if (polarity < -60) label = 'Highly Negative';
  else if (polarity < -20) label = 'Mostly Negative';

  return { polarity, label };
}
