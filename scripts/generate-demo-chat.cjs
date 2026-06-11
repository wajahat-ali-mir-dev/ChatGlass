/**
 * Generates a realistic WhatsApp-formatted demo chat
 * and writes it as _chat.txt inside a zip at src/assets/
 */
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

// ─── Participants ────────────────────────────────────────────────────────────
const USERS = ['Aisha Khan', 'Bilal Ahmed', 'Sara Malik', 'Zaid Hussain'];

// ─── Chat content pools ───────────────────────────────────────────────────────
const messages = [
  // Opening — system message
  { author: null, text: 'Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.' },

  // Day 1 – casual morning chat
  { author: 0, text: 'Good morning everyone! ☀️' },
  { author: 1, text: 'Morning! How\'s everyone doing today? 😊' },
  { author: 2, text: 'Heyyy! Slept so late last night 😴 but feeling okay now' },
  { author: 3, text: 'Same honestly. We stayed up till 2am on that call lol' },
  { author: 0, text: 'Haha yes that was totally worth it though 😂' },
  { author: 1, text: 'Okay agenda for today — we need to finalize the project plan' },
  { author: 2, text: 'Agreed. I already started the doc, sending you the link now' },
  { author: 2, text: 'https://docs.google.com/document/d/xyz123' },
  { author: 3, text: 'Got it, thanks Sara!' },
  { author: 0, text: 'Looks great! I made a few comments on section 2' },
  { author: 1, text: 'Perfect, let me review' },
  { author: 1, text: 'Actually the timeline seems too aggressive in section 3. Can we add 2 more weeks?' },
  { author: 2, text: 'I think we can but we need to check with the client first' },
  { author: 3, text: 'I\'ll email them this evening. Give me the revised dates' },
  { author: 0, text: '👍' },
  { author: 2, text: 'Sending them now' },
  { author: 2, text: 'Week 1-2: Research & Discovery\nWeek 3-4: Wireframes\nWeek 5-6: Design\nWeek 7-8: Dev\nWeek 9: Testing\nWeek 10: Launch' },
  { author: 1, text: 'That\'s much better! 🙌' },
  { author: 3, text: 'Great plan. Client will love this' },
  { author: 0, text: 'Should we have a standup call later today?' },
  { author: 1, text: 'Yes! 4pm works?' },
  { author: 2, text: '4pm works for me ✅' },
  { author: 3, text: '4pm is fine 👍' },
  { author: 0, text: 'Perfect, I\'ll send the invite' },

  // Day 2 – deeper discussion
  { author: 1, text: 'Good morning! Did everyone check the client\'s response?' },
  { author: 2, text: 'Yes just saw it! They approved the timeline 🎉' },
  { author: 3, text: 'Amazing news!! 🙌🎉' },
  { author: 0, text: 'Let\'s gooo!! So excited for this project 🚀' },
  { author: 1, text: 'Okay so Aisha you\'ll handle discovery, Sara handles wireframes, Zaid you\'re on dev, I\'ll manage client comms' },
  { author: 0, text: 'Sounds good! I already have some research notes from our initial convo' },
  { author: 2, text: 'Nice, share them in the doc when ready' },
  { author: 3, text: 'Do we have a Figma workspace yet?' },
  { author: 2, text: 'Not yet, I\'ll set one up today' },
  { author: 1, text: 'Also need to decide on the tech stack' },
  { author: 3, text: 'I\'d suggest React + TypeScript on the frontend, Node.js + Express backend' },
  { author: 0, text: 'Agreed, that\'s what we\'re most comfortable with' },
  { author: 2, text: 'And for the database? PostgreSQL?' },
  { author: 3, text: 'Yeah PostgreSQL + Prisma ORM. Very clean to work with' },
  { author: 1, text: 'Sounds solid 💪 Let\'s document this in the tech spec' },
  { author: 0, text: 'On it!' },
  { author: 3, text: 'BTW anyone know a good library for data visualization? Client wants charts' },
  { author: 1, text: 'Recharts is great. Very React-friendly' },
  { author: 2, text: 'Or Chart.js if you need more customization' },
  { author: 3, text: 'I\'ll check both out. Thanks!' },
  { author: 0, text: 'Recharts has better docs imo 📖' },

  // Day 3 – some fun mixed in
  { author: 2, text: 'Okay random but has anyone tried that new ramen place downtown? 🍜' },
  { author: 1, text: 'YESS it\'s so good!! 😍' },
  { author: 3, text: 'Which one??' },
  { author: 2, text: 'Ramen House on 5th, near the park' },
  { author: 0, text: 'I heard about it! The spicy tonkotsu is supposed to be incredible' },
  { author: 3, text: 'We should go as a team lunch! 🍣' },
  { author: 1, text: 'Yes!! When?' },
  { author: 2, text: 'Friday after our sprint review?' },
  { author: 0, text: 'I\'m in 🙋‍♀️' },
  { author: 3, text: 'Same. Reservations needed?' },
  { author: 2, text: 'I\'ll call them tomorrow and let you know' },
  { author: 1, text: 'Perfect! Also reminder — sprint review is at 2pm Friday' },
  { author: 0, text: 'In calendar ✅' },
  { author: 3, text: 'Noted 📝' },
  { author: 2, text: 'Okay back to work everyone lol 😅' },
  { author: 1, text: '😂 yes back to work!' },

  // Day 5 – emotional / apology moment
  { author: 3, text: 'Hey guys, I messed up the database migration today. Really sorry about that 😔' },
  { author: 0, text: 'Oh no what happened?' },
  { author: 3, text: 'I ran the wrong migration script and it corrupted a few tables. Spent 3 hours fixing it' },
  { author: 1, text: 'Ah man, that happens to the best of us. Is it fixed now?' },
  { author: 3, text: 'Yes everything is restored from backup thankfully' },
  { author: 2, text: 'Glad it\'s fixed! Don\'t beat yourself up, these things happen 💙' },
  { author: 0, text: 'Seriously we\'ve all been there. No worries Zaid 🤝' },
  { author: 1, text: 'Maybe we set up a staging environment to test migrations before prod?' },
  { author: 3, text: 'That\'s exactly what I was thinking. I\'ll set it up this week' },
  { author: 2, text: 'Great learning from this. Thanks for being transparent about it!' },
  { author: 0, text: '💯' },

  // Day 7 – late night grinding
  { author: 0, text: 'Anyone else still awake? 😅 It\'s midnight and I\'m still on the research doc' },
  { author: 1, text: 'Haha yes I\'m still here! Reviewing the design mockups Sara sent' },
  { author: 2, text: 'And I\'m waiting on your feedback lol' },
  { author: 0, text: 'We need sleep 😂😂' },
  { author: 1, text: 'After I finish this section! Sara the first 3 screens are 🔥' },
  { author: 2, text: 'Aww thank you!! 🥰 The dashboard one took me the longest' },
  { author: 0, text: 'It shows! The hierarchy is so clean' },
  { author: 3, text: 'Wait I just woke up to check my phone and you guys are all awake?? 😂' },
  { author: 1, text: 'HAHAHA go back to sleep Zaid' },
  { author: 3, text: 'Okay okay goodnight 🌙' },
  { author: 0, text: 'Night Zaid 😂' },
  { author: 2, text: 'Lol he woke up just to say goodnight' },

  // Day 10 – questions and curiosity
  { author: 1, text: 'Quick question — should we do server-side rendering or client-side?' },
  { author: 3, text: 'What does the client need exactly? Is SEO important to them?' },
  { author: 1, text: 'Yeah they want good Google rankings' },
  { author: 0, text: 'SSR then for sure. Next.js?' },
  { author: 3, text: 'Next.js would be perfect for this. I can set it up' },
  { author: 2, text: 'What about image optimization?' },
  { author: 3, text: 'Next.js has a built-in Image component that\'s excellent' },
  { author: 0, text: 'And it automatically converts to WebP which is nice 🙌' },
  { author: 2, text: 'Great! What about accessibility — does the client care about WCAG compliance?' },
  { author: 1, text: 'Good point, let me check the brief...' },
  { author: 1, text: 'Yes! They explicitly mentioned WCAG 2.1 AA compliance' },
  { author: 3, text: 'Okay I\'ll make sure to use semantic HTML and proper aria labels throughout' },
  { author: 0, text: 'I can do an accessibility audit once we have the dev build' },
  { author: 2, text: 'Perfect! This team is so thorough I love it 😊' },
  { author: 1, text: '❤️ We\'re the best' },

  // Day 12 – celebration
  { author: 3, text: 'GUYS. The MVP is deployed and working!! 🎉🎉🎉' },
  { author: 0, text: 'NO WAY! Already?!' },
  { author: 3, text: 'YES!! https://mvp.clientproject.demo' },
  { author: 2, text: 'Omg I\'m checking it now!! 😍' },
  { author: 1, text: '🚀🚀🚀 This is amazing Zaid!!' },
  { author: 2, text: 'IT LOOKS SO GOOD!! The animations are so smooth!!' },
  { author: 0, text: 'Okay wow I\'m genuinely impressed. Great work team 💪' },
  { author: 3, text: 'Couldn\'t have done it without Sara\'s designs, they\'re so polished' },
  { author: 2, text: 'Aww stop it 😭 team effort all the way!' },
  { author: 1, text: 'Sharing with the client now. Fingers crossed 🤞' },
  { author: 0, text: '🤞🤞🤞' },
  { author: 3, text: '🤞' },
  { author: 2, text: '🤞😬' },
  { author: 1, text: 'They replied: "This is beyond what we expected. Incredible work!" 🎉🎉🎉' },
  { author: 0, text: 'LETS GOOOOO!!! 🥳🥳🥳' },
  { author: 3, text: 'I\'m literally tearing up 😭' },
  { author: 2, text: 'BEST. DAY. EVER!! 🥳❤️🎊' },
  { author: 1, text: 'Team dinner is on me this Friday! 🍽️' },
  { author: 0, text: 'We deserve it 😂💯' },

  // Day 15 – ongoing work
  { author: 2, text: 'Working on the feedback from the client. Small revisions to the color palette' },
  { author: 1, text: 'What did they want changed?' },
  { author: 2, text: 'They prefer a warmer tone for the primary color. Going from #3b82f6 to #6366f1' },
  { author: 3, text: 'Should I update the design tokens?' },
  { author: 2, text: 'Yes please! All the CSS variables in theme.ts' },
  { author: 3, text: 'Done! Pushed to staging' },
  { author: 0, text: 'Looks really nice actually. I prefer the indigo too' },
  { author: 1, text: 'Client has good taste 😂' },
  { author: 2, text: 'Haha agreed! Also updated the mobile nav while I was at it' },
  { author: 0, text: 'Oh nice! Was that in the feedback too?' },
  { author: 2, text: 'No just noticed it felt cramped on smaller screens. Fixed the spacing' },
  { author: 3, text: 'Good catch. Proactive! 💪' },
  { author: 1, text: 'That\'s why we love having Sara on the team 🙌' },
  { author: 2, text: '😊💕' },

  // Day 18 – introspective/confidence
  { author: 0, text: 'Random thought — do you guys ever feel like imposters in this field? 🤔' },
  { author: 1, text: 'ALL the time honestly. Even now after years of experience' },
  { author: 3, text: 'Yes! Imposter syndrome is so real' },
  { author: 2, text: 'I think it\'s actually a sign that you care about doing good work 💙' },
  { author: 0, text: 'That\'s such a nice way to look at it' },
  { author: 1, text: 'I read somewhere that the people who feel it least are often the ones who should worry most 😂' },
  { author: 3, text: 'Dunning-Kruger effect lol' },
  { author: 0, text: 'Exactly! At least we know what we don\'t know' },
  { author: 2, text: 'We\'re always learning and that\'s what matters 🌱' },
  { author: 1, text: 'This conversation got deep fast 😂❤️' },
  { author: 0, text: 'It\'s the late night energy haha' },

  // Day 20 – final stretch
  { author: 3, text: 'Performance audit done. Lighthouse scores: 98 Performance, 96 Accessibility, 100 Best Practices 💯' },
  { author: 1, text: 'INCREDIBLE!! Those are amazing scores 🏆' },
  { author: 0, text: '98 performance is insane! How did you do it?' },
  { author: 3, text: 'Lazy loading, code splitting, image optimization, eliminated render-blocking scripts' },
  { author: 2, text: 'And the animations are hardware accelerated via CSS transforms 😊' },
  { author: 3, text: 'Yes! Sara\'s CSS work helped a lot with the paint performance' },
  { author: 0, text: 'Okay this project is genuinely impressive. I\'m proud of us 🥺' },
  { author: 1, text: 'Same 💙 okay final checklist before launch:' },
  { author: 1, text: '✅ Performance audit\n✅ Accessibility audit\n✅ Cross-browser testing\n⬜ Final client review\n⬜ DNS cutover\n⬜ Launch announcement' },
  { author: 2, text: 'I\'ll get final client sign-off today' },
  { author: 0, text: 'I can write the launch post for their socials if you want?' },
  { author: 1, text: 'Yes please! That would be amazing Aisha' },
  { author: 3, text: 'This is happening!! 🚀' },
  { author: 2, text: 'Client approved everything!! We\'re good to launch!!! 🎊' },
  { author: 0, text: 'DNS cutover initiated... 🤞' },
  { author: 3, text: 'Site is LIVE on the custom domain!! 🌐🎉' },
  { author: 1, text: '🥳🥳🥳 WE DID IT!!!' },
  { author: 2, text: '😭😭😭 So proud of everyone!!' },
  { author: 0, text: 'From zero to launch in 10 weeks. What a team ❤️' },
  { author: 3, text: 'Best team ever. No cap 💯' },
  { author: 1, text: 'Pizza and celebration drinks on Friday. Non-negotiable 🍕🥂' },
  { author: 0, text: 'ABSOLUTELY 🙌🎉' },
  { author: 2, text: '❤️❤️❤️' },
  { author: 3, text: '🍕🥂🎊' },
];

