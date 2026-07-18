/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Unit } from '../types';

export const syllabusData: Unit[] = [
  {
    id: 'unit-1',
    number: 1,
    title: 'Fun Outdoors',
    lessons: [
      {
        id: 'lesson-1',
        title: 'Camping',
        focus: 'Vocabulary & Likes',
        vocabulary: ['climb', 'hike', 'canoe', 'fish', 'grill hamburgers', 'watch birds'],
        sentencePatterns: ['What does he/she like doing?', 'He/She likes climbing.'],
        activities: [
          {
            id: 'u1-l1-act1',
            type: 'flashcard',
            title: 'Camping Vocabulary',
            instructions: 'Tap to flip the card and learn new words!',
            data: [
              { word: 'climb', meaning: 'leo núi / leo trèo', phonetic: '/klaɪm/', emoji: '🧗' },
              { word: 'hike', meaning: 'đi bộ đường dài', phonetic: '/haɪk/', emoji: '🥾' },
              { word: 'canoe', meaning: 'chèo xuồng canoe', phonetic: '/kəˈnuː/', emoji: '🛶' },
              { word: 'fish', meaning: 'câu cá', phonetic: '/fɪʃ/', emoji: '🎣' },
              { word: 'grill hamburgers', meaning: 'nướng bánh burger', phonetic: '/ɡrɪl ˈhæmˌbɜː.ɡərz/', emoji: '🍔' },
              { word: 'watch birds', meaning: 'ngắm chim', phonetic: '/wɒtʃ bɜːdz/', emoji: '🦉' }
            ]
          },
          {
            id: 'u1-l1-act2',
            type: 'sentence_builder',
            title: 'Build Like / Likes Sentences',
            instructions: 'Drag and drop words in the correct order!',
            data: {
              target: 'She likes climbing',
              options: ['climbing', 'likes', 'She', 'like', 'climb'],
              translation: 'Cô ấy thích leo trèo'
            }
          }
        ]
      },
      {
        id: 'lesson-2',
        title: 'Sports',
        focus: 'Abilities & Sports',
        vocabulary: ['ski', 'snowboard', 'ice skate', 'in-line skate', 'skateboard', 'surf'],
        sentencePatterns: ["He's/She's good at skiing.", "Is he/she good at skiing?", "Yes, he's/she's very good at it.", "No, he's/she's not very good at it."],
        activities: [
          {
            id: 'u1-l2-act1',
            type: 'flashcard',
            title: 'Sports Vocabulary',
            instructions: 'Tap to flip the card and learn sports!',
            data: [
              { word: 'ski', meaning: 'trượt tuyết', phonetic: '/skiː/', emoji: '⛷️' },
              { word: 'snowboard', meaning: 'lướt ván tuyết', phonetic: '/ˈsnəʊ.bɔːd/', emoji: '🏂' },
              { word: 'ice skate', meaning: 'trượt băng', phonetic: '/ˈaɪs.skeɪt/', emoji: '⛸️' },
              { word: 'in-line skate', meaning: 'trượt patin giày bánh dọc', phonetic: '/ˌɪn.laɪn ˈskeɪt/', emoji: '🛼' },
              { word: 'skateboard', meaning: 'trượt ván', phonetic: '/ˈskeɪt.bɔːd/', emoji: '🛹' },
              { word: 'surf', meaning: 'lướt sóng', phonetic: '/sɜːf/', emoji: '🏄' }
            ]
          }
        ]
      },
      {
        id: 'lesson-3',
        title: 'The Skating Lesson',
        focus: 'Reading & Value',
        vocabulary: ['skate', 'help', 'brave'],
        sentencePatterns: ["I'm not very good at ice skating.", "Don't worry. I can help you."],
        value: 'Be brave.',
        activities: [
          {
            id: 'u1-l3-act1',
            type: 'vocabulary_match',
            title: 'Reading Match',
            instructions: 'Match the English words with their Vietnamese translation!',
            data: [
              { english: 'skate', vietnamese: 'trượt băng/patin' },
              { english: 'help', vietnamese: 'giúp đỡ' },
              { english: 'brave', vietnamese: 'dũng cảm' },
              { english: 'worry', vietnamese: 'lo lắng' }
            ]
          }
        ]
      },
      {
        id: 'lesson-4',
        title: 'Safety',
        focus: 'Health & Protection',
        vocabulary: ['wear a helmet', 'put on sunscreen', 'wear a life jacket', 'fasten your seatbelt'],
        sentencePatterns: ['When you go snowboarding, always wear a helmet.'],
        activities: [
          {
            id: 'u1-l4-act1',
            type: 'flashcard',
            title: 'Safety Vocabulary',
            instructions: 'Stay safe by learning safety words!',
            data: [
              { word: 'wear a helmet', meaning: 'đội mũ bảo hiểm', phonetic: '/weər ə ˈhel.mət/', emoji: '🪖' },
              { word: 'put on sunscreen', meaning: 'bôi kem chống nắng', phonetic: '/pʊt ɒn ˈsʌn.skriːn/', emoji: '🧴' },
              { word: 'wear a life jacket', meaning: 'mặc áo phao', phonetic: '/weər ə laɪf ˈdʒæk.ɪt/', emoji: '🦺' },
              { word: 'fasten your seatbelt', meaning: 'thắt dây an toàn', phonetic: '/ˈfɑː.sən jɔːr ˈsiːt.belt/', emoji: '🚗' }
            ]
          }
        ]
      }
    ],
    review: {
      title: 'Review Unit 1',
      description: 'Review camping, sports, brave values, and safety rules.',
      completed: false
    }
  },
  {
    id: 'unit-2',
    number: 2,
    title: 'Land and Sea',
    lessons: [
      {
        id: 'lesson-1',
        title: 'Animals and Insects',
        focus: 'Comparisons',
        vocabulary: ['hippopotamus', 'gorilla', 'panda', 'butterfly', 'caterpillar', 'bee'],
        sentencePatterns: ['The hippopotamus is bigger than the panda.', 'The hippopotamus is the biggest.', 'Which one is the smallest?', 'The bee is the smallest.'],
        activities: []
      },
      {
        id: 'lesson-2',
        title: 'Sea Creatures',
        focus: 'Equality Comparisons',
        vocabulary: ['eel', 'seal', 'dolphin', 'squid', 'whale', 'shark'],
        sentencePatterns: ['The eel is/isn’t as long as the seal.', 'Is the eel as long as the seal?', 'Yes, it is.', 'No, it isn’t. It’s shorter.'],
        activities: []
      },
      {
        id: 'lesson-3',
        title: 'The Best Cap',
        focus: 'Value: Be thoughtful',
        vocabulary: ['longest', 'thoughtful', 'best'],
        sentencePatterns: ['Which one would you like?', 'I’d like the longest one, please.'],
        value: 'Be thoughtful.',
        activities: []
      },
      {
        id: 'lesson-4',
        title: 'Weight and Length',
        focus: 'Math Connection',
        vocabulary: ['lizard', 'beetle', 'crab', 'octopus'],
        sentencePatterns: ['How much does the lizard weigh?', 'It weighs 150 grams.', 'How long is the lizard?', 'It’s 3 meters long.'],
        activities: []
      }
    ],
    review: {
      title: 'Review Unit 2',
      description: 'Review comparisons, sea creatures, weight, and thoughtfulness.',
      completed: false
    }
  },
  {
    id: 'unit-3',
    number: 3,
    title: 'Appearance',
    lessons: [
      {
        id: 'lesson-1',
        title: 'What We Look Like',
        focus: 'Descriptions',
        vocabulary: ['short hair', 'shoulder-length hair', 'long hair', 'straight hair', 'curly hair', 'wavy hair'],
        sentencePatterns: ['What does he/she look like?', 'He/She has short, black hair and brown eyes / a beard.', 'Which one is your brother/sister?', "He's/She's the one with short, straight, black hair and brown eyes."],
        activities: []
      },
      {
        id: 'lesson-2',
        title: 'Accessories',
        focus: 'Belongings',
        vocabulary: ['watch', 'necklace', 'earrings', 'sunglasses', 'gloves', 'belt'],
        sentencePatterns: ['What does the watch/earrings look like?', 'It’s/They’re new and black.', 'Which watch/gloves does he/she want to wear?', 'He/She wants to wear the black one/ones.'],
        activities: []
      },
      {
        id: 'lesson-3',
        title: 'The School Play',
        focus: 'Value: Be kind',
        vocabulary: ['play', 'good luck', 'kind'],
        sentencePatterns: ['Good luck with the play.', 'Thanks. You, too.'],
        value: 'Be kind.',
        activities: []
      },
      {
        id: 'lesson-4',
        title: 'Camouflage',
        focus: 'Science Connection',
        vocabulary: ['stick', 'leaf', 'grass', 'sand'],
        sentencePatterns: ['The caterpillar is the same color/shape as the stick.'],
        activities: []
      }
    ],
    review: {
      title: 'Review Unit 3',
      description: 'Review physical appearance, accessories, and camouflage.',
      completed: false
    }
  },
  {
    id: 'unit-4',
    number: 4,
    title: 'Last Week',
    lessons: [
      {
        id: 'lesson-1',
        title: 'Sports Activities',
        focus: 'Simple Past Tense',
        vocabulary: ['baseball', 'basketball', 'volleyball', 'golf', 'tennis', 'table tennis'],
        sentencePatterns: ['He/She played baseball yesterday.', 'What did he/she do yesterday?', 'He/She played baseball yesterday.'],
        activities: []
      },
      {
        id: 'lesson-2',
        title: 'Activities',
        focus: 'Simple Past Practice',
        vocabulary: ['practice the piano', 'use the computer', 'talk on the phone', 'help my parents', 'visit my friend', 'work on a project'],
        sentencePatterns: ['What did you do last weekend?', 'I practiced the piano.', 'Did you practice the piano on Monday?', 'Yes, I did. / No, I didn’t.'],
        activities: []
      },
      {
        id: 'lesson-3',
        title: 'The Baseball Game',
        focus: 'Value: Be prepared',
        vocabulary: ['glove', 'borrow', 'find'],
        sentencePatterns: ['I can’t find my glove.', 'Don’t worry. You can borrow mine.'],
        value: 'Be prepared.',
        activities: []
      },
      {
        id: 'lesson-4',
        title: 'Ancient Rome',
        focus: 'Social Studies',
        vocabulary: ['stone', 'clay', 'glass', 'metal'],
        sentencePatterns: ['What did they use to make homes in Rome?', 'They used stone.'],
        activities: []
      }
    ],
    review: {
      title: 'Review Unit 4',
      description: 'Review simple past tense, activities, Rome materials, and preparedness.',
      completed: false
    }
  },
  {
    id: 'unit-5',
    number: 5,
    title: 'A Day Out',
    lessons: [
      {
        id: 'lesson-1',
        title: 'Food and Drink',
        focus: 'Past Foods',
        vocabulary: ['noodles', 'curry', 'sushi', 'lemonade', 'grape juice', 'tea'],
        sentencePatterns: ['He/She ate noodles.', 'He/She drank lemonade.', 'What did he/she eat for lunch?', 'What did he/she drink with lunch?'],
        activities: []
      },
      {
        id: 'lesson-2',
        title: 'Things to Do',
        focus: 'Past Activities',
        vocabulary: ['go bowling', 'take a picture', 'see a parade', 'have a picnic', 'get a haircut', 'buy clothes'],
        sentencePatterns: ['What did he/she do yesterday?', 'He/She went bowling.', 'When did he/she go bowling?', 'He/She went bowling yesterday.'],
        activities: []
      },
      {
        id: 'lesson-3',
        title: 'The Missing Backpack',
        focus: 'Value: Be helpful',
        vocabulary: ['backpack', 'lost', 'together'],
        sentencePatterns: ['What happened?', 'I lost my backpack. Let’s look for it together.'],
        value: 'Be helpful.',
        activities: []
      },
      {
        id: 'lesson-4',
        title: 'Dinosaurs',
        focus: 'Science Connection',
        vocabulary: ['feather', 'tail', 'claw', 'wing'],
        sentencePatterns: ['Some dinosaurs had feathers.'],
        activities: []
      }
    ],
    review: {
      title: 'Review Unit 5',
      description: 'Review past foods, outings, dinosaurs, and helpfulness.',
      completed: false
    }
  },
  {
    id: 'unit-6',
    number: 6,
    title: 'Being Creative',
    lessons: [
      {
        id: 'lesson-1',
        title: 'The Arts',
        focus: 'Creative Pursuits',
        vocabulary: ['sing songs', 'make movies', 'write stories', 'design clothes', 'paint pictures', 'make models'],
        sentencePatterns: ['What does he/she like to do in his/her free time?', 'He/She likes to sing songs.', 'Does he/she like to sing songs in his/her free time?', 'Yes, he/she does. / No, he/she doesn’t. He/She likes to make movies.'],
        activities: []
      },
      {
        id: 'lesson-2',
        title: 'Making Things',
        focus: 'Past Actions',
        vocabulary: ['cook dinner', 'bake cookies', 'make jewelry', 'make a card', 'knit a scarf', 'play music'],
        sentencePatterns: ['He/She cooked dinner for him/her/them.', 'What did he/she cook for him/her/them?', 'He/She cooked dinner for him/her/them.'],
        activities: []
      },
      {
        id: 'lesson-3',
        title: 'Good Neighbors',
        focus: 'Value: Be helpful',
        vocabulary: ['carry', 'bags', 'neighbors'],
        sentencePatterns: ['Could you carry these bags for me?', 'Sure. No problem.'],
        value: 'Be helpful.',
        activities: []
      },
      {
        id: 'lesson-4',
        title: 'Types of Art',
        focus: 'Art Appreciation',
        vocabulary: ['painting', 'photograph', 'mosaic', 'sculpture'],
        sentencePatterns: ['This is a painting of a bedroom.'],
        activities: []
      }
    ],
    review: {
      title: 'Review Unit 6',
      description: 'Review hobbies, creating things, types of art, and neighbors.',
      completed: false
    }
  },
  {
    id: 'unit-7',
    number: 7,
    title: 'Things to Be',
    lessons: [
      {
        id: 'lesson-1',
        title: 'Careers',
        focus: 'Future Jobs',
        vocabulary: ['actor', 'artist', 'musician', 'game designer', 'journalist', 'scientist'],
        sentencePatterns: ['What do you want to be when you grow up?', 'I want to be an actor.', 'What does he/she want to be when he/she grows up?', 'He/She wants to be an actor.'],
        activities: []
      },
      {
        id: 'lesson-2',
        title: 'The Future',
        focus: 'Future Activities',
        vocabulary: ['go to space', 'fly a helicopter', 'work with animals', 'drive a race car', 'explore the jungle', 'travel the world'],
        sentencePatterns: ['What do you want to do when you’re older?', 'I want to go to space.', 'What does he/she want to do when he/she’s older?', 'He/She wants to go to space.'],
        activities: []
      },
      {
        id: 'lesson-3',
        title: 'Space Museum',
        focus: 'Value: Be patient',
        vocabulary: ['sign', 'mean', 'patient'],
        sentencePatterns: ['What does that sign mean?', 'It means you can’t run here.'],
        value: 'Be patient.',
        activities: []
      },
      {
        id: 'lesson-4',
        title: 'In Space',
        focus: 'Science Connection',
        vocabulary: ['space shuttle', 'space station', 'space suit', 'Earth'],
        sentencePatterns: ['Astronauts have to/don’t have to take the space shuttle to get to the space station.'],
        activities: []
      }
    ],
    review: {
      title: 'Review Unit 7',
      description: 'Review future careers, plans, space exploration, and patience.',
      completed: false
    }
  },
  {
    id: 'unit-8',
    number: 8,
    title: 'On Vacation',
    lessons: [
      {
        id: 'lesson-1',
        title: 'Vacation Activities',
        focus: 'Future Vacation plans',
        vocabulary: ['take a boat ride', 'see a show', 'go on a bus tour', 'ride a horse', 'swim in the ocean', 'stay in a hotel'],
        sentencePatterns: ['What’s he/she going to do on vacation?', 'He’s/She’s going to take a boat ride.', 'When is he/she going to take a boat ride?', 'He’s/She’s going to take a boat ride tomorrow.'],
        activities: []
      },
      {
        id: 'lesson-2',
        title: 'Things for a Trip',
        focus: 'Vacation Items',
        vocabulary: ['swimsuit', 'towel', 'money', 'tent', 'flashlight', 'sleeping bag'],
        sentencePatterns: ['What’s he/she going to take with him/her?', 'He’s/She’s going to take a swimsuit.', 'Are they going to take swimsuits with them?', 'Yes, they are. / No, they aren’t.'],
        activities: []
      },
      {
        id: 'lesson-3',
        title: 'Vacation Plans',
        focus: 'Value: Be thoughtful',
        vocabulary: ['plans', 'great time', 'thoughtful'],
        sentencePatterns: ['Bye. Have a great time.', 'Thank you. See you next month!'],
        value: 'Be thoughtful.',
        activities: []
      },
      {
        id: 'lesson-4',
        title: 'Transportation',
        focus: 'Social Studies',
        vocabulary: ['taxi', 'ferry', 'subway', 'gondola'],
        sentencePatterns: ['How’s he/she going to the department store?', 'He’s/She’s going to take a taxi.'],
        activities: []
      }
    ],
    review: {
      title: 'Review Unit 8',
      description: 'Review vacation activities, trip preparations, transportation, and thoughtfulness.',
      completed: false
    }
  }
];

