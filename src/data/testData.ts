/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TestQuestion {
  id: string;
  section: 'listening' | 'reading' | 'writing';
  type: 'listen_choose' | 'listen_picture' | 'listen_complete' | 'read_choose' | 'read_complete' | 'write_arrange' | 'write_complete' | 'write_picture';
  question: string;
  prompt: string; // Vietnamese translation or visual prompt
  options: string[]; // Options
  correctAnswer: string; // Exact match of correct option/string
  explanation: string;
  audioText?: string; // Text to speak in Listening section
  emoji?: string; // Used for picture challenges
}

export const unitTestsData: Record<string, TestQuestion[]> = {
  'unit-1': [
    // --- LISTENING SECTION (7 QUESTIONS) ---
    {
      id: 'u1-q1',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose what the boy likes doing:',
      prompt: 'Nghe và chọn hoạt động cậu bé thích:',
      options: ['He likes hiking.', 'He likes climbing.', 'He likes canoeing.'],
      correctAnswer: 'He likes climbing.',
      audioText: 'I like trees. My favorite activity is climbing. Yes, I like climbing!',
      explanation: 'Giọng nói nói rõ: "My favorite activity is climbing. Yes, I like climbing!". Do đó, đáp án đúng là "He likes climbing."'
    },
    {
      id: 'u1-q2',
      section: 'listening',
      type: 'listen_picture',
      question: 'Listen and select the correct activity emoji:',
      prompt: 'Nghe và chọn biểu tượng hình ảnh đúng nhất:',
      options: ['🥾 (Hike)', '🛶 (Canoe)', '🎣 (Fish)'],
      correctAnswer: '🛶 (Canoe)',
      audioText: 'Let’s go to the river. We can sit in the canoe and paddle. I like canoeing!',
      explanation: 'Trong đoạn hội thoại nhắc đến "canoe" và "canoeing" (chèo xuồng), tương ứng với biểu tượng chiếc xuồng 🛶.'
    },
    {
      id: 'u1-q3',
      section: 'listening',
      type: 'listen_complete',
      question: 'Listen and complete the missing word:',
      prompt: 'Nghe và điền từ thích hợp vào chỗ trống:',
      options: ['birds', 'hamburgers', 'fish'],
      correctAnswer: 'hamburgers',
      audioText: 'We are hungry. Let’s grill hamburgers in the backyard!',
      explanation: 'Đoạn băng nói: "Let’s grill hamburgers in the backyard!". Từ còn thiếu là "hamburgers".'
    },
    {
      id: 'u1-q4',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen to the question and choose the correct reply:',
      prompt: 'Nghe câu hỏi và chọn câu trả lời đúng nhất:',
      options: ['Yes, she’s very good at it.', 'No, she likes climbing.', 'She likes watching birds.'],
      correctAnswer: 'Yes, she’s very good at it.',
      audioText: 'Is she good at skiing?',
      explanation: 'Câu hỏi là "Is she good at skiing?" (Cô ấy trượt tuyết giỏi không?). Câu trả lời phù hợp nhất là "Yes, she’s very good at it."'
    },
    {
      id: 'u1-q5',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen to the girl and choose what she is good at:',
      prompt: 'Nghe bạn nữ nói và chọn môn thể thao bạn ấy giỏi:',
      options: ['She is good at surfing.', 'She is good at skateboarding.', 'She is good at ice skating.'],
      correctAnswer: 'She is good at skateboarding.',
      audioText: 'I have a new board with four wheels. I love to skateboard. I am very good at skateboarding!',
      explanation: 'Bạn nữ nhắc đến "board with four wheels" (ván trượt 4 bánh) và khẳng định "I am very good at skateboarding".'
    },
    {
      id: 'u1-q6',
      section: 'listening',
      type: 'listen_complete',
      question: 'Listen and complete the safety rule:',
      prompt: 'Nghe và hoàn thiện quy tắc an toàn sau:',
      options: ['life jacket', 'helmet', 'seatbelt'],
      correctAnswer: 'helmet',
      audioText: 'When you go snowboarding, always wear a helmet to protect your head.',
      explanation: 'Đoạn băng khuyên: "always wear a helmet". Từ cần chọn là "helmet" (mũ bảo hiểm).'
    },
    {
      id: 'u1-q7',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose the correct answer to the question:',
      prompt: 'Nghe và chọn câu trả lời đúng cho câu hỏi:',
      options: ['He’s not very good at it.', 'He’s very good at surfing.', 'Yes, he is.'],
      correctAnswer: 'He’s not very good at it.',
      audioText: 'Look at him. He falls off his surfboard again and again. He is not very good at surfing.',
      explanation: 'Đoạn băng nói: "He falls off his surfboard again and again. He is not very good at surfing" (Cậu ấy ngã liên tục, cậu ấy không giỏi lắm).'
    },

    // --- READING SECTION (4 QUESTIONS) ---
    {
      id: 'u1-q8',
      section: 'reading',
      type: 'read_choose',
      question: 'Read the text and choose the correct word:\n"We go to a quiet lake with binoculars to observe owls and eagles. We like..."',
      prompt: 'Đọc văn bản và chọn đáp án chính xác nhất:',
      options: ['watching birds', 'grilling hamburgers', 'hiking'],
      correctAnswer: 'watching birds',
      explanation: 'Cụm từ "observe owls and eagles" (quan sát chim cú và đại bàng) bằng ống nhòm (binoculars) đồng nghĩa với việc ngắm chim ("watching birds").'
    },
    {
      id: 'u1-q9',
      section: 'reading',
      type: 'read_complete',
      question: 'Choose the correct word to complete the sentence:\n"She is really good at ______ in the winter snow."',
      prompt: 'Chọn từ đúng nhất để hoàn thiện câu:',
      options: ['surfing', 'skiing', 'canoeing'],
      correctAnswer: 'skiing',
      explanation: 'Hoạt động thể thao diễn ra trên tuyết vào mùa đông ("winter snow") là trượt tuyết ("skiing").'
    },
    {
      id: 'u1-q10',
      section: 'reading',
      type: 'read_choose',
      question: 'Read the short dialogue and choose the best missing phrase:\nTony: "I am not very good at ice skating. I am scared."\nMary: "Don’t worry. ______"',
      prompt: 'Đọc đoạn đối thoại ngắn và điền cụm từ phù hợp nhất:',
      options: ['Be brave. I can help you.', 'No, you are not.', 'I like grilling hamburgers.'],
      correctAnswer: 'Be brave. I can help you.',
      explanation: 'Khi Tony lo lắng và sợ trượt băng, lời khuyên và đề nghị giúp đỡ phù hợp nhất là "Be brave. I can help you" (Hãy dũng cảm lên, mình có thể giúp bạn).'
    },
    {
      id: 'u1-q11',
      section: 'reading',
      type: 'read_complete',
      question: 'Complete the safety instruction:\n"When you go on a boat, always put on a ______ to keep safe in water."',
      prompt: 'Điền vào chỗ trống quy tắc an toàn dưới nước:',
      options: ['helmet', 'life jacket', 'seatbelt'],
      correctAnswer: 'life jacket',
      explanation: 'Khi đi thuyền ("on a boat"), thiết bị bảo hộ an toàn dưới nước để nổi là áo phao cứu sinh ("life jacket").'
    },

    // --- WRITING SECTION (4 QUESTIONS) ---
    {
      id: 'u1-q12',
      section: 'writing',
      type: 'write_arrange',
      question: 'Arrange the words to make a correct sentence:',
      prompt: 'Sắp xếp các từ thành câu đúng cấu trúc Everybody Up 4:',
      options: ['likes', 'climbing', 'He', 'high', 'trees', '.'],
      correctAnswer: 'He likes climbing high trees .',
      explanation: 'Sắp xếp chuẩn theo chủ ngữ số ít "He" + "likes" + V-ing "climbing" + cụm danh từ "high trees".'
    },
    {
      id: 'u1-q13',
      section: 'writing',
      type: 'write_complete',
      question: 'Fill in the blank with the correct form of the verb:\n"What does she like ______ (do)?"',
      prompt: 'Điền dạng đúng của động từ trong ngoặc:',
      options: ['doing', 'does', 'do'],
      correctAnswer: 'doing',
      explanation: 'Cấu trúc hỏi sở thích chuẩn của Everybody Up 4 là "What does she like doing?".'
    },
    {
      id: 'u1-q14',
      section: 'writing',
      type: 'write_picture',
      question: 'Look at the picture description and write the correct verb:\n"To travel on a wave in the ocean, you need a board to ______."',
      prompt: 'Đọc gợi ý hình ảnh và điền động từ chỉ hoạt động tương ứng:',
      options: ['surf', 'ski', 'canoe'],
      correctAnswer: 'surf',
      explanation: 'Hoạt động lướt trên sóng biển với một chiếc ván được gọi là "surf" (lướt sóng).'
    },
    {
      id: 'u1-q15',
      section: 'writing',
      type: 'write_arrange',
      question: 'Arrange the words to make a correct sentence:',
      prompt: 'Sắp xếp các từ để hoàn chỉnh câu lời khuyên an toàn:',
      options: ['Always', 'wear', 'a', 'helmet', 'snowboarding', 'when', '.'],
      correctAnswer: 'Always wear a helmet when snowboarding .',
      explanation: 'Cấu trúc chuẩn khuyên bảo: "Always wear a helmet when snowboarding ." (Hãy luôn đội mũ bảo hiểm khi trượt tuyết bằng ván).'
    }
  ],
  'unit-2': [
    // --- LISTENING SECTION (7 QUESTIONS) ---
    {
      id: 'u2-q1',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose the correct statement about the animal:',
      prompt: 'Nghe và chọn nhận xét đúng nhất về con vật:',
      options: ['The panda is bigger than the gorilla.', 'The hippopotamus is the biggest.', 'The panda is the smallest.'],
      correctAnswer: 'The hippopotamus is the biggest.',
      audioText: 'Look at the zoo! The panda is big. The gorilla is bigger than the panda. But the hippopotamus is the biggest!',
      explanation: 'Giọng nói khẳng định: "the hippopotamus is the biggest!" (con hà mã là to lớn nhất).'
    },
    {
      id: 'u2-q2',
      section: 'listening',
      type: 'listen_picture',
      question: 'Listen and select the animal mentioned:',
      prompt: 'Nghe và chọn biểu tượng động vật được nhắc tới:',
      options: ['🦛 (Hippopotamus)', '🐼 (Panda)', '🦍 (Gorilla)'],
      correctAnswer: '🐼 (Panda)',
      audioText: 'Look at this cute animal. It has black eyes, black ears, and eats bamboo. Yes, it’s a giant panda!',
      explanation: 'Đoạn miêu tả động vật ăn tre ("eats bamboo") và có đôi mắt, tai màu đen, chính là con gấu trúc 🐼.'
    },
    {
      id: 'u2-q3',
      section: 'listening',
      type: 'listen_complete',
      question: 'Listen and complete the missing word:',
      prompt: 'Nghe và điền từ so sánh bằng còn thiếu:',
      options: ['long', 'short', 'fast'],
      correctAnswer: 'long',
      audioText: 'The eel is very long. Is the eel as long as the seal? Yes, it is.',
      explanation: 'Từ miêu tả độ dài của lươn và hải cẩu được lặp lại là "as long as". Từ còn thiếu là "long".'
    },
    {
      id: 'u2-q4',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose what the whale is compared to:',
      prompt: 'Nghe và chọn con vật được so sánh với cá voi:',
      options: ['The whale is bigger than the shark.', 'The whale is smaller than the dolphin.', 'The whale is as long as the squid.'],
      correctAnswer: 'The whale is bigger than the shark.',
      audioText: 'The shark has sharp teeth. But the whale is much bigger than the shark!',
      explanation: 'Băng ghi âm nói: "the whale is much bigger than the shark!" (cá voi to lớn hơn cá mập rất nhiều).'
    },
    {
      id: 'u2-q5',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose the animal described:',
      prompt: 'Nghe và chọn con vật đại dương được miêu tả:',
      options: ['A squid', 'A dolphin', 'An octopus'],
      correctAnswer: 'An octopus',
      audioText: 'This ocean creature has eight long arms and can swim very well. It is an octopus.',
      explanation: 'Con vật có tám cánh tay dài ("eight long arms") chính là con bạch tuộc "An octopus".'
    },
    {
      id: 'u2-q6',
      section: 'listening',
      type: 'listen_complete',
      question: 'Listen and fill in the number:',
      prompt: 'Nghe và điền số cân nặng (bằng chữ hoặc số):',
      options: ['150', '250', '50'],
      correctAnswer: '150',
      audioText: 'How much does the lizard weigh? It weighs one hundred and fifty grams.',
      explanation: 'Cân nặng của thằn lằn được đọc là "one hundred and fifty grams", tức là 150 grams.'
    },
    {
      id: 'u2-q7',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen to the value and choose the correct word:',
      prompt: 'Nghe bài học giá trị đạo đức và chọn đức tính:',
      options: ['Be brave.', 'Be thoughtful.', 'Be patient.'],
      correctAnswer: 'Be thoughtful.',
      audioText: 'When you think about other people’s feelings and help them, you are very kind. Remember: Be thoughtful.',
      explanation: 'Đoạn nói về sự quan tâm tới người khác và đưa ra lời khuyên "Be thoughtful" (Biết chu đáo/quan tâm).'
    },

    // --- READING SECTION (4 QUESTIONS) ---
    {
      id: 'u2-q8',
      section: 'reading',
      type: 'read_choose',
      question: 'Read the comparison and choose the correct option:\n"The butterfly is colorful. The caterpillar is small. The bee is ______ than the butterfly."',
      prompt: 'Đọc đoạn miêu tả và chọn từ so sánh thích hợp:',
      options: ['smaller', 'smallest', 'as small as'],
      correctAnswer: 'smaller',
      explanation: 'Cấu trúc so sánh hơn giữa hai chủ thể (the bee và the butterfly) yêu cầu tính từ thêm "-er" và có "than". Đáp án là "smaller".'
    },
    {
      id: 'u2-q9',
      section: 'reading',
      type: 'read_complete',
      question: 'Choose the correct word to complete the sentence:\n"The dolphin ______ as long as the blue whale. The whale is much longer."',
      prompt: 'Chọn từ chính xác điền vào câu phủ định so sánh bằng:',
      options: ['is', 'isn’t', 'are'],
      correctAnswer: 'isn’t',
      explanation: 'Vì vế sau ghi cá voi dài hơn nhiều ("much longer"), nên cá heo KHÔNG dài bằng cá voi, chọn thể phủ định số ít "isn’t".'
    },
    {
      id: 'u2-q10',
      section: 'reading',
      type: 'read_choose',
      question: 'Read the text and answer the question:\n"The beetle weighs 20 grams. The lizard weighs 150 grams. Which one is heavier?"',
      prompt: 'Đọc và trả lời con vật nào nặng hơn:',
      options: ['The beetle is heavier.', 'The lizard is heavier.', 'They are the same.'],
      correctAnswer: 'The lizard is heavier.',
      explanation: 'Thằn lằn (150g) nặng hơn bọ cánh cứng (20g). Do đó "The lizard is heavier" là đáp án chính xác.'
    },
    {
      id: 'u2-q11',
      section: 'reading',
      type: 'read_complete',
      question: 'Complete the sentence:\n"Among the dolphin, the seal, and the blue whale, the blue whale is the ______ animal."',
      prompt: 'Điền từ so sánh nhất thích hợp:',
      options: ['biggest', 'bigger', 'big'],
      correctAnswer: 'biggest',
      explanation: 'So sánh giữa ba đối tượng trở lên dùng so sánh nhất ("the biggest").'
    },

    // --- WRITING SECTION (4 QUESTIONS) ---
    {
      id: 'u2-q12',
      section: 'writing',
      type: 'write_arrange',
      question: 'Arrange the words to make a correct sentence:',
      prompt: 'Sắp xếp các từ thành câu đúng cấu trúc Everybody Up 4:',
      options: ['panda', 'is', 'The', 'gorilla', 'than', 'smaller', 'the', '.'],
      correctAnswer: 'The panda is smaller than the gorilla .',
      explanation: 'Cấu trúc so sánh hơn chuẩn: "The panda is smaller than the gorilla ."'
    },
    {
      id: 'u2-q13',
      section: 'writing',
      type: 'write_complete',
      question: 'Fill in the blank with the correct comparison term:\n"The bee is the ______ (small) insect in this garden."',
      prompt: 'Điền dạng so sánh nhất của từ trong ngoặc:',
      options: ['smallest', 'smaller', 'small'],
      correctAnswer: 'smallest',
      explanation: 'Có mạo từ "the" phía trước nên ta dùng dạng so sánh nhất "smallest".'
    },
    {
      id: 'u2-q14',
      section: 'writing',
      type: 'write_picture',
      question: 'Look at the clues and write the correct sea creature name:\n"It has ten arms, shoots dark ink, and lives in deep oceans. It is a ______."',
      prompt: 'Gợi ý: Con vật phun mực đen dưới biển:',
      options: ['squid', 'eel', 'dolphin'],
      correctAnswer: 'squid',
      explanation: 'Con vật có nhiều râu/xúc tu và phun mực đen chính là con mực ("squid").'
    },
    {
      id: 'u2-q15',
      section: 'writing',
      type: 'write_arrange',
      question: 'Arrange the words to make a correct sentence:',
      prompt: 'Sắp xếp câu so sánh bằng của Everybody Up 4:',
      options: ['eel', 'The', 'is', 'as', 'long', 'as', 'the', 'seal', '.'],
      correctAnswer: 'The eel is as long as the seal .',
      explanation: 'Cấu trúc so sánh bằng hoàn chỉnh: "The eel is as long as the seal ."'
    }
  ],
  'unit-3': [
    // --- LISTENING SECTION (7 QUESTIONS) ---
    {
      id: 'u3-q1',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose what the girl looks like:',
      prompt: 'Nghe và chọn miêu tả ngoại hình đúng của bạn nữ:',
      options: ['She has short straight hair.', 'She has long curly hair.', 'She has shoulder-length wavy hair.'],
      correctAnswer: 'She has shoulder-length wavy hair.',
      audioText: 'Hi, I’m Daisy. My hair is not short, and it is not straight. It is shoulder-length and wavy. I love my hair!',
      explanation: ' Daisy khẳng định tóc của bạn ấy là "shoulder-length and wavy" (dài ngang vai và gợn sóng).'
    },
    {
      id: 'u3-q2',
      section: 'listening',
      type: 'listen_picture',
      question: 'Listen and select the correct accessory mentioned:',
      prompt: 'Nghe và chọn hình ảnh phụ kiện đúng:',
      options: ['⌚ (Watch)', '🕶️ (Sunglasses)', '🧤 (Gloves)'],
      correctAnswer: '🕶️ (Sunglasses)',
      audioText: 'The sun is very hot and bright. I need to put on my dark sunglasses to protect my eyes.',
      explanation: 'Phụ kiện đeo khi nắng để bảo vệ mắt là kính râm 🕶️ ("sunglasses").'
    },
    {
      id: 'u3-q3',
      section: 'listening',
      type: 'listen_complete',
      question: 'Listen and complete the sentence:',
      prompt: 'Nghe và điền từ còn thiếu vào chỗ trống:',
      options: ['kind', 'brave', 'thoughtful'],
      correctAnswer: 'kind',
      audioText: 'When your friend needs help, you share your things. That’s very good. Remember to be kind to everyone.',
      explanation: 'Giá trị đạo đức được dạy là "be kind" (Tử tế, tốt bụng).'
    },
    {
      id: 'u3-q4',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose who the brother is:',
      prompt: 'Nghe và xác định ai là người anh trai:',
      options: ['The one with curly hair and blue eyes.', 'The one with straight hair and brown eyes.', 'The one with short hair and a beard.'],
      correctAnswer: 'The one with short hair and a beard.',
      audioText: 'Can you see my brother over there? He is the one with short hair and a black beard.',
      explanation: 'Giọng nói mô tả anh trai có tóc ngắn và một bộ râu quai nón ("short hair and a black beard").'
    },
    {
      id: 'u3-q5',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose what accessories the woman wants to wear:',
      prompt: 'Nghe và chọn món phụ kiện người phụ nữ muốn đeo:',
      options: ['She wants to wear the gold earrings.', 'She wants to wear the black gloves.', 'She wants to wear the silver necklace.'],
      correctAnswer: 'She wants to wear the gold earrings.',
      audioText: 'I am going to a party. I want to wear my beautiful gold earrings.',
      explanation: 'Người phụ nữ nói muốn đeo đôi bông tai vàng "gold earrings" của cô ấy.'
    },
    {
      id: 'u3-q6',
      section: 'listening',
      type: 'listen_complete',
      question: 'Listen and fill in the missing camouflage place:',
      prompt: 'Nghe và điền môi trường ngụy trang còn thiếu:',
      options: ['stick', 'sand', 'grass'],
      correctAnswer: 'sand',
      audioText: 'Look at the brown crab on the beach. It is the same color as the sand.',
      explanation: 'Con cua màu nâu ngụy trang tiệp màu với cát ("same color as the sand").'
    },
    {
      id: 'u3-q7',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen to the conversation and choose the correct reply:',
      prompt: 'Nghe hội thoại và chọn phản hồi đúng:',
      options: ['Good luck with the play!', 'Thanks. You, too.', 'I’d like a watch, please.'],
      correctAnswer: 'Thanks. You, too.',
      audioText: 'Teacher: Good luck with the play! Student: Thanks. You, too.',
      explanation: 'Khi giáo viên nói "Good luck with the play!", học sinh phản hồi lịch sự "Thanks. You, too."'
    },

    // --- READING SECTION (4 QUESTIONS) ---
    {
      id: 'u3-q8',
      section: 'reading',
      type: 'read_choose',
      question: 'Read and choose the correct word:\n"He doesn’t have straight hair. His hair has tight round curls. He has..."',
      prompt: 'Đọc và chọn kiểu tóc tương ứng:',
      options: ['curly hair', 'wavy hair', 'long hair'],
      correctAnswer: 'curly hair',
      explanation: 'Tóc có các lọn xoăn tròn ("tight round curls") là tóc xoăn ("curly hair").'
    },
    {
      id: 'u3-q9',
      section: 'reading',
      type: 'read_complete',
      question: 'Choose the correct pronoun to complete the sentence:\n"Which sunglasses does she want to wear? She wants to wear the black ______."',
      prompt: 'Chọn đại từ thay thế phù hợp cho danh từ số nhiều (sunglasses):',
      options: ['one', 'ones', 'it'],
      correctAnswer: 'ones',
      explanation: '"Sunglasses" là danh từ số nhiều nên đại từ thay thế phải là "ones".'
    },
    {
      id: 'u3-q10',
      section: 'reading',
      type: 'read_choose',
      question: 'Read the science text and choose the correct option:\n"Camouflage helps animals hide. The green caterpillar is the same color as the ______."',
      prompt: 'Chọn vật ngụy trang có màu xanh trùng với sâu bướm xanh:',
      options: ['stick', 'leaf', 'sand'],
      correctAnswer: 'leaf',
      explanation: 'Sâu bướm xanh ("green caterpillar") ngụy trang tiệp màu với lá cây ("leaf") có màu xanh.'
    },
    {
      id: 'u3-q11',
      section: 'reading',
      type: 'read_complete',
      question: 'Complete the sentence:\n"What does your sister look like? She ______ shoulder-length, straight, black hair."',
      prompt: 'Điền từ chỉ sở hữu đặc điểm ngoại hình:',
      options: ['has', 'have', 'is'],
      correctAnswer: 'has',
      explanation: 'Chủ ngữ ngôi thứ ba số ít "She" đi với động từ chỉ sở hữu là "has".'
    },

    // --- WRITING SECTION (4 QUESTIONS) ---
    {
      id: 'u3-q12',
      section: 'writing',
      type: 'write_arrange',
      question: 'Arrange the words to make a correct sentence:',
      prompt: 'Sắp xếp các từ thành câu định vị ngoại hình chuẩn tiếng Anh:',
      options: ['is', 'the', 'She', 'one', 'with', 'curly', 'red', 'hair', '.'],
      correctAnswer: 'She is the one with curly red hair .',
      explanation: 'Cấu trúc định vị người chuẩn của Everybody Up 4: "She is the one with curly red hair ."'
    },
    {
      id: 'u3-q13',
      section: 'writing',
      type: 'write_complete',
      question: 'Fill in the blank with the correct word order:\n"What ______ (he / look) like?"',
      prompt: 'Điền cụm từ hỏi ngoại hình đúng ngữ pháp:',
      options: ['does he look', 'he looks', 'do he look'],
      correctAnswer: 'does he look',
      explanation: 'Cấu trúc câu hỏi ngoại hình với chủ ngữ "he" là "What does he look like?".'
    },
    {
      id: 'u3-q14',
      section: 'writing',
      type: 'write_picture',
      question: 'Look at the clues and write the accessory name:\n"You wear them on your ears to look beautiful. They are ______."',
      prompt: 'Gợi ý: Đồ trang sức đeo ở tai:',
      options: ['earrings', 'necklaces', 'watches'],
      correctAnswer: 'earrings',
      explanation: 'Trang sức đeo ở tai ("wear on your ears") là bông tai ("earrings").'
    },
    {
      id: 'u3-q15',
      section: 'writing',
      type: 'write_arrange',
      question: 'Arrange the words to make a correct sentence:',
      prompt: 'Sắp xếp câu hỏi lựa chọn phụ kiện trong Everybody Up 4:',
      options: ['Which', 'watch', 'does', 'he', 'want', 'to', 'wear', '?'],
      correctAnswer: 'Which watch does he want to wear ?',
      explanation: 'Câu hỏi chuẩn: "Which watch does he want to wear ?"'
    }
  ],
  'unit-4': [
    // --- LISTENING SECTION (7 QUESTIONS) ---
    {
      id: 'u4-q1',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose what activity the boy did yesterday:',
      prompt: 'Nghe và chọn hoạt động cậu bé đã làm hôm qua:',
      options: ['He played tennis.', 'He played table tennis.', 'He played basketball.'],
      correctAnswer: 'He played table tennis.',
      audioText: 'Hi! Yesterday afternoon, my cousin and I stood at the small table with paddles and a tiny ball. We played table tennis and had fun!',
      explanation: 'Mô tả "table with paddles and a tiny ball" và "played table tennis" chỉ hoạt động bóng bàn.'
    },
    {
      id: 'u4-q2',
      section: 'listening',
      type: 'listen_picture',
      question: 'Listen and select the sport equipment emoji:',
      prompt: 'Nghe và chọn biểu tượng thiết bị thể thao tương ứng:',
      options: ['🏀 (Basketball)', '⚾ (Baseball)', '🎾 (Tennis)'],
      correctAnswer: '⚾ (Baseball)',
      audioText: 'I can’t find my glove and bat. How can I play baseball today?',
      explanation: '"glove and bat" (găng tay và gậy đánh bóng) là dụng cụ của môn bóng chày ⚾.'
    },
    {
      id: 'u4-q3',
      section: 'listening',
      type: 'listen_complete',
      question: 'Listen and complete the sentence with the past action:',
      prompt: 'Nghe và điền từ hành động quá khứ thích hợp:',
      options: ['practiced', 'talked', 'helped'],
      correctAnswer: 'talked',
      audioText: 'Last night, I talked on the phone with my friends for one hour.',
      explanation: 'Đoạn băng nói rõ động từ quá khứ: "I talked on the phone". Từ cần chọn là "talked".'
    },
    {
      id: 'u4-q4',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and answer what materials they used in Rome to build homes:',
      prompt: 'Nghe và chọn chất liệu người La Mã đã dùng xây nhà:',
      options: ['They used clay.', 'They used metal.', 'They used stone.'],
      correctAnswer: 'They used stone.',
      audioText: 'In ancient Rome, people wanted strong houses. What did they use to make homes? They used stone.',
      explanation: 'Băng ghi âm nói rõ: "They used stone." (Họ đã sử dụng đá).'
    },
    {
      id: 'u4-q5',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose what the girl did last weekend:',
      prompt: 'Nghe và chọn hoạt động cuối tuần trước của bạn nữ:',
      options: ['She practiced the piano.', 'She visited her friend.', 'She used the computer.'],
      correctAnswer: 'She practiced the piano.',
      audioText: 'Last weekend, I sat in front of the black and white keys. I practiced the piano for two hours.',
      explanation: 'Ngồi trước các phím đen trắng ("black and white keys") và "practiced the piano" chỉ hoạt động tập đàn piano.'
    },
    {
      id: 'u4-q6',
      section: 'listening',
      type: 'listen_complete',
      question: 'Listen and complete the material word:',
      prompt: 'Nghe và điền từ chất liệu bình cổ:',
      options: ['clay', 'glass', 'stone'],
      correctAnswer: 'clay',
      audioText: 'Look at this ancient jar. It was shaped from soft red clay and baked in fire.',
      explanation: 'Bình cổ được tạo hình từ đất sét đỏ mềm ("soft red clay"), từ cần điền là "clay".'
    },
    {
      id: 'u4-q7',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose the moral lesson value:',
      prompt: 'Nghe và chọn giá trị chuẩn bị kỹ càng:',
      options: ['Be prepared.', 'Be helpful.', 'Be kind.'],
      correctAnswer: 'Be prepared.',
      audioText: 'Before you go on a trip, always check your backpack. Make sure you have everything. Be prepared.',
      explanation: 'Lời khuyên khích lệ chuẩn bị đầy đủ hành trang: "Be prepared" (Luôn sẵn sàng/chuẩn bị kỹ).'
    },

    // --- READING SECTION (4 QUESTIONS) ---
    {
      id: 'u4-q8',
      section: 'reading',
      type: 'read_choose',
      question: 'Read the past tense sentence and choose the correct verb:\n"What did she ______ yesterday afternoon?"\n"She played golf."',
      prompt: 'Chọn trợ động từ hoặc động từ đúng trong câu hỏi quá khứ:',
      options: ['did', 'do', 'does'],
      correctAnswer: 'do',
      explanation: 'Trong câu hỏi quá khứ đã có "did" thì động từ chính phải giữ nguyên thể "do".'
    },
    {
      id: 'u4-q9',
      section: 'reading',
      type: 'read_complete',
      question: 'Choose the correct verb form for yesterday action:\n"My brother ______ (use) the computer to write his school project yesterday."',
      prompt: 'Chọn dạng quá khứ của từ "use":',
      options: ['use', 'uses', 'used'],
      correctAnswer: 'used',
      explanation: 'Vì có trạng từ chỉ thời gian quá khứ "yesterday", động từ "use" thêm "-d" thành "used".'
    },
    {
      id: 'u4-q10',
      section: 'reading',
      type: 'read_choose',
      question: 'Read the dialogue and choose the best reply:\nTony: "I can’t find my baseball glove!"\nPeter: "Don’t worry. ______"',
      prompt: 'Đọc đoạn thoại và chọn phản hồi lịch sự chia sẻ đồ dùng:',
      options: ['You can borrow mine.', 'I played basketball yesterday.', 'They used stone.'],
      correctAnswer: 'You can borrow mine.',
      explanation: 'Khi bạn không tìm thấy găng tay bóng chày, câu phản hồi phù hợp nhất là cho bạn mượn găng tay của mình: "You can borrow mine."'
    },
    {
      id: 'u4-q11',
      section: 'reading',
      type: 'read_complete',
      question: 'Complete the sentence:\n"Windows are made of ______, which is transparent and fragile."',
      prompt: 'Điền từ chất liệu thủy tinh làm cửa sổ:',
      options: ['glass', 'clay', 'metal'],
      correctAnswer: 'glass',
      explanation: 'Cửa sổ trong suốt ("transparent") và dễ vỡ ("fragile") được làm bằng thủy tinh ("glass").'
    },

    // --- WRITING SECTION (4 QUESTIONS) ---
    {
      id: 'u4-q12',
      section: 'writing',
      type: 'write_arrange',
      question: 'Arrange the words to make a correct sentence:',
      prompt: 'Sắp xếp câu khẳng định thì quá khứ đơn chuẩn ngữ pháp:',
      options: ['He', 'played', 'tennis', 'with', 'his', 'friend', 'yesterday', '.'],
      correctAnswer: 'He played tennis with his friend yesterday .',
      explanation: 'Trật tự đúng: Chủ ngữ + Động từ quá khứ + Tân ngữ + Trạng ngữ chỉ thời gian.'
    },
    {
      id: 'u4-q13',
      section: 'writing',
      type: 'write_complete',
      question: 'Fill in the blank with the correct past tense auxiliary:\n"______ you practice the piano last night?"\n"Yes, I did."',
      prompt: 'Điền trợ động từ nghi vấn thì quá khứ đơn:',
      options: ['Did', 'Do', 'Were'],
      correctAnswer: 'Did',
      explanation: 'Câu hỏi nghi vấn thì quá khứ đơn với động từ thường sử dụng trợ động từ "Did".'
    },
    {
      id: 'u4-q14',
      section: 'writing',
      type: 'write_picture',
      question: 'Look at the description and write the correct material name:\n"Forks, spoons, and cars are made of strong, shiny ______."',
      prompt: 'Gợi ý chất liệu kim loại cứng, sáng bóng:',
      options: ['metal', 'clay', 'stone'],
      correctAnswer: 'metal',
      explanation: 'Thìa dĩa và ô tô được chế tạo từ kim loại chắc chắn và sáng bóng ("metal").'
    },
    {
      id: 'u4-q15',
      section: 'writing',
      type: 'write_arrange',
      question: 'Arrange the words to make a correct sentence:',
      prompt: 'Sắp xếp câu hỏi chất liệu xây dựng La Mã cổ đại:',
      options: ['What', 'did', 'they', 'use', 'to', 'make', 'homes', '?'],
      correctAnswer: 'What did they use to make homes ?',
      explanation: 'Cấu trúc câu hỏi quá khứ chuẩn: "What did they use to make homes ?"'
    }
  ],
  'unit-5': [
    // --- LISTENING SECTION (7 QUESTIONS) ---
    {
      id: 'u5-q1',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose what the girl ate for lunch:',
      prompt: 'Nghe và chọn món ăn trưa của bạn nữ:',
      options: ['She ate sushi.', 'She ate curry.', 'She ate noodles.'],
      correctAnswer: 'She ate sushi.',
      audioText: 'Yesterday, my family went to a Japanese restaurant. I used chopsticks and ate delicious raw fish with rice. Yes, I ate sushi!',
      explanation: 'Dùng đũa ăn cá sống với cơm ("raw fish with rice") tại nhà hàng Nhật là món sushi.'
    },
    {
      id: 'u5-q2',
      section: 'listening',
      type: 'listen_picture',
      question: 'Listen and select the correct drink emoji:',
      prompt: 'Nghe và chọn biểu tượng đồ uống tương ứng:',
      options: ['🍹 (Lemonade)', '🍇 (Grape juice)', '🍵 (Tea)'],
      correctAnswer: '🍇 (Grape juice)',
      audioText: 'The juice is purple and made from fresh grapes. It is very sweet. I drank a cup of grape juice!',
      explanation: 'Nước trái cây màu tím làm từ nho tươi chính là nước nho 🍇 ("Grape juice").'
    },
    {
      id: 'u5-q3',
      section: 'listening',
      type: 'listen_complete',
      question: 'Listen and complete the past action:',
      prompt: 'Nghe và điền từ hoạt động quá khứ còn thiếu:',
      options: ['went bowling', 'saw a parade', 'had a picnic'],
      correctAnswer: 'went bowling',
      audioText: 'We held a heavy ball and rolled it to hit the ten pins. We went bowling yesterday.',
      explanation: 'Hành động ném bóng lăn đổ các ki gỗ ("hit the ten pins") là đi chơi bowling "went bowling".'
    },
    {
      id: 'u5-q4',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose what happened to the boy:',
      prompt: 'Nghe và chọn sự việc xảy ra với bạn nam:',
      options: ['He lost his backpack.', 'He got a haircut.', 'He bought new clothes.'],
      correctAnswer: 'He lost his backpack.',
      audioText: 'Oh no! Where are my books? I can’t find my school bag. I lost my backpack!',
      explanation: 'Bạn nam nói không tìm thấy cặp sách ("can’t find my school bag") và thốt lên "I lost my backpack!".'
    },
    {
      id: 'u5-q5',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose the dinosaur part described:',
      prompt: 'Nghe và chọn bộ phận của khủng long được nhắc tới:',
      options: ['Some dinosaurs had feathers.', 'Some dinosaurs had long tails.', 'Some dinosaurs had sharp claws.'],
      correctAnswer: 'Some dinosaurs had feathers.',
      audioText: 'Did you know? Many ancient dinosaurs looked like birds. Some dinosaurs had soft, colorful feathers on their bodies!',
      explanation: 'Băng ghi âm nhắc đến khủng long trông giống chim và có lông vũ mềm mại: "Some dinosaurs had soft, colorful feathers".'
    },
    {
      id: 'u5-q6',
      section: 'listening',
      type: 'listen_complete',
      question: 'Listen and complete the word:',
      prompt: 'Nghe và điền từ chỉ bộ phận vuốt sắc nhọn:',
      options: ['wing', 'tail', 'claw'],
      correctAnswer: 'claw',
      audioText: 'Watch out! The T-Rex dinosaur had sharp claws on its hands to catch food.',
      explanation: 'Bộ phận tay của khủng long để bắt mồi là móng vuốt "claw" sắc nhọn.'
    },
    {
      id: 'u5-q7',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose the moral lesson value:',
      prompt: 'Nghe và chọn giá trị bài học cuộc sống:',
      options: ['Be helpful.', 'Be thoughtful.', 'Be patient.'],
      correctAnswer: 'Be helpful.',
      audioText: 'When your friend loses their book, don’t ignore them. Look for it together. Remember: Be helpful.',
      explanation: 'Giúp đỡ bạn tìm lại sách bị mất dạy bé bài học: "Be helpful" (Có tinh thần giúp đỡ).'
    },

    // --- READING SECTION (4 QUESTIONS) ---
    {
      id: 'u5-q8',
      section: 'reading',
      type: 'read_choose',
      question: 'Read and choose the correct past verb form:\n"What did she ______ yesterday afternoon?"\n"She drank lemonade."',
      prompt: 'Chọn từ đúng cho câu hỏi quá khứ với động từ chỉ đồ uống:',
      options: ['drank', 'drink', 'drinks'],
      correctAnswer: 'drink',
      explanation: 'Trong câu hỏi quá khứ "What did she...", động từ chính "drink" phải giữ nguyên mẫu.'
    },
    {
      id: 'u5-q9',
      section: 'reading',
      type: 'read_complete',
      question: 'Choose the correct word to complete the outing story:\n"On Sunday, they saw many brass bands and dancers marching down the main street. They saw a ______."',
      prompt: 'Chọn hoạt động dã ngoại ngoài đường phố thích hợp:',
      options: ['picnic', 'parade', 'haircut'],
      correctAnswer: 'parade',
      explanation: 'Sự kiện có ban nhạc kèn đồng và vũ công tuần hành trên đường phố được gọi là lễ diễu hành ("parade").'
    },
    {
      id: 'u5-q10',
      section: 'reading',
      type: 'read_choose',
      question: 'Read the text and answer the question:\n"Yesterday, Mary ate chicken curry. Her brother, Jim, ate Japanese sushi. What did Mary eat?"',
      prompt: 'Đọc và chọn món ăn Mary đã ăn:',
      options: ['sushi', 'noodles', 'curry'],
      correctAnswer: 'curry',
      explanation: 'Đoạn văn ghi rõ: "Mary ate chicken curry", nên Mary đã ăn món cà ri ("curry").'
    },
    {
      id: 'u5-q11',
      section: 'reading',
      type: 'read_complete',
      question: 'Complete the dinosaur description:\n"Pterosaurs were flying dinosaurs. They could fly because they had two big ______."',
      prompt: 'Điền từ bộ phận giúp khủng long bay được:',
      options: ['wings', 'tails', 'feathers'],
      correctAnswer: 'wings',
      explanation: 'Khủng long bay có thể bay được nhờ có hai đôi cánh lớn ("wings").'
    },

    // --- WRITING SECTION (4 QUESTIONS) ---
    {
      id: 'u5-q12',
      section: 'writing',
      type: 'write_arrange',
      question: 'Arrange the words to make a correct sentence:',
      prompt: 'Sắp xếp câu kể hoạt động ăn uống thì quá khứ đơn:',
      options: ['He', 'ate', 'noodles', 'for', 'lunch', 'yesterday', '.'],
      correctAnswer: 'He ate noodles for lunch yesterday .',
      explanation: 'Cấu trúc hoàn chỉnh: "He ate noodles for lunch yesterday ."'
    },
    {
      id: 'u5-q13',
      section: 'writing',
      type: 'write_complete',
      question: 'Fill in the blank with the correct past tense verb:\n"When did they ______ (go) bowling?"\n"They went bowling yesterday."',
      prompt: 'Điền dạng động từ nguyên thể của "went" trong câu hỏi:',
      options: ['go', 'goes', 'went'],
      correctAnswer: 'go',
      explanation: 'Có trợ động từ "did" trong câu hỏi "When did they..." nên ta dùng động từ nguyên mẫu "go".'
    },
    {
      id: 'u5-q14',
      section: 'writing',
      type: 'write_picture',
      question: 'Look at the clues and write the correct item:\n"You pack your books and carry it on your shoulders. It is a ______."',
      prompt: 'Gợi ý: Đồ vật đựng sách đeo trên vai:',
      options: ['backpack', 'towel', 'glove'],
      correctAnswer: 'backpack',
      explanation: 'Đồ vật đeo trên vai để đựng sách vở đi học là chiếc ba lô ("backpack").'
    },
    {
      id: 'u5-q15',
      section: 'writing',
      type: 'write_arrange',
      question: 'Arrange the words to make a correct sentence:',
      prompt: 'Sắp xếp câu miêu tả đặc điểm khủng long trong quá khứ:',
      options: ['Some', 'dinosaurs', 'had', 'feathers', 'on', 'their', 'bodies', '.'],
      correctAnswer: 'Some dinosaurs had feathers on their bodies .',
      explanation: 'Cấu trúc sắp xếp đúng: "Some dinosaurs had feathers on their bodies ."'
    }
  ],
  'unit-6': [
    // --- LISTENING SECTION (7 QUESTIONS) ---
    {
      id: 'u6-q1',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose what the girl likes to do in her free time:',
      prompt: 'Nghe và chọn sở thích hoạt động sáng tạo của bạn nữ:',
      options: ['She likes to paint pictures.', 'She likes to write stories.', 'She likes to sing songs.'],
      correctAnswer: 'She likes to write stories.',
      audioText: 'In my free time, I don’t paint or sing. I love words. I use my pencil and notebook to write beautiful stories about princesses and astronauts. I like to write stories!',
      explanation: 'Bạn nữ khẳng định thích dùng bút, vở viết nên các câu chuyện: "I like to write stories".'
    },
    {
      id: 'u6-q2',
      section: 'listening',
      type: 'listen_picture',
      question: 'Listen and select the creative hobby emoji:',
      prompt: 'Nghe và chọn biểu tượng hoạt động sáng tạo tương ứng:',
      options: ['👗 (Design clothes)', '✈️ (Make models)', '🎬 (Make movies)'],
      correctAnswer: '✈️ (Make models)',
      audioText: 'My brother has many plastic parts of toy planes and cars. He likes glueing them together. He likes to make models!',
      explanation: 'Lắp ghép các mảnh nhựa của máy bay và ô tô đồ chơi là sở thích ráp mô hình ✈️ ("make models").'
    },
    {
      id: 'u6-q3',
      section: 'listening',
      type: 'listen_complete',
      question: 'Listen and complete the past cooking sentence:',
      prompt: 'Nghe và điền từ món ăn tối quá khứ còn thiếu:',
      options: ['dinner', 'cookies', 'jewelry'],
      correctAnswer: 'dinner',
      audioText: 'Yesterday evening, I helped my parents. I cooked dinner for them in the kitchen.',
      explanation: 'Băng nói rõ động từ và tân ngữ quá khứ: "I cooked dinner for them". Từ còn thiếu là "dinner".'
    },
    {
      id: 'u6-q4',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose what the boy knitted for his mother:',
      prompt: 'Nghe và chọn món đồ bạn nam đã đan tặng mẹ:',
      options: ['He knitted a sweater.', 'He knitted a scarf.', 'He knitted a hat.'],
      correctAnswer: 'He knitted a scarf.',
      audioText: 'The weather is cold. I used red wool and needles. I knitted a warm scarf for my mother.',
      explanation: 'Bạn nam sử dụng len và kim đan để đan tặng mẹ chiếc khăn len ấm áp "He knitted a scarf".'
    },
    {
      id: 'u6-q5',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose the type of art described:',
      prompt: 'Nghe và chọn loại hình nghệ thuật được miêu tả:',
      options: ['A painting', 'A sculpture', 'A mosaic'],
      correctAnswer: 'A sculpture',
      audioText: 'Look at this figure. It was carved out of a big piece of white marble stone by an artist. It is a beautiful sculpture.',
      explanation: 'Tác phẩm được tạc từ một khối đá cẩm thạch trắng lớn chính là tác phẩm điêu khắc "A sculpture".'
    },
    {
      id: 'u6-q6',
      section: 'listening',
      type: 'listen_complete',
      question: 'Listen and complete the word about art:',
      prompt: 'Nghe và điền từ loại hình nghệ thuật tranh ghép mảnh:',
      options: ['photograph', 'mosaic', 'painting'],
      correctAnswer: 'mosaic',
      audioText: 'This wall is decorated with thousands of small colored glass tiles. It is an ancient mosaic.',
      explanation: 'Tác phẩm được ghép từ hàng nghìn ô kính màu nhỏ chính là bức tranh mosaic "mosaic".'
    },
    {
      id: 'u6-q7',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose the moral lesson value:',
      prompt: 'Nghe và chọn giá trị đạo đức tương trợ:',
      options: ['Be helpful.', 'Be prepared.', 'Be brave.'],
      correctAnswer: 'Be helpful.',
      audioText: 'Our neighbors are carrying very heavy bags. Let’s help them carry the bags. Remember: Be helpful.',
      explanation: 'Giúp đỡ hàng xóm bê xách đồ đạc nặng dạy bé bài học: "Be helpful" (Tốt bụng giúp đỡ mọi người).'
    },

    // --- READING SECTION (4 QUESTIONS) ---
    {
      id: 'u6-q8',
      section: 'reading',
      type: 'read_choose',
      question: 'Read and choose the correct question pattern:\n"______ does she like to do in her free time?"\n"She likes to design clothes."',
      prompt: 'Chọn từ để hỏi hoạt động sở thích sáng tạo:',
      options: ['What', 'When', 'Who'],
      correctAnswer: 'What',
      explanation: 'Câu trả lời nói về sở thích thiết kế quần áo (chỉ sự vật, hành động), nên câu hỏi dùng từ "What" (Cái gì/Làm gì).'
    },
    {
      id: 'u6-q9',
      section: 'reading',
      type: 'read_complete',
      question: 'Choose the correct preposition for the past action:\n"He baked delicious cookies ______ them last Sunday."',
      prompt: 'Chọn giới từ đúng cho mẫu câu tặng quà quá khứ:',
      options: ['for', 'to', 'with'],
      correctAnswer: 'for',
      explanation: 'Cấu trúc nướng bánh quy tặng cho ai đó dùng giới từ "for" (bake cookies for someone).'
    },
    {
      id: 'u6-q10',
      section: 'reading',
      type: 'read_choose',
      question: 'Read the description and answer the question:\n"This is a photo of a forest captured by a camera. What type of art is it?"',
      prompt: 'Chọn loại hình nghệ thuật phù hợp với mô tả ảnh chụp máy ảnh:',
      options: ['sculpture', 'painting', 'photograph'],
      correctAnswer: 'photograph',
      explanation: 'Bức ảnh được ghi lại bằng máy ảnh kỹ thuật số là một bức ảnh chụp ("photograph").'
    },
    {
      id: 'u6-q11',
      section: 'reading',
      type: 'read_complete',
      question: 'Complete the neighbors sentence:\n"Our neighbors are very friendly. We should help them ______ their heavy bags."',
      prompt: 'Điền động từ hành động giúp đỡ bưng vác:',
      options: ['carry', 'knit', 'cook'],
      correctAnswer: 'carry',
      explanation: 'Giúp đỡ hàng xóm bưng vác túi nặng, ta dùng động từ mang vác là "carry".'
    },

    // --- WRITING SECTION (4 QUESTIONS) ---
    {
      id: 'u6-q12',
      section: 'writing',
      type: 'write_arrange',
      question: 'Arrange the words to make a correct sentence:',
      prompt: 'Sắp xếp các từ thành câu đúng cấu trúc Everybody Up 4:',
      options: ['She', 'likes', 'to', 'sing', 'songs', 'in', 'her', 'free', 'time', '.'],
      correctAnswer: 'She likes to sing songs in her free time .',
      explanation: 'Cấu trúc đúng: "She likes to sing songs in her free time ."'
    },
    {
      id: 'u6-q13',
      section: 'writing',
      type: 'write_complete',
      question: 'Fill in the blank with the correct past tense verb:\n"What did he ______ (knit) for his sister?"\n"He knitted a warm scarf."',
      prompt: 'Điền động từ nguyên thể của động từ "knitted" trong câu hỏi:',
      options: ['knit', 'knits', 'knitted'],
      correctAnswer: 'knit',
      explanation: 'Có trợ động từ "did" trong câu hỏi quá khứ "What did he..." nên ta dùng động từ nguyên mẫu "knit".'
    },
    {
      id: 'u6-q14',
      section: 'writing',
      type: 'write_picture',
      question: 'Look at the clues and write the correct craft name:\n"You use sweet ingredients like sugar, flour, and chocolate to ______ cookies."',
      prompt: 'Gợi ý động từ hành động nướng bánh quy:',
      options: ['bake', 'cook', 'make'],
      correctAnswer: 'bake',
      explanation: 'Hành động nướng bánh quy trong lò sử dụng các nguyên liệu ngọt ngào là "bake" (nướng bánh).'
    },
    {
      id: 'u6-q15',
      section: 'writing',
      type: 'write_arrange',
      question: 'Arrange the words to make a correct sentence:',
      prompt: 'Sắp xếp câu kể hành động nấu nướng trong quá khứ tặng gia đình:',
      options: ['He', 'cooked', 'dinner', 'for', 'them', 'yesterday', '.'],
      correctAnswer: 'He cooked dinner for them yesterday .',
      explanation: 'Trật tự đúng: "He cooked dinner for them yesterday ."'
    }
  ],
  'unit-7': [
    // --- LISTENING SECTION (7 QUESTIONS) ---
    {
      id: 'u7-q1',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose what the boy wants to be:',
      prompt: 'Nghe và chọn nghề nghiệp ước mơ của bạn nam:',
      options: ['He wants to be a scientist.', 'He wants to be a game designer.', 'He wants to be a journalist.'],
      correctAnswer: 'He wants to be a game designer.',
      audioText: 'I love playing computer games. My dream is to create new virtual worlds and funny games. I want to be a game designer when I grow up!',
      explanation: 'Bạn nam mơ ước tạo ra các trò chơi máy tính và khẳng định: "I want to be a game designer".'
    },
    {
      id: 'u7-q2',
      section: 'listening',
      type: 'listen_picture',
      question: 'Listen and select the career emoji:',
      prompt: 'Nghe và chọn biểu tượng nghề nghiệp tương ứng:',
      options: ['🎻 (Musician)', '🎨 (Artist)', '📰 (Journalist)'],
      correctAnswer: '🎻 (Musician)',
      audioText: 'I love music. I play the violin every day in front of many people. I want to be a musician.',
      explanation: 'Chơi đàn vĩ cầm 🎻 chuyên nghiệp là nghề nhạc sĩ/nhạc công "musician".'
    },
    {
      id: 'u7-q3',
      section: 'listening',
      type: 'listen_complete',
      question: 'Listen and complete the future plan sentence:',
      prompt: 'Nghe và điền cụm từ hành động tương lai còn thiếu:',
      options: ['go to space', 'explore the jungle', 'travel the world'],
      correctAnswer: 'explore the jungle',
      audioText: 'When I am older, I want to travel to hot places with big trees and wild monkeys. I want to explore the jungle!',
      explanation: 'Đi tới nơi nóng, nhiều cây lớn và khỉ hoang dã để thám hiểm rừng sâu: "explore the jungle".'
    },
    {
      id: 'u7-q4',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose what the girl wants to do when she is older:',
      prompt: 'Nghe và chọn dự định khi lớn của bạn nữ:',
      options: ['She wants to fly a helicopter.', 'She wants to travel the world.', 'She wants to work with animals.'],
      correctAnswer: 'She wants to work with animals.',
      audioText: 'I love puppies, pandas and kittens. I want to become a veterinarian and help them. I want to work with animals.',
      explanation: 'Bạn nữ yêu quý động vật và muốn trở thành bác sĩ thú y để giúp đỡ chúng: "I want to work with animals".'
    },
    {
      id: 'u7-q5',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose what the sign means:',
      prompt: 'Nghe và chọn ý nghĩa của biển báo bảo tàng:',
      options: ['It means you can’t run here.', 'It means you can’t eat here.', 'It means you can’t touch things.'],
      correctAnswer: 'It means you can’t run here.',
      audioText: 'Children! Look at the sign with a running boy and a red line. What does that sign mean? It means you can’t run here.',
      explanation: 'Biển hình cậu bé chạy có gạch chéo đỏ có nghĩa là: "It means you can’t run here" (Cấm chạy ở đây).'
    },
    {
      id: 'u7-q6',
      section: 'listening',
      type: 'listen_complete',
      question: 'Listen and complete the space vehicle term:',
      prompt: 'Nghe và điền từ phương tiện phi hành gia sử dụng:',
      options: ['space shuttle', 'helicopter', 'race car'],
      correctAnswer: 'space shuttle',
      audioText: 'Astronauts have to take the space shuttle to leave the Earth and travel into space.',
      explanation: 'Phương tiện đưa phi hành gia rời Trái đất bay vào vũ trụ là tàu vũ trụ "space shuttle".'
    },
    {
      id: 'u7-q7',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose the moral lesson value:',
      prompt: 'Nghe và chọn giá trị bài học rèn luyện tính kiên nhẫn:',
      options: ['Be patient.', 'Be prepared.', 'Be helpful.'],
      correctAnswer: 'Be patient.',
      audioText: 'When you stand in a long line, don’t yell or push other people. Wait for your turn quietly. Be patient.',
      explanation: 'Chờ đợi xếp hàng yên lặng dạy bé đức tính kiên nhẫn: "Be patient" (Hãy kiên nhẫn).'
    },

    // --- READING SECTION (4 QUESTIONS) ---
    {
      id: 'u7-q8',
      section: 'reading',
      type: 'read_choose',
      question: 'Read and choose the correct job matching the description:\n"A person who does experiments in a laboratory to study science. He is a..."',
      prompt: 'Chọn nghề nghiệp nghiên cứu khoa học phòng thí nghiệm:',
      options: ['musician', 'scientist', 'actor'],
      correctAnswer: 'scientist',
      explanation: 'Người làm thí nghiệm nghiên cứu khoa học được gọi là nhà khoa học ("scientist").'
    },
    {
      id: 'u7-q9',
      section: 'reading',
      type: 'read_complete',
      question: 'Choose the correct verb form for future plans:\n"What ______ he want to be when he grows up?"\n"He wants to be an artist."',
      prompt: 'Chọn trợ động từ tương lai nghề nghiệp cho ngôi thứ ba số ít (he):',
      options: ['does', 'do', 'did'],
      correctAnswer: 'does',
      explanation: 'Câu hỏi nghề nghiệp ước mơ với chủ ngữ "he" sử dụng trợ động từ số ít hiện tại "does".'
    },
    {
      id: 'u7-q10',
      section: 'reading',
      type: 'read_choose',
      question: 'Read the space science text and answer the question:\n"Astronauts live and work in a giant space station orbiting the Earth. Where do they live in space?"',
      prompt: 'Đọc văn bản và trả lời nơi sống của phi hành gia trong không gian:',
      options: ['They live on a space shuttle.', 'They live in a space station.', 'They live on Earth.'],
      correctAnswer: 'They live in a space station.',
      explanation: 'Văn bản nêu rõ phi hành gia sống và làm việc trên trạm vũ trụ: "They live in a space station."'
    },
    {
      id: 'u7-q11',
      section: 'reading',
      type: 'read_complete',
      question: 'Complete the career plan sentence:\n"I want to help news papers write articles about current events. I want to be a ______."',
      prompt: 'Điền từ chỉ nghề viết báo, phóng viên:',
      options: ['journalist', 'game designer', 'actor'],
      correctAnswer: 'journalist',
      explanation: 'Người viết các bài báo cho tòa soạn là nhà báo/phóng viên ("journalist").'
    },

    // --- WRITING SECTION (4 QUESTIONS) ---
    {
      id: 'u7-q12',
      section: 'writing',
      type: 'write_arrange',
      question: 'Arrange the words to make a correct sentence:',
      prompt: 'Sắp xếp câu ước mơ nghề nghiệp chuẩn tiếng Anh Everybody Up 4:',
      options: ['I', 'want', 'to', 'be', 'a', 'scientist', 'when', 'I', 'grow', 'up', '.'],
      correctAnswer: 'I want to be a scientist when I grow up .',
      explanation: 'Cấu trúc chuẩn: "I want to be a scientist when I grow up ."'
    },
    {
      id: 'u7-q13',
      section: 'writing',
      type: 'write_complete',
      question: 'Fill in the blank with the correct verb form for singular subject:\n"What does she want to ______ (do) when she is older?"',
      prompt: 'Điền động từ nguyên thể của động từ hành động tương lai:',
      options: ['do', 'does', 'doing'],
      correctAnswer: 'do',
      explanation: 'Sau "want to" luôn đi kèm động từ nguyên mẫu không "to", do đó ta điền "do".'
    },
    {
      id: 'u7-q14',
      section: 'writing',
      type: 'write_picture',
      question: 'Look at the clues and write the correct space item:\n"Astronauts must wear this special heavy clothing to breathe and keep safe. It is a ______."',
      prompt: 'Gợi ý: Trang phục phi hành gia mặc trong vũ trụ:',
      options: ['space suit', 'space station', 'helmet'],
      correctAnswer: 'space suit',
      explanation: 'Trang phục bảo vệ phi hành gia thở và an toàn trong vũ trụ là bộ đồ phi hành gia ("space suit").'
    },
    {
      id: 'u7-q15',
      section: 'writing',
      type: 'write_arrange',
      question: 'Arrange the words to make a correct sentence:',
      prompt: 'Sắp xếp câu hỏi dự định khi lớn tuổi của Everybody Up 4:',
      options: ['What', 'does', 'he', 'want', 'to', 'do', 'when', 'he’s', 'older', '?'],
      correctAnswer: 'What does he want to do when he’s older ?',
      explanation: 'Cấu trúc câu hỏi đúng: "What does he want to do when he’s older ?"'
    }
  ],
  'unit-8': [
    // --- LISTENING SECTION (7 QUESTIONS) ---
    {
      id: 'u8-q1',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose what the boy is going to do on vacation tomorrow:',
      prompt: 'Nghe và chọn hoạt động đi chơi ngày mai của bạn nam:',
      options: ['He’s going to see a show.', 'He’s going to stay in a hotel.', 'He’s going to take a boat ride.'],
      correctAnswer: 'He’s going to take a boat ride.',
      audioText: 'I am so excited! Tomorrow morning, I am going to stand on a big ship and look at the blue sea. Yes, I’m going to take a boat ride tomorrow!',
      explanation: 'Đứng trên tàu lớn ngắm biển xanh ngày mai tương ứng với hoạt động "take a boat ride tomorrow".'
    },
    {
      id: 'u8-q2',
      section: 'listening',
      type: 'listen_picture',
      question: 'Listen and select the vacation item emoji:',
      prompt: 'Nghe và chọn biểu tượng vật dụng đi dã ngoại:',
      options: ['⛺ (Tent)', '🔦 (Flashlight)', 'Sleeping bag'],
      correctAnswer: '⛺ (Tent)',
      audioText: 'It is a small house made of cloth. We can build it in the forest and sleep inside. We need to take a tent with us.',
      explanation: '"house made of cloth" (ngôi nhà vải lắp dựng trong rừng để ngủ) là chiếc lều ⛺ ("tent").'
    },
    {
      id: 'u8-q3',
      section: 'listening',
      type: 'listen_complete',
      question: 'Listen and complete the transportation vehicle word:',
      prompt: 'Nghe và điền từ phương tiện giao thông còn thiếu:',
      options: ['ferry', 'subway', 'taxi'],
      correctAnswer: 'ferry',
      audioText: 'To cross the big river, my car must drive onto a giant boat. We are going to take the ferry to the island.',
      explanation: 'Chiếc tàu lớn chở ô tô qua sông chính là chiếc phà "ferry".'
    },
    {
      id: 'u8-q4',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen to the girl and choose what she is going to take with her:',
      prompt: 'Nghe bạn nữ nói và chọn vật dụng mang theo du lịch:',
      options: ['She is going to take swimsuit and towel.', 'She is going to take money and tent.', 'She is going to take flashlight and sleeping bag.'],
      correctAnswer: 'She is going to take swimsuit and towel.',
      audioText: 'I am going to swim in the blue ocean. I must put on my swimsuit, and I need a dry towel to wipe my body.',
      explanation: 'Bạn nữ muốn bơi biển nên mang theo đồ bơi và khăn tắm: "swimsuit and towel".'
    },
    {
      id: 'u8-q5',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen and choose where the family is going to the department store:',
      prompt: 'Nghe và chọn phương tiện gia đình sẽ dùng đến cửa hàng bách hóa:',
      options: ['They are going to take a taxi.', 'They are going to take the subway.', 'They are going to take the ferry.'],
      correctAnswer: 'They are going to take a taxi.',
      audioText: 'Look at that yellow car with a taxi sign. We don’t want to walk. Let’s wave our hands and take a taxi to the department store.',
      explanation: 'Chiếc xe màu vàng có biển báo taxi chính là xe taxi "take a taxi".'
    },
    {
      id: 'u8-q6',
      section: 'listening',
      type: 'listen_complete',
      question: 'Listen and complete the vacation item word:',
      prompt: 'Nghe và điền từ vật dụng cứu sáng ban đêm:',
      options: ['sleeping bag', 'flashlight', 'swimsuit'],
      correctAnswer: 'flashlight',
      audioText: 'It is very dark inside our tent at night. I need to click the button of this flashlight to see things.',
      explanation: 'Vật dụng phát sáng ban đêm trong lều là chiếc đèn pin "flashlight".'
    },
    {
      id: 'u8-q7',
      section: 'listening',
      type: 'listen_choose',
      question: 'Listen to the dialogue and choose the correct reply:',
      prompt: 'Nghe hội thoại chúc đi chơi vui vẻ và phản hồi:',
      options: ['Thank you. See you next month!', 'I’m going to stay in a hotel.', 'He’s going to take a ferry.'],
      correctAnswer: 'Thank you. See you next month!',
      audioText: 'Friend: Have a great time on vacation! Boy: Thank you. See you next month!',
      explanation: 'Khi được bạn bè chúc có kỳ nghỉ vui vẻ ("Have a great time..."), bạn nam phản hồi "Thank you. See you next month!".'
    },

    // --- READING SECTION (4 QUESTIONS) ---
    {
      id: 'u8-q8',
      section: 'reading',
      type: 'read_choose',
      question: 'Read and choose the correct vacation item based on the text:\n"We are going to camp in the forest. To stay warm when sleeping on the cold ground, we need a..."',
      prompt: 'Chọn vật dụng giữ ấm cơ thể khi ngủ cắm trại:',
      options: ['sleeping bag', 'swimsuit', 'money'],
      correctAnswer: 'sleeping bag',
      explanation: 'Vật dụng giữ ấm cơ thể khi nằm ngủ dưới đất lúc cắm trại là túi ngủ ("sleeping bag").'
    },
    {
      id: 'u8-q9',
      section: 'reading',
      type: 'read_complete',
      question: 'Choose the correct future form to complete the sentence:\n"What ______ she going to do on vacation tomorrow?"\n"She’s going to ride a horse."',
      prompt: 'Chọn động từ to-be phù hợp với chủ ngữ "she" trong tương lai gần:',
      options: ['is', 'are', 'am'],
      correctAnswer: 'is',
      explanation: 'Chủ ngữ số ít "she" đi với động từ to-be là "is" trong cấu trúc "What is she going to do...".'
    },
    {
      id: 'u8-q10',
      section: 'reading',
      type: 'read_choose',
      question: 'Read the transport description and answer the question:\n"A fast train that travels inside dark tunnels underground. What is it?"',
      prompt: 'Chọn phương tiện tàu chạy dưới lòng đất:',
      options: ['The subway', 'The taxi', 'The ferry'],
      correctAnswer: 'The subway',
      explanation: 'Tàu điện chạy nhanh trong đường hầm dưới lòng đất được gọi là tàu điện ngầm ("The subway").'
    },
    {
      id: 'u8-q11',
      section: 'reading',
      type: 'read_complete',
      question: 'Complete the vacation plans:\n"We want to buy beautiful clothes and toys in the city. We are going to stay in a luxurious ______ next to the beach."',
      prompt: 'Điền địa điểm nghỉ dưỡng khi đi du lịch:',
      options: ['hotel', 'tent', 'subway'],
      correctAnswer: 'hotel',
      explanation: 'Địa điểm lưu trú sang trọng gần bãi biển khi đi du lịch là khách sạn ("hotel").'
    },

    // --- WRITING SECTION (4 QUESTIONS) ---
    {
      id: 'u8-q12',
      section: 'writing',
      type: 'write_arrange',
      question: 'Arrange the words to make a correct sentence:',
      prompt: 'Sắp xếp câu diễn đạt kế hoạch tương lai gần với going to:',
      options: ['She’s', 'going', 'to', 'swim', 'in', 'the', 'ocean', 'tomorrow', '.'],
      correctAnswer: 'She’s going to swim in the ocean tomorrow .',
      explanation: 'Cấu trúc đúng: "She’s going to swim in the ocean tomorrow ."'
    },
    {
      id: 'u8-q13',
      section: 'writing',
      type: 'write_complete',
      question: 'Fill in the blank with the correct vacation plans query verb:\n"When is he ______ (go) to see a show?"\n"He’s going to see a show tonight."',
      prompt: 'Điền từ còn thiếu trong cấu trúc "going to":',
      options: ['going', 'goes', 'go'],
      correctAnswer: 'going',
      explanation: 'Thì tương lai gần sử dụng cụm "be going to + V-inf". Do đó từ cần điền là "going".'
    },
    {
      id: 'u8-q14',
      section: 'writing',
      type: 'write_picture',
      question: 'Look at the clues and write the vacation item name:\n"You use paper bills and metal coins to buy food and souvenirs. It is ______."',
      prompt: 'Gợi ý: Vật phẩm dùng để mua sắm đồ ăn thức uống:',
      options: ['money', 'towel', 'flashlight'],
      correctAnswer: 'money',
      explanation: 'Tiền giấy hoặc đồng xu dùng để thanh toán mua bán đồ ăn, quà lưu niệm được gọi là tiền ("money").'
    },
    {
      id: 'u8-q15',
      section: 'writing',
      type: 'write_arrange',
      question: 'Arrange the words to make a correct sentence:',
      prompt: 'Sắp xếp câu hỏi dự định mang theo hành lý trong Everybody Up 4:',
      options: ['What’s', 'he', 'going', 'to', 'take', 'with', 'him', '?'],
      correctAnswer: 'What’s he going to take with him ?',
      explanation: 'Cấu trúc câu hỏi tương lai mang theo hành lý chuẩn: "What’s he going to take with him ?"'
    }
  ]
};