// ─── Timestamp generator ──────────────────────────────────────────────────────
// Spread messages over ~25 days, with realistic daily patterns
function generateTimestamps(count) {
  const timestamps = [];
  // Start date: 25 days ago
  const startMs = Date.now() - 25 * 24 * 60 * 60 * 1000;

  // Typical active hours distribution (weighted toward 9am-11pm)
  const activeHours = [
    8, 9, 9, 10, 10, 10, 11, 11, 12, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 20, 21, 21, 22, 22, 23,
  ];

  let cursor = startMs;
  for (let i = 0; i < count; i++) {
    // Advance time between 30s and 45 minutes (realistic group chat)
    const baseGap = Math.floor(Math.random() * 2700000) + 30000;

    // Occasionally insert a long silence (1-12 hours) to simulate overnight gaps
    const silenceRoll = Math.random();
    const silence = silenceRoll < 0.04
      ? Math.floor(Math.random() * 43200000) + 3600000  // 1-12 hours
      : 0;

    cursor += baseGap + silence;
    timestamps.push(new Date(cursor));
  }

  // Ensure timestamps stay within reasonable hour windows per day
  // (shift them if they fall in dead hours 1am-6am)
  return timestamps.map(d => {
    const h = d.getHours();
    if (h >= 1 && h <= 6) {
      d.setHours(activeHours[Math.floor(Math.random() * activeHours.length)]);
      d.setMinutes(Math.floor(Math.random() * 60));
      d.setSeconds(Math.floor(Math.random() * 60));
    }
    return d;
  });
}

