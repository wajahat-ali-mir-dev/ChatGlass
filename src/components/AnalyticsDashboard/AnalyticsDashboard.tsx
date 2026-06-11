import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { messagesAtom, participantsAtom } from '../../stores/global';
import { authorColors } from '../../utils/colors';
import {
  analyzeMessageSentiment,
  computeOverallSentiment,
} from '../../utils/sentiment';
import * as S from './style';

const stopwords = new Set([
  'the',
  'be',
  'to',
  'of',
  'and',
  'a',
  'in',
  'that',
  'have',
  'i',
  'it',
  'for',
  'not',
  'on',
  'with',
  'he',
  'as',
  'you',
  'do',
  'at',
  'this',
  'but',
  'his',
  'by',
  'from',
  'they',
  'we',
  'say',
  'her',
  'she',
  'or',
  'an',
  'will',
  'my',
  'one',
  'all',
  'would',
  'there',
  'their',
  'what',
  'so',
  'up',
  'out',
  'if',
  'about',
  'who',
  'get',
  'which',
  'go',
  'me',
  'when',
  'make',
  'can',
  'like',
  'time',
  'no',
  'just',
  'him',
  'know',
  'take',
  'people',
  'into',
  'year',
  'your',
  'good',
  'some',
  'could',
  'them',
  'see',
  'other',
  'than',
  'then',
  'now',
  'look',
  'only',
  'come',
  'its',
  'over',
  'think',
  'also',
  'back',
  'after',
  'use',
  'two',
  'how',
  'our',
  'work',
  'first',
  'well',
  'way',
  'even',
  'new',
  'want',
  'because',
  'any',
  'these',
  'give',
  'day',
  'most',
  'us',
  'me',
  'my',
  'myself',
  'we',
  'our',
  'ours',
  'ourselves',
  'you',
  "you're",
  "you've",
  "you'll",
  "you'd",
  'your',
  'yours',
  'yourself',
  'yourselves',
  'he',
  'him',
  'his',
  'himself',
  'she',
  "she's",
  'her',
  'hers',
  'herself',
  'it',
  "it's",
  'its',
  'itself',
  'they',
  'them',
  'their',
  'theirs',
  'themselves',
  'what',
  'which',
  'who',
  'whom',
  'this',
  'that',
  "that'll",
  'these',
  'those',
  'am',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'having',
  'do',
  'does',
  'did',
  'doing',
  'a',
  'an',
  'the',
  'and',
  'but',
  'if',
  'or',
  'because',
  'as',
  'until',
  'while',
  'of',
  'at',
  'by',
  'for',
  'with',
  'about',
  'against',
  'between',
  'into',
  'through',
  'during',
  'before',
  'after',
  'above',
  'below',
  'to',
  'from',
  'up',
  'down',
  'in',
  'out',
  'on',
  'off',
  'over',
  'under',
  'again',
  'further',
  'then',
  'once',
  'here',
  'there',
  'when',
  'where',
  'why',
  'how',
  'all',
  'any',
  'both',
  'each',
  'few',
  'more',
  'most',
  'other',
  'some',
  'such',
  'no',
  'nor',
  'not',
  'only',
  'own',
  'same',
  'so',
  'than',
  'too',
  'very',
  's',
  't',
  'can',
  'will',
  'just',
  'don',
  "don't",
  'should',
  "should've",
  'now',
  'd',
  'll',
  'm',
  'o',
  're',
  've',
  'y',
  'ain',
  'aren',
  "aren't",
  'couldn',
  "couldn't",
  'didn',
  "didn't",
  'doesn',
  "doesn't",
  'hadn',
  "hadn't",
  'hasn',
  "hasn't",
  'haven',
  "haven't",
  'isn',
  "isn't",
  'ma',
  'mightn',
  "mightn't",
  'mustn',
  "mustn't",
  'needn',
  "needn't",
  'shan',
  "shan't",
  'shouldn',
  "shouldn't",
  'wasn',
  "wasn't",
  'weren',
  "weren't",
  'won',
  "won't",
  'wouldn',
  "wouldn't",
  'omitted',
  'media',
]);

