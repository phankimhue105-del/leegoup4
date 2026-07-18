/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VocabularyItem {
  word: string;
  ipa: string;
  meaning: string;
  partOfSpeech: string;
  exampleSentence: string;
  exampleTranslation: string;
  emoji: string;
}

// Complete rich vocabulary database for Everybody Up 4 syllabus, bám sát từng bài học
export const vocabularyDatabase: Record<string, Record<string, VocabularyItem[]>> = {
  'unit-1': {
    'lesson-1': [
      {
        word: 'climb',
        ipa: '/klaɪm/',
        meaning: 'leo núi / leo trèo',
        partOfSpeech: 'Verb',
        exampleSentence: 'He likes climbing high trees.',
        exampleTranslation: 'Cậu ấy thích trèo cây cao.',
        emoji: '🧗'
      },
      {
        word: 'hike',
        ipa: '/haɪk/',
        meaning: 'đi bộ đường dài',
        partOfSpeech: 'Verb',
        exampleSentence: 'They love to hike in the forest.',
        exampleTranslation: 'Họ thích đi bộ đường dài ở trong rừng.',
        emoji: '🥾'
      },
      {
        word: 'canoe',
        ipa: '/kəˈnuː/',
        meaning: 'chèo xuồng canoe',
        partOfSpeech: 'Verb',
        exampleSentence: 'She can canoe on the quiet lake.',
        exampleTranslation: 'Cô ấy có thể chèo xuồng trên hồ nước yên ả.',
        emoji: '🛶'
      },
      {
        word: 'fish',
        ipa: '/fɪʃ/',
        meaning: 'câu cá',
        partOfSpeech: 'Verb',
        exampleSentence: 'My grandfather likes to fish at weekends.',
        exampleTranslation: 'Ông của tớ thích câu cá vào cuối tuần.',
        emoji: '🎣'
      },
      {
        word: 'grill hamburgers',
        ipa: '/ɡrɪl ˈhæmˌbɜː.ɡərz/',
        meaning: 'nướng bánh burger',
        partOfSpeech: 'Phrase',
        exampleSentence: 'We grill hamburgers in our backyard camping.',
        exampleTranslation: 'Chúng tớ nướng bánh burger trong vườn sau khi đi cắm trại.',
        emoji: '🍔'
      },
      {
        word: 'watch birds',
        ipa: '/wɒtʃ bɜːdz/',
        meaning: 'ngắm chim',
        partOfSpeech: 'Phrase',
        exampleSentence: 'She uses binoculars to watch birds.',
        exampleTranslation: 'Cô ấy dùng ống nhòm để ngắm chim.',
        emoji: '🦉'
      }
    ],
    'lesson-2': [
      {
        word: 'ski',
        ipa: '/skiː/',
        meaning: 'trượt tuyết',
        partOfSpeech: 'Verb',
        exampleSentence: 'He wants to learn how to ski this winter.',
        exampleTranslation: 'Cậu ấy muốn học trượt tuyết vào mùa đông này.',
        emoji: '⛷️'
      },
      {
        word: 'snowboard',
        ipa: '/ˈsnəʊ.bɔːd/',
        meaning: 'lướt ván tuyết',
        partOfSpeech: 'Verb',
        exampleSentence: "She is good at snowboarding.",
        exampleTranslation: 'Cô ấy chơi lướt ván tuyết rất giỏi.',
        emoji: '🏂'
      },
      {
        word: 'ice skate',
        ipa: '/ˈaɪs.skeɪt/',
        meaning: 'trượt băng',
        partOfSpeech: 'Verb',
        exampleSentence: 'We often ice skate at the rink.',
        exampleTranslation: 'Chúng tớ thường trượt băng ở sân trượt.',
        emoji: '⛸️'
      },
      {
        word: 'in-line skate',
        ipa: '/ˌɪn.laɪn ˈskeɪt/',
        meaning: 'trượt patin giày bánh dọc',
        partOfSpeech: 'Verb',
        exampleSentence: 'He can in-line skate very fast on the street.',
        exampleTranslation: 'Cậu ấy có thể trượt patin bánh dọc rất nhanh trên đường.',
        emoji: '🛼'
      },
      {
        word: 'skateboard',
        ipa: '/ˈskeɪt.bɔːd/',
        meaning: 'trượt ván',
        partOfSpeech: 'Verb',
        exampleSentence: 'My brother got a new skateboard.',
        exampleTranslation: 'Em trai tớ có một chiếc ván trượt mới.',
        emoji: '🛹'
      },
      {
        word: 'surf',
        ipa: '/sɜːf/',
        meaning: 'lướt sóng',
        partOfSpeech: 'Verb',
        exampleSentence: 'They love to surf in the summer ocean.',
        exampleTranslation: 'Họ thích lướt sóng ở biển vào mùa hè.',
        emoji: '🏄'
      }
    ],
    'lesson-3': [
      {
        word: 'skate',
        ipa: '/skeɪt/',
        meaning: 'trượt băng/patin',
        partOfSpeech: 'Verb',
        exampleSentence: "I am learning to skate.",
        exampleTranslation: 'Tớ đang học trượt băng.',
        emoji: '⛸️'
      },
      {
        word: 'help',
        ipa: '/help/',
        meaning: 'giúp đỡ',
        partOfSpeech: 'Verb',
        exampleSentence: 'Can you help me with this box?',
        exampleTranslation: 'Cậu giúp tớ một tay với cái hộp này nhé?',
        emoji: '🤝'
      },
      {
        word: 'brave',
        ipa: '/breɪv/',
        meaning: 'dũng cảm',
        partOfSpeech: 'Adjective',
        exampleSentence: 'Be brave! You can do it.',
        exampleTranslation: 'Hãy dũng cảm lên! Con làm được mà.',
        emoji: '🦁'
      }
    ],
    'lesson-4': [
      {
        word: 'wear a helmet',
        ipa: '/weər ə ˈhel.mət/',
        meaning: 'đội mũ bảo hiểm',
        partOfSpeech: 'Phrase',
        exampleSentence: 'Always wear a helmet when riding a bike.',
        exampleTranslation: 'Hãy luôn đội mũ bảo hiểm khi đi xe đạp nhé.',
        emoji: '🪖'
      },
      {
        word: 'put on sunscreen',
        ipa: '/pʊt ɒn ˈsʌn.skriːn/',
        meaning: 'bôi kem chống nắng',
        partOfSpeech: 'Phrase',
        exampleSentence: 'Remember to put on sunscreen at the beach.',
        exampleTranslation: 'Nhớ bôi kem chống nắng khi ở bãi biển nhé.',
        emoji: '🧴'
      },
      {
        word: 'wear a life jacket',
        ipa: '/weər ə laɪf ˈdʒæk.ɪt/',
        meaning: 'mặc áo phao',
        partOfSpeech: 'Phrase',
        exampleSentence: 'Wear a life jacket when you go on a boat.',
        exampleTranslation: 'Hãy mặc áo phao cứu hộ khi con đi thuyền.',
        emoji: '🦺'
      },
      {
        word: 'fasten your seatbelt',
        ipa: '/ˈfɑː.sən jɔːr ˈsiːt.belt/',
        meaning: 'thắt dây an toàn',
        partOfSpeech: 'Phrase',
        exampleSentence: 'Please fasten your seatbelt in the car.',
        exampleTranslation: 'Xin vui lòng thắt dây an toàn khi ở trong ô tô.',
        emoji: '🚗'
      }
    ]
  },
  'unit-2': {
    'lesson-1': [
      {
        word: 'hippopotamus',
        ipa: '/ˌhɪp.əˈpɒt.ə.məs/',
        meaning: 'con hà mã',
        partOfSpeech: 'Noun',
        exampleSentence: 'The hippopotamus loves staying in water.',
        exampleTranslation: 'Con hà mã thích ngâm mình dưới nước.',
        emoji: '🦛'
      },
      {
        word: 'gorilla',
        ipa: '/ɡəˈrɪl.ə/',
        meaning: 'con khỉ đột',
        partOfSpeech: 'Noun',
        exampleSentence: 'The gorilla is strong and smart.',
        exampleTranslation: 'Con khỉ đột rất khỏe mạnh và thông minh.',
        emoji: '🦍'
      },
      {
        word: 'panda',
        ipa: '/ˈpæn.də/',
        meaning: 'con gấu trúc',
        partOfSpeech: 'Noun',
        exampleSentence: 'The panda is eating bamboo leaves.',
        exampleTranslation: 'Con gấu trúc đang ăn lá tre.',
        emoji: '🐼'
      },
      {
        word: 'butterfly',
        ipa: '/ˈbʌt.ə.flaɪ/',
        meaning: 'con bướm',
        partOfSpeech: 'Noun',
        exampleSentence: 'A colorful butterfly lands on the flower.',
        exampleTranslation: 'Một chú bướm đầy màu sắc đậu lên bông hoa.',
        emoji: '🦋'
      },
      {
        word: 'caterpillar',
        ipa: '/ˈkæt.ə.pɪl.ər/',
        meaning: 'con sâu bướm',
        partOfSpeech: 'Noun',
        exampleSentence: 'The caterpillar crawls slowly on the leaf.',
        exampleTranslation: 'Con sâu bướm bò chậm chạp trên chiếc lá.',
        emoji: '🐛'
      },
      {
        word: 'bee',
        ipa: '/biː/',
        meaning: 'con ong',
        partOfSpeech: 'Noun',
        exampleSentence: 'The busy bee is making honey.',
        exampleTranslation: 'Chú ong bận rộn đang làm mật.',
        emoji: '🐝'
      }
    ],
    'lesson-2': [
      {
        word: 'eel',
        ipa: '/iːl/',
        meaning: 'con lươn',
        partOfSpeech: 'Noun',
        exampleSentence: 'The eel swims like a long snake.',
        exampleTranslation: 'Con lươn bơi trông như một con rắn dài.',
        emoji: '🐍'
      },
      {
        word: 'seal',
        ipa: '/siːl/',
        meaning: 'con hải cẩu',
        partOfSpeech: 'Noun',
        exampleSentence: 'The cute seal is clapping its flippers.',
        exampleTranslation: 'Chú hải cẩu đáng yêu đang vỗ vây.',
        emoji: '🦭'
      },
      {
        word: 'dolphin',
        ipa: '/ˈdɒl.fɪn/',
        meaning: 'con cá heo',
        partOfSpeech: 'Noun',
        exampleSentence: 'Dolphins are very friendly sea animals.',
        exampleTranslation: 'Cá heo là loài động vật biển rất thân thiện.',
        emoji: '🐬'
      },
      {
        word: 'squid',
        ipa: '/skwɪd/',
        meaning: 'con mực',
        partOfSpeech: 'Noun',
        exampleSentence: 'The squid can shoot ink to protect itself.',
        exampleTranslation: 'Con mực có thể phun mực để tự vệ.',
        emoji: '🦑'
      },
      {
        word: 'whale',
        ipa: '/weɪl/',
        meaning: 'con cá voi',
        partOfSpeech: 'Noun',
        exampleSentence: 'The blue whale is the biggest animal in the world.',
        exampleTranslation: 'Cá voi xanh là loài động vật lớn nhất thế giới.',
        emoji: '🐋'
      },
      {
        word: 'shark',
        ipa: '/ʃɑːk/',
        meaning: 'con cá mập',
        partOfSpeech: 'Noun',
        exampleSentence: 'The shark has very sharp teeth.',
        exampleTranslation: 'Con cá mập có hàm răng cực kỳ sắc nhọn.',
        emoji: '🦈'
      }
    ],
    'lesson-3': [
      {
        word: 'longest',
        ipa: '/lɒŋ.ɡɪst/',
        meaning: 'dài nhất',
        partOfSpeech: 'Adjective',
        exampleSentence: 'Which pencil is the longest one?',
        exampleTranslation: 'Chiếc bút chì nào là dài nhất thế con?',
        emoji: '📏'
      },
      {
        word: 'thoughtful',
        ipa: '/ˈθɔːt.fəl/',
        meaning: 'chu đáo / ân cần',
        partOfSpeech: 'Adjective',
        exampleSentence: 'It is very thoughtful of you to share.',
        exampleTranslation: 'Con thật chu đáo khi biết chia sẻ đồ chơi.',
        emoji: '💖'
      },
      {
        word: 'best',
        ipa: '/best/',
        meaning: 'tốt nhất / giỏi nhất',
        partOfSpeech: 'Adjective',
        exampleSentence: 'You are my best friend.',
        exampleTranslation: 'Cậu là người bạn tốt nhất của tớ.',
        emoji: '🏆'
      }
    ],
    'lesson-4': [
      {
        word: 'lizard',
        ipa: '/ˈlɪz.əd/',
        meaning: 'con thằn lằn',
        partOfSpeech: 'Noun',
        exampleSentence: 'The lizard can climb up the wall quickly.',
        exampleTranslation: 'Con thằn lằn có thể bò lên tường rất nhanh.',
        emoji: '🦎'
      },
      {
        word: 'beetle',
        ipa: '/ˈbiː.təl/',
        meaning: 'bọ cánh cứng',
        partOfSpeech: 'Noun',
        exampleSentence: 'The beetle has a hard shell on its back.',
        exampleTranslation: 'Con bọ cánh cứng có một lớp vỏ cứng trên lưng.',
        emoji: '🪲'
      },
      {
        word: 'crab',
        ipa: '/kræb/',
        meaning: 'con cua',
        partOfSpeech: 'Noun',
        exampleSentence: 'The crab walks sideways on the beach.',
        exampleTranslation: 'Con cua bò ngang trên bãi cát.',
        emoji: '🦀'
      },
      {
        word: 'octopus',
        ipa: '/ˈɒk.tə.pəs/',
        meaning: 'con bạch tuộc',
        partOfSpeech: 'Noun',
        exampleSentence: 'The octopus has eight long arms.',
        exampleTranslation: 'Con bạch tuộc có tám xúc tu dài.',
        emoji: '🐙'
      }
    ]
  },
  'unit-3': {
    'lesson-1': [
      {
        word: 'short hair',
        ipa: '/ʃɔːt heər/',
        meaning: 'tóc ngắn',
        partOfSpeech: 'Phrase',
        exampleSentence: 'She wants to cut her hair to have short hair.',
        exampleTranslation: 'Cô ấy muốn cắt tóc để có mái tóc ngắn.',
        emoji: '👦'
      },
      {
        word: 'shoulder-length hair',
        ipa: '/ˈʃəʊl.dəˌleŋθ heər/',
        meaning: 'tóc ngang vai',
        partOfSpeech: 'Phrase',
        exampleSentence: 'Her hair is beautiful and shoulder-length.',
        exampleTranslation: 'Mái tóc cô ấy rất đẹp và dài ngang vai.',
        emoji: '👩'
      },
      {
        word: 'long hair',
        ipa: '/lɒŋ heər/',
        meaning: 'tóc dài',
        partOfSpeech: 'Phrase',
        exampleSentence: 'The princess in the story has very long hair.',
        exampleTranslation: 'Nàng công chúa trong truyện có mái tóc rất dài.',
        emoji: '👧'
      },
      {
        word: 'straight hair',
        ipa: '/streɪt heər/',
        meaning: 'tóc thẳng',
        partOfSpeech: 'Phrase',
        exampleSentence: 'She has long straight hair.',
        exampleTranslation: 'Cô ấy có mái tóc thẳng dài.',
        emoji: '💇‍♀️'
      },
      {
        word: 'curly hair',
        ipa: '/ˈkɜː.li heər/',
        meaning: 'tóc xoăn',
        partOfSpeech: 'Phrase',
        exampleSentence: 'My cousin has cute curly hair.',
        exampleTranslation: 'Anh họ tớ có mái tóc xoăn rất dễ thương.',
        emoji: '🧑‍🦱'
      },
      {
        word: 'wavy hair',
        ipa: '/ˈweɪ.vi heər/',
        meaning: 'tóc gợn sóng',
        partOfSpeech: 'Phrase',
        exampleSentence: 'Her mother has elegant wavy hair.',
        exampleTranslation: 'Mẹ của bạn ấy có mái tóc gợn sóng thanh lịch.',
        emoji: '👩‍🦱'
      }
    ],
    'lesson-2': [
      {
        word: 'watch',
        ipa: '/wɒtʃ/',
        meaning: 'đồng hồ đeo tay',
        partOfSpeech: 'Noun',
        exampleSentence: 'He wears a black sports watch.',
        exampleTranslation: 'Cậu ấy đeo một chiếc đồng hồ thể thao màu đen.',
        emoji: '⌚'
      },
      {
        word: 'necklace',
        ipa: '/ˈnek.ləs/',
        meaning: 'vòng cổ',
        partOfSpeech: 'Noun',
        exampleSentence: 'The beautiful necklace is made of silver.',
        exampleTranslation: 'Chiếc vòng cổ xinh đẹp được làm bằng bạc.',
        emoji: '📿'
      },
      {
        word: 'earrings',
        ipa: '/ˈɪə.rɪŋz/',
        meaning: 'bông tai',
        partOfSpeech: 'Noun',
        exampleSentence: 'She is wearing gold earrings.',
        exampleTranslation: 'Cô ấy đang đeo một đôi bông tai vàng.',
        emoji: '💎'
      },
      {
        word: 'sunglasses',
        ipa: '/ˈsʌŋ.ɡlɑː.sɪz/',
        meaning: 'kính mát / kính râm',
        partOfSpeech: 'Noun',
        exampleSentence: 'Put on your sunglasses to protect your eyes.',
        exampleTranslation: 'Hãy đeo kính mát để bảo vệ đôi mắt của con nhé.',
        emoji: '🕶️'
      },
      {
        word: 'gloves',
        ipa: '/ɡlʌvz/',
        meaning: 'găng tay',
        partOfSpeech: 'Noun',
        exampleSentence: 'Wear gloves to keep your hands warm in winter.',
        exampleTranslation: 'Hãy đeo găng tay để giữ ấm đôi bàn tay vào mùa đông.',
        emoji: '🧤'
      },
      {
        word: 'belt',
        ipa: '/belt/',
        meaning: 'thắt lưng / dây nịt',
        partOfSpeech: 'Noun',
        exampleSentence: 'He wears a brown leather belt.',
        exampleTranslation: 'Chú ấy đeo một chiếc thắt lưng da màu nâu.',
        emoji: '👖'
      }
    ],
    'lesson-3': [
      {
        word: 'play',
        ipa: '/pleɪ/',
        meaning: 'vở kịch / buổi diễn',
        partOfSpeech: 'Noun',
        exampleSentence: 'They are practicing for the school play.',
        exampleTranslation: 'Họ đang tập luyện cho vở kịch của trường.',
        emoji: '🎭'
      },
      {
        word: 'good luck',
        ipa: '/ɡʊd lʌk/',
        meaning: 'chúc may mắn',
        partOfSpeech: 'Phrase',
        exampleSentence: 'Good luck with your English exam!',
        exampleTranslation: 'Chúc con gặp nhiều may mắn trong kỳ thi tiếng Anh nhé!',
        emoji: '🍀'
      },
      {
        word: 'kind',
        ipa: '/kaɪnd/',
        meaning: 'tử tế / tốt bụng',
        partOfSpeech: 'Adjective',
        exampleSentence: 'He is a very kind and helpful boy.',
        exampleTranslation: 'Cậu ấy là một cậu bé tốt bụng và hay giúp đỡ.',
        emoji: '😇'
      }
    ],
    'lesson-4': [
      {
        word: 'stick',
        ipa: '/stɪk/',
        meaning: 'nhánh củi / cành cây khô',
        partOfSpeech: 'Noun',
        exampleSentence: 'The walking stick insect looks like a small stick.',
        exampleTranslation: 'Con bọ que trông giống như một cành cây khô nhỏ.',
        emoji: '🥢'
      },
      {
        word: 'leaf',
        ipa: '/liːf/',
        meaning: 'lá cây',
        partOfSpeech: 'Noun',
        exampleSentence: 'The green caterpillar is hiding under a leaf.',
        exampleTranslation: 'Chú sâu bướm xanh đang trốn dưới một chiếc lá.',
        emoji: '🍃'
      },
      {
        word: 'grass',
        ipa: '/ɡrɑːs/',
        meaning: 'bãi cỏ / ngọn cỏ',
        partOfSpeech: 'Noun',
        exampleSentence: 'The grass in the park is green and fresh.',
        exampleTranslation: 'Cỏ trong công viên thật xanh tươi.',
        emoji: '🌱'
      },
      {
        word: 'sand',
        ipa: '/sænd/',
        meaning: 'bãi cát / hạt cát',
        partOfSpeech: 'Noun',
        exampleSentence: 'Kids like building sandcastles in the wet sand.',
        exampleTranslation: 'Trẻ em thích xây lâu đài cát trên bãi cát ướt.',
        emoji: '🏖️'
      }
    ]
  },
  'unit-4': {
    'lesson-1': [
      {
        word: 'baseball',
        ipa: '/ˈbeɪs.bɔːl/',
        meaning: 'môn bóng chày',
        partOfSpeech: 'Noun',
        exampleSentence: 'They played baseball in the park yesterday.',
        exampleTranslation: 'Họ đã chơi bóng chày trong công viên hôm qua.',
        emoji: '⚾'
      },
      {
        word: 'basketball',
        ipa: '/ˈbɑː.skɪt.bɔːl/',
        meaning: 'môn bóng rổ',
        partOfSpeech: 'Noun',
        exampleSentence: 'My taller brother is very good at basketball.',
        exampleTranslation: 'Anh trai cao hơn của tớ chơi bóng rổ rất giỏi.',
        emoji: '🏀'
      },
      {
        word: 'volleyball',
        ipa: '/ˈvɒl.i.bɔːl/',
        meaning: 'môn bóng chuyền',
        partOfSpeech: 'Noun',
        exampleSentence: 'We like playing volleyball at the beach.',
        exampleTranslation: 'Chúng tớ thích chơi bóng chuyền ở bãi biển.',
        emoji: '🏐'
      },
      {
        word: 'golf',
        ipa: '/ɡɒlf/',
        meaning: 'môn đánh golf',
        partOfSpeech: 'Noun',
        exampleSentence: 'His father plays golf on Sundays.',
        exampleTranslation: 'Bố của cậu ấy chơi golf vào các ngày Chủ nhật.',
        emoji: '🏌️'
      },
      {
        word: 'tennis',
        ipa: '/ˈten.ɪs/',
        meaning: 'môn quần vợt',
        partOfSpeech: 'Noun',
        exampleSentence: 'She practices tennis every afternoon.',
        exampleTranslation: 'Cô ấy tập chơi quần vợt mỗi chiều.',
        emoji: '🎾'
      },
      {
        word: 'table tennis',
        ipa: '/ˈteɪ.bəl ˌten.ɪs/',
        meaning: 'môn bóng bàn',
        partOfSpeech: 'Noun',
        exampleSentence: 'Table tennis is a fast and fun sport.',
        exampleTranslation: 'Bóng bàn là một môn thể thao nhanh và vui nhộn.',
        emoji: '🏓'
      }
    ],
    'lesson-2': [
      {
        word: 'practice the piano',
        ipa: '/ˈpræk.tɪs ðə piˈæn.ə/',
        meaning: 'luyện đàn piano',
        partOfSpeech: 'Phrase',
        exampleSentence: 'I have to practice the piano for thirty minutes.',
        exampleTranslation: 'Tớ phải luyện tập piano trong ba mươi phút.',
        emoji: '🎹'
      },
      {
        word: 'use the computer',
        ipa: '/juːz ðə kəmˈpjuː.tər/',
        meaning: 'sử dụng máy tính',
        partOfSpeech: 'Phrase',
        exampleSentence: 'He uses the computer to do his homework.',
        exampleTranslation: 'Cậu ấy dùng máy tính để làm bài tập về nhà.',
        emoji: '💻'
      },
      {
        word: 'talk on the phone',
        ipa: '/tɔːk ɒn ðə fəʊn/',
        meaning: 'nói chuyện điện thoại',
        partOfSpeech: 'Phrase',
        exampleSentence: 'She talked on the phone with her grandma.',
        exampleTranslation: 'Cô ấy đã nói chuyện điện thoại với bà ngoại.',
        emoji: '📞'
      },
      {
        word: 'help my parents',
        ipa: '/help maɪ ˈpeə.rənts/',
        meaning: 'giúp đỡ bố mẹ',
        partOfSpeech: 'Phrase',
        exampleSentence: 'I always help my parents sweep the floor.',
        exampleTranslation: 'Tớ luôn giúp đỡ bố mẹ quét dọn sàn nhà.',
        emoji: '🧹'
      },
      {
        word: 'visit my friend',
        ipa: '/ˈvɪz.ɪt maɪ frend/',
        meaning: 'thăm bạn bè',
        partOfSpeech: 'Phrase',
        exampleSentence: 'I will visit my friend at the hospital.',
        exampleTranslation: 'Tớ sẽ đi thăm bạn tớ ở bệnh viện.',
        emoji: '🏡'
      },
      {
        word: 'work on a project',
        ipa: '/wɜːk ɒn ə ˈprɒdʒ.ekt/',
        meaning: 'làm dự án học tập',
        partOfSpeech: 'Phrase',
        exampleSentence: 'They worked on a science project together.',
        exampleTranslation: 'Họ đã cùng nhau làm một dự án khoa học.',
        emoji: '🔬'
      }
    ],
    'lesson-3': [
      {
        word: 'glove',
        ipa: '/ɡlʌv/',
        meaning: 'găng tay bóng chày / bao tay',
        partOfSpeech: 'Noun',
        exampleSentence: "Where is my baseball glove?",
        exampleTranslation: 'Bao tay chơi bóng chày của tớ đâu rồi nhỉ?',
        emoji: '⚾'
      },
      {
        word: 'borrow',
        ipa: '/ˈbɒr.əʊ/',
        meaning: 'mượn',
        partOfSpeech: 'Verb',
        exampleSentence: 'Can I borrow your pencil, please?',
        exampleTranslation: 'Tớ có thể mượn chiếc bút chì của cậu được không?',
        emoji: '✏️'
      },
      {
        word: 'find',
        ipa: '/faɪnd/',
        meaning: 'tìm thấy',
        partOfSpeech: 'Verb',
        exampleSentence: "I can't find my keys.",
        exampleTranslation: 'Tớ không tìm thấy chìa khóa của mình.',
        emoji: '🔍'
      }
    ],
    'lesson-4': [
      {
        word: 'stone',
        ipa: '/stəʊn/',
        meaning: 'đá / viên đá',
        partOfSpeech: 'Noun',
        exampleSentence: 'In Rome, they built heavy walls with stone.',
        exampleTranslation: 'Ở thành Rome, họ đã xây những bức tường dày bằng đá.',
        emoji: '🪨'
      },
      {
        word: 'clay',
        ipa: '/kleɪ/',
        meaning: 'đất sét',
        partOfSpeech: 'Noun',
        exampleSentence: 'We use red clay to make pots and bricks.',
        exampleTranslation: 'Chúng tôi dùng đất sét đỏ để làm chậu và gạch.',
        emoji: '🏺'
      },
      {
        word: 'glass',
        ipa: '/ɡlɑːs/',
        meaning: 'thủy tinh',
        partOfSpeech: 'Noun',
        exampleSentence: 'Be careful! The glass vase is very fragile.',
        exampleTranslation: 'Cẩn thận nhé! Bình hoa thủy tinh dễ vỡ lắm.',
        emoji: '🥛'
      },
      {
        word: 'metal',
        ipa: '/ˈmet.əl/',
        meaning: 'kim loại',
        partOfSpeech: 'Noun',
        exampleSentence: 'The bridge is made of strong metal beams.',
        exampleTranslation: 'Cây cầu được làm từ những thanh kim loại chắc khỏe.',
        emoji: '🔩'
      }
    ]
  },
  'unit-5': {
    'lesson-1': [
      {
        word: 'noodles',
        ipa: '/ˈnuː.dəlz/',
        meaning: 'mì sợi / phở',
        partOfSpeech: 'Noun',
        exampleSentence: 'She loves to eat warm noodles for breakfast.',
        exampleTranslation: 'Cô ấy thích ăn mì ấm vào bữa sáng.',
        emoji: '🍜'
      },
      {
        word: 'curry',
        ipa: '/ˈkʌr.i/',
        meaning: 'món cà ri',
        partOfSpeech: 'Noun',
        exampleSentence: 'My mother cooks delicious chicken curry.',
        exampleTranslation: 'Mẹ tớ nấu món cà ri gà rất ngon.',
        emoji: '🍛'
      },
      {
        word: 'sushi',
        ipa: '/ˈsuː.ʃi/',
        meaning: 'món sushi',
        partOfSpeech: 'Noun',
        exampleSentence: 'Sushi is a very famous food from Japan.',
        exampleTranslation: 'Sushi là một món ăn rất nổi tiếng từ Nhật Bản.',
        emoji: '🍣'
      },
      {
        word: 'lemonade',
        ipa: '/ˌlem.əˈneɪd/',
        meaning: 'nước chanh',
        partOfSpeech: 'Noun',
        exampleSentence: 'Lemonade is refreshing on hot summer days.',
        exampleTranslation: 'Nước chanh rất mát lành vào những ngày hè nóng nực.',
        emoji: '🍹'
      },
      {
        word: 'grape juice',
        ipa: '/ɡreɪp dʒuːs/',
        meaning: 'nước nho',
        partOfSpeech: 'Noun',
        exampleSentence: 'He drank a big glass of sweet grape juice.',
        exampleTranslation: 'Cậu ấy đã uống một ly nước nho ngọt lịm.',
        emoji: '🍇'
      },
      {
        word: 'tea',
        ipa: '/tiː/',
        meaning: 'trà',
        partOfSpeech: 'Noun',
        exampleSentence: 'My grandparents drink hot tea every morning.',
        exampleTranslation: 'Ông bà tớ uống trà nóng mỗi sáng.',
        emoji: '🍵'
      }
    ],
    'lesson-2': [
      {
        word: 'go bowling',
        ipa: '/ɡəʊ ˈbəʊ.lɪŋ/',
        meaning: 'đi chơi bowling',
        partOfSpeech: 'Phrase',
        exampleSentence: 'Let’s go bowling together this Saturday!',
        exampleTranslation: 'Chúng mình cùng đi chơi bowling thứ Bảy này nhé!',
        emoji: '🎳'
      },
      {
        word: 'take a picture',
        ipa: '/teɪk ə ˈpɪk.tʃər/',
        meaning: 'chụp ảnh',
        partOfSpeech: 'Phrase',
        exampleSentence: 'She wants to take a picture of the flower.',
        exampleTranslation: 'Cô ấy muốn chụp một bức ảnh bông hoa.',
        emoji: '📸'
      },
      {
        word: 'see a parade',
        ipa: '/siː ə pəˈreɪd/',
        meaning: 'xem diễu hành',
        partOfSpeech: 'Phrase',
        exampleSentence: 'We went to the city center to see a parade.',
        exampleTranslation: 'Chúng tớ đã lên trung tâm thành phố để xem diễu hành.',
        emoji: '🎺'
      },
      {
        word: 'have a picnic',
        ipa: '/hæv ə ˈpɪk.nɪk/',
        meaning: 'đi dã ngoại',
        partOfSpeech: 'Phrase',
        exampleSentence: 'They love to have a picnic on the grass.',
        exampleTranslation: 'Họ thích đi dã ngoại trên thảm cỏ.',
        emoji: '🧺'
      },
      {
        word: 'get a haircut',
        ipa: '/ɡet ə ˈheə.kʌt/',
        meaning: 'cắt tóc',
        partOfSpeech: 'Phrase',
        exampleSentence: 'His hair is long, so he needs to get a haircut.',
        exampleTranslation: 'Tóc cậu ấy dài rồi, nên cậu ấy cần đi cắt tóc.',
        emoji: '✂️'
      },
      {
        word: 'buy clothes',
        ipa: '/baɪ kləʊðz/',
        meaning: 'mua sắm quần áo',
        partOfSpeech: 'Phrase',
        exampleSentence: 'My mother took me to the store to buy clothes.',
        exampleTranslation: 'Mẹ đưa tớ đến cửa hàng để mua quần áo.',
        emoji: '🛍️'
      }
    ],
    'lesson-3': [
      {
        word: 'backpack',
        ipa: '/ˈbæk.pæk/',
        meaning: 'ba lô',
        partOfSpeech: 'Noun',
        exampleSentence: 'He packed his books inside his school backpack.',
        exampleTranslation: 'Cậu ấy xếp sách vở vào trong ba lô đi học.',
        emoji: '🎒'
      },
      {
        word: 'lost',
        ipa: '/lɒst/',
        meaning: 'bị lạc / bị mất',
        partOfSpeech: 'Adjective',
        exampleSentence: "I think my wallet is lost.",
        exampleTranslation: 'Tớ nghĩ ví tiền của tớ bị mất rồi.',
        emoji: '😟'
      },
      {
        word: 'together',
        ipa: '/təˈɡeð.ər/',
        meaning: 'cùng nhau',
        partOfSpeech: 'Adverb',
        exampleSentence: 'We can solve this problem together.',
        exampleTranslation: 'Chúng mình có thể cùng nhau giải quyết vấn đề này.',
        emoji: '🧑‍🤝‍🧑'
      }
    ],
    'lesson-4': [
      {
        word: 'feather',
        ipa: '/ˈfeð.ər/',
        meaning: 'lông vũ',
        partOfSpeech: 'Noun',
        exampleSentence: 'The bird has beautiful blue feathers.',
        exampleTranslation: 'Chú chim có những chiếc lông vũ màu xanh tuyệt đẹp.',
        emoji: '🪶'
      },
      {
        word: 'tail',
        ipa: '/teɪl/',
        meaning: 'cái đuôi',
        partOfSpeech: 'Noun',
        exampleSentence: 'The puppy wags its tail when happy.',
        exampleTranslation: 'Chú cún vẫy đuôi mừng rỡ khi vui vẻ.',
        emoji: '🐕'
      },
      {
        word: 'claw',
        ipa: '/klɔː/',
        meaning: 'móng vuốt',
        partOfSpeech: 'Noun',
        exampleSentence: 'The cat has very sharp claws.',
        exampleTranslation: 'Con mèo có móng vuốt rất sắc nhọn.',
        emoji: '🐾'
      },
      {
        word: 'wing',
        ipa: '/wɪŋ/',
        meaning: 'cánh chim / đôi cánh',
        partOfSpeech: 'Noun',
        exampleSentence: 'The eagle opened its wide wings and flew.',
        exampleTranslation: 'Đại bàng dang rộng đôi cánh lớn rồi bay vút lên.',
        emoji: '🦅'
      }
    ]
  },
  'unit-6': {
    'lesson-1': [
      {
        word: 'sing songs',
        ipa: '/sɪŋ sɒŋz/',
        meaning: 'hát các bài hát',
        partOfSpeech: 'Phrase',
        exampleSentence: 'We sing songs in the music class.',
        exampleTranslation: 'Chúng tớ hát những bài hát trong giờ âm nhạc.',
        emoji: '🎤'
      },
      {
        word: 'make movies',
        ipa: '/meɪk ˈmuː.viz/',
        meaning: 'làm phim',
        partOfSpeech: 'Phrase',
        exampleSentence: 'They use a camera to make short movies.',
        exampleTranslation: 'Họ dùng máy quay để làm những bộ phim ngắn.',
        emoji: '🎬'
      },
      {
        word: 'write stories',
        ipa: '/raɪt ˈstɔː.riz/',
        meaning: 'viết truyện',
        partOfSpeech: 'Phrase',
        exampleSentence: 'He likes to write stories about space.',
        exampleTranslation: 'Cậu ấy thích viết những câu chuyện về vũ trụ.',
        emoji: '✍️'
      },
      {
        word: 'design clothes',
        ipa: '/dɪˈzaɪn kləʊðz/',
        meaning: 'thiết kế quần áo',
        partOfSpeech: 'Phrase',
        exampleSentence: 'She dreams of designing clothes for stars.',
        exampleTranslation: 'Cô ấy mơ ước thiết kế thời trang cho các ngôi sao.',
        emoji: '👗'
      },
      {
        word: 'paint pictures',
        ipa: '/peɪnt ˈpɪk.tʃərz/',
        meaning: 'vẽ tranh màu',
        partOfSpeech: 'Phrase',
        exampleSentence: 'The artist paints pictures of mountains.',
        exampleTranslation: 'Họa sĩ vẽ những bức tranh về núi non.',
        emoji: '🎨'
      },
      {
        word: 'make models',
        ipa: '/meɪk ˈmɒd.əlz/',
        meaning: 'lắp ráp mô hình',
        partOfSpeech: 'Phrase',
        exampleSentence: 'My brother likes to make airplane models.',
        exampleTranslation: 'Em trai tớ thích lắp ráp các mô hình máy bay.',
        emoji: '✈️'
      }
    ],
    'lesson-2': [
      {
        word: 'cook dinner',
        ipa: '/kʊk ˈdɪn.ər/',
        meaning: 'nấu bữa tối',
        partOfSpeech: 'Phrase',
        exampleSentence: 'My dad is cooking dinner in the kitchen.',
        exampleTranslation: 'Bố tớ đang nấu bữa tối ở trong bếp.',
        emoji: '🍳'
      },
      {
        word: 'bake cookies',
        ipa: '/beɪk ˈkʊk.iz/',
        meaning: 'nướng bánh quy',
        partOfSpeech: 'Phrase',
        exampleSentence: 'The house smells sweet when we bake cookies.',
        exampleTranslation: 'Căn nhà thơm phức mùi ngọt ngào khi chúng tớ nướng bánh quy.',
        emoji: '🍪'
      },
      {
        word: 'make jewelry',
        ipa: '/meɪk ˈdʒuː.əl.ri/',
        meaning: 'làm đồ trang sức thủ công',
        partOfSpeech: 'Phrase',
        exampleSentence: 'She uses colorful beads to make jewelry.',
        exampleTranslation: 'Cô ấy dùng những hạt cườm sắc màu để làm trang sức thủ công.',
        emoji: '📿'
      },
      {
        word: 'make a card',
        ipa: '/meɪk ə kɑːd/',
        meaning: 'làm thiệp chúc mừng',
        partOfSpeech: 'Phrase',
        exampleSentence: 'I want to make a card for Mother’s Day.',
        exampleTranslation: 'Tớ muốn làm một chiếc thiệp tặng mẹ vào Ngày của Mẹ.',
        emoji: '💌'
      },
      {
        word: 'knit a scarf',
        ipa: '/nɪt ə skɑːf/',
        meaning: 'đan khăn len',
        partOfSpeech: 'Phrase',
        exampleSentence: 'Her grandma is knitting a warm scarf for her.',
        exampleTranslation: 'Bà ngoại đang đan cho bạn ấy một chiếc khăn len ấm áp.',
        emoji: '🧣'
      },
      {
        word: 'play music',
        ipa: '/pleɪ ˈmjuː.zɪk/',
        meaning: 'chơi nhạc cụ / phát nhạc',
        partOfSpeech: 'Phrase',
        exampleSentence: 'They love to play music together as a band.',
        exampleTranslation: 'Họ thích cùng nhau chơi nhạc như một ban nhạc.',
        emoji: '🎸'
      }
    ],
    'lesson-3': [
      {
        word: 'carry',
        ipa: '/ˈkær.i/',
        meaning: 'bê / mang / vác',
        partOfSpeech: 'Verb',
        exampleSentence: 'Let me carry those heavy books for you.',
        exampleTranslation: 'Để tớ ôm đống sách nặng kia giúp cậu nhé.',
        emoji: '📦'
      },
      {
        word: 'bags',
        ipa: '/bæɡz/',
        meaning: 'những chiếc túi / bao tải',
        partOfSpeech: 'Noun',
        exampleSentence: 'We put the groceries inside the reusable bags.',
        exampleTranslation: 'Chúng tôi bỏ đồ tạp hóa vào các túi tái sử dụng.',
        emoji: '🛍️'
      },
      {
        word: 'neighbors',
        ipa: '/ˈneɪ.bərz/',
        meaning: 'hàng xóm láng giềng',
        partOfSpeech: 'Noun',
        exampleSentence: 'Our neighbors are very kind and friendly.',
        exampleTranslation: 'Hàng xóm láng giềng của chúng tớ rất tốt bụng và thân thiện.',
        emoji: '🏡'
      }
    ],
    'lesson-4': [
      {
        word: 'painting',
        ipa: '/ˈpeɪn.tɪŋ/',
        meaning: 'bức tranh vẽ',
        partOfSpeech: 'Noun',
        exampleSentence: 'This painting shows a beautiful sunset over the sea.',
        exampleTranslation: 'Bức họa này thể hiện hoàng hôn tuyệt đẹp trên biển.',
        emoji: '🖼️'
      },
      {
        word: 'photograph',
        ipa: '/ˈfəʊ.tə.ɡrɑːf/',
        meaning: 'bức ảnh chụp',
        partOfSpeech: 'Noun',
        exampleSentence: 'She took a beautiful photograph of her family.',
        exampleTranslation: 'Cô ấy đã chụp một bức ảnh rất đẹp về gia đình mình.',
        emoji: '📷'
      },
      {
        word: 'mosaic',
        ipa: '/məˈzeɪ.ɪk/',
        meaning: 'tranh ghép mảnh / khảm',
        partOfSpeech: 'Noun',
        exampleSentence: 'The museum has a historic Roman mosaic on the floor.',
        exampleTranslation: 'Bảo tàng có một tác phẩm tranh ghép mảnh La Mã lịch sử trên sàn.',
        emoji: '🧩'
      },
      {
        word: 'sculpture',
        ipa: '/ˈskʌlp.tʃər/',
        meaning: 'tác phẩm điêu khắc',
        partOfSpeech: 'Noun',
        exampleSentence: 'The stone sculpture was made by a famous artist.',
        exampleTranslation: 'Tác phẩm điêu khắc bằng đá này được làm bởi một nghệ sĩ nổi tiếng.',
        emoji: '🗿'
      }
    ]
  },
  'unit-7': {
    'lesson-1': [
      {
        word: 'actor',
        ipa: '/ˈæk.tər/',
        meaning: 'diễn viên',
        partOfSpeech: 'Noun',
        exampleSentence: 'He wants to be a famous actor in the future.',
        exampleTranslation: 'Cậu ấy muốn trở thành một diễn viên nổi tiếng trong tương lai.',
        emoji: '🎭'
      },
      {
        word: 'artist',
        ipa: '/ˈɑː.tɪst/',
        meaning: 'họa sĩ / nghệ sĩ',
        partOfSpeech: 'Noun',
        exampleSentence: 'The artist is drawing on a big canvas.',
        exampleTranslation: 'Họa sĩ đang vẽ tranh trên một tấm toan lớn.',
        emoji: '🎨'
      },
      {
        word: 'musician',
        ipa: '/mjuːˈzɪʃ.ən/',
        meaning: 'nhạc sĩ / nhạc công',
        partOfSpeech: 'Noun',
        exampleSentence: 'The musician plays the violin beautifully.',
        exampleTranslation: 'Nhạc sĩ chơi đàn vĩ cầm thật là hay.',
        emoji: '🎻'
      },
      {
        word: 'game designer',
        ipa: '/ɡeɪm dɪˈzaɪ.nər/',
        meaning: 'nhà thiết kế trò chơi',
        partOfSpeech: 'Noun',
        exampleSentence: 'A game designer creates new video games.',
        exampleTranslation: 'Nhà thiết kế game sáng tạo ra các trò chơi điện tử mới.',
        emoji: '🎮'
      },
      {
        word: 'journalist',
        ipa: '/ˈdʒɜː.nə.lɪst/',
        meaning: 'nhà báo / phóng viên',
        partOfSpeech: 'Noun',
        exampleSentence: 'The journalist is writing an article for the newspaper.',
        exampleTranslation: 'Nhà báo đang viết một bài viết cho tòa soạn.',
        emoji: '📰'
      },
      {
        word: 'scientist',
        ipa: '/ˈsaɪən.tɪst/',
        meaning: 'nhà khoa học',
        partOfSpeech: 'Noun',
        exampleSentence: 'The scientist is looking through a microscope.',
        exampleTranslation: 'Nhà khoa học đang quan sát qua kính hiển vi.',
        emoji: '🔬'
      }
    ],
    'lesson-2': [
      {
        word: 'go to space',
        ipa: '/ɡəʊ tuː speɪs/',
        meaning: 'bay vào vũ trụ',
        partOfSpeech: 'Phrase',
        exampleSentence: 'Astronauts go to space to study stars.',
        exampleTranslation: 'Các phi hành gia bay vào vũ trụ để nghiên cứu các vì sao.',
        emoji: '🚀'
      },
      {
        word: 'fly a helicopter',
        ipa: '/flaɪ ə ˈhel.ɪˌkɒp.tər/',
        meaning: 'lái máy bay trực thăng',
        partOfSpeech: 'Phrase',
        exampleSentence: 'The brave pilot can fly a helicopter.',
        exampleTranslation: 'Người phi công dũng cảm có thể lái máy bay trực thăng.',
        emoji: '🚁'
      },
      {
        word: 'work with animals',
        ipa: '/wɜːk wɪð ˈæn.ɪ.məlz/',
        meaning: 'làm việc với động vật',
        partOfSpeech: 'Phrase',
        exampleSentence: 'The vet works with sick animals.',
        exampleTranslation: 'Bác sĩ thú y làm việc với các con vật bị ốm.',
        emoji: '🐼'
      },
      {
        word: 'drive a race car',
        ipa: '/draɪv ə reɪs kɑːr/',
        meaning: 'lái xe đua',
        partOfSpeech: 'Phrase',
        exampleSentence: 'He wants to drive a race car very fast.',
        exampleTranslation: 'Cậu ấy muốn lái một chiếc xe đua thật nhanh.',
        emoji: '🏎️'
      },
      {
        word: 'explore the jungle',
        ipa: '/ɪkˈsplɔːr ðə ˈdʒʌŋ.ɡəl/',
        meaning: 'thám hiểm rừng sâu',
        partOfSpeech: 'Phrase',
        exampleSentence: 'We will explore the jungle with our guide.',
        exampleTranslation: 'Chúng tôi sẽ thám hiểm rừng sâu cùng người hướng dẫn.',
        emoji: '🌳'
      },
      {
        word: 'travel the world',
        ipa: '/ˈtræv.əl ðə wɜːld/',
        meaning: 'đi du lịch thế giới',
        partOfSpeech: 'Phrase',
        exampleSentence: 'I want to travel the world when I grow up.',
        exampleTranslation: 'Tớ muốn đi du lịch khắp thế giới khi lớn lên.',
        emoji: '🌍'
      }
    ],
    'lesson-3': [
      {
        word: 'sign',
        ipa: '/saɪn/',
        meaning: 'biển báo / ký hiệu',
        partOfSpeech: 'Noun',
        exampleSentence: 'Look at that traffic sign over there.',
        exampleTranslation: 'Hãy nhìn tấm biển báo giao thông ở đằng kia kìa.',
        emoji: '🛑'
      },
      {
        word: 'mean',
        ipa: '/miːn/',
        meaning: 'có nghĩa là / định nói',
        partOfSpeech: 'Verb',
        exampleSentence: 'What does this red word mean?',
        exampleTranslation: 'Từ màu đỏ này có nghĩa là gì vậy ạ?',
        emoji: '❓'
      },
      {
        word: 'patient',
        ipa: '/ˈpeɪ.ʃənt/',
        meaning: 'kiên nhẫn',
        partOfSpeech: 'Adjective',
        exampleSentence: 'Please be patient and wait in line.',
        exampleTranslation: 'Xin vui lòng kiên nhẫn xếp hàng chờ nhé.',
        emoji: '⏳'
      }
    ],
    'lesson-4': [
      {
        word: 'space shuttle',
        ipa: '/speɪs ˈʃʌt.əl/',
        meaning: 'tàu vũ trụ con thoi',
        partOfSpeech: 'Noun',
        exampleSentence: 'The space shuttle launched into the sky.',
        exampleTranslation: 'Tàu vũ trụ con thoi đã phóng vút lên bầu trời.',
        emoji: '🚀'
      },
      {
        word: 'space station',
        ipa: '/speɪs ˈsteɪ.ʃən/',
        meaning: 'trạm vũ trụ',
        partOfSpeech: 'Noun',
        exampleSentence: 'Astronauts live and work on the space station.',
        exampleTranslation: 'Các phi hành gia sống và làm việc trên trạm vũ trụ.',
        emoji: '🛰️'
      },
      {
        word: 'space suit',
        ipa: '/speɪs suːt/',
        meaning: 'bộ đồ phi hành gia',
        partOfSpeech: 'Noun',
        exampleSentence: 'The space suit protects astronauts from cold.',
        exampleTranslation: 'Bộ quần áo phi hành vũ trụ bảo vệ họ khỏi cái lạnh.',
        emoji: '👨‍🚀'
      },
      {
        word: 'Earth',
        ipa: '/ɜːθ/',
        meaning: 'Trái Đất',
        partOfSpeech: 'Noun',
        exampleSentence: 'The Earth looks blue and beautiful from space.',
        exampleTranslation: 'Trái Đất trông xanh ngắt và xinh đẹp từ ngoài không gian.',
        emoji: '🌍'
      }
    ]
  },
  'unit-8': {
    'lesson-1': [
      {
        word: 'take a boat ride',
        ipa: '/teɪk ə bəʊt raɪd/',
        meaning: 'đi dạo bằng thuyền',
        partOfSpeech: 'Phrase',
        exampleSentence: 'We will take a boat ride on the river tomorrow.',
        exampleTranslation: 'Ngày mai chúng tôi sẽ đi dạo bằng thuyền trên sông.',
        emoji: '🛥️'
      },
      {
        word: 'see a show',
        ipa: '/siː ə ʃəʊ/',
        meaning: 'xem một buổi biểu diễn',
        partOfSpeech: 'Phrase',
        exampleSentence: 'They are going to see a puppet show tonight.',
        exampleTranslation: 'Tối nay họ định đi xem một buổi biểu diễn múa rối.',
        emoji: '🎪'
      },
      {
        word: 'go on a bus tour',
        ipa: '/ɡəʊ ɒn ə bʌs tʊər/',
        meaning: 'đi tham quan bằng xe buýt',
        partOfSpeech: 'Phrase',
        exampleSentence: 'We can go on a bus tour to see the historic city.',
        exampleTranslation: 'Chúng tôi có thể tham quan bằng xe buýt để ngắm thành phố lịch sử.',
        emoji: '🚌'
      },
      {
        word: 'ride a horse',
        ipa: '/raɪd ə hɔːs/',
        meaning: 'cưỡi ngựa',
        partOfSpeech: 'Phrase',
        exampleSentence: 'She learned to ride a horse on her uncle’s farm.',
        exampleTranslation: 'Cô ấy đã học cưỡi ngựa tại trang trại của bác mình.',
        emoji: '🐎'
      },
      {
        word: 'swim in the ocean',
        ipa: '/swɪm ɪn ðə ˈəʊ.ʃən/',
        meaning: 'bơi ở biển / đại dương',
        partOfSpeech: 'Phrase',
        exampleSentence: 'I love to swim in the ocean with my family.',
        exampleTranslation: 'Tớ thích được bơi ngoài biển lớn cùng gia đình tớ.',
        emoji: '🏊'
      },
      {
        word: 'stay in a hotel',
        ipa: '/steɪ ɪn ə həʊˈtel/',
        meaning: 'ở trong khách sạn',
        partOfSpeech: 'Phrase',
        exampleSentence: 'They are going to stay in a hotel near the beach.',
        exampleTranslation: 'Họ định sẽ nghỉ chân tại một khách sạn gần bãi biển.',
        emoji: '🏨'
      }
    ],
    'lesson-2': [
      {
        word: 'swimsuit',
        ipa: '/ˈswɪm.suːt/',
        meaning: 'đồ bơi / áo tắm',
        partOfSpeech: 'Noun',
        exampleSentence: 'Don’t forget to pack your swimsuit!',
        exampleTranslation: 'Đừng quên mang theo bộ đồ bơi của con nhé!',
        emoji: '🩱'
      },
      {
        word: 'towel',
        ipa: '/taʊəl/',
        meaning: 'khăn tắm / khăn lau',
        partOfSpeech: 'Noun',
        exampleSentence: 'Bring a dry towel to dry yourself after swimming.',
        exampleTranslation: 'Hãy mang theo một chiếc khăn tắm khô để lau người sau khi bơi.',
        emoji: '🧣'
      },
      {
        word: 'money',
        ipa: '/ˈmʌn.i/',
        meaning: 'tiền / tiền xu giấy',
        partOfSpeech: 'Noun',
        exampleSentence: 'Keep your money safe inside your pocket.',
        exampleTranslation: 'Hãy giữ tiền cẩn thận trong túi áo nhé con.',
        emoji: '💵'
      },
      {
        word: 'tent',
        ipa: '/tent/',
        meaning: 'cái lều dã ngoại',
        partOfSpeech: 'Noun',
        exampleSentence: 'We pitched our camping tent under the stars.',
        exampleTranslation: 'Chúng tôi dựng lều cắm trại dưới trời sao lấp lánh.',
        emoji: '⛺'
      },
      {
        word: 'flashlight',
        ipa: '/ˈflæʃ.laɪt/',
        meaning: 'đèn pin',
        partOfSpeech: 'Noun',
        exampleSentence: 'Use a flashlight to find your way in the dark.',
        exampleTranslation: 'Dùng đèn pin để tìm đường đi trong bóng tối.',
        emoji: '🔦'
      },
      {
        word: 'sleeping bag',
        ipa: '/ˈsliː.pɪŋ ˌbæɡ/',
        meaning: 'túi ngủ cắm trại',
        partOfSpeech: 'Noun',
        exampleSentence: 'My sleeping bag is warm and comfortable.',
        exampleTranslation: 'Túi ngủ của tớ rất ấm áp và dễ chịu.',
        emoji: '🛌'
      }
    ],
    'lesson-3': [
      {
        word: 'plans',
        ipa: '/plænz/',
        meaning: 'kế hoạch / dự định',
        partOfSpeech: 'Noun',
        exampleSentence: 'What are your vacation plans for this summer?',
        exampleTranslation: 'Kế hoạch đi nghỉ mát hè này của con là gì?',
        emoji: '🗺️'
      },
      {
        word: 'great time',
        ipa: '/ɡreɪt taɪm/',
        meaning: 'thời gian tuyệt vời',
        partOfSpeech: 'Phrase',
        exampleSentence: 'I had a great time at your birthday party.',
        exampleTranslation: 'Tớ đã có một thời gian vô cùng tuyệt vời ở tiệc sinh nhật cậu.',
        emoji: '🎉'
      },
      {
        word: 'thoughtful',
        ipa: '/ˈθɔːt.fəl/',
        meaning: 'chu đáo / thấu hiểu',
        partOfSpeech: 'Adjective',
        exampleSentence: 'Sending flowers is a thoughtful gesture.',
        exampleTranslation: 'Tặng hoa là một cử chỉ rất đỗi chu đáo.',
        emoji: '🌸'
      }
    ],
    'lesson-4': [
      {
        word: 'taxi',
        ipa: '/ˈtæk.si/',
        meaning: 'xe taxi',
        partOfSpeech: 'Noun',
        exampleSentence: 'He waved his hand to stop a yellow taxi.',
        exampleTranslation: 'Cậu ấy vẫy tay để dừng một chiếc taxi màu vàng.',
        emoji: '🚕'
      },
      {
        word: 'ferry',
        ipa: '/ˈfer.i/',
        meaning: 'chuyến phà chở khách',
        partOfSpeech: 'Noun',
        exampleSentence: 'The ferry carries cars and passengers across the river.',
        exampleTranslation: 'Chuyến phà chở ô tô và hành khách băng qua sông.',
        emoji: '⛴️'
      },
      {
        word: 'subway',
        ipa: '/ˈsʌb.weɪ/',
        meaning: 'tàu điện ngầm',
        partOfSpeech: 'Noun',
        exampleSentence: 'The subway is a fast way to travel in big cities.',
        exampleTranslation: 'Tàu điện ngầm là một cách di chuyển nhanh chóng ở thành phố lớn.',
        emoji: '🚇'
      },
      {
        word: 'gondola',
        ipa: '/ˈɡɒn.də.lə/',
        meaning: 'thuyền gondola / cáp treo',
        partOfSpeech: 'Noun',
        exampleSentence: 'We rode a scenic gondola in Venice, Italy.',
        exampleTranslation: 'Chúng tôi đã chèo chiếc thuyền Gondola thơ mộng ở Venice, Ý.',
        emoji: '🛶'
      }
    ]
  }
};

export function getVocabularyForLesson(unitId: string, lessonId: string): VocabularyItem[] {
  return vocabularyDatabase[unitId]?.[lessonId] || [];
}