// ─── Format as WhatsApp chat line ─────────────────────────────────────────────
function formatLine(date, authorName, text) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  const dateStr = `${dd}/${mm}/${yyyy}, ${hh}:${mm}:${ss}`;

  if (authorName === null) {
    return `[${dateStr}] ${text}`;
  }
  // Multi-line messages: indent continuation lines
  const lines = text.split('\n');
  const firstLine = `[${dateStr}] ${authorName}: ${lines[0]}`;
  if (lines.length === 1) return firstLine;
  return firstLine + '\n' + lines.slice(1).join('\n');
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const timestamps = generateTimestamps(messages.length);

  const chatLines = messages.map((msg, i) => {
    const authorName = msg.author !== null ? USERS[msg.author] : null;
    return formatLine(timestamps[i], authorName, msg.text);
  });

  const chatText = chatLines.join('\n') + '\n';

  // Package into zip
  const zip = new JSZip();
  zip.file('_chat.txt', chatText);

  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const outPath = path.join(__dirname, '../src/assets/whatsapp-chat-parser-example.zip');
  fs.writeFileSync(outPath, zipBuffer);

  console.log(`✅ Demo chat written to: ${outPath}`);
  console.log(`   Messages: ${messages.length}`);
  console.log(`   Participants: ${USERS.join(', ')}`);
  console.log(`   File size: ${(zipBuffer.length / 1024).toFixed(1)} KB`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