// Helper to format duration in seconds to readable string
const formatDuration = (seconds: number) => {
  if (seconds <= 0) return 'N/A';
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ${seconds % 60}s`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
};

// Personality archetype classifier based on conversational metrics
const getArchetype = (
  name: string,
  avgDelaySec: number,
  doubleTextsCount: number,
  initiationCount: number,
  curiosityPercent: number,
  totalMsg: number,
) => {
  if (totalMsg < 5) {
    return {
      title: 'The Quiet Observer',
      desc: 'Responds occasionally, mostly reading without dominating the discussion or double-texting.',
    };
  }

  const doubleTextRatio = doubleTextsCount / totalMsg;

  if (avgDelaySec > 0 && avgDelaySec < 120) {
    return {
      title: 'The Rapid Fire Replier',
      desc: 'Responds within 2 minutes on average. Highly enthusiastic, actively keeps the conversation flowing, and rarely leaves anyone waiting.',
    };
  }
  if (curiosityPercent > 15) {
    return {
      title: 'The Inquisitive Mind',
      desc: 'Asks a high percentage of questions (over 15% of messages). Focused on learning more about others and driving engagement.',
    };
  }
  if (doubleTextRatio > 0.18) {
    return {
      title: 'The Machine Gunner',
      desc: 'Sends thoughts in quick consecutive bursts (double-texts frequently) rather than aggregating them into single paragraphs.',
    };
  }
  if (initiationCount > 10 && initiationCount > totalMsg * 0.08) {
    return {
      title: 'The Spark Ignition',
      desc: 'Frequently initiates conversation threads after periods of silence. Keeps the connection alive over long gaps.',
    };
  }
  if (avgDelaySec > 1800) {
    return {
      title: 'The Reflective Outbox',
      desc: 'Replies take over 30 minutes on average. Prefers crafting deliberate, thoughtful messages rather than engaging in rapid exchanges.',
    };
  }

  return {
    title: 'The Balanced Anchor',
    desc: 'Maintains steady conversational rhythms. Replies at a moderate speed, double-texts occasionally, and balances talking with listening.',
  };
};

function AnalyticsDashboard() {
  const messages = useAtomValue(messagesAtom);
  const participants = useAtomValue(participantsAtom);
  const [subTab, setSubTab] = useState<
    'overview' | 'psychology' | 'dossier' | 'prediction' | 'trends'
  >('overview');
  const [selectedDossierUser, setSelectedDossierUser] = useState<string>('');

  const colorMap = useMemo(
    () =>
      participants.reduce<Record<string, string>>(
        (obj, participant, i) => ({
          ...obj,
          [participant]: authorColors[i % authorColors.length],
        }),
        {},
      ),
    [participants],
  );

  const stats = useMemo(() => {
    const totalMessages = messages.length;
    let totalWords = 0;
    let totalMedia = 0;
    let totalLinks = 0;

    const userCounts: Record<string, { messages: number; words: number }> = {};
    const hourlyDistribution = Array(24).fill(0);
    const dailyDistribution = Array(7).fill(0);
    const wordFrequencies: Record<string, number> = {};

    // In-depth psychology trackers
    const responseDelays: Record<string, { total: number; count: number }> = {};
    const doubleTexts: Record<string, number> = {};
    const initiations: Record<string, number> = {};
    const questionCounts: Record<string, number> = {};

    // Probability matrices for prediction
    const replySpeedByHour: Record<
      number,
      { fastReplies: number; totalReplies: number }
    > = {};

    // New Advanced trackers
    const posWordsCount: Record<string, number> = {};
    const negWordsCount: Record<string, number> = {};
    const emotionalProfiles: Record<
      string,
      {
        joy: number;
        sadness: number;
        anger: number;
        anxiety: number;
        gratefulness: number;
        confidence: number;
      }
    > = {};
    const uniqueWordSets: Record<string, Set<string>> = {};
    const userHourlyDistribution: Record<string, number[]> = {};
    const userResponseDelaysList: Record<string, number[]> = {};

    // Persona trackers
    const apologyCount: Record<string, number> = {};
    const exclamationCount: Record<string, number> = {};
    const allLowercaseCount: Record<string, number> = {};
    const capitalizedCount: Record<string, number> = {};
    const emojiCount: Record<string, number> = {};

    // Interaction Matrix: key1 is speaker, key2 is target they reply to
    const interactCount: Record<string, Record<string, number>> = {};
    const interactDelay: Record<
      string,
      Record<string, { total: number; count: number }>
    > = {};
    const doubleTextsTrigger: Record<string, Record<string, number>> = {};
    const userReplySpeedByHour: Record<
      string,
      Record<number, { fastReplies: number; totalReplies: number }>
    > = {};

    // Initialize trackers for each user
    const allUsers = participants.concat('System Messages');
    allUsers.forEach(p => {
      responseDelays[p] = { total: 0, count: 0 };
      doubleTexts[p] = 0;
      initiations[p] = 0;
      questionCounts[p] = 0;
      userCounts[p] = { messages: 0, words: 0 };

      // Advanced initializers
      posWordsCount[p] = 0;
      negWordsCount[p] = 0;
      emotionalProfiles[p] = {
        joy: 0,
        sadness: 0,
        anger: 0,
        anxiety: 0,
        gratefulness: 0,
        confidence: 0,
      };
      uniqueWordSets[p] = new Set<string>();
      userHourlyDistribution[p] = Array(24).fill(0);
      userResponseDelaysList[p] = [];

      // Persona initializers
      apologyCount[p] = 0;
      exclamationCount[p] = 0;
      allLowercaseCount[p] = 0;
      capitalizedCount[p] = 0;
      emojiCount[p] = 0;

      interactCount[p] = {};
      interactDelay[p] = {};
      doubleTextsTrigger[p] = {};
      userReplySpeedByHour[p] = {};
      for (let hr = 0; hr < 24; hr += 1) {
        userReplySpeedByHour[p][hr] = { fastReplies: 0, totalReplies: 0 };
      }

      allUsers.forEach(other => {
        interactCount[p][other] = 0;
        interactDelay[p][other] = { total: 0, count: 0 };
        doubleTextsTrigger[p][other] = 0;
      });
    });

    for (let hr = 0; hr < 24; hr += 1) {
      replySpeedByHour[hr] = { fastReplies: 0, totalReplies: 0 };
    }

    let lastAuthor: string | null = null;
    let lastTimestamp: number | null = null;
    let lastDifferentAuthor: string | null = null;

    messages.forEach(m => {
      const author = m.author || 'System Messages';
      const timestamp = m.date.getTime();

      // Hourly & Weekday distributions
      const hour = m.date.getHours();
      const day = m.date.getDay();
      hourlyDistribution[hour] += 1;
      dailyDistribution[day] += 1;

      // User hourly distribution
      if (userHourlyDistribution[author]) {
        userHourlyDistribution[author][hour] += 1;
      }

      // Message counts
      userCounts[author].messages += 1;

      // Word count, questions & word frequencies
      if (m.message) {
        const cleanMsg = m.message.toLowerCase().replace(/[^\w\s]/g, ' ');
        const tokens = cleanMsg.trim().split(/\s+/).filter(Boolean);
        const wordsCount = tokens.length;
        totalWords += wordsCount;
        userCounts[author].words += wordsCount;

        // Sentiment & Emotions analysis
        const sentimentResult = analyzeMessageSentiment(m.message);
        posWordsCount[author] += sentimentResult.posWords;
        negWordsCount[author] += sentimentResult.negWords;
        emotionalProfiles[author].joy += sentimentResult.joy;
        emotionalProfiles[author].sadness += sentimentResult.sadness;
        emotionalProfiles[author].anger += sentimentResult.anger;
        emotionalProfiles[author].anxiety += sentimentResult.anxiety;
        emotionalProfiles[author].gratefulness += sentimentResult.gratefulness;
        emotionalProfiles[author].confidence += sentimentResult.confidence;

        // Unique words tracking
        tokens.forEach(tok => {
          if (tok.length > 2) {
            uniqueWordSets[author].add(tok);
            if (!stopwords.has(tok)) {
              wordFrequencies[tok] = (wordFrequencies[tok] || 0) + 1;
            }
          }
        });

        // Links check
        if (/https?:\/\/[^\s]+/.test(m.message)) {
          totalLinks += 1;
        }

        // Questions check
        if (m.message.includes('?')) {
          questionCounts[author] += 1;
        }

        // Persona & Style details scanning
        // Emojis check
        let userEmojiCount = 0;
        for (let i = 0; i < m.message.length; i += 1) {
          const char = m.message[i];
          const cp = char.codePointAt(0);
          if (
            cp &&
            ((cp >= 0x1f300 && cp <= 0x1f9ff) ||
              (cp >= 0x2600 && cp <= 0x27bf) ||
              cp === 0x2764 ||
              cp === 0x1f200)
          ) {
            userEmojiCount += 1;
          }
        }
        emojiCount[author] += userEmojiCount;

        // Capitalization checks
        const hasLowercase = /[a-z]/.test(m.message);
        const hasUppercase = /[A-Z]/.test(m.message);
        if (hasLowercase && !hasUppercase) {
          allLowercaseCount[author] += 1;
        }
        const trimmed = m.message.trim();
        if (trimmed.length > 0 && /^[A-Z]/.test(trimmed)) {
          capitalizedCount[author] += 1;
        }

        // Exclamations
        if (m.message.includes('!')) {
          exclamationCount[author] += 1;
        }

        // Apologies check
        const apologyWords = [
          'sorry',
          'apologize',
          'apologized',
          'apology',
          'apologies',
          'pardon',
          'excuse',
        ];
        const hasApology = tokens.some(tok => apologyWords.includes(tok));
        if (hasApology) {
          apologyCount[author] += 1;
        }
      }

      // Media check
      if (m.attachment) {
        totalMedia += 1;
      }

      // Conversational dynamics math (response delay, double texting, initiations)
      if (lastAuthor !== null && lastTimestamp !== null) {
        const delay = timestamp - lastTimestamp;
        if (delay > 0) {
          if (lastAuthor !== author) {
            // Conversational response (gap under 18 hours)
            if (delay < 18 * 60 * 60 * 1000) {
              responseDelays[author].total += delay;
              responseDelays[author].count += 1;

              // Standard deviation delays list
              userResponseDelaysList[author].push(delay / 1000);

              // Interaction Matrix delay
              interactCount[author][lastAuthor] += 1;
              interactDelay[author][lastAuthor].total += delay;
              interactDelay[author][lastAuthor].count += 1;

              // Reply probability by hour
              const previousHour = new Date(lastTimestamp).getHours();
              replySpeedByHour[previousHour].totalReplies += 1;
              if (delay < 15 * 60 * 1000) {
                // Replied in under 15 minutes
                replySpeedByHour[previousHour].fastReplies += 1;
              }

              // Reply probability by hour per user
              userReplySpeedByHour[author][previousHour].totalReplies += 1;
              if (delay < 15 * 60 * 1000) {
                userReplySpeedByHour[author][previousHour].fastReplies += 1;
              }
            } else {
              // Gap over 18 hours is a conversation initiation
              initiations[author] += 1;
            }
          } else if (delay > 5 * 60 * 1000) {
            doubleTexts[author] += 1;

            if (lastDifferentAuthor && lastDifferentAuthor !== author) {
              doubleTextsTrigger[author][lastDifferentAuthor] += 1;
            }
          }
        }
      } else {
        // First message of the log is an initiation
        initiations[author] += 1;
      }

      if (lastAuthor !== author) {
        lastDifferentAuthor = lastAuthor;
      }
      lastAuthor = author;
      lastTimestamp = timestamp;
    });

    // Format participant leaderboard details
    const participantStatsList = Object.entries(userCounts)
      .map(([name, data]) => {
        // Chronotype computation
        const hourDistribution =
          userHourlyDistribution[name] || Array(24).fill(0);
        const totalUserMsgs = data.messages;

        let chronotype = 'Balanced';
        let nocturnalRatio = 0;

        if (totalUserMsgs > 0) {
          const nocturnalCount = [22, 23, 0, 1, 2, 3, 4, 5].reduce(
            (sum, h) => sum + hourDistribution[h],
            0,
          );
          nocturnalRatio = Math.round((nocturnalCount / totalUserMsgs) * 100);

          const earlyBirdCount = [4, 5, 6, 7, 8].reduce(
            (sum, h) => sum + hourDistribution[h],
            0,
          );
          const businessCount = [9, 10, 11, 12, 13, 14, 15, 16].reduce(
            (sum, h) => sum + hourDistribution[h],
            0,
          );
          const eveningCount = [17, 18, 19, 20, 21].reduce(
            (sum, h) => sum + hourDistribution[h],
            0,
          );

          if (nocturnalRatio > 25) {
            chronotype = 'Night Owl 🦉';
          } else if (earlyBirdCount / totalUserMsgs > 0.2) {
            chronotype = 'Early Bird 🌅';
          } else if (businessCount / totalUserMsgs > 0.45) {
            chronotype = 'Business Hours 💼';
          } else if (eveningCount / totalUserMsgs > 0.4) {
            chronotype = 'Evening Active 🌆';
          }
        }

        // Sentiment details
        const pos = posWordsCount[name] || 0;
        const neg = negWordsCount[name] || 0;
        const { polarity, label: sentimentLabel } = computeOverallSentiment(
          pos,
          neg,
        );

        // Emotional profile percentiles
        const rawEmotions = emotionalProfiles[name] || {
          joy: 0,
          sadness: 0,
          anger: 0,
          anxiety: 0,
          gratefulness: 0,
          confidence: 0,
        };
        const emotionSum =
          rawEmotions.joy +
          rawEmotions.sadness +
          rawEmotions.anger +
          rawEmotions.anxiety +
          rawEmotions.gratefulness +
          rawEmotions.confidence;

        const emotionalProfilePercent = {
          joy:
            emotionSum > 0
              ? Math.round((rawEmotions.joy / emotionSum) * 100)
              : 0,
          sadness:
            emotionSum > 0
              ? Math.round((rawEmotions.sadness / emotionSum) * 100)
              : 0,
          anger:
            emotionSum > 0
              ? Math.round((rawEmotions.anger / emotionSum) * 100)
              : 0,
          anxiety:
            emotionSum > 0
              ? Math.round((rawEmotions.anxiety / emotionSum) * 100)
              : 0,
          gratefulness:
            emotionSum > 0
              ? Math.round((rawEmotions.gratefulness / emotionSum) * 100)
              : 0,
          confidence:
            emotionSum > 0
              ? Math.round((rawEmotions.confidence / emotionSum) * 100)
              : 0,
          neutral: emotionSum === 0 ? 100 : 0,
        };

        // Response Delay Standard Deviation (Consistency)
        const delays = userResponseDelaysList[name] || [];
        const avgDelay =
          responseDelays[name].count > 0
            ? responseDelays[name].total / responseDelays[name].count / 1000
            : 0;

        let delayConsistency = 'Erratic Rhythms';
        let stdDevSec = 0;
        if (delays.length > 2) {
          const sumOfSquares = delays.reduce(
            (sum, d) => sum + (d - avgDelay) ** 2,
            0,
          );
          stdDevSec = Math.sqrt(sumOfSquares / delays.length);

          if (stdDevSec < 15 * 60) {
            delayConsistency = 'Highly Consistent ⚡';
          } else if (stdDevSec < 60 * 60) {
            delayConsistency = 'Moderately Consistent ⏱️';
          } else {
            delayConsistency = 'Highly Variable / Erratic 🌀';
          }
        } else if (delays.length > 0) {
          delayConsistency = 'Consistent Pace';
        } else {
          delayConsistency = 'Insufficient Replies';
        }

        // Vocabulary Lexical Diversity (TTR)
        const uniqueWordCount = uniqueWordSets[name]?.size || 0;
        const userWordsCount = data.words;
        const lexicalDiversity =
          userWordsCount > 0
            ? Math.round((uniqueWordCount / userWordsCount) * 100)
            : 0;

        // Writing Quirks & Style Traits
        const lowercasePct =
          data.messages > 0
            ? (allLowercaseCount[name] / data.messages) * 100
            : 0;
        const capsPct =
          data.messages > 0
            ? (capitalizedCount[name] / data.messages) * 100
            : 0;
        let capitalizationQuirk = 'Standard Case 🔤';
        if (lowercasePct > 80) capitalizationQuirk = 'Casual Lowercase 🔡';
        else if (capsPct > 75) capitalizationQuirk = 'Proper Grammar 🔠';

        const emojiRatio =
          data.messages > 0 ? emojiCount[name] / data.messages : 0;
        let emojiQuirk = 'Balanced Emojis 😊';
        if (emojiRatio > 1.2) emojiQuirk = 'Emoji Artist 🎨';
        else if (emojiRatio < 0.05) emojiQuirk = 'Text Purist 📝';

        const exclPct =
          data.messages > 0
            ? (exclamationCount[name] / data.messages) * 100
            : 0;
        let punctuationQuirk = 'Stable Statements 💬';
        if (exclPct > 12) punctuationQuirk = 'High Excitement ⚡';
        else if (questionCounts[name] / data.messages > 0.15)
          punctuationQuirk = 'Inquisitive Mind ❓';

        const doubleTextRatio =
          data.messages > 0 ? (doubleTexts[name] / data.messages) * 100 : 0;
        let rhythmQuirk = 'Steady Pace ⏱️';
        if (doubleTextRatio > 18) rhythmQuirk = 'Burst Sender 🚀';
        else if (avgDelay > 1800) rhythmQuirk = 'Thoughtful Pauses 🕒';

        // Myers-Briggs Type Indicator (MBTI) Approximation
        let eScore = 50;
        if (avgDelay < 180) eScore += 20;
        if (avgDelay > 1800) eScore -= 20;
        if (doubleTextRatio > 15) eScore += 15;
        if (initiations[name] / totalUserMsgs > 0.08) eScore += 15;
        const userPercentage =
          totalMessages > 0 ? (data.messages / totalMessages) * 100 : 0;
        if (userPercentage > 30) eScore += 20;
        if (userPercentage < 10) eScore -= 20;
        if (data.messages > 0 && data.words / data.messages < 8) eScore += 10;
        eScore = Math.max(0, Math.min(100, eScore));

        let nScore = 50;
        if (lexicalDiversity > 35) nScore += 20;
        if (questionCounts[name] / totalUserMsgs > 0.12) nScore += 20;
        if (data.messages > 0 && data.words / data.messages > 15) nScore += 10;

        const abstractWords = [
          'guess',
          'maybe',
          'perhaps',
          'think',
          'wonder',
          'imagine',
          'could',
          'would',
          'believe',
        ];
        let abstractCount = 0;
        abstractWords.forEach(w => {
          if (uniqueWordSets[name]?.has(w)) abstractCount += 1;
        });
        nScore += abstractCount * 5;
        nScore = Math.max(0, Math.min(100, nScore));

        let fScore = 50;
        const joyPct = rawEmotions.joy;
        const gratPct = rawEmotions.gratefulness;
        const confPct = rawEmotions.confidence;
        if (gratPct + joyPct > confPct + rawEmotions.anger + 10) fScore += 20;
        if (rawEmotions.anger + confPct > gratPct + joyPct) fScore -= 20;
        if (apologyCount[name] / totalUserMsgs > 0.03) fScore += 20;
        if (polarity > 20) fScore += 15;
        if (polarity < -20) fScore -= 10;
        fScore = Math.max(0, Math.min(100, fScore));

        let jScore = 50;
        if (delayConsistency.includes('Consistent') || stdDevSec < 1800)
          jScore += 25;
        if (delayConsistency.includes('Erratic') || stdDevSec > 3600)
          jScore -= 25;
        if (chronotype.includes('Business Hours')) jScore += 20;
        if (doubleTextRatio < 8) jScore += 15;
        jScore = Math.max(0, Math.min(100, jScore));

        const mbtiType =
          (eScore >= 50 ? 'E' : 'I') +
          (nScore >= 50 ? 'N' : 'S') +
          (fScore >= 50 ? 'F' : 'T') +
          (jScore >= 50 ? 'J' : 'P');

        const mbtiTitles: Record<string, string> = {
          ISTJ: 'The Inspector 🛠️',
          ISFJ: 'The Protector 🛡️',
          INFJ: 'The Counselor 🔮',
          INTJ: 'The Mastermind 🧠',
          ISTP: 'The Craftsman ⚙️',
          ISFP: 'The Composer 🎨',
          INFP: 'The Healer 🌿',
          INTP: 'The Architect 🧬',
          ESTP: 'The Dynamo ⚡',
          ESFP: 'The Entertainer 🎭',
          ENFP: 'The Champion 🌟',
          ENTP: 'The Visionary 🛸',
          ESTJ: 'The Supervisor 👔',
          ESFJ: 'The Provider 🤝',
          ENFJ: 'The Teacher 📢',
          ENTJ: 'The Commander ⚔️',
        };
        const mbtiTitle = mbtiTitles[mbtiType] || 'The Conversationalist';

        let personaText = '';
        if (totalUserMsgs < 5) {
          personaText = `${name} has sent very few messages in this conversation, making it difficult to catalog their communication persona. From what we observe, they maintain a quiet and reserved presence.`;
        } else {
          let capStr = 'using standard mixed capitalization';
          if (lowercasePct > 80) {
            capStr = 'written in a highly relaxed, lowercase style';
          } else if (capsPct > 75) {
            capStr = 'structured with correct grammar and capitalization';
          }

          let emoStr = 'a moderate, selective use of emojis';
          if (emojiRatio > 1.2) {
            emoStr = 'frequent emoji punctuations';
          } else if (emojiRatio < 0.05) {
            emoStr = 'a clean, text-only layout without emojis';
          }

          let exclStr = 'making logical, direct statements';
          if (exclPct > 12) {
            exclStr = 'expressing high enthusiasm and intensity';
          } else if (questionCounts[name] / totalUserMsgs > 0.15) {
            exclStr = 'frequently posing questions and showing high curiosity';
          }

          let speedStr = 'responding at a balanced, steady pace';
          if (avgDelay < 120) {
            speedStr = 'replying almost instantly on average';
          } else if (avgDelay > 1800) {
            speedStr =
              'preferring to take their time to craft detailed, deliberate answers';
          }

          personaText = `${name} exhibits the core characteristics of "${mbtiTitle}" (${mbtiType}). Their writing style is typically ${capStr}, characterized by ${emoStr} while ${exclStr}. In terms of messaging dynamics, they are ${speedStr}, demonstrating ${delayConsistency.toLowerCase()}. They are active primarily during their ${chronotype
            .replace(/🦉|🌅|💼|🌆/g, '')
            .trim()
            .toLowerCase()} hours.`;
        }

        // Rapport Matrix summaries
        const repliesTo = interactCount[name] || {};
        const repliesToDel = interactDelay[name] || {};
        const dTextTrig = doubleTextsTrigger[name] || {};

        let mainPartner = 'N/A';
        let maxReplies = 0;
        Object.entries(repliesTo).forEach(([partner, count]) => {
          if (
            partner !== 'System Messages' &&
            partner !== name &&
            count > maxReplies
          ) {
            maxReplies = count;
            mainPartner = partner;
          }
        });

        let fastestTarget = 'N/A';
        let minDelay = Infinity;
        Object.entries(repliesToDel).forEach(([partner, delayData]) => {
          if (
            partner !== 'System Messages' &&
            partner !== name &&
            delayData.count > 0
          ) {
            const avg = delayData.total / delayData.count / 1000;
            if (avg < minDelay) {
              minDelay = avg;
              fastestTarget = partner;
            }
          }
        });
        if (minDelay === Infinity) fastestTarget = 'N/A';

        let slowestTarget = 'N/A';
        let maxDelay = -1;
        Object.entries(repliesToDel).forEach(([partner, delayData]) => {
          if (
            partner !== 'System Messages' &&
            partner !== name &&
            delayData.count > 0
          ) {
            const avg = delayData.total / delayData.count / 1000;
            if (avg > maxDelay) {
              maxDelay = avg;
              slowestTarget = partner;
            }
          }
        });
        if (maxDelay === -1) slowestTarget = 'N/A';

        let maxDoubleTextTrigger = 'N/A';
        let maxDTextCount = 0;
        Object.entries(dTextTrig).forEach(([partner, count]) => {
          if (
            partner !== 'System Messages' &&
            partner !== name &&
            count > maxDTextCount
          ) {
            maxDTextCount = count;
            maxDoubleTextTrigger = partner;
          }
        });

        const userProbabilities = Array.from({ length: 24 }, (_, hour) => {
          const uData = userReplySpeedByHour[name]?.[hour] || {
            fastReplies: 0,
            totalReplies: 0,
          };
          const probability =
            uData.totalReplies > 0
              ? Math.round((uData.fastReplies / uData.totalReplies) * 100)
              : 55;
          return { hour, probability };
        });

        return {
          name,
          messagesCount: data.messages,
          wordsCount: data.words,
          color: colorMap[name] || '#94a3b8',
          avgWords:
            data.messages > 0 ? Math.round(data.words / data.messages) : 0,
          percentage:
            totalMessages > 0
              ? ((data.messages / totalMessages) * 100).toFixed(1)
              : '0',

          // Psychology metrics
          avgResponseTime: Math.round(avgDelay),
          doubleTextCount: doubleTexts[name] || 0,
          initiationCount: initiations[name] || 0,
          curiosityRate:
            data.messages > 0
              ? Math.round((questionCounts[name] / data.messages) * 100)
              : 0,

          // New Advanced metrics
          chronotype,
          nocturnalRatio,
          polarity,
          sentimentLabel,
          emotionalProfilePercent,
          uniqueWords: uniqueWordCount,
          lexicalDiversity,
          stdDevSec,
          delayConsistency,

          // Persona metrics
          capitalizationQuirk,
          emojiQuirk,
          punctuationQuirk,
          rhythmQuirk,
          mbtiType,
          mbtiTitle,
          personaText,

          // Rapport
          mainPartner,
          mainPartnerCount: maxReplies,
          fastestTarget,
          fastestTargetDelay: minDelay !== Infinity ? Math.round(minDelay) : 0,
          slowestTarget,
          slowestTargetDelay: maxDelay !== -1 ? Math.round(maxDelay) : 0,
          doubleTextTriggerUser: maxDoubleTextTrigger,
          doubleTextTriggerCount: maxDTextCount,

          // User response probability timeline
          responseProbabilityByHour: userProbabilities,
        };
      })
      .sort((a, b) => b.messagesCount - a.messagesCount);

    // Filter out System Messages from the psychology archetype cards if they don't represent real conversations
    const conversationalArchetypeList = participantStatsList
      .filter(p => p.name !== 'System Messages' && p.messagesCount > 0)
      .map(p => ({
        ...p,
        archetype: getArchetype(
          p.name,
          p.avgResponseTime,
          p.doubleTextCount,
          p.initiationCount,
          p.curiosityRate,
          p.messagesCount,
        ),
      }));

    // Sort top 10 words
    const topWords = Object.entries(wordFrequencies)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate response probability array by hour for prediction chart
    // Default values if no replies at a given hour
    const responseProbabilityByHour = Array.from({ length: 24 }, (_, hour) => {
      const data = replySpeedByHour[hour];
      const probability =
        data.totalReplies > 0
          ? Math.round((data.fastReplies / data.totalReplies) * 100)
          : 55; // 55% default baseline
      return { hour, probability };
    });

    // ── ADVANCED: Emoji leaderboard (top 15 most-used emojis)
    const emojiFrequencies: Record<string, number> = {};
    // Use Unicode property escape with a safe fallback for environments that don't support it
    let emojiRegex: RegExp;
    try {
      // eslint-disable-next-line prefer-regex-literals
      emojiRegex = new RegExp(
        '\\p{Emoji_Presentation}|\\p{Extended_Pictographic}',
        'gu',
      );
    } catch {
      // Fallback: match common emoji Unicode ranges
      emojiRegex =
        /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]|[\u{1F000}-\u{1F02F}]|\u{2764}/gu;
    }
    messages.forEach(m => {
      if (!m.message) return;
      try {
        const found = m.message.match(emojiRegex);
        if (found) {
          found.forEach(e => {
            emojiFrequencies[e] = (emojiFrequencies[e] || 0) + 1;
          });
        }
      } catch {
        // skip unparseable messages
      }
    });
    const topEmojis = Object.entries(emojiFrequencies)
      .map(([emoji, count]) => ({ emoji, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // ── ADVANCED: Monthly activity heatmap (messages per calendar month)
    const monthlyActivity: Record<string, number> = {};
    messages.forEach(m => {
      const key = `${m.date.getFullYear()}-${String(m.date.getMonth() + 1).padStart(2, '0')}`;
      monthlyActivity[key] = (monthlyActivity[key] || 0) + 1;
    });
    const monthlyActivityList = Object.entries(monthlyActivity)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // ── ADVANCED: Cumulative message growth over time (one point per day or week)
    const cumulativeGrowth: Array<{
      date: string;
      total: number;
      timestamp: number;
    }> = [];
    if (messages.length > 0) {
      const dailyMap: Record<string, number> = {};
      messages.forEach(m => {
        const key = m.date.toISOString().slice(0, 10);
        dailyMap[key] = (dailyMap[key] || 0) + 1;
      });
      const sortedDays = Object.keys(dailyMap).sort();
      let cum = 0;
      sortedDays.forEach(day => {
        cum += dailyMap[day];
        cumulativeGrowth.push({
          date: day,
          total: cum,
          timestamp: new Date(day).getTime(),
        });
      });
    }

    // ── ADVANCED: Engagement score per participant (composite 0-100)
    const engagementScores = participantStatsList
      .filter(p => p.name !== 'System Messages' && p.messagesCount > 0)
      .map(p => {
        const totalMsgs = totalMessages || 1;
        const shareScore = Math.min(
          100,
          (p.messagesCount / totalMsgs) * 100 * 2,
        ); // 0-100
        const speedScore =
          p.avgResponseTime > 0
            ? Math.max(
                0,
                100 - Math.min(100, (p.avgResponseTime / (30 * 60)) * 100),
              )
            : 50;
        const initiationScore = Math.min(100, p.initiationCount * 5);
        const consistencyScore =
          p.avgWords > 0 ? Math.min(100, p.avgWords * 5) : 0;
        const composite = Math.round(
          shareScore * 0.35 +
            speedScore * 0.3 +
            initiationScore * 0.2 +
            consistencyScore * 0.15,
        );
        let tier = 'Bronze';
        let tierColor = '#cd7f32';
        if (composite >= 75) {
          tier = 'Diamond';
          tierColor = '#38bdf8';
        } else if (composite >= 60) {
          tier = 'Gold';
          tierColor = '#f59e0b';
        } else if (composite >= 45) {
          tier = 'Silver';
          tierColor = '#94a3b8';
        }
        return { ...p, engagementScore: composite, tier, tierColor };
      })
      .sort((a, b) => b.engagementScore - a.engagementScore);

    // ── ADVANCED: Ghost periods detector (top 5 longest silences)
    const ghostPeriods: Array<{
      from: Date;
      to: Date;
      durationHours: number;
      breakerAuthor: string;
    }> = [];
    for (let i = 1; i < messages.length; i += 1) {
      const gap = messages[i].date.getTime() - messages[i - 1].date.getTime();
      const gapHours = gap / (1000 * 60 * 60);
      if (gapHours >= 12) {
        ghostPeriods.push({
          from: messages[i - 1].date,
          to: messages[i].date,
          durationHours: gapHours,
          breakerAuthor: messages[i].author || 'System',
        });
      }
    }
    ghostPeriods.sort((a, b) => b.durationHours - a.durationHours);
    const top5Ghosts = ghostPeriods.slice(0, 5);

    // ── ADVANCED: Message length histogram (bucket by word count: 1-5, 6-15, 16-30, 31-60, 61+)
    const lengthBuckets = ['1-5', '6-15', '16-30', '31-60', '61+'];
    const lengthHistogram: Record<string, number[]> = {};
    participantStatsList
      .filter(p => p.name !== 'System Messages')
      .forEach(p => {
        lengthHistogram[p.name] = [0, 0, 0, 0, 0];
      });
    messages.forEach(m => {
      if (!m.message || !m.author || !lengthHistogram[m.author]) return;
      const wc = m.message.trim().split(/\s+/).filter(Boolean).length;
      if (wc <= 5) lengthHistogram[m.author][0] += 1;
      else if (wc <= 15) lengthHistogram[m.author][1] += 1;
      else if (wc <= 30) lengthHistogram[m.author][2] += 1;
      else if (wc <= 60) lengthHistogram[m.author][3] += 1;
      else lengthHistogram[m.author][4] += 1;
    });

    return {
      totalMessages,
      totalWords,
      totalMedia,
      totalLinks,
      hourlyDistribution,
      dailyDistribution,
      participantStatsList,
      conversationalArchetypeList,
      topWords,
      responseProbabilityByHour,
      // Advanced
      topEmojis,
      monthlyActivityList,
      cumulativeGrowth,
      engagementScores,
      top5Ghosts,
      lengthBuckets,
      lengthHistogram,
    };
  }, [messages, colorMap, participants]);

  // Hourly SVG Chart Calculations
  const maxHourCount = Math.max(...stats.hourlyDistribution, 1);
  // Weekday SVG Chart Calculations
  const weekdays = [
    { label: 'Mon', index: 1 },
    { label: 'Tue', index: 2 },
    { label: 'Wed', index: 3 },
    { label: 'Thu', index: 4 },
    { label: 'Fri', index: 5 },
    { label: 'Sat', index: 6 },
    { label: 'Sun', index: 0 },
  ];
  const weekdayCounts = weekdays.map(w => stats.dailyDistribution[w.index]);
  const maxWeekdayCount = Math.max(...weekdayCounts, 1);

  // Predictions math
  const totalInitiations =
    stats.conversationalArchetypeList.reduce(
      (acc, p) => acc + p.initiationCount,
      0,
    ) || 1;

  // Calculate conversational stability forecast
  const longevityForecast = useMemo(() => {
    if (messages.length < 50) {
      return {
        status: 'Uncertain Density',
        desc: 'The chat history has too few data points to forecast long-term trajectory safely.',
        color: '#64748b',
      };
    }

    const firstMsgDate = messages[0]?.date.getTime() || 0;
    const lastMsgDate = messages.at(-1)?.date.getTime() || 0;
    const totalDays =
      Math.ceil((lastMsgDate - firstMsgDate) / (1000 * 60 * 60 * 24)) || 1;
    const avgMessagesPerDay = messages.length / totalDays;

    if (totalDays < 5) {
      return {
        status: 'Rapid Outburst',
        desc: 'High volume over a very short duration. Likely a temporary burst of intense coordination.',
        color: '#3b82f6',
      };
    }

    // Check recent density slope (first half vs second half)
    const midPointIndex = Math.floor(messages.length / 2);
    const midDate = messages[midPointIndex].date.getTime();
    const daysFirstHalf =
      Math.ceil((midDate - firstMsgDate) / (1000 * 60 * 60 * 24)) || 1;
    const daysSecondHalf =
      Math.ceil((lastMsgDate - midDate) / (1000 * 60 * 60 * 24)) || 1;
    const densityFirst = midPointIndex / daysFirstHalf;
    const densitySecond = (messages.length - midPointIndex) / daysSecondHalf;
    const ratio = densitySecond / (densityFirst || 1);

    if (ratio > 1.25) {
      return {
        status: 'Accelerating Momentum',
        desc: `Messaging frequency increased by ${Math.round((ratio - 1) * 100)}% recently. Predicting a high-intensity engagement wave over the next 30 days.`,
        color: '#10b981',
      };
    }
    if (ratio < 0.6) {
      return {
        status: 'Gradual Deceleration',
        desc: `Message density cooled down by ${Math.round((1 - ratio) * 100)}% recently. Predict a natural wind-down to low-frequency messaging.`,
        color: '#f43f5e',
      };
    }
    return {
      status: 'Stable Equilbrium',
      desc: `Consistent message density detected (avg. ${Math.round(avgMessagesPerDay)} msgs/day). Forecast expects this connection to remain highly active and sustainable.`,
      color: '#6366f1',
    };
  }, [messages]);

  return (
    <S.DashboardContainer>
      <S.Title>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: '#10b981' }}
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M7 16V8" />
          <path d="M12 16V12" />
          <path d="M17 16v-6" />
        </svg>
        Chat Analytics Dashboard
      </S.Title>

      {/* Analytics Sub-tab navigation */}
      <S.SubTabNav>
        <S.SubTabButton
          $isActive={subTab === 'overview'}
          onClick={() => setSubTab('overview')}
        >
          📊 Activity Overview
        </S.SubTabButton>
        <S.SubTabButton
          $isActive={subTab === 'psychology'}
          onClick={() => setSubTab('psychology')}
        >
          🧠 Behavior & Psychology
        </S.SubTabButton>
        <S.SubTabButton
          $isActive={subTab === 'dossier'}
          onClick={() => setSubTab('dossier')}
        >
          🔍 In-Depth Profiling
        </S.SubTabButton>
        <S.SubTabButton
          $isActive={subTab === 'prediction'}
          onClick={() => setSubTab('prediction')}
        >
          🔮 Predictive Models
        </S.SubTabButton>
        <S.SubTabButton
          $isActive={subTab === 'trends'}
          onClick={() => setSubTab('trends')}
        >
          🌐 Trends &amp; Network
        </S.SubTabButton>
      </S.SubTabNav>

      {subTab === 'overview' && (
        <>
          <S.StatsGrid>
            <S.StatCard $color="#10b981">
              <S.StatIcon $bg="#10b981">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </S.StatIcon>
              <S.StatInfo>
                <S.StatLabel>Total Messages</S.StatLabel>
                <S.StatValue>
                  {stats.totalMessages.toLocaleString()}
                </S.StatValue>
              </S.StatInfo>
            </S.StatCard>

            <S.StatCard $color="#6366f1">
              <S.StatIcon $bg="#6366f1">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M6 6h10" />
                  <path d="M6 10h10" />
                </svg>
              </S.StatIcon>
              <S.StatInfo>
                <S.StatLabel>Total Words</S.StatLabel>
                <S.StatValue>{stats.totalWords.toLocaleString()}</S.StatValue>
              </S.StatInfo>
            </S.StatCard>

            <S.StatCard $color="#f43f5e">
              <S.StatIcon $bg="#f43f5e">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </S.StatIcon>
              <S.StatInfo>
                <S.StatLabel>Media Shared</S.StatLabel>
                <S.StatValue>{stats.totalMedia.toLocaleString()}</S.StatValue>
              </S.StatInfo>
            </S.StatCard>

            <S.StatCard $color="#f59e0b">
              <S.StatIcon $bg="#f59e0b">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </S.StatIcon>
              <S.StatInfo>
                <S.StatLabel>Links Shared</S.StatLabel>
                <S.StatValue>{stats.totalLinks.toLocaleString()}</S.StatValue>
              </S.StatInfo>
            </S.StatCard>
          </S.StatsGrid>

          <S.ChartRow>
            <S.ChartCard>
              <S.CardTitle>Activity by Hour of Day</S.CardTitle>
              <S.ChartContainer>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 540 180"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="hourBarGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                  {Array.from({ length: 24 }, (_, i) => i).map(hr => {
                    const count = stats.hourlyDistribution[hr];
                    const height = (count / maxHourCount) * 125;
                    const barWidth = 14;
                    const gap = 7;
                    const x = 30 + hr * (barWidth + gap);
                    const y = 145 - height;
                    return (
                      <g key={`hour-slot-${hr}`}>
                        <title>{`${hr}:00 - ${count} messages`}</title>
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={height}
                          rx="3"
                          fill="url(#hourBarGrad)"
                          style={{ transition: 'all 0.3s ease' }}
                        />
                        {/* Hourly Labels (every 4 hours to keep clean) */}
                        {hr % 4 === 0 && (
                          <text
                            x={x + barWidth / 2}
                            y="165"
                            fill="#94a3b8"
                            fontSize="10"
                            textAnchor="middle"
                            fontWeight="500"
                          >
                            {`${hr}h`}
                          </text>
                        )}
                      </g>
                    );
                  })}
                  <line
                    x1="20"
                    y1="145"
                    x2="520"
                    y2="145"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                </svg>
              </S.ChartContainer>
            </S.ChartCard>

            <S.ChartCard>
              <S.CardTitle>Activity by Weekday</S.CardTitle>
              <S.ChartContainer>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 450 180"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="dayBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                  </defs>
                  {weekdays.map((dayObj, i) => {
                    const count = stats.dailyDistribution[dayObj.index];
                    const height = (count / maxWeekdayCount) * 125;
                    const barWidth = 36;
                    const gap = 20;
                    const x = 40 + i * (barWidth + gap);
                    const y = 145 - height;
                    return (
                      <g key={dayObj.label}>
                        <title>{`${dayObj.label}: ${count} messages`}</title>
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={height}
                          rx="4"
                          fill="url(#dayBarGrad)"
                        />
                        <text
                          x={x + barWidth / 2}
                          y="165"
                          fill="#94a3b8"
                          fontSize="11"
                          textAnchor="middle"
                          fontWeight="600"
                        >
                          {dayObj.label}
                        </text>
                      </g>
                    );
                  })}
                  <line
                    x1="20"
                    y1="145"
                    x2="430"
                    y2="145"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                </svg>
              </S.ChartContainer>
            </S.ChartCard>
          </S.ChartRow>

          <S.ChartRow>
            <S.TableCard>
              <S.CardTitle style={{ marginBottom: '1.25rem' }}>
                Participant Leaderboard
              </S.CardTitle>
              <S.Table>
                <thead>
                  <tr>
                    <S.Th>Participant</S.Th>
                    <S.Th>Messages</S.Th>
                    <S.Th>Share</S.Th>
                    <S.Th>Avg. Words</S.Th>
                  </tr>
                </thead>
                <tbody>
                  {stats.participantStatsList.map(p => (
                    <S.ParticipantRow key={p.name}>
                      <S.Td style={{ fontWeight: 600 }}>
                        <S.Badge $color={p.color} />
                        {p.name}
                      </S.Td>
                      <S.Td>{p.messagesCount.toLocaleString()}</S.Td>
                      <S.Td>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <div
                            style={{
                              flex: '1',
                              width: '60px',
                              height: '6px',
                              backgroundColor: '#e2e8f0',
                              borderRadius: '3px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${p.percentage}%`,
                                height: '100%',
                                backgroundColor: p.color,
                              }}
                            />
                          </div>
                          <span>{p.percentage}%</span>
                        </div>
                      </S.Td>
                      <S.Td>{p.avgWords} words</S.Td>
                    </S.ParticipantRow>
                  ))}
                </tbody>
              </S.Table>
            </S.TableCard>

            <S.ChartCard>
              <S.CardTitle style={{ marginBottom: '1.25rem' }}>
                Most Frequent Words
              </S.CardTitle>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {stats.topWords.length === 0 ? (
                  <div
                    style={{
                      color: '#94a3b8',
                      fontSize: '0.9rem',
                      textAlign: 'center',
                      padding: '2rem 0',
                    }}
                  >
                    Not enough text data to calculate word frequencies.
                  </div>
                ) : (
                  stats.topWords.map(w => {
                    const maxCount = stats.topWords[0]?.count || 1;
                    const percent = Math.round((w.count / maxCount) * 100);
                    return (
                      <div
                        key={w.word}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.875rem',
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              background: 'rgba(16, 185, 129, 0.1)',
                              color: '#059669',
                              padding: '2px 8px',
                              borderRadius: '6px',
                            }}
                          >
                            {w.word}
                          </span>
                          <span style={{ color: '#64748b', fontWeight: 500 }}>
                            {w.count.toLocaleString()} times
                          </span>
                        </div>
                        <div
                          style={{
                            width: '100%',
                            height: '6px',
                            backgroundColor: '#e2e8f0',
                            borderRadius: '3px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${percent}%`,
                              height: '100%',
                              backgroundColor: '#10b981',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </S.ChartCard>
          </S.ChartRow>
        </>
      )}

      {subTab === 'psychology' && (
        <S.InsightGrid>
          {stats.conversationalArchetypeList.map(p => (
            <S.ArchetypeContainer key={p.name}>
              <S.ArchetypeCardHeader>
                <S.Avatar $color={p.color}>
                  {p.name.charAt(0).toUpperCase()}
                </S.Avatar>
                <S.ProfileInfo>
                  <S.ProfileName>{p.name}</S.ProfileName>
                  <S.ArchetypeBadge>{p.archetype.title}</S.ArchetypeBadge>
                </S.ProfileInfo>
              </S.ArchetypeCardHeader>

              <S.ArchetypeDescription>
                {p.archetype.desc}
              </S.ArchetypeDescription>

              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
              >
                <S.MetricRow>
                  <S.MetricLabel>Average Response Delay</S.MetricLabel>
                  <S.MetricValue>
                    {formatDuration(p.avgResponseTime)}
                  </S.MetricValue>
                </S.MetricRow>
                <S.MetricRow>
                  <S.MetricLabel>Double Texts Sent</S.MetricLabel>
                  <S.MetricValue>
                    {p.doubleTextCount.toLocaleString()}
                  </S.MetricValue>
                </S.MetricRow>
                <S.MetricRow>
                  <S.MetricLabel>Topic Initiations</S.MetricLabel>
                  <S.MetricValue>
                    {p.initiationCount.toLocaleString()}
                  </S.MetricValue>
                </S.MetricRow>
                <S.MetricRow>
                  <S.MetricLabel>Curiosity index (Questions)</S.MetricLabel>
                  <S.MetricValue>{p.curiosityRate}% of messages</S.MetricValue>
                </S.MetricRow>
                <S.MetricRow>
                  <S.MetricLabel>Average Length</S.MetricLabel>
                  <S.MetricValue>{p.avgWords} words</S.MetricValue>
                </S.MetricRow>
              </div>
            </S.ArchetypeContainer>
          ))}
        </S.InsightGrid>
      )}

      {subTab === 'dossier' &&
        (() => {
          const activeDossierUser =
            selectedDossierUser ||
            stats.conversationalArchetypeList[0]?.name ||
            '';
          const selectedUserStats = stats.conversationalArchetypeList.find(
            p => p.name === activeDossierUser,
          );

          return (
            <>
              <S.DossierSelectorContainer>
                <S.SelectorLabel htmlFor="dossier-select">
                  Select Participant for Deep Profiling:
                </S.SelectorLabel>
                <S.StyledSelect
                  id="dossier-select"
                  value={activeDossierUser}
                  onChange={e => setSelectedDossierUser(e.target.value)}
                >
                  {stats.conversationalArchetypeList.map(p => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </S.StyledSelect>
              </S.DossierSelectorContainer>

              {selectedUserStats ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                  }}
                >
                  <S.DossierHeader>
                    <S.Avatar
                      $color={selectedUserStats.color}
                      style={{
                        width: '64px',
                        height: '64px',
                        fontSize: '1.75rem',
                      }}
                    >
                      {selectedUserStats.name.charAt(0).toUpperCase()}
                    </S.Avatar>
                    <S.DossierMeta>
                      <S.DossierTitle>{selectedUserStats.name}</S.DossierTitle>
                      <S.BadgesRow>
                        <S.ArchetypeBadge>
                          {selectedUserStats.archetype.title}
                        </S.ArchetypeBadge>
                        <S.ChronotypeBadge>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {selectedUserStats.chronotype}
                        </S.ChronotypeBadge>
                        <S.ChronotypeBadge
                          style={{
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: '#059669',
                          }}
                        >
                          {selectedUserStats.delayConsistency}
                        </S.ChronotypeBadge>
                      </S.BadgesRow>
                    </S.DossierMeta>
                  </S.DossierHeader>

                  <S.PersonaCard>
                    <S.PersonaTitle>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: '#10b981' }}
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a7 7 0 0 0-7 7c0 4.14 7 13 7 13s7-8.86 7-13a7 7 0 0 0-7-7z" />
                        <circle cx="12" cy="9" r="3" />
                      </svg>
                      Communication Persona Profile:{' '}
                      {selectedUserStats.mbtiTitle} (
                      {selectedUserStats.mbtiType})
                    </S.PersonaTitle>
                    <S.PersonaDesc>
                      {selectedUserStats.personaText}
                    </S.PersonaDesc>
                    <S.QuirksGrid>
                      <S.QuirkItem>
                        <S.QuirkIcon $bg="#6366f1">🔡</S.QuirkIcon>
                        <S.QuirkMeta>
                          <S.QuirkLabel>Capitalization</S.QuirkLabel>
                          <S.QuirkVal>
                            {selectedUserStats.capitalizationQuirk}
                          </S.QuirkVal>
                        </S.QuirkMeta>
                      </S.QuirkItem>

                      <S.QuirkItem>
                        <S.QuirkIcon $bg="#10b981">🎨</S.QuirkIcon>
                        <S.QuirkMeta>
                          <S.QuirkLabel>Emoji Habit</S.QuirkLabel>
                          <S.QuirkVal>
                            {selectedUserStats.emojiQuirk}
                          </S.QuirkVal>
                        </S.QuirkMeta>
                      </S.QuirkItem>

                      <S.QuirkItem>
                        <S.QuirkIcon $bg="#f59e0b">⚡</S.QuirkIcon>
                        <S.QuirkMeta>
                          <S.QuirkLabel>Punctuation</S.QuirkLabel>
                          <S.QuirkVal>
                            {selectedUserStats.punctuationQuirk}
                          </S.QuirkVal>
                        </S.QuirkMeta>
                      </S.QuirkItem>

                      <S.QuirkItem>
                        <S.QuirkIcon $bg="#ec4899">🚀</S.QuirkIcon>
                        <S.QuirkMeta>
                          <S.QuirkLabel>Rhythm Pacing</S.QuirkLabel>
                          <S.QuirkVal>
                            {selectedUserStats.rhythmQuirk}
                          </S.QuirkVal>
                        </S.QuirkMeta>
                      </S.QuirkItem>
                    </S.QuirksGrid>
                  </S.PersonaCard>

                  <S.ChartRow>
                    <S.ChartCard>
                      <S.CardTitle>Sentiment & Emotional Spectrum</S.CardTitle>
                      <S.SentimentContainer>
                        <S.SentimentTextRow>
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              color: '#64748b',
                            }}
                          >
                            Sentiment Index
                          </span>
                          <S.SentimentVal
                            $polarity={selectedUserStats.polarity}
                          >
                            {selectedUserStats.polarity > 0 ? '+' : ''}
                            {selectedUserStats.polarity}% (
                            {selectedUserStats.sentimentLabel})
                          </S.SentimentVal>
                        </S.SentimentTextRow>
                        <S.SentimentSlider>
                          <S.SentimentSliderThumb
                            $val={selectedUserStats.polarity}
                          />
                        </S.SentimentSlider>
                        <S.SentimentLabels>
                          <span>NEGATIVE</span>
                          <span>NEUTRAL</span>
                          <span>POSITIVE</span>
                        </S.SentimentLabels>
                      </S.SentimentContainer>

                      <div
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          margin: '0.5rem 0',
                        }}
                      />

                      <S.CardTitle
                        style={{ fontSize: '1rem', marginTop: '0.5rem' }}
                      >
                        Emotional Composition
                      </S.CardTitle>
                      <S.EmotionalBars>
                        {[
                          {
                            label: 'Joy & Excitement',
                            pct: selectedUserStats.emotionalProfilePercent.joy,
                            color: '#10b981',
                            emoji: '😂',
                          },
                          {
                            label: 'Sadness & Empathy',
                            pct: selectedUserStats.emotionalProfilePercent
                              .sadness,
                            color: '#3b82f6',
                            emoji: '😢',
                          },
                          {
                            label: 'Anger & Frustration',
                            pct: selectedUserStats.emotionalProfilePercent
                              .anger,
                            color: '#f43f5e',
                            emoji: '😠',
                          },
                          {
                            label: 'Worry & Doubt',
                            pct: selectedUserStats.emotionalProfilePercent
                              .anxiety,
                            color: '#f59e0b',
                            emoji: '😰',
                          },
                          {
                            label: 'Gratefulness & Affection',
                            pct: selectedUserStats.emotionalProfilePercent
                              .gratefulness,
                            color: '#ec4899',
                            emoji: '🙏',
                          },
                          {
                            label: 'Assertiveness & Confidence',
                            pct: selectedUserStats.emotionalProfilePercent
                              .confidence,
                            color: '#8b5cf6',
                            emoji: '💯',
                          },
                        ].map(emo => (
                          <S.EmotionBarRow key={emo.label}>
                            <S.EmotionBarInfo>
                              <S.EmotionBarLabel>
                                <span>{emo.emoji}</span>
                                <span>{emo.label}</span>
                              </S.EmotionBarLabel>
                              <S.EmotionBarValue>{emo.pct}%</S.EmotionBarValue>
                            </S.EmotionBarInfo>
                            <S.EmotionBarTrack>
                              <S.EmotionBarFill
                                $pct={emo.pct}
                                $color={emo.color}
                              />
                            </S.EmotionBarTrack>
                          </S.EmotionBarRow>
                        ))}
                      </S.EmotionalBars>
                    </S.ChartCard>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                      }}
                    >
                      <S.ChartCard>
                        <S.CardTitle>Texting Habits & Rhythms</S.CardTitle>
                        <S.HabitsGrid>
                          <S.HabitCard>
                            <S.HabitValue>
                              {selectedUserStats.lexicalDiversity}%
                            </S.HabitValue>
                            <S.HabitLabel>Lexical Richness</S.HabitLabel>
                          </S.HabitCard>
                          <S.HabitCard>
                            <S.HabitValue>
                              {selectedUserStats.uniqueWords.toLocaleString()}
                            </S.HabitValue>
                            <S.HabitLabel>Vocabulary Size</S.HabitLabel>
                          </S.HabitCard>
                          <S.HabitCard>
                            <S.HabitValue>
                              {selectedUserStats.avgWords} words
                            </S.HabitValue>
                            <S.HabitLabel>Average Length</S.HabitLabel>
                          </S.HabitCard>
                          <S.HabitCard>
                            <S.HabitValue>
                              {selectedUserStats.nocturnalRatio}%
                            </S.HabitValue>
                            <S.HabitLabel>Nocturnal Ratio</S.HabitLabel>
                          </S.HabitCard>
                          <S.HabitCard>
                            <S.HabitValue>
                              {selectedUserStats.curiosityRate}%
                            </S.HabitValue>
                            <S.HabitLabel>Curiosity Rate</S.HabitLabel>
                          </S.HabitCard>
                          <S.HabitCard>
                            <S.HabitValue>
                              {selectedUserStats.doubleTextCount.toLocaleString()}
                            </S.HabitValue>
                            <S.HabitLabel>Double Texts</S.HabitLabel>
                          </S.HabitCard>
                        </S.HabitsGrid>
                      </S.ChartCard>

                      <S.ChartCard>
                        <S.CardTitle>
                          Interpersonal Rapport & Network
                        </S.CardTitle>
                        <S.RapportGrid>
                          <S.RapportCard $border={selectedUserStats.color}>
                            <S.RapportLabel>Main Partner</S.RapportLabel>
                            <S.RapportValue>
                              {selectedUserStats.mainPartner}
                            </S.RapportValue>
                            {selectedUserStats.mainPartner !== 'N/A' && (
                              <S.RapportDetail>
                                Replied to them{' '}
                                <strong>
                                  {selectedUserStats.mainPartnerCount}
                                </strong>{' '}
                                times.
                              </S.RapportDetail>
                            )}
                          </S.RapportCard>

                          <S.RapportCard $border="#10b981">
                            <S.RapportLabel>Fastest Response</S.RapportLabel>
                            <S.RapportValue>
                              {selectedUserStats.fastestTarget}
                            </S.RapportValue>
                            {selectedUserStats.fastestTarget !== 'N/A' && (
                              <S.RapportDetail>
                                Average:{' '}
                                <strong>
                                  {formatDuration(
                                    selectedUserStats.fastestTargetDelay,
                                  )}
                                </strong>
                              </S.RapportDetail>
                            )}
                          </S.RapportCard>

                          <S.RapportCard $border="#f59e0b">
                            <S.RapportLabel>Slowest Response</S.RapportLabel>
                            <S.RapportValue>
                              {selectedUserStats.slowestTarget}
                            </S.RapportValue>
                            {selectedUserStats.slowestTarget !== 'N/A' && (
                              <S.RapportDetail>
                                Average:{' '}
                                <strong>
                                  {formatDuration(
                                    selectedUserStats.slowestTargetDelay,
                                  )}
                                </strong>
                              </S.RapportDetail>
                            )}
                          </S.RapportCard>

                          <S.RapportCard $border="#ec4899">
                            <S.RapportLabel>Double-Text Trigger</S.RapportLabel>
                            <S.RapportValue>
                              {selectedUserStats.doubleTextTriggerUser}
                            </S.RapportValue>
                            {selectedUserStats.doubleTextTriggerUser !==
                              'N/A' && (
                              <S.RapportDetail>
                                Double-texted them{' '}
                                <strong>
                                  {selectedUserStats.doubleTextTriggerCount}
                                </strong>{' '}
                                times.
                              </S.RapportDetail>
                            )}
                          </S.RapportCard>
                        </S.RapportGrid>
                      </S.ChartCard>
                    </div>
                  </S.ChartRow>

                  <S.ChartCard>
                    <S.CardTitle>Response Likelihood Forecasting</S.CardTitle>
                    <S.PredictionSubtitle
                      style={{ textAlign: 'left', marginBottom: '1rem' }}
                    >
                      The predicted percentage chance of{' '}
                      <strong>{selectedUserStats.name}</strong> replying in{' '}
                      <strong>under 15 minutes</strong> if you text them at a
                      specific hour of the day.
                    </S.PredictionSubtitle>
                    <S.ChartContainer style={{ height: '200px' }}>
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 540 180"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient
                            id={`userProbAreaGrad-${selectedUserStats.name.replace(/\s+/g, '-')}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={selectedUserStats.color}
                              stopOpacity="0.3"
                            />
                            <stop
                              offset="100%"
                              stopColor={selectedUserStats.color}
                              stopOpacity="0.0"
                            />
                          </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        {[25, 50, 75, 100].map(val => {
                          const y = 145 - (val / 100) * 120;
                          return (
                            <g key={val}>
                              <line
                                x1="30"
                                y1={y}
                                x2="520"
                                y2={y}
                                stroke="#f1f5f9"
                                strokeWidth="1"
                                strokeDasharray="3"
                              />
                              <text
                                x="12"
                                y={y + 4}
                                fill="#94a3b8"
                                fontSize="9"
                                fontWeight="500"
                              >
                                {val}%
                              </text>
                            </g>
                          );
                        })}

                        {/* Draw area and path */}
                        {(() => {
                          const points =
                            selectedUserStats.responseProbabilityByHour.map(
                              (d, index) => {
                                const x = 30 + index * 21.3;
                                const y = 145 - (d.probability / 100) * 120;
                                return { x, y };
                              },
                            );

                          const pathD = `M ${points[0].x} ${points[0].y} ${points
                            .slice(1)
                            .map(p => `L ${p.x} ${p.y}`)
                            .join(' ')}`;
                          const areaD = `${pathD} L ${points.at(-1)?.x} 145 L ${points[0].x} 145 Z`;

                          return (
                            <>
                              <path
                                d={areaD}
                                fill={`url(#userProbAreaGrad-${selectedUserStats.name.replace(/\s+/g, '-')})`}
                              />
                              <path
                                d={pathD}
                                fill="none"
                                stroke={selectedUserStats.color}
                                strokeWidth="3"
                              />
                              {Array.from({ length: 24 }, (_, i) => i).map(
                                hr => {
                                  const p = points[hr];
                                  const d =
                                    selectedUserStats.responseProbabilityByHour[
                                      hr
                                    ];
                                  return (
                                    <circle
                                      key={`dossier-prob-dot-${hr}`}
                                      cx={p.x}
                                      cy={p.y}
                                      r="4"
                                      fill="white"
                                      stroke={selectedUserStats.color}
                                      strokeWidth="2.5"
                                    >
                                      <title>
                                        Hour {hr}h: {d.probability}% likelihood
                                      </title>
                                    </circle>
                                  );
                                },
                              )}
                            </>
                          );
                        })()}

                        {/* Hour labels */}
                        {Array.from({ length: 24 }, (_, i) => i).map(hr => {
                          const x = 30 + hr * 21.3;
                          return (
                            hr % 3 === 0 && (
                              <text
                                key={hr}
                                x={x}
                                y="165"
                                fill="#94a3b8"
                                fontSize="9"
                                textAnchor="middle"
                                fontWeight="600"
                              >
                                {`${hr}h`}
                              </text>
                            )
                          );
                        })}
                        <line
                          x1="30"
                          y1="145"
                          x2="520"
                          y2="145"
                          stroke="#e2e8f0"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </S.ChartContainer>
                  </S.ChartCard>
                </div>
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: '#64748b',
                  }}
                >
                  No participant data available for in-depth profiling.
                </div>
              )}
            </>
          );
        })()}

      {subTab === 'prediction' && (
        <>
          <S.ChartRow>
            <S.ChartCard>
              <S.CardTitle>Next Message Initiator Probability</S.CardTitle>
              <S.PredictionGauge>
                {stats.conversationalArchetypeList.map(p => {
                  const probability = Math.round(
                    (p.initiationCount / totalInitiations) * 100,
                  );
                  return (
                    <div
                      key={p.name}
                      style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                        }}
                      >
                        <span>{p.name}</span>
                        <span style={{ color: p.color }}>
                          {probability}% likelihood
                        </span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '12px',
                          backgroundColor: '#e2e8f0',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border: '1px solid rgba(0,0,0,0.03)',
                        }}
                      >
                        <div
                          style={{
                            width: `${probability}%`,
                            height: '100%',
                            backgroundColor: p.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                <S.PredictionSubtitle style={{ marginTop: '1rem' }}>
                  Based on historical conversation restart patterns after long
                  silences (&gt;18 hours).
                </S.PredictionSubtitle>
              </S.PredictionGauge>
            </S.ChartCard>

            <S.ChartCard>
              <S.CardTitle>Conversational Health & Forecast</S.CardTitle>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  padding: '1rem',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: '#94a3b8',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '4px',
                    }}
                  >
                    Current Trend Status
                  </div>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: longevityForecast.color,
                      fontFamily: 'Outfit, sans-serif',
                    }}
                  >
                    {longevityForecast.status}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: '#475569',
                    borderLeft: `3px solid ${longevityForecast.color}`,
                    paddingLeft: '12px',
                  }}
                >
                  {longevityForecast.desc}
                </div>
                <S.PredictionSubtitle
                  style={{ textAlign: 'left', opacity: 0.8 }}
                >
                  Our algorithm calculates this forecast by comparing message
                  density trends between early and recent stages of the chat log
                  history.
                </S.PredictionSubtitle>
              </div>
            </S.ChartCard>
          </S.ChartRow>

          <S.ChartCard>
            <S.CardTitle>Response Likelihood by Hour of Day</S.CardTitle>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                padding: '1rem 0',
              }}
            >
              <S.PredictionSubtitle
                style={{ textAlign: 'left', marginBottom: '1.5rem' }}
              >
                Probability of receiving a response in{' '}
                <strong>under 15 minutes</strong> depending on which hour of the
                day you send a message.
              </S.PredictionSubtitle>
              <S.ChartContainer style={{ height: '200px' }}>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 540 180"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="probAreaGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop
                        offset="100%"
                        stopColor="#10b981"
                        stopOpacity="0.0"
                      />
                    </linearGradient>
                  </defs>

                  {/* Grid lines */}
                  {[25, 50, 75, 100].map(val => {
                    const y = 145 - (val / 100) * 120;
                    return (
                      <g key={val}>
                        <line
                          x1="30"
                          y1={y}
                          x2="520"
                          y2={y}
                          stroke="#f1f5f9"
                          strokeWidth="1"
                          strokeDasharray="3"
                        />
                        <text
                          x="12"
                          y={y + 4}
                          fill="#94a3b8"
                          fontSize="9"
                          fontWeight="500"
                        >
                          {val}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Draw area and path */}
                  {(() => {
                    const points = stats.responseProbabilityByHour.map(
                      (d, index) => {
                        const x = 30 + index * 21.3;
                        const y = 145 - (d.probability / 100) * 120;
                        return { x, y };
                      },
                    );

                    const pathD = `M ${points[0].x} ${points[0].y} ${points
                      .slice(1)
                      .map(p => `L ${p.x} ${p.y}`)
                      .join(' ')}`;
                    const areaD = `${pathD} L ${points.at(-1)?.x} 145 L ${points[0].x} 145 Z`;

                    return (
                      <>
                        <path d={areaD} fill="url(#probAreaGrad)" />
                        <path
                          d={pathD}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                        />
                        {Array.from({ length: 24 }, (_, i) => i).map(hr => {
                          const p = points[hr];
                          const d = stats.responseProbabilityByHour[hr];
                          return (
                            <circle
                              key={`prob-dot-${hr}`}
                              cx={p.x}
                              cy={p.y}
                              r="4"
                              fill="white"
                              stroke="#10b981"
                              strokeWidth="2.5"
                            >
                              <title>
                                Hour {hr}h: {d.probability}% fast reply rate
                              </title>
                            </circle>
                          );
                        })}
                      </>
                    );
                  })()}

                  {/* Hour labels */}
                  {Array.from({ length: 24 }, (_, i) => i).map(hr => {
                    const x = 30 + hr * 21.3;
                    return (
                      hr % 3 === 0 && (
                        <text
                          key={hr}
                          x={x}
                          y="165"
                          fill="#94a3b8"
                          fontSize="9"
                          textAnchor="middle"
                          fontWeight="600"
                        >
                          {`${hr}h`}
                        </text>
                      )
                    );
                  })}
                  <line
                    x1="30"
                    y1="145"
                    x2="520"
                    y2="145"
                    stroke="#e2e8f0"
                    strokeWidth="1.5"
                  />
                </svg>
              </S.ChartContainer>
            </div>
          </S.ChartCard>
        </>
      )}

      {subTab === 'trends' && (
        <>
          {/* ── Engagement Score Leaderboard ── */}
          <S.ChartCard>
            <S.CardTitle>
              <span style={{ fontSize: '1.2rem' }}>🏆</span> Engagement Score
              Leaderboard
            </S.CardTitle>
            <S.PredictionSubtitle
              style={{ textAlign: 'left', marginBottom: '0.5rem' }}
            >
              Composite score (0-100) combining message share, reply speed,
              topic initiations, and message depth.
            </S.PredictionSubtitle>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {stats.engagementScores.map((p, rank) => (
                <S.EngagementRow key={p.name}>
                  <S.EngagementRank $color={p.tierColor}>
                    #{rank + 1}
                  </S.EngagementRank>
                  <S.Avatar
                    $color={p.color}
                    style={{
                      width: '38px',
                      height: '38px',
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </S.Avatar>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          color: '#0f172a',
                        }}
                      >
                        {p.name}
                      </span>
                      <S.TierBadge $color={p.tierColor}>
                        {p.tier} · {p.engagementScore}/100
                      </S.TierBadge>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '10px',
                        backgroundColor: '#e2e8f0',
                        borderRadius: '5px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${p.engagementScore}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, ${p.tierColor} 0%, ${p.color} 100%)`,
                          borderRadius: '5px',
                          transition:
                            'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                      />
                    </div>
                  </div>
                </S.EngagementRow>
              ))}
            </div>
          </S.ChartCard>

          {/* ── Cumulative Growth + Monthly Activity ── */}
          <S.ChartRow>
            <S.ChartCard>
              <S.CardTitle>📈 Cumulative Message Growth</S.CardTitle>
              <S.PredictionSubtitle style={{ textAlign: 'left' }}>
                Total messages accumulated over the chat lifetime.
              </S.PredictionSubtitle>
              <S.ChartContainer style={{ height: '220px' }}>
                {stats.cumulativeGrowth.length > 1 ? (
                  (() => {
                    const maxTotal = stats.cumulativeGrowth.at(-1)?.total || 1;
                    const pts = stats.cumulativeGrowth.map((d, i) => {
                      const x =
                        30 + (i / (stats.cumulativeGrowth.length - 1)) * 490;
                      const y = 145 - (d.total / maxTotal) * 120;
                      return { x, y, ...d };
                    });
                    const pathD = `M ${pts[0].x} ${pts[0].y} ${pts
                      .slice(1)
                      .map(p => `L ${p.x} ${p.y}`)
                      .join(' ')}`;
                    const areaD = `${pathD} L ${pts.at(-1)?.x} 145 L ${pts[0].x} 145 Z`;
                    return (
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 540 180"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient
                            id="growthAreaGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#6366f1"
                              stopOpacity="0.35"
                            />
                            <stop
                              offset="100%"
                              stopColor="#6366f1"
                              stopOpacity="0.02"
                            />
                          </linearGradient>
                        </defs>
                        {[25, 50, 75, 100].map(pct => {
                          const y = 145 - (pct / 100) * 120;
                          return (
                            <g key={pct}>
                              <line
                                x1="30"
                                y1={y}
                                x2="520"
                                y2={y}
                                stroke="#f1f5f9"
                                strokeWidth="1"
                                strokeDasharray="4"
                              />
                              <text
                                x="10"
                                y={y + 4}
                                fill="#94a3b8"
                                fontSize="9"
                                fontWeight="500"
                              >
                                {Math.round(
                                  (pct / 100) * maxTotal,
                                ).toLocaleString()}
                              </text>
                            </g>
                          );
                        })}
                        <path d={areaD} fill="url(#growthAreaGrad)" />
                        <path
                          d={pathD}
                          fill="none"
                          stroke="#6366f1"
                          strokeWidth="2.5"
                        />
                        {/* Start & end dots */}
                        <circle
                          cx={pts[0].x}
                          cy={pts[0].y}
                          r="5"
                          fill="white"
                          stroke="#6366f1"
                          strokeWidth="2.5"
                        />
                        <circle
                          cx={pts.at(-1)!.x}
                          cy={pts.at(-1)!.y}
                          r="5"
                          fill="#6366f1"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <line
                          x1="30"
                          y1="145"
                          x2="520"
                          y2="145"
                          stroke="#e2e8f0"
                          strokeWidth="1.5"
                        />
                        {/* Date labels: first, middle, last */}
                        {[
                          pts[0],
                          pts[Math.floor(pts.length / 2)],
                          pts.at(-1)!,
                        ].map(p => (
                          <text
                            key={p.date}
                            x={p.x}
                            y="165"
                            fill="#94a3b8"
                            fontSize="9"
                            textAnchor="middle"
                            fontWeight="600"
                          >
                            {p.date.slice(0, 7)}
                          </text>
                        ))}
                      </svg>
                    );
                  })()
                ) : (
                  <div
                    style={{
                      color: '#94a3b8',
                      textAlign: 'center',
                      padding: '2rem',
                    }}
                  >
                    Not enough data
                  </div>
                )}
              </S.ChartContainer>
            </S.ChartCard>

            <S.ChartCard>
              <S.CardTitle>📅 Monthly Message Volume</S.CardTitle>
              <S.PredictionSubtitle style={{ textAlign: 'left' }}>
                Messages sent per calendar month across the chat history.
              </S.PredictionSubtitle>
              <S.ChartContainer style={{ height: '220px' }}>
                {stats.monthlyActivityList.length > 0 ? (
                  (() => {
                    const maxM = Math.max(
                      ...stats.monthlyActivityList.map(m => m.count),
                      1,
                    );
                    const barW = Math.max(
                      8,
                      Math.floor(480 / stats.monthlyActivityList.length) - 4,
                    );
                    return (
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 540 180"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient
                            id="monthBarGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#be185d" />
                          </linearGradient>
                        </defs>
                        {stats.monthlyActivityList.map((m, i) => {
                          const h = (m.count / maxM) * 120;
                          const x = 30 + i * (barW + 4);
                          return (
                            <g key={m.month}>
                              <title>{`${m.month}: ${m.count} messages`}</title>
                              <rect
                                x={x}
                                y={145 - h}
                                width={barW}
                                height={h}
                                rx="3"
                                fill="url(#monthBarGrad)"
                              />
                              {stats.monthlyActivityList.length <= 24 && (
                                <text
                                  x={x + barW / 2}
                                  y="165"
                                  fill="#94a3b8"
                                  fontSize="8"
                                  textAnchor="middle"
                                  fontWeight="600"
                                >
                                  {m.month.slice(5)}
                                </text>
                              )}
                            </g>
                          );
                        })}
                        <line
                          x1="20"
                          y1="145"
                          x2="520"
                          y2="145"
                          stroke="#e2e8f0"
                          strokeWidth="1"
                        />
                      </svg>
                    );
                  })()
                ) : (
                  <div
                    style={{
                      color: '#94a3b8',
                      textAlign: 'center',
                      padding: '2rem',
                    }}
                  >
                    Not enough data
                  </div>
                )}
              </S.ChartContainer>
            </S.ChartCard>
          </S.ChartRow>

          {/* ── Emoji Leaderboard + Ghost Periods ── */}
          <S.ChartRow>
            <S.ChartCard>
              <S.CardTitle>😂 Top Emojis Used</S.CardTitle>
              <S.PredictionSubtitle style={{ textAlign: 'left' }}>
                Most frequently sent emojis in the conversation.
              </S.PredictionSubtitle>
              {stats.topEmojis.length === 0 ? (
                <div
                  style={{
                    color: '#94a3b8',
                    textAlign: 'center',
                    padding: '2rem 0',
                    fontSize: '0.9rem',
                  }}
                >
                  No emojis detected in this chat.
                </div>
              ) : (
                <S.EmojiGrid>
                  {stats.topEmojis.map((e, i) => {
                    const maxCount = stats.topEmojis[0]?.count || 1;
                    const pct = Math.round((e.count / maxCount) * 100);
                    return (
                      <S.EmojiCard key={e.emoji} $rank={i}>
                        <S.EmojiGlyph>{e.emoji}</S.EmojiGlyph>
                        <S.EmojiCount>{e.count.toLocaleString()}×</S.EmojiCount>
                        <div
                          style={{
                            width: '100%',
                            height: '4px',
                            backgroundColor: '#e2e8f0',
                            borderRadius: '2px',
                            marginTop: '4px',
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              background:
                                'linear-gradient(90deg, #f59e0b, #ec4899)',
                              borderRadius: '2px',
                            }}
                          />
                        </div>
                      </S.EmojiCard>
                    );
                  })}
                </S.EmojiGrid>
              )}
            </S.ChartCard>

            <S.ChartCard>
              <S.CardTitle>👻 Longest Silence Periods</S.CardTitle>
              <S.PredictionSubtitle style={{ textAlign: 'left' }}>
                Top 5 longest gaps (&gt;12h) where nobody sent a message. Who
                broke the silence?
              </S.PredictionSubtitle>
              {stats.top5Ghosts.length === 0 ? (
                <div
                  style={{
                    color: '#94a3b8',
                    textAlign: 'center',
                    padding: '2rem 0',
                    fontSize: '0.9rem',
                  }}
                >
                  No significant silence gaps detected.
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  {stats.top5Ghosts.map((g, i) => {
                    const days = Math.floor(g.durationHours / 24);
                    const hrs = Math.round(g.durationHours % 24);
                    const durationStr =
                      days > 0 ? `${days}d ${hrs}h` : `${hrs}h`;
                    const fromStr = g.from.toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                    const toStr = g.to.toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    });
                    const breakerColor =
                      stats.participantStatsList.find(
                        p => p.name === g.breakerAuthor,
                      )?.color || '#6366f1';
                    return (
                      <S.GhostPeriodRow key={g.from.toISOString()}>
                        <S.GhostRank>#{i + 1}</S.GhostRank>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: '0.85rem',
                              color: '#64748b',
                              marginBottom: '2px',
                            }}
                          >
                            {fromStr} → {toStr}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '1.1rem',
                                fontWeight: 800,
                                color: '#0f172a',
                                fontFamily: 'Outfit, sans-serif',
                              }}
                            >
                              {durationStr} silence
                            </span>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                background: `${breakerColor}22`,
                                color: breakerColor,
                                padding: '2px 8px',
                                borderRadius: '9999px',
                                fontWeight: 700,
                              }}
                            >
                              broken by {g.breakerAuthor}
                            </span>
                          </div>
                        </div>
                      </S.GhostPeriodRow>
                    );
                  })}
                </div>
              )}
            </S.ChartCard>
          </S.ChartRow>

          {/* ── Message Length Distribution ── */}
          <S.ChartCard>
            <S.CardTitle>📏 Message Length Distribution</S.CardTitle>
            <S.PredictionSubtitle
              style={{ textAlign: 'left', marginBottom: '0.5rem' }}
            >
              Breakdown of message lengths (by word count) for each participant
              — reveals whether they prefer quick texts or lengthy replies.
            </S.PredictionSubtitle>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              {Object.entries(stats.lengthHistogram)
                .filter(([name]) => name !== 'System Messages')
                .map(([name, buckets]) => {
                  const total = buckets.reduce((s, c) => s + c, 0) || 1;
                  const userColor =
                    stats.participantStatsList.find(p => p.name === name)
                      ?.color || '#6366f1';
                  const bucketColors = [
                    '#10b981',
                    '#6366f1',
                    '#f59e0b',
                    '#ec4899',
                    '#f43f5e',
                  ];
                  return (
                    <div key={name}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '6px',
                        }}
                      >
                        <S.Avatar
                          $color={userColor}
                          style={{
                            width: '28px',
                            height: '28px',
                            fontSize: '0.8rem',
                            flexShrink: 0,
                          }}
                        >
                          {name.charAt(0).toUpperCase()}
                        </S.Avatar>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            color: '#0f172a',
                          }}
                        >
                          {name}
                        </span>
                      </div>
                      <S.LengthBar>
                        {buckets.map((count, bi) => {
                          const pct = (count / total) * 100;
                          return pct > 0 ? (
                            <S.LengthSegment
                              key={stats.lengthBuckets[bi]}
                              $pct={pct}
                              $color={bucketColors[bi]}
                              title={`${stats.lengthBuckets[bi]} words: ${count} msgs (${pct.toFixed(1)}%)`}
                            />
                          ) : null;
                        })}
                      </S.LengthBar>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.75rem',
                          marginTop: '6px',
                          flexWrap: 'wrap',
                        }}
                      >
                        {buckets.map((count, bi) => (
                          <span
                            key={stats.lengthBuckets[bi]}
                            style={{
                              fontSize: '0.72rem',
                              color: '#64748b',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            <span
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '2px',
                                background: bucketColors[bi],
                                display: 'inline-block',
                              }}
                            />
                            {stats.lengthBuckets[bi]} words:{' '}
                            {((count / total) * 100).toFixed(1)}%
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </S.ChartCard>
        </>
      )}
    </S.DashboardContainer>
  );
}

export default AnalyticsDashboard;
