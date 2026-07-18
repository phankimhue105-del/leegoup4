/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GrammarPoint {
  id: string;
  title: string;
  structure: string;
  explanation: string;
  commonMistakes: string;
  rememberTip: string;
  examples: {
    english: string;
    vietnamese: string;
    type: 'target' | 'example' | 'practice' | 'challenge';
  }[];
}

export interface GrammarExercise {
  id: string;
  type: 'scrambled_words' | 'fill_in_blank' | 'choose_correct' | 'find_error' | 'complete_dialog' | 'picture_matching';
  question: string;
  prompt: string; // Vietnamese clue or meaning
  options: string[]; // Options for selection or scrambled words
  correctAnswer: string | number; // Correct string answer or correct index (0-based)
  explanation: string; // Grammar explanation and rule feedback
  difficulty: 'target' | 'example' | 'practice' | 'challenge';
}

export interface GrammarLessonData {
  grammarPoint: GrammarPoint;
  exercises: GrammarExercise[];
}

// Complete rich grammar database for Oxford Everybody Up 4
export const grammarDatabase: Record<string, Record<string, GrammarLessonData>> = {
  'unit-1': {
    'lesson-1': {
      grammarPoint: {
        id: 'u1-l1-gp',
        title: 'Cấu trúc Hỏi & Trả lời sở thích (Like + V-ing)',
        structure: 'Q: What does he/she like doing?\nA: He/She likes climbing.',
        explanation: 'Dùng để hỏi và nói về sở thích hoạt động ngoài trời của một ai đó (ở ngôi thứ 3 số ít: He, She). Nhớ thêm "s" vào sau từ "like" thành "likes" khi nói về He hoặc She nhé!',
        commonMistakes: 'Không dùng: "What does she likes doing?" hoặc "He like climbing."\nĐúng là: "What does she like doing?" và "He likes climbing."',
        rememberTip: 'He, She thì đi với "likes" (có s), còn từ chỉ hành động đằng sau phải thêm đuôi "-ing" (ví dụ: climbing, hiking).',
        examples: [
          { english: 'What does he like doing?', vietnamese: 'Cậu ấy thích làm gì?', type: 'target' },
          { english: 'He likes climbing.', vietnamese: 'Cậu ấy thích leo trèo.', type: 'target' },
          { english: 'What does she like doing?', vietnamese: 'Cô ấy thích làm gì?', type: 'example' },
          { english: 'She likes watching birds.', vietnamese: 'Cô ấy thích ngắm chim.', type: 'practice' },
          { english: 'Do they like grilling hamburgers?', vietnamese: 'Họ có thích nướng bánh burger không?', type: 'challenge' }
        ]
      },
      exercises: [
        {
          id: 'u1-l1-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp các từ để hoàn thành câu đúng về sở thích:',
          prompt: 'Cô ấy thích leo núi.',
          options: ['likes', 'climbing', 'She', '.'],
          correctAnswer: 'She likes climbing .',
          explanation: 'Chủ ngữ "She" đứng đầu, đi kèm động từ thêm s là "likes" và động từ thêm -ing là "climbing".',
          difficulty: 'target'
        },
        {
          id: 'u1-l1-ex2',
          type: 'fill_in_blank',
          question: 'Điền dạng đúng của từ "like" vào ô trống:',
          prompt: 'What does he ____ doing?',
          options: ['likes', 'like', 'liking'],
          correctAnswer: 1,
          explanation: 'Trong câu hỏi đã có trợ động từ "does" nên động từ chính "like" giữ nguyên mẫu, không thêm "s".',
          difficulty: 'example'
        },
        {
          id: 'u1-l1-ex3',
          type: 'choose_correct',
          question: 'Chọn câu viết đúng ngữ pháp tiếng Anh chuẩn:',
          prompt: 'Cậu ấy thích ngắm chim.',
          options: [
            'He likes watch birds.',
            'He like watching birds.',
            'He likes watching birds.'
          ],
          correctAnswer: 2,
          explanation: 'Chủ ngữ "He" đi với "likes" và động từ "watch" phải thêm "-ing" thành "watching".',
          difficulty: 'practice'
        },
        {
          id: 'u1-l1-ex4',
          type: 'find_error',
          question: 'Tìm lỗi sai trong câu dưới đây:',
          prompt: 'She likes grill hamburgers in the afternoon.',
          options: ['likes', 'grill', 'hamburgers'],
          correctAnswer: 1,
          explanation: 'Sau động từ "likes" chỉ sở thích, động từ "grill" phải chuyển thành "grilling" (grilling hamburgers).',
          difficulty: 'challenge'
        }
      ]
    },
    'lesson-2': {
      grammarPoint: {
        id: 'u1-l2-gp',
        title: 'Cấu trúc Hỏi & Trả lời về Khả năng môn Thể thao (Good at + V-ing)',
        structure: 'Q: Is he/she good at skiing?\nA: Yes, he\'s/she\'s very good at it. / No, he\'s/she\'s not very good at it.',
        explanation: 'Dùng để hỏi một người có giỏi làm hoạt động hay môn thể thao nào đó không. Cấu trúc là "good at" + động từ thêm "-ing".',
        commonMistakes: 'Không dùng: "He good at ski." hoặc "She is good at snowboard."\nĐúng là: "He is good at skiing." hoặc "She is good at snowboarding."',
        rememberTip: 'Sau "good at" luôn là một hành động thêm đuôi "-ing". Khi trả lời ngắn gọn, có thể dùng "at it" để thay thế cho cả hoạt động.',
        examples: [
          { english: "He's good at skiing.", vietnamese: 'Cậu ấy giỏi trượt tuyết.', type: 'target' },
          { english: 'Is she good at surfing?', vietnamese: 'Cô ấy có giỏi lướt sóng không?', type: 'target' },
          { english: "Yes, she's very good at it.", vietnamese: 'Có, cô ấy rất giỏi môn đó.', type: 'example' },
          { english: "No, he's not very good at it.", vietnamese: 'Không, cậu ấy không giỏi môn đó lắm.', type: 'practice' },
          { english: 'Are they good at ice skating?', vietnamese: 'Họ có giỏi trượt băng không?', type: 'challenge' }
        ]
      },
      exercises: [
        {
          id: 'u1-l2-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp các từ để hoàn thành câu hỏi về khả năng:',
          prompt: 'Cô ấy có giỏi lướt sóng không?',
          options: ['she', 'at', 'Is', 'good', 'surfing', '?'],
          correctAnswer: 'Is she good at surfing ?',
          explanation: 'Câu hỏi đảo động từ to-be "Is" lên đầu câu, theo sau là chủ ngữ "she", cụm từ "good at" và động từ "surfing".',
          difficulty: 'target'
        },
        {
          id: 'u1-l2-ex2',
          type: 'fill_in_blank',
          question: 'Điền từ còn thiếu vào câu trả lời phủ định:',
          prompt: "No, he's not very good ___ it.",
          options: ['on', 'at', 'in'],
          correctAnswer: 1,
          explanation: 'Giới từ đi kèm với từ "good" để chỉ năng khiếu là "at" (good at something / good at doing something).',
          difficulty: 'example'
        },
        {
          id: 'u1-l2-ex3',
          type: 'choose_correct',
          question: 'Chọn câu viết đúng ngữ pháp nhất:',
          prompt: 'Tôi giỏi trượt ván.',
          options: [
            'I am good at skateboard.',
            'I am good at skateboarding.',
            'I am very good in skateboarding.'
          ],
          correctAnswer: 1,
          explanation: 'Chúng ta dùng "good at" cộng với động từ thêm -ing "skateboarding".',
          difficulty: 'practice'
        },
        {
          id: 'u1-l2-ex4',
          type: 'find_error',
          question: 'Tìm lỗi sai trong câu dưới đây:',
          prompt: 'Is she very good at ice skate?',
          options: ['Is', 'good at', 'ice skate'],
          correctAnswer: 2,
          explanation: 'Sau giới từ "at", động từ trượt băng phải ở dạng thêm -ing: "ice skating".',
          difficulty: 'challenge'
        }
      ]
    },
    'lesson-3': {
      grammarPoint: {
        id: 'u1-l3-gp',
        title: 'Mẫu câu Giao tiếp & Trấn an bạn bè (Don\'t worry)',
        structure: 'A: I\'m not very good at ice skating.\nB: Don\'t worry. I can help you.',
        explanation: 'Dùng khi bạn mình lo lắng hoặc cảm thấy không tự tin về một hoạt động nào đó. Câu "Don\'t worry. I can help you" thể hiện sự dũng cảm, biết giúp đỡ và cảm thông.',
        commonMistakes: 'Không dùng: "Don\'t worried." hoặc "I can helping you."\nĐúng là: "Don\'t worry." và "I can help you."',
        rememberTip: 'Sau động từ khuyết thiếu "can", chúng ta dùng động từ nguyên mẫu không chia (help, skate, play...).',
        examples: [
          { english: "I'm not very good at ice skating.", vietnamese: 'Tớ trượt băng không giỏi lắm.', type: 'target' },
          { english: "Don't worry. I can help you.", vietnamese: 'Đừng lo lắng. Tớ có thể giúp cậu.', type: 'target' },
          { english: 'Can you help him?', vietnamese: 'Cậu có thể giúp bạn ấy không?', type: 'example' },
          { english: 'I can help them snowboard.', vietnamese: 'Tớ có thể giúp họ chơi lướt ván tuyết.', type: 'practice' },
          { english: "Be brave! Don't be afraid.", vietnamese: 'Dũng cảm lên! Đừng sợ hãi nhé.', type: 'challenge' }
        ]
      },
      exercises: [
        {
          id: 'u1-l3-ex1',
          type: 'complete_dialog',
          question: 'Hoàn thành đoạn hội thoại sau:',
          prompt: 'Bạn nói "I can\'t swim." Con sẽ an ủi và giúp đỡ bạn thế nào?',
          options: [
            "Don't worry. I can help you.",
            'No, you are not.',
            'Yes, I can.'
          ],
          correctAnswer: 0,
          explanation: '"Don\'t worry. I can help you." là câu nói lịch sự, trấn an và giúp đỡ bạn khi bạn gặp khó khăn.',
          difficulty: 'target'
        },
        {
          id: 'u1-l3-ex2',
          type: 'scrambled_words',
          question: 'Sắp xếp các từ thành câu đúng:',
          prompt: 'Tớ có thể giúp cậu trượt patin.',
          options: ['help', 'skate', 'I', 'can', 'you', '.'],
          correctAnswer: 'I can help you skate .',
          explanation: 'Chủ ngữ "I", đi với "can" + động từ nguyên thể "help" + tân ngữ "you" + động từ "skate".',
          difficulty: 'example'
        }
      ]
    },
    'lesson-4': {
      grammarPoint: {
        id: 'u1-l4-gp',
        title: 'Mẫu câu Chỉ dẫn An toàn (When... always...)',
        structure: 'When you go snowboarding, always wear a helmet.',
        explanation: 'Dùng để đưa ra lời khuyên an toàn, nhắc nhở ai đó luôn luôn làm việc gì (đeo mũ bảo hiểm, mặc áo phao, thắt dây an toàn) khi tham gia một hoạt động cụ thể.',
        commonMistakes: 'Không dùng: "When you go snowboarding, always wearing a helmet."\nĐúng là: "When you go snowboarding, always wear a helmet."',
        rememberTip: 'Sau từ "always" trong câu mệnh lệnh, khuyên nhủ, chúng ta dùng động từ nguyên mẫu (wear, put, fasten...).',
        examples: [
          { english: 'When you go snowboarding, always wear a helmet.', vietnamese: 'Khi bạn đi lướt ván tuyết, hãy luôn đội mũ bảo hiểm.', type: 'target' },
          { english: 'When you go canoeing, always wear a life jacket.', vietnamese: 'Khi bạn đi chèo xuồng, hãy luôn mặc áo phao.', type: 'example' },
          { english: 'When you ride in a car, always fasten your seatbelt.', vietnamese: 'Khi bạn đi ô tô, hãy luôn thắt dây an toàn.', type: 'practice' },
          { english: 'When you play in the sun, always put on sunscreen.', vietnamese: 'Khi bạn chơi ngoài trời nắng, hãy luôn bôi kem chống nắng.', type: 'challenge' }
        ]
      },
      exercises: [
        {
          id: 'u1-l4-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu chỉ dẫn an toàn chuẩn Oxford:',
          prompt: 'Khi đi thuyền canoe, hãy luôn mặc áo phao.',
          options: ['wear', 'canoeing', 'When', 'you', 'go', ',', 'always', 'a', 'life jacket', '.'],
          correctAnswer: 'When you go canoeing , always wear a life jacket .',
          explanation: 'Mệnh đề trạng ngữ chỉ thời gian "When you go + V-ing" đứng đầu, tiếp theo là mệnh đề mệnh lệnh "always + động từ nguyên mẫu".',
          difficulty: 'target'
        },
        {
          id: 'u1-l4-ex2',
          type: 'fill_in_blank',
          question: 'Chọn từ phù hợp nhất điền vào chỗ trống:',
          prompt: 'When you play outdoors, always ______ on sunscreen.',
          options: ['puts', 'putting', 'put'],
          correctAnswer: 2,
          explanation: 'Chúng ta sử dụng động từ nguyên mẫu "put" sau trạng từ "always" trong câu khuyên nhủ.',
          difficulty: 'example'
        },
        {
          id: 'u1-l4-ex3',
          type: 'choose_correct',
          question: 'Chọn câu viết đúng chính tả và ngữ pháp:',
          prompt: 'Khi đi xe hơi, hãy luôn thắt dây an toàn.',
          options: [
            'When you ride in a car, always fasten your seatbelt.',
            'When you go in a car, always fastening your seatbelt.',
            'When you ride in a car, always wear your seatbelt.'
          ],
          correctAnswer: 0,
          explanation: '"fasten your seatbelt" là cụm từ chuẩn để nói về việc thắt dây an toàn khi đi ô tô.',
          difficulty: 'practice'
        }
      ]
    }
  },
  'unit-2': {
    'lesson-1': {
      grammarPoint: {
        id: 'u2-l1-gp',
        title: 'Cấu trúc So sánh hơn và So sánh nhất (Comparatives & Superlatives)',
        structure: 'Q: Which one is the smallest?\nA: The bee is the smallest. / The hippopotamus is bigger than the panda.',
        explanation: 'Dùng để so sánh giữa hai con vật (So sánh hơn: thêm "-er than") hoặc so sánh giữa nhiều con vật để tìm ra con nhất (So sánh nhất: thêm "the" + "-est").',
        commonMistakes: 'Không dùng: "The panda is more big than the bee." hoặc "The bee is smallest."\nĐúng là: "The panda is bigger than the bee." hoặc "The bee is the smallest."',
        rememberTip: 'Tính từ ngắn như: big -> bigger -> the biggest; small -> smaller -> the smallest.',
        examples: [
          { english: 'The hippopotamus is bigger than the panda.', vietnamese: 'Hà mã thì to hơn gấu trúc.', type: 'target' },
          { english: 'The hippopotamus is the biggest.', vietnamese: 'Hà mã là con to nhất.', type: 'target' },
          { english: 'Which one is the smallest?', vietnamese: 'Con nào là con nhỏ nhất?', type: 'example' },
          { english: 'The bee is the smallest.', vietnamese: 'Con ong là con nhỏ nhất.', type: 'practice' }
        ]
      },
      exercises: [
        {
          id: 'u2-l1-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu so sánh hơn đúng ngữ pháp:',
          prompt: 'Con hà mã to hơn con gấu trúc.',
          options: ['is', 'The', 'hippopotamus', 'bigger', 'than', 'the', 'panda', '.'],
          correctAnswer: 'The hippopotamus is bigger than the panda .',
          explanation: 'Cấu trúc so sánh hơn của tính từ ngắn: S1 + is + Adj-er + than + S2.',
          difficulty: 'target'
        },
        {
          id: 'u2-l1-ex2',
          type: 'fill_in_blank',
          question: 'Điền tính từ so sánh nhất thích hợp:',
          prompt: 'Which one is the ______? (Nhỏ nhất)',
          options: ['smaller', 'small', 'smallest'],
          correctAnswer: 2,
          explanation: 'So sánh nhất đi kèm với "the" phía trước và đuôi "-est" ở sau tính từ ngắn.',
          difficulty: 'example'
        },
        {
          id: 'u2-l1-ex3',
          type: 'choose_correct',
          question: 'Chọn câu so sánh đúng ngữ pháp:',
          prompt: 'Gấu trúc thì nhỏ hơn hà mã.',
          options: [
            'The panda is smallest than the hippopotamus.',
            'The panda is smaller than the hippopotamus.',
            'The panda is as smaller than the hippopotamus.'
          ],
          correctAnswer: 1,
          explanation: '"smaller than" dùng để so sánh hơn giữa hai chủ thể.',
          difficulty: 'practice'
        }
      ]
    },
    'lesson-2': {
      grammarPoint: {
        id: 'u2-l2-gp',
        title: 'Cấu trúc So sánh Bằng và Không Bằng (As... as...)',
        structure: 'Q: Is the eel as long as the seal?\nA: Yes, it is. / No, it isn’t. It’s shorter.',
        explanation: 'Dùng để so sánh hai sự vật có tính chất bằng nhau (S1 + to be + as + Adj + as + S2) hoặc không bằng nhau (isn\'t as + Adj + as).',
        commonMistakes: 'Không dùng: "The eel is as longer as the seal."\nĐúng là: "The eel is as long as the seal." (giữ nguyên tính từ gốc)',
        rememberTip: 'Giữa hai từ "as... as" luôn là một tính từ nguyên mẫu (không thêm đuôi -er hay -est).',
        examples: [
          { english: 'The eel is as long as the seal.', vietnamese: 'Con lươn dài bằng con hải cẩu.', type: 'target' },
          { english: 'The eel isn’t as long as the seal.', vietnamese: 'Con lươn không dài bằng con hải cẩu.', type: 'target' },
          { english: 'Is the eel as long as the seal?', vietnamese: 'Con lươn có dài bằng con hải cẩu không?', type: 'example' },
          { english: "No, it isn't. It's shorter.", vietnamese: 'Không, không phải. Nó ngắn hơn.', type: 'practice' }
        ]
      },
      exercises: [
        {
          id: 'u2-l2-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu so sánh bằng hoàn chỉnh:',
          prompt: 'Con lươn dài bằng con hải cẩu.',
          options: ['as', 'The', 'eel', 'is', 'long', 'as', 'the', 'seal', '.'],
          correctAnswer: 'The eel is as long as the seal .',
          explanation: 'Cấu trúc so sánh bằng: S + to be + as + adj + as + N.',
          difficulty: 'target'
        },
        {
          id: 'u2-l2-ex2',
          type: 'fill_in_blank',
          question: 'Điền từ phủ định đúng trong câu so sánh không bằng:',
          prompt: "The squid ______ as big as the whale.",
          options: ['not', 'isn’t', 'aren’t'],
          correctAnswer: 1,
          explanation: 'Chủ ngữ "The squid" số ít nên đi với to be phủ định là "isn\'t".',
          difficulty: 'example'
        }
      ]
    },
    'lesson-3': {
      grammarPoint: {
        id: 'u2-l3-gp',
        title: 'Mẫu câu Nhã nhặn khi lựa chọn đồ vật',
        structure: 'Q: Which one would you like?\nA: I’d like the longest one, please.',
        explanation: 'Dùng để hỏi một cách lịch sự khi muốn mời ai đó lựa chọn đồ vật, và cách trả lời bày tỏ mong muốn nhã nhặn với cụm "I\'d like" (tắt của I would like) + so sánh nhất.',
        commonMistakes: 'Không dùng: "I want the longer one." (Thiếu lịch sự)\nĐúng là: "I’d like the longest one, please."',
        rememberTip: '"I\'d like" là cách nói lịch sự, nhớ thêm chữ "please" ở cuối câu để tăng tính lễ phép nhé con!',
        examples: [
          { english: 'Which one would you like?', vietnamese: 'Con thích cái nào hơn?', type: 'target' },
          { english: 'I’d like the longest one, please.', vietnamese: 'Cho con xin cái dài nhất ạ.', type: 'target' },
          { english: 'Which one is the best?', vietnamese: 'Cái nào là cái tốt nhất?', type: 'example' }
        ]
      },
      exercises: [
        {
          id: 'u2-l3-ex1',
          type: 'complete_dialog',
          question: 'Hoàn thành câu trả lời lịch sự:',
          prompt: 'Người bán hàng hỏi: "Which cap would you like?" Con trả lời thế nào?',
          options: [
            "I'd like the biggest one, please.",
            'I want big cap!',
            'Yes, I like.'
          ],
          correctAnswer: 0,
          explanation: '"I\'d like + the + so sánh nhất + please" là mẫu câu trả lời vô cùng lịch sự và chuẩn Oxford.',
          difficulty: 'target'
        }
      ]
    },
    'lesson-4': {
      grammarPoint: {
        id: 'u2-l4-gp',
        title: 'Cấu trúc hỏi chiều dài và cân nặng (How much / How long)',
        structure: 'Q: How much does the lizard weigh?\nA: It weighs 150 grams.\nQ: How long is the lizard?\nA: It’s 3 meters long.',
        explanation: 'Dùng để hỏi về cân nặng của sinh vật (dùng "How much does ... weigh?" với động từ weigh) hoặc hỏi độ dài (dùng "How long is...?" với tính từ long).',
        commonMistakes: 'Không dùng: "How long is the lizard weigh?" hoặc "It weigh 150 grams."\nĐúng là: "How long is the lizard?" và "It weighs 150 grams." (nhớ thêm s vào động từ)',
        rememberTip: '"weigh" (không có s) là động từ trong câu hỏi có trợ động từ "does". Trong câu trả lời, chủ ngữ "It" số ít nên động từ "weighs" có thêm s.',
        examples: [
          { english: 'How much does the lizard weigh?', vietnamese: 'Con thằn lằn nặng bao nhiêu?', type: 'target' },
          { english: 'It weighs 150 grams.', vietnamese: 'Nó nặng 150 gam.', type: 'target' },
          { english: 'How long is the lizard?', vietnamese: 'Con thằn lằn dài bao nhiêu?', type: 'example' },
          { english: 'It’s 3 meters long.', vietnamese: 'Nó dài 3 mét.', type: 'example' }
        ]
      },
      exercises: [
        {
          id: 'u2-l4-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu hỏi cân nặng chính xác:',
          prompt: 'Con thằn lằn nặng bao nhiêu?',
          options: ['weigh', 'does', 'How', 'much', 'the', 'lizard', '?'],
          correctAnswer: 'How much does the lizard weigh ?',
          explanation: 'Câu hỏi cân nặng: How much + does + chủ ngữ số ít + weigh (động từ nguyên thể).',
          difficulty: 'target'
        },
        {
          id: 'u2-l4-ex2',
          type: 'fill_in_blank',
          question: 'Điền dạng đúng của động từ cân nặng:',
          prompt: 'The lizard ______ 2 kilograms.',
          options: ['weigh', 'weighs', 'weighing'],
          correctAnswer: 1,
          explanation: 'Chủ ngữ "The lizard" là ngôi thứ ba số ít nên động từ "weighs" cần thêm "s" ở thì hiện tại đơn.',
          difficulty: 'example'
        }
      ]
    }
  },
  'unit-3': {
    'lesson-1': {
      grammarPoint: {
        id: 'u3-l1-gp',
        title: 'Cấu trúc Miêu tả Ngoại hình và Nhận diện (Look Like & Have/Has)',
        structure: 'Q: What does he/she look like?\nA: He/She has short, black hair.\nQ: Which one is your sister?\nA: She\'s the one with short, straight, black hair.',
        explanation: 'Dùng để hỏi ngoại hình ai đó ("What does... look like?") và cách trả lời miêu tả tóc, mắt bằng động từ "has" (cho He/She) hoặc định vị người đó bằng cụm "the one with + đặc điểm".',
        commonMistakes: 'Không dùng: "What does she looks like?" hoặc "She have curly hair."\nĐúng là: "What does she look like?" và "She has curly hair."',
        rememberTip: 'Khi sắp xếp tính từ miêu tả tóc, hãy tuân theo thứ tự: Độ dài -> Kiểu dáng -> Màu sắc (ví dụ: short, straight, black hair).',
        examples: [
          { english: 'What does she look like?', vietnamese: 'Cô ấy trông như thế nào?', type: 'target' },
          { english: 'She has short, black hair and brown eyes.', vietnamese: 'Cô ấy có mái tóc ngắn màu đen và đôi mắt màu nâu.', type: 'target' },
          { english: 'Which one is your sister?', vietnamese: 'Ai là chị gái của bạn?', type: 'example' },
          { english: "She's the one with short, straight, black hair.", vietnamese: 'Chị ấy là người có mái tóc ngắn, thẳng và màu đen.', type: 'practice' }
        ]
      },
      exercises: [
        {
          id: 'u3-l1-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu miêu tả đặc điểm ngoại hình chuẩn Oxford:',
          prompt: 'Cô ấy có mái tóc ngắn màu đen.',
          options: ['has', 'She', 'hair', 'short', ',', 'black', '.'],
          correctAnswer: 'She has short , black hair .',
          explanation: 'Thứ tự tính từ miêu tả: short (độ dài) rồi đến black (màu sắc).',
          difficulty: 'target'
        },
        {
          id: 'u3-l1-ex2',
          type: 'fill_in_blank',
          question: 'Điền từ chỉ sự sở hữu ngoại hình đúng với ngôi thứ ba số ít:',
          prompt: 'He ______ wavy hair and a beard.',
          options: ['have', 'has', 'having'],
          correctAnswer: 1,
          explanation: '"He" đi với động từ bất quy tắc "has" khi nói về đặc điểm ngoại hình sở hữu.',
          difficulty: 'example'
        }
      ]
    },
    'lesson-2': {
      grammarPoint: {
        id: 'u3-l2-gp',
        title: 'Miêu tả Phụ kiện & Lựa chọn trang phục (Which... want to wear?)',
        structure: 'Q: Which watch does he/she want to wear?\nA: He/She wants to wear the black one.',
        explanation: 'Dùng để hỏi xem ai đó muốn đeo/mặc phụ kiện nào. Sử dụng "one" cho phụ kiện số ít (watch, necklace, belt) và "ones" cho phụ kiện số nhiều (earrings, sunglasses, gloves).',
        commonMistakes: 'Không dùng: "She wants to wear the black ones watch." hoặc "He want to wear..."\nĐúng là: "She wants to wear the black one." và "He wants to wear..."',
        rememberTip: 'Chủ ngữ "He/She" thì động từ "want" phải chuyển thành "wants" (thêm s).',
        examples: [
          { english: 'Which watch does she want to wear?', vietnamese: 'Cô ấy muốn đeo chiếc đồng hồ nào?', type: 'target' },
          { english: 'She wants to wear the black one.', vietnamese: 'Cô ấy muốn đeo cái màu đen.', type: 'target' },
          { english: 'Which gloves does he want to wear?', vietnamese: 'Cậu ấy muốn đeo đôi găng tay nào?', type: 'example' },
          { english: 'He wants to wear the black ones.', vietnamese: 'Cậu ấy muốn đeo đôi găng tay màu đen.', type: 'practice' }
        ]
      },
      exercises: [
        {
          id: 'u3-l2-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu hỏi sự lựa chọn phụ kiện số nhiều:',
          prompt: 'Cậu ấy muốn đeo cặp kính râm nào?',
          options: ['does', 'want', 'Which', 'sunglasses', 'he', 'to', 'wear', '?'],
          correctAnswer: 'Which sunglasses does he want to wear ?',
          explanation: 'Với kính râm số nhiều (sunglasses), câu hỏi là "Which sunglasses does he want to wear?".',
          difficulty: 'target'
        },
        {
          id: 'u3-l2-ex2',
          type: 'fill_in_blank',
          question: 'Điền từ đại diện cho danh từ số nhiều đã nhắc đến:',
          prompt: 'He wants to wear the black ______ (đôi găng tay).',
          options: ['one', 'ones', 'it'],
          correctAnswer: 1,
          explanation: 'Găng tay (gloves) là số nhiều, ta phải dùng đại từ "ones" thay thế.',
          difficulty: 'example'
        }
      ]
    },
    'lesson-3': {
      grammarPoint: {
        id: 'u3-l3-gp',
        title: 'Mẫu câu chúc may mắn & lịch sự',
        structure: 'A: Good luck with the play.\nB: Thanks. You, too.',
        explanation: 'Mẫu câu giao tiếp lịch sự để chúc ai đó gặp nhiều may mắn trong buổi biểu diễn hoặc sự kiện nào đó, và cách đáp lại thân thiện.',
        commonMistakes: 'Không dùng: "Good luck for the play."\nĐúng là: "Good luck with the play."',
        rememberTip: 'Cụm từ cố định là "Good luck with [something]" (Chúc may mắn với việc gì).',
        examples: [
          { english: 'Good luck with the play.', vietnamese: 'Chúc cậu may mắn với vở kịch nhé.', type: 'target' },
          { english: 'Thanks. You, too.', vietnamese: 'Cảm ơn cậu. Cậu cũng thế nhé.', type: 'target' }
        ]
      },
      exercises: [
        {
          id: 'u3-l3-ex1',
          type: 'complete_dialog',
          question: 'Chọn câu đáp lại lời chúc tốt đẹp chuẩn văn hóa Anh:',
          prompt: 'Bạn nói: "Good luck with your English test!" Con trả lời thế nào?',
          options: [
            'Thanks. You, too.',
            'No, thanks.',
            'Yes, I do.'
          ],
          correctAnswer: 0,
          explanation: '"Thanks. You, too." là lời đáp cực kỳ lịch sự và tự nhiên nhất khi ai đó chúc con may mắn.',
          difficulty: 'target'
        }
      ]
    },
    'lesson-4': {
      grammarPoint: {
        id: 'u3-l4-gp',
        title: 'Cấu trúc So sánh Sự tương đồng (The same... as...)',
        structure: 'The caterpillar is the same color/shape as the stick.',
        explanation: 'Cấu trúc dùng để so sánh sự giống nhau về đặc điểm (màu sắc, hình dáng) giữa hai vật thể, thường dùng trong miêu tả ngụy trang động vật.',
        commonMistakes: 'Không dùng: "The caterpillar is same color with the stick."\nĐúng là: "The caterpillar is the same color as the stick."',
        rememberTip: 'Nhớ phải có mạo từ "the" đứng trước "same" và giới từ "as" đứng sau (the same... as).',
        examples: [
          { english: 'The caterpillar is the same color as the stick.', vietnamese: 'Con sâu bướm có cùng màu sắc với chiếc cành cây.', type: 'target' },
          { english: 'The insect is the same shape as the leaf.', vietnamese: 'Con côn trùng có cùng hình dáng với chiếc lá.', type: 'example' }
        ]
      },
      exercises: [
        {
          id: 'u3-l4-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu so sánh sự tương đồng:',
          prompt: 'Con sâu bướm có cùng màu sắc với cành cây.',
          options: ['is', 'caterpillar', 'The', 'the', 'same', 'color', 'as', 'the', 'stick', '.'],
          correctAnswer: 'The caterpillar is the same color as the stick .',
          explanation: 'Mẫu câu: S1 + is + the same + [color/shape] + as + S2.',
          difficulty: 'target'
        }
      ]
    }
  },
  'unit-4': {
    'lesson-1': {
      grammarPoint: {
        id: 'u4-l1-gp',
        title: 'Thì Quá khứ Đơn với Động từ Thường (Simple Past with Regular Verbs)',
        structure: 'Q: What did he/she do yesterday?\nA: He/She played baseball yesterday.',
        explanation: 'Dùng để hỏi và nói về các hành động đã xảy ra và kết thúc trong quá khứ (ví dụ: ngày hôm qua - yesterday). Chúng ta thêm đuôi "-ed" vào sau động từ thường.',
        commonMistakes: 'Không dùng: "What did he did yesterday?" hoặc "He play baseball yesterday."\nĐúng là: "What did he do yesterday?" và "He played baseball yesterday."',
        rememberTip: 'Khi đã có trợ động từ "did" trong câu hỏi thì động từ chính "do" ở dạng nguyên mẫu. Ở câu khẳng định, động từ phải thêm đuôi "-ed" (ví dụ: play -> played).',
        examples: [
          { english: 'What did she do yesterday?', vietnamese: 'Cô ấy đã làm gì hôm qua?', type: 'target' },
          { english: 'She played baseball yesterday.', vietnamese: 'Cô ấy đã chơi bóng chày hôm qua.', type: 'target' },
          { english: 'What did he do yesterday?', vietnamese: 'Cậu ấy đã làm gì hôm qua?', type: 'example' },
          { english: 'He played basketball yesterday.', vietnamese: 'Cậu ấy đã chơi bóng rổ hôm qua.', type: 'practice' }
        ]
      },
      exercises: [
        {
          id: 'u4-l1-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu thì quá khứ đơn chuẩn:',
          prompt: 'Cậu ấy đã chơi bóng chày hôm qua.',
          options: ['played', 'He', 'baseball', 'yesterday', '.'],
          correctAnswer: 'He played baseball yesterday .',
          explanation: 'Chủ ngữ + động từ đuôi "-ed" (played) + tân ngữ + trạng ngữ quá khứ (yesterday).',
          difficulty: 'target'
        },
        {
          id: 'u4-l1-ex2',
          type: 'fill_in_blank',
          question: 'Điền động từ đúng của câu hỏi thì quá khứ:',
          prompt: 'What did she ______ yesterday?',
          options: ['do', 'does', 'did'],
          correctAnswer: 0,
          explanation: 'Trong câu hỏi quá khứ đã mượn trợ động từ "did" thì động từ chính quay về nguyên mẫu là "do".',
          difficulty: 'example'
        },
        {
          id: 'u4-l1-ex3',
          type: 'choose_correct',
          question: 'Chọn câu quá khứ đơn đúng ngữ pháp tiếng Anh:',
          prompt: 'Cô ấy đã chơi bóng chuyền ngày hôm qua.',
          options: [
            'She plays volleyball yesterday.',
            'She played volleyball yesterday.',
            'She did played volleyball yesterday.'
          ],
          correctAnswer: 1,
          explanation: '"played" là dạng quá khứ của động từ regular "play".',
          difficulty: 'practice'
        }
      ]
    },
    'lesson-2': {
      grammarPoint: {
        id: 'u4-l2-gp',
        title: 'Hỏi Nghi vấn Quá khứ Đơn (Did you...?)',
        structure: 'Q: Did you practice the piano on Monday?\nA: Yes, I did. / No, I didn’t. I practiced on Tuesday.',
        explanation: 'Dùng để hỏi xem ai đó có thực hiện một hành động trong quá khứ không. Bắt đầu câu hỏi bằng "Did" và trả lời bằng "Yes, I did" hoặc "No, I didn\'t".',
        commonMistakes: 'Không dùng: "Did you practiced the piano?" hoặc "Yes, I did practice."\nĐúng là: "Did you practice the piano?" và "Yes, I did."',
        rememberTip: '"Did" đã gánh thì quá khứ nên động từ theo sau nó (ví dụ: practice) tuyệt đối không thêm đuôi -ed nữa nhé con!',
        examples: [
          { english: 'Did you practice the piano on Monday?', vietnamese: 'Bạn có luyện đàn piano vào thứ Hai không?', type: 'target' },
          { english: 'Yes, I did.', vietnamese: 'Có, tớ có luyện tập.', type: 'target' },
          { english: 'No, I didn’t.', vietnamese: 'Không, tớ không luyện tập.', type: 'target' },
          { english: 'Did she visit her friend last weekend?', vietnamese: 'Cô ấy có đi thăm bạn cuối tuần trước không?', type: 'challenge' }
        ]
      },
      exercises: [
        {
          id: 'u4-l2-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu hỏi nghi vấn quá khứ:',
          prompt: 'Bạn có luyện piano vào thứ Hai không?',
          options: ['practice', 'Did', 'you', 'the', 'piano', 'on', 'Monday', '?'],
          correctAnswer: 'Did you practice the piano on Monday ?',
          explanation: 'Cấu trúc câu hỏi: Did + S + V(nguyên mẫu) + ...?',
          difficulty: 'target'
        },
        {
          id: 'u4-l2-ex2',
          type: 'fill_in_blank',
          question: 'Điền từ phủ định ngắn gọn của trợ động từ "did":',
          prompt: "No, I ______.",
          options: ['don\'t', 'didn’t', 'wasn\'t'],
          correctAnswer: 1,
          explanation: 'Câu trả lời ngắn phủ định cho câu hỏi xuất phát bằng "Did" là "No, I didn\'t".',
          difficulty: 'example'
        }
      ]
    },
    'lesson-3': {
      grammarPoint: {
        id: 'u4-l3-gp',
        title: 'Mẫu câu Nhờ vả & Cho mượn đồ đạc (Borrow & Mine)',
        structure: 'A: I can’t find my glove.\nB: Don’t worry. You can borrow mine.',
        explanation: 'Dùng khi một người không tìm thấy đồ vật của mình và một người bạn tốt bụng sẵn sàng đề xuất cho mượn đồ của họ bằng đại từ sở hữu "mine" (đồ của tớ).',
        commonMistakes: 'Không dùng: "You can borrow my."\nĐúng là: "You can borrow mine." (mine thay thế cho my glove)',
        rememberTip: '"mine" = "my glove". Dùng "mine" ở cuối câu để không phải lặp lại từ "glove" nữa.',
        examples: [
          { english: "I can't find my glove.", vietnamese: 'Tớ không tìm thấy găng tay của tớ.', type: 'target' },
          { english: "Don't worry. You can borrow mine.", vietnamese: 'Đừng lo lắng. Cậu có thể mượn của tớ.', type: 'target' }
        ]
      },
      exercises: [
        {
          id: 'u4-l3-ex1',
          type: 'complete_dialog',
          question: 'Hoàn thành câu trả lời sẻ chia giúp đỡ bạn:',
          prompt: 'Bạn con nói: "I can\'t find my pencil." Con sẽ đáp lại như thế nào?',
          options: [
            "Don't worry. You can borrow mine.",
            'No, you cannot.',
            'This is my pencil.'
          ],
          correctAnswer: 0,
          explanation: '"You can borrow mine" (Cậu có thể mượn bút của tớ) thể hiện sự chu đáo và chuẩn văn phong Oxford.',
          difficulty: 'target'
        }
      ]
    },
    'lesson-4': {
      grammarPoint: {
        id: 'u4-l4-gp',
        title: 'Thì Quá khứ với động từ bất quy tắc "Use" (Used to make)',
        structure: 'Q: What did they use to make homes in Rome?\nA: They used stone.',
        explanation: 'Dùng để hỏi và trả lời về các chất liệu người xưa đã sử dụng để làm nhà trong lịch sử. Động từ "use" chuyển sang quá khứ thêm "d" thành "used".',
        commonMistakes: 'Không dùng: "They use stone to make homes yesterday."\nĐúng là: "They used stone."',
        rememberTip: '"used" là thì quá khứ của "use". Nhớ đọc phát âm đuôi /t/ nhẹ ở cuối nhé con.',
        examples: [
          { english: 'What did they use to make homes in Rome?', vietnamese: 'Họ đã dùng cái gì để làm nhà ở Rome?', type: 'target' },
          { english: 'They used stone.', vietnamese: 'Họ đã dùng đá.', type: 'target' }
        ]
      },
      exercises: [
        {
          id: 'u4-l4-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu khẳng định quá khứ về chất liệu:',
          prompt: 'Họ đã dùng đá để xây nhà.',
          options: ['used', 'They', 'stone', '.'],
          correctAnswer: 'They used stone .',
          explanation: 'Cấu trúc đơn giản: Chủ ngữ "They" + động từ quá khứ "used" + danh từ chất liệu "stone".',
          difficulty: 'target'
        }
      ]
    }
  },
  'unit-5': {
    'lesson-1': {
      grammarPoint: {
        id: 'u5-l1-gp',
        title: 'Động từ Bất quy tắc Quá khứ (Ate & Drank)',
        structure: 'Q: What did he/she eat/drink for lunch?\nA: He/She ate noodles. / He/She drank lemonade.',
        explanation: 'Thì quá khứ của một số động từ đặc biệt không thêm "-ed" mà biến đổi hoàn toàn: "eat" (ăn) đổi thành "ate", "drink" (uống) đổi thành "drank".',
        commonMistakes: 'Không dùng: "He eated noodles." hoặc "She drinked tea."\nĐúng là: "He ate noodles." và "She drank tea."',
        rememberTip: 'Đây là các động từ bất quy tắc (Irregular Verbs). Con phải học thuộc lòng: eat -> ate; drink -> drank.',
        examples: [
          { english: 'What did he eat for lunch?', vietnamese: 'Cậu ấy đã ăn gì cho bữa trưa?', type: 'target' },
          { english: 'He ate sushi.', vietnamese: 'Cậu ấy đã ăn sushi.', type: 'target' },
          { english: 'What did she drink with lunch?', vietnamese: 'Cô ấy đã uống gì cùng bữa trưa?', type: 'example' },
          { english: 'She drank grape juice.', vietnamese: 'Cô ấy đã uống nước nho.', type: 'practice' }
        ]
      },
      exercises: [
        {
          id: 'u5-l1-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu trả lời quá khứ bất quy tắc:',
          prompt: 'Cô ấy đã uống nước chanh.',
          options: ['drank', 'lemonade', 'She', '.'],
          correctAnswer: 'She drank lemonade .',
          explanation: 'Chủ ngữ "She" + dạng quá khứ của drink là "drank" + tên đồ uống "lemonade".',
          difficulty: 'target'
        },
        {
          id: 'u5-l1-ex2',
          type: 'fill_in_blank',
          question: 'Điền dạng quá khứ của động từ "eat" (ăn):',
          prompt: 'Yesterday, my brother ______ noodles for breakfast.',
          options: ['eats', 'ate', 'eated'],
          correctAnswer: 1,
          explanation: 'Quá khứ của động từ "eat" là từ bất quy tắc "ate".',
          difficulty: 'example'
        },
        {
          id: 'u5-l1-ex3',
          type: 'choose_correct',
          question: 'Chọn câu viết đúng ngữ pháp nhất:',
          prompt: 'Cậu ấy đã uống nước ép nho ngày hôm qua.',
          options: [
            'He drank grape juice yesterday.',
            'He drinked grape juice yesterday.',
            'He dranked grape juice yesterday.'
          ],
          correctAnswer: 0,
          explanation: '"drank" là dạng quá khứ bất quy tắc duy nhất và đúng của "drink".',
          difficulty: 'practice'
        }
      ]
    },
    'lesson-2': {
      grammarPoint: {
        id: 'u5-l2-gp',
        title: 'Hỏi thời gian hành động Quá khứ (When did...?)',
        structure: 'Q: When did he/she go bowling?\nA: He/She went bowling yesterday.',
        explanation: 'Dùng để hỏi thời điểm một ai đó đã thực hiện hành động trong quá khứ bằng từ hỏi "When". Quá khứ của cụm từ "go bowling" là "went bowling".',
        commonMistakes: 'Không dùng: "When did she went bowling?"\nĐúng là: "When did she go bowling?" (mượn did thì động từ go giữ nguyên mẫu)',
        rememberTip: 'Cặp từ quá khứ bất quy tắc cực kỳ quan trọng: go -> went.',
        examples: [
          { english: 'When did he go bowling?', vietnamese: 'Cậu ấy đã đi chơi bowling khi nào?', type: 'target' },
          { english: 'He went bowling yesterday.', vietnamese: 'Cậu ấy đã đi chơi bowling hôm qua.', type: 'target' }
        ]
      },
      exercises: [
        {
          id: 'u5-l2-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu hỏi mốc thời gian quá khứ:',
          prompt: 'Cô ấy đi chơi bowling khi nào?',
          options: ['did', 'she', 'When', 'go', 'bowling', '?'],
          correctAnswer: 'When did she go bowling ?',
          explanation: 'Câu hỏi mốc thời gian quá khứ: When + did + S + V(nguyên mẫu) + ...?',
          difficulty: 'target'
        }
      ]
    },
    'lesson-3': {
      grammarPoint: {
        id: 'u5-l3-gp',
        title: 'Mẫu câu Giúp đỡ khi bạn bị mất đồ (What happened?)',
        structure: 'A: What happened?\nB: I lost my backpack. Let’s look for it together.',
        explanation: 'Dùng khi thấy bạn mình buồn hoặc bối rối. Câu hỏi thăm "What happened?" (Có chuyện gì đã xảy ra thế?) và đề xuất tìm kiếm cùng nhau "Let\'s look for it together" là bài học về sự tốt bụng.',
        commonMistakes: 'Không dùng: "What happen?" hoặc "Let\'s looking for..."\nĐúng là: "What happened?" và "Let\'s look for..."',
        rememberTip: 'Từ "happened" có đuôi "-ed" vì hỏi về việc vừa xảy ra trong quá khứ. Sau "Let\'s" là động từ nguyên mẫu.',
        examples: [
          { english: 'What happened?', vietnamese: 'Có chuyện gì thế?', type: 'target' },
          { english: 'I lost my backpack.', vietnamese: 'Tớ bị mất ba lô rồi.', type: 'target' },
          { english: "Let's look for it together.", vietnamese: 'Chúng mình cùng tìm nó nhé.', type: 'target' }
        ]
      },
      exercises: [
        {
          id: 'u5-l3-ex1',
          type: 'complete_dialog',
          question: 'Hoàn thành câu trả lời lịch sự và ấm áp khi bạn mất đồ:',
          prompt: 'Bạn khóc: "I lost my toy!" Con nên nói gì?',
          options: [
            "Don't worry. Let's look for it together.",
            'That is bad.',
            'Where is my toy?'
          ],
          correctAnswer: 0,
          explanation: '"Don\'t worry. Let\'s look for it together" là câu nói chia sẻ, hỗ trợ chuẩn mực đạo đức của Everybody Up 4.',
          difficulty: 'target'
        }
      ]
    },
    'lesson-4': {
      grammarPoint: {
        id: 'u5-l4-gp',
        title: 'Thì quá khứ của động từ "Have" (Had)',
        structure: 'Some dinosaurs had feathers.',
        explanation: 'Để miêu tả các đặc điểm của động vật cổ đại trong quá khứ (như khủng long), ta dùng động từ "had" (đã có) là dạng quá khứ của "have/has".',
        commonMistakes: 'Không dùng: "Some dinosaurs haved wings."\nĐúng là: "Some dinosaurs had wings."',
        rememberTip: 'Quá khứ của cả have và has đều chuyển thành "had".',
        examples: [
          { english: 'Some dinosaurs had feathers.', vietnamese: 'Một số loài khủng long đã có lông vũ.', type: 'target' },
          { english: 'This dinosaur had a long tail.', vietnamese: 'Con khủng long này đã có một chiếc đuôi dài.', type: 'example' }
        ]
      },
      exercises: [
        {
          id: 'u5-l4-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu miêu tả khủng long hoàn chỉnh:',
          prompt: 'Một số loài khủng long đã có cánh.',
          options: ['had', 'dinosaurs', 'Some', 'wings', '.'],
          correctAnswer: 'Some dinosaurs had wings .',
          explanation: 'Chủ ngữ "Some dinosaurs" + động từ quá khứ "had" + danh từ số nhiều "wings".',
          difficulty: 'target'
        }
      ]
    }
  },
  'unit-6': {
    'lesson-1': {
      grammarPoint: {
        id: 'u6-l1-gp',
        title: 'Hỏi về sở thích rảnh rỗi (Like to + động từ nguyên thể)',
        structure: 'Q: What does he/she like to do in his/her free time?\nA: He/She likes to sing songs.',
        explanation: 'Khác với "like + V-ing", chúng ta cũng có thể sử dụng cấu trúc "like + to + động từ nguyên thể" để nói về sở thích làm một việc gì đó trong thời gian rảnh rỗi.',
        commonMistakes: 'Không dùng: "What does he likes to do?" hoặc "She likes to singing."\nĐúng là: "What does he like to do?" và "She likes to sing."',
        rememberTip: 'Nhớ công thức: like + to + V(nguyên thể). Nếu chủ ngữ là He/She thì "like" biến thành "likes".',
        examples: [
          { english: 'What does she like to do in her free time?', vietnamese: 'Cô ấy thích làm gì vào thời gian rảnh?', type: 'target' },
          { english: 'She likes to sing songs.', vietnamese: 'Cô ấy thích hát các bài hát.', type: 'target' }
        ]
      },
      exercises: [
        {
          id: 'u6-l1-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu về sở thích thời gian rảnh:',
          prompt: 'Cậu ấy thích vẽ tranh.',
          options: ['likes', 'pictures', 'to', 'He', 'paint', '.'],
          correctAnswer: 'He likes to paint pictures .',
          explanation: 'Cấu trúc: He + likes + to + động từ nguyên mẫu (paint) + tân ngữ (pictures).',
          difficulty: 'target'
        }
      ]
    },
    'lesson-2': {
      grammarPoint: {
        id: 'u6-l2-gp',
        title: 'Quá khứ Đơn có giới từ chỉ đối tượng (for him/her/them)',
        structure: 'Q: What did he/she cook for him/her/them?\nA: He/She cooked dinner for them.',
        explanation: 'Dùng để nói về một hành động làm việc gì đó (như nấu ăn, làm thiệp, nướng bánh) "cho" một ai đó trong quá khứ. Sử dụng giới từ "for" kết hợp các tân ngữ (him, her, them).',
        commonMistakes: 'Không dùng: "He cooked dinner for they."\nĐúng là: "He cooked dinner for them." (them là tân ngữ đứng sau giới từ for)',
        rememberTip: 'Sau giới từ "for" phải là các đại từ tân ngữ: him (cho cậu ấy), her (cho cô ấy), them (cho họ), us (cho chúng tớ).',
        examples: [
          { english: 'What did she cook for them?', vietnamese: 'Cô ấy đã nấu món gì cho họ?', type: 'target' },
          { english: 'She cooked dinner for them.', vietnamese: 'Cô ấy đã nấu bữa tối cho họ.', type: 'target' }
        ]
      },
      exercises: [
        {
          id: 'u6-l2-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu khẳng định quá khứ:',
          prompt: 'Cậu ấy đã làm một chiếc thiệp cho cô ấy.',
          options: ['made', 'a', 'card', 'for', 'He', 'her', '.'],
          correctAnswer: 'He made a card for her .',
          explanation: 'Động từ quá khứ bất quy tắc "made" (từ make) đi kèm tân ngữ "a card" + giới từ "for her".',
          difficulty: 'target'
        }
      ]
    },
    'lesson-3': {
      grammarPoint: {
        id: 'u6-l3-gp',
        title: 'Lời Yêu cầu trợ giúp lịch sự (Could you...?)',
        structure: 'A: Could you carry these bags for me?\nB: Sure. No problem.',
        explanation: 'Mẫu câu lịch sự trang nhã dùng để nhờ vả một ai đó làm giúp mình việc gì nặng nhọc (như xách túi đồ, giúp đỡ hàng xóm). Trả lời thân thiện bằng "Sure. No problem" (Chắc chắn rồi. Không có vấn đề gì ạ).',
        commonMistakes: 'Không dùng: "Could you carrying these bags?"\nĐúng là: "Could you carry these bags?" (carry nguyên mẫu sau could)',
        rememberTip: 'Dùng động từ nguyên mẫu ngay sau cấu trúc "Could you ... ?".',
        examples: [
          { english: 'Could you carry these bags for me?', vietnamese: 'Bác/Bạn có thể xách hộ cháu/tớ mấy chiếc túi này được không?', type: 'target' },
          { english: 'Sure. No problem.', vietnamese: 'Được chứ. Không vấn đề gì.', type: 'target' }
        ]
      },
      exercises: [
        {
          id: 'u6-l3-ex1',
          type: 'complete_dialog',
          question: 'Chọn câu đáp lại nhã nhặn nhất khi hàng xóm nhờ giúp đỡ:',
          prompt: 'Bác hàng xóm xách nặng nhờ: "Could you carry this bag for me?" Con sẽ nói:',
          options: [
            'Sure. No problem.',
            'No, I cannot.',
            'I am busy.'
          ],
          correctAnswer: 0,
          explanation: '"Sure. No problem." là câu đồng ý giúp đỡ vô cùng lịch sự, lễ phép và chuẩn Everybody Up 4.',
          difficulty: 'target'
        }
      ]
    },
    'lesson-4': {
      grammarPoint: {
        id: 'u6-l4-gp',
        title: 'Mẫu câu Giới thiệu tác phẩm Nghệ thuật (This is a...)',
        structure: 'This is a painting of a bedroom.',
        explanation: 'Dùng giới từ "of" để nói về nội dung được vẽ, chụp hoặc điêu khắc trong một bức tranh/ảnh. Công thức: "This is a [loại nghệ thuật] of a [đối tượng]".',
        commonMistakes: 'Không dùng: "This is a painting with a bedroom."\nĐúng là: "This is a painting of a bedroom."',
        rememberTip: 'Sử dụng giới từ "of" mang nghĩa là "về/của" chủ đề được thể hiện.',
        examples: [
          { english: 'This is a painting of a bedroom.', vietnamese: 'Đây là một bức họa về một phòng ngủ.', type: 'target' },
          { english: 'This is a photograph of a garden.', vietnamese: 'Đây là bức ảnh chụp một khu vườn.', type: 'example' }
        ]
      },
      exercises: [
        {
          id: 'u6-l4-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu mô tả tác phẩm nghệ thuật:',
          prompt: 'Đây là bức ảnh chụp gia đình.',
          options: ['This', 'is', 'a', 'photograph', 'of', 'a', 'family', '.'],
          correctAnswer: 'This is a photograph of a family .',
          explanation: 'Chủ ngữ "This" + is + "a photograph of" + "a family".',
          difficulty: 'target'
        }
      ]
    }
  },
  'unit-7': {
    'lesson-1': {
      grammarPoint: {
        id: 'u7-l1-gp',
        title: 'Hỏi ước mơ nghề nghiệp tương lai (Want to be...)',
        structure: 'Q: What do you want to be when you grow up?\nA: I want to be an artist.\nQ: What does he/she want to be when he/she grows up?\nA: He/She wants to be an artist.',
        explanation: 'Dùng hỏi về ước mơ nghề nghiệp khi lớn lên. Nhớ mạo từ "an" trước nghề nghiệp bắt đầu bằng nguyên âm (actor, artist, engineer...) và "a" trước phụ âm (musician, scientist, game designer...).',
        commonMistakes: 'Không dùng: "I want to be a artist." hoặc "She want to be..."\nĐúng là: "I want to be an artist." và "She wants to be..."',
        rememberTip: 'Khi dùng cho He/She, động từ "want" đổi thành "wants", động từ "grow" đổi thành "grows".',
        examples: [
          { english: 'What do you want to be when you grow up?', vietnamese: 'Cậu muốn làm nghề gì khi lớn lên?', type: 'target' },
          { english: 'I want to be an artist.', vietnamese: 'Tớ muốn trở thành một họa sĩ.', type: 'target' },
          { english: 'What does she want to be when she grows up?', vietnamese: 'Cô ấy muốn làm nghề gì khi lớn lên?', type: 'example' },
          { english: 'She wants to be a scientist.', vietnamese: 'Cô ấy muốn trở thành một nhà khoa học.', type: 'practice' }
        ]
      },
      exercises: [
        {
          id: 'u7-l1-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu hỏi ước mơ nghề nghiệp khi lớn lên:',
          prompt: 'Cậu muốn làm nghề gì khi lớn lên?',
          options: ['do', 'you', 'be', 'What', 'want', 'to', 'when', 'you', 'grow', 'up', '?'],
          correctAnswer: 'What do you want to be when you grow up ?',
          explanation: 'Công thức hỏi tương lai: What do you want to be when you grow up?',
          difficulty: 'target'
        },
        {
          id: 'u7-l1-ex2',
          type: 'fill_in_blank',
          question: 'Chọn mạo từ chính xác điền vào chỗ trống:',
          prompt: 'I want to be ______ actor when I grow up.',
          options: ['a', 'an', 'the'],
          correctAnswer: 1,
          explanation: 'Từ "actor" bắt đầu bằng nguyên âm /æ/, do đó ta sử dụng mạo từ "an".',
          difficulty: 'example'
        },
        {
          id: 'u7-l1-ex3',
          type: 'choose_correct',
          question: 'Chọn câu viết đúng ngữ pháp tiếng Anh ngôi thứ ba số ít:',
          prompt: 'Cô ấy muốn trở thành một nhà khoa học khi lớn lên.',
          options: [
            'She wants to be a scientist when she grows up.',
            'She want to be a scientist when she grow up.',
            'She wants to be an scientist when she grows up.'
          ],
          correctAnswer: 0,
          explanation: '"She" đi với "wants" và "grows", "scientist" là phụ âm nên đi với "a".',
          difficulty: 'practice'
        }
      ]
    },
    'lesson-2': {
      grammarPoint: {
        id: 'u7-l2-gp',
        title: 'Hỏi ước mơ hoạt động tương lai (Want to do... older)',
        structure: 'Q: What do you want to do when you’re older?\nA: I want to go to space.\nQ: What does he/she want to do when he/she’s older?\nA: He/She wants to go to space.',
        explanation: 'Khác với hỏi về danh từ nghề nghiệp (be a/an...), cấu trúc này hỏi về ước mơ "làm việc gì" (do) khi con lớn tuổi hơn (older).',
        commonMistakes: 'Không dùng: "What do you want to be when you are older? I want to go to space." (Go to space là hành động, không phải nghề nghiệp)\nĐúng là: "What do you want to do...?"',
        rememberTip: 'Hỏi nghề nghiệp dùng "want to BE". Hỏi hoạt động trải nghiệm dùng "want to DO".',
        examples: [
          { english: 'What do you want to do when you’re older?', vietnamese: 'Cậu muốn làm gì khi lớn tuổi hơn?', type: 'target' },
          { english: 'I want to go to space.', vietnamese: 'Tớ muốn đi vào vũ trụ.', type: 'target' }
        ]
      },
      exercises: [
        {
          id: 'u7-l2-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu hỏi ước mơ trải nghiệm tương lai:',
          prompt: 'Cô ấy muốn làm gì khi lớn tuổi hơn?',
          options: ['What', 'does', 'she', 'want', 'to', 'do', 'when', 'she’s', 'older', '?'],
          correctAnswer: 'What does she want to do when she’s older ?',
          explanation: 'Công thức: What does + he/she + want to do + when + he’s/she’s older?',
          difficulty: 'target'
        }
      ]
    },
    'lesson-3': {
      grammarPoint: {
        id: 'u7-l3-gp',
        title: 'Hỏi ý nghĩa biển báo chỉ dẫn (What does that sign mean?)',
        structure: 'Q: What does that sign mean?\nA: It means you can’t run here.',
        explanation: 'Cấu trúc dùng để hỏi ý nghĩa của một biển báo công cộng. Sử dụng động từ khuyết thiếu phủ định "can\'t" (không được phép) để giải thích lệnh cấm.',
        commonMistakes: 'Không dùng: "What does that sign means?" hoặc "It mean you can\'t run."\nĐúng là: "What does that sign mean?" và "It means you can\'t run."',
        rememberTip: 'Trong câu hỏi đã có trợ động từ "does" nên "mean" giữ nguyên. Trong câu trả lời, chủ ngữ "It" số ít nên "means" có thêm s.',
        examples: [
          { english: 'What does that sign mean?', vietnamese: 'Biển báo kia có nghĩa là gì?', type: 'target' },
          { english: 'It means you can’t run here.', vietnamese: 'Nó có nghĩa là con không được chạy ở đây.', type: 'target' }
        ]
      },
      exercises: [
        {
          id: 'u7-l3-ex1',
          type: 'complete_dialog',
          question: 'Chọn câu giải thích biển báo đúng chuẩn mực văn hóa và học thuật:',
          prompt: 'Bé nhìn thấy biển báo cấm chạy và hỏi: "What does that sign mean?" Con trả lời:',
          options: [
            'It means you can’t run here.',
            'It means you can run.',
            'No run!'
          ],
          correctAnswer: 0,
          explanation: '"It means you can\'t run here" là lời giải thích lịch sự, đầy đủ thành phần câu và chính xác ngữ pháp.',
          difficulty: 'target'
        }
      ]
    },
    'lesson-4': {
      grammarPoint: {
        id: 'u7-l4-gp',
        title: 'Cấu trúc Diễn tả Nghĩa vụ và Sự bắt buộc (Have to / Don\'t have to)',
        structure: 'Astronauts have to / don’t have to take the space shuttle to get to the space station.',
        explanation: 'Cấu trúc diễn tả một việc bắt buộc phải làm ("have to" / "has to") hoặc một việc không bắt buộc phải làm ("don\'t have to" / "doesn\'t have to").',
        commonMistakes: 'Không dùng: "Astronauts don\'t have take the space shuttle." (thiếu từ to)\nĐúng là: "Astronauts don\'t have to take..."',
        rememberTip: 'Cụm từ bắt buộc luôn là "have to" + động từ nguyên mẫu.',
        examples: [
          { english: 'Astronauts have to take the space shuttle.', vietnamese: 'Các phi hành gia phải đi tàu vũ trụ.', type: 'target' },
          { english: 'They don’t have to wear spacesuits inside.', vietnamese: 'Họ không phải mặc đồ phi hành gia ở bên trong.', type: 'example' }
        ]
      },
      exercises: [
        {
          id: 'u7-l4-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu diễn tả sự bắt buộc:',
          prompt: 'Họ phải mặc đồ bảo hộ vũ trụ.',
          options: ['They', 'have', 'to', 'wear', 'spacesuits', '.'],
          correctAnswer: 'They have to wear spacesuits .',
          explanation: 'Cấu trúc: S + have to + V(nguyên mẫu) + ...',
          difficulty: 'target'
        }
      ]
    }
  },
  'unit-8': {
    'lesson-1': {
      grammarPoint: {
        id: 'u8-l1-gp',
        title: 'Thì Tương lai gần với "Going to" chỉ dự định (Be going to + V)',
        structure: 'Q: What’s he/she going to do on vacation?\nA: He’s/She’s going to take a boat ride.\nQ: When is he/she going to take a boat ride?\nA: He’s/She’s going to take a boat ride tomorrow.',
        explanation: 'Thì tương lai gần diễn tả một kế hoạch hoặc dự định chắc chắn sẽ làm trong kỳ nghỉ (on vacation). Công thức: S + to be (am/is/are) + going to + động từ nguyên thể.',
        commonMistakes: 'Không dùng: "He going to take a boat ride." hoặc "She is going to taking..."\nĐúng là: "He is going to take..." và "She is going to take..."',
        rememberTip: 'Đừng quên động từ to be (am, is, are) đứng trước "going to", và động từ chính đằng sau "going to" phải ở dạng nguyên mẫu nhé!',
        examples: [
          { english: 'What’s he going to do on vacation?', vietnamese: 'Cậu ấy dự định làm gì vào kỳ nghỉ?', type: 'target' },
          { english: 'He’s going to take a boat ride.', vietnamese: 'Cậu ấy dự định đi thuyền.', type: 'target' },
          { english: 'When is she going to take a boat ride?', vietnamese: 'Khi nào cô ấy định đi thuyền?', type: 'example' },
          { english: 'She’s going to take a boat ride tomorrow.', vietnamese: 'Cô ấy dự định đi thuyền vào ngày mai.', type: 'practice' }
        ]
      },
      exercises: [
        {
          id: 'u8-l1-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu dự định tương lai hoàn chỉnh:',
          prompt: 'Cậu ấy dự định đi thuyền vào ngày mai.',
          options: ['He’s', 'going', 'to', 'take', 'a', 'boat', 'ride', 'tomorrow', '.'],
          correctAnswer: 'He’s going to take a boat ride tomorrow .',
          explanation: 'Cấu trúc: S + ’s + going to + động từ nguyên thể (take) + cụm hoạt động + trạng từ thời gian (tomorrow).',
          difficulty: 'target'
        },
        {
          id: 'u8-l1-ex2',
          type: 'fill_in_blank',
          question: 'Điền dạng đúng của động từ sau "going to":',
          prompt: 'She is going to ______ in a hotel next week.',
          options: ['stay', 'stays', 'stayed'],
          correctAnswer: 0,
          explanation: 'Sau "going to" chỉ mục đích tương lai, động từ chính "stay" phải giữ nguyên mẫu không chia.',
          difficulty: 'example'
        },
        {
          id: 'u8-l1-ex3',
          type: 'choose_correct',
          question: 'Chọn câu viết đúng ngữ pháp tiếng Anh nhất:',
          prompt: 'Họ dự định bơi ở đại dương.',
          options: [
            'They are going to swim in the ocean.',
            'They going to swim in the ocean.',
            'They are going to swimming in the ocean.'
          ],
          correctAnswer: 0,
          explanation: 'Chủ ngữ "They" đi với động từ to be "are", sau đó là "going to" + động từ nguyên thể "swim".',
          difficulty: 'practice'
        }
      ]
    },
    'lesson-2': {
      grammarPoint: {
        id: 'u8-l2-gp',
        title: 'Đồ dùng mang theo hành trình (Going to take with...)',
        structure: 'Q: What’s he/she going to take with him/her?\nA: He’s/She’s going to take a swimsuit.\nQ: Are they going to take swimsuits with them?\nA: Yes, they are. / No, they aren’t.',
        explanation: 'Dùng để hỏi về đồ dùng cá nhân ai đó chuẩn bị mang theo chuyến đi. Sử dụng cụm từ "with him" (cho nam), "with her" (cho nữ), hoặc "with them" (cho họ).',
        commonMistakes: 'Không dùng: "What is she going to take with him?" (Hỏi cô ấy phải dùng her)\nĐúng là: "What is she going to take with her?"',
        rememberTip: 'Nhớ đổi đại từ tương ứng: he -> him; she -> her; they -> them.',
        examples: [
          { english: 'What’s he going to take with him?', vietnamese: 'Cậu ấy định mang theo cái gì?', type: 'target' },
          { english: 'He’s going to take a swimsuit.', vietnamese: 'Cậu ấy định mang theo một bộ đồ bơi.', type: 'target' },
          { english: 'Are they going to take swimsuits with them?', vietnamese: 'Họ có định mang đồ bơi đi cùng không?', type: 'example' },
          { english: 'Yes, they are.', vietnamese: 'Có, họ có mang theo.', type: 'practice' }
        ]
      },
      exercises: [
        {
          id: 'u8-l2-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu hỏi dự định mang đồ dùng đi cùng:',
          prompt: 'Cô ấy định mang cái gì đi theo?',
          options: ['What’s', 'she', 'going', 'to', 'take', 'with', 'her', '?'],
          correctAnswer: 'What’s she going to take with her ?',
          explanation: 'Mẫu câu hỏi chuẩn: What’s + she + going to take + with her?',
          difficulty: 'target'
        },
        {
          id: 'u8-l2-ex2',
          type: 'fill_in_blank',
          question: 'Điền đại từ phản thân chỉ đối tượng số nhiều chính xác:',
          prompt: 'Are they going to take towels with ______?',
          options: ['him', 'them', 'their'],
          correctAnswer: 1,
          explanation: 'Chủ ngữ "they" tương ứng với giới từ chỉ đối tượng kèm theo là "them" (with them).',
          difficulty: 'example'
        }
      ]
    },
    'lesson-3': {
      grammarPoint: {
        id: 'u8-l3-gp',
        title: 'Mẫu câu Tạm biệt & Chúc mừng chu đáo (Have a great time!)',
        structure: 'A: Bye. Have a great time.\nB: Thank you. See you next month!',
        explanation: 'Mẫu câu chia tay khi bạn bè đi nghỉ mát hoặc đi du lịch. Chúc bạn có thời gian tuyệt vời "Have a great time" thể hiện tính chu đáo và tình bạn khăng khít.',
        commonMistakes: 'Không dùng: "Have great time." (thiếu mạo từ a)\nĐúng là: "Have a great time."',
        rememberTip: 'Luôn nói "Have a great time!" có chữ "a" nhé con.',
        examples: [
          { english: 'Bye. Have a great time.', vietnamese: 'Tạm biệt nhé. Chúc cậu đi chơi thật vui vẻ!', type: 'target' },
          { english: 'Thank you. See you next month!', vietnamese: 'Cảm ơn cậu. Hẹn gặp cậu tháng sau nhé!', type: 'target' }
        ]
      },
      exercises: [
        {
          id: 'u8-l3-ex1',
          type: 'complete_dialog',
          question: 'Chọn lời chia tay chu đáo, thân thiện chuẩn mực:',
          prompt: 'Bạn con chuẩn bị lên xe đi du lịch và vẫy tay chào. Con nên chúc bạn gì?',
          options: [
            'Bye. Have a great time!',
            'Good luck tests.',
            'What is your plan?'
          ],
          correctAnswer: 0,
          explanation: '"Bye. Have a great time!" là câu nói ấm áp, chu đáo nhất khi chia tay bạn đi chơi.',
          difficulty: 'target'
        }
      ]
    },
    'lesson-4': {
      grammarPoint: {
        id: 'u8-l4-gp',
        title: 'Cấu trúc Hỏi phương tiện di chuyển du lịch (How is he/she going to...)',
        structure: 'Q: How’s he/she going to the department store?\nA: He’s/She’s going to take a taxi.',
        explanation: 'Dùng để hỏi một người di chuyển đến địa điểm bằng phương tiện gì. Trả lời bằng cụm động từ "take a + phương tiện" (taxi, ferry, subway, gondola).',
        commonMistakes: 'Không dùng: "How is she go to the park?" (Thiếu động từ going to chỉ kế hoạch)\nĐúng là: "How’s she going to the department store?"',
        rememberTip: 'Sử dụng "take a taxi" (đi taxi), "take a ferry" (đi phà) để chỉ hành động đón phương tiện di chuyển.',
        examples: [
          { english: 'How’s he going to the department store?', vietnamese: 'Cậu ấy di chuyển đến cửa hàng bách hóa bằng cách nào?', type: 'target' },
          { english: 'He’s going to take a taxi.', vietnamese: 'Cậu ấy dự định đi bằng xe taxi.', type: 'target' }
        ]
      },
      exercises: [
        {
          id: 'u8-l4-ex1',
          type: 'scrambled_words',
          question: 'Sắp xếp câu hỏi phương tiện di chuyển:',
          prompt: 'Cô ấy đi đến trung tâm thương mại bằng cách nào?',
          options: ['How’s', 'she', 'going', 'to', 'the', 'department store', '?'],
          correctAnswer: 'How’s she going to the department store ?',
          explanation: 'Cấu trúc hỏi phương tiện: How’s + he/she + going to + [địa điểm]?',
          difficulty: 'target'
        }
      ]
    }
  }
};