import { getVocabularyForLesson } from './vocabulary';

// Helper to get structured activities dynamically
export function getLessonActivities(unitId: string, lessonId: string): any[] {
  // Find unit & lesson
  const unit = syllabusData.find(u => u.id === unitId);
  if (!unit) return [];
  const lesson = unit.lessons.find(l => l.id === lessonId);
  if (!lesson) return [];
  
  // Get rich vocabulary from database
  const richVocab = getVocabularyForLesson(unitId, lessonId);
  const vocabItems = richVocab.length > 0 ? richVocab.map(v => v.word) : lesson.vocabulary;
  const targetPattern = lesson.sentencePatterns[0] || 'Hello!';
  const targetPatternReply = lesson.sentencePatterns[1] || 'Welcome!';
  
  const flashcardData = richVocab.length > 0 ? richVocab.map(item => ({
    word: item.word,
    meaning: item.meaning,
    phonetic: item.ipa,
    emoji: item.emoji,
    partOfSpeech: item.partOfSpeech,
    exampleSentence: item.exampleSentence,
    exampleTranslation: item.exampleTranslation
  })) : vocabItems.map((word, index) => {
    const emojis = ['🌟', '🎒', '🎨', '🚀', '🌈', '⛺', '🦖', '🏀', '🚗', '🗺️', '🍕', '🦁'];
    const emoji = emojis[index % emojis.length];
    return {
      word,
      meaning: `Từ vựng học tập: ${word}`,
      phonetic: `/${word.replace(' ', '.')}/`,
      emoji,
      partOfSpeech: 'Noun',
      exampleSentence: `Let's practice the word ${word}.`,
      exampleTranslation: `Chúng ta cùng luyện tập từ ${word}.`
    };
  });

  const matchingData = richVocab.length > 0 ? richVocab.map(item => ({
    english: item.word,
    vietnamese: item.meaning,
    emoji: item.emoji
  })) : vocabItems.map(word => ({
    english: word,
    vietnamese: `Nghĩa của: ${word}`,
    emoji: '⭐'
  }));

  // Create activities array
  return [
    {
      id: `${unitId}-${lessonId}-flashcard`,
      type: 'flashcard',
      title: `Flashcard học tập: ${lesson.title}`,
      instructions: 'Nhấp chuột để lật thẻ từ vựng và luyện phát âm!',
      data: flashcardData
    },
    {
      id: `${unitId}-${lessonId}-match`,
      type: 'vocabulary_match',
      title: 'Trò chơi Nối từ',
      instructions: 'Chọn từ tiếng Anh và phần nghĩa tiếng Việt tương ứng để nối chúng lại!',
      data: matchingData
    }
  ];
}