/**
 * Gets grammar data and exercises for a specific lesson in a unit.
 * Fallbacks to a general structured placeholder if specific lesson is not populated, 
 * guaranteeing zero blank pages or crashes.
 */
export function getGrammarForLesson(unitId: string, lessonId: string): GrammarLessonData {
  const unitData = grammarDatabase[unitId];
  if (unitData && unitData[lessonId]) {
    return unitData[lessonId];
  }

  // Fallback structure to prevent crashes and keep code resilient
  return {
    grammarPoint: {
      id: `${unitId}-${lessonId}-fallback-gp`,
      title: `Cấu trúc ngữ pháp Lesson ${lessonId.replace('lesson-', '')}`,
      structure: `Cấu trúc mẫu của Oxford Everybody Up 4`,
      explanation: `Nội dung học đang được cập nhật đồng bộ trực tiếp từ giáo trình Everybody Up 4 chuẩn Oxford.`,
      commonMistakes: `Hãy chú ý viết hoa đầu câu và kết thúc bằng dấu chấm tròn đúng cách.`,
      rememberTip: `Luyện tập hằng ngày giúp con ghi nhớ mẫu câu nhanh hơn!`,
      examples: [
        { english: 'Practice makes perfect!', vietnamese: 'Có công mài sắt có ngày nên kim!', type: 'target' }
      ]
    },
    exercises: [
      {
        id: `${unitId}-${lessonId}-fallback-ex1`,
        type: 'scrambled_words',
        question: 'Sắp xếp câu đúng mẫu:',
        prompt: 'Có công mài sắt có ngày nên kim.',
        options: ['makes', 'perfect', 'Practice', '.'],
        correctAnswer: 'Practice makes perfect .',
        explanation: 'Cấu trúc câu hoàn chỉnh bắt đầu bằng chữ viết hoa và kết thúc bằng dấu chấm.',
        difficulty: 'target'
      }
    ]
  };
}
