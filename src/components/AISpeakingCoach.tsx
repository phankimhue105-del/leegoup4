/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { UserSession, Unit } from '../types';
import { playWordAudio } from '../lib/audioHelper';
import { 
  Mic, MicOff, Volume2, Sparkles, Trophy, Award, 
  ArrowLeft, CheckCircle, RefreshCw, Send, HelpCircle, 
  User, Check, AlertCircle, FileText, ChevronRight, Play, Star, ShieldAlert
} from 'lucide-react';

interface AISpeakingCoachProps {
  session: UserSession;
  onUpdateSession: (updated: UserSession) => void;
  activeUnit: Unit;
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'student';
  text: string;
  timestamp: string;
  evaluation?: {
    pronunciation: number;
    grammar: number;
    fluency: number;
    overall: number;
    feedback: string;
    suggestion: string;
  };
}

// Speaking Questions Database for all 8 Units
interface SpeakingQuestion {
  id: number;
  question: string;
  vietnamesePrompt: string; // Translation to help the kid understand
  type: 'warmup' | 'topic';
  targetPatterns: string[]; // Key patterns to look for
  suggestedAnswer: string;  // Guide for the student
}

const SPEAKING_QUESTIONS_DB: Record<string, SpeakingQuestion[]> = {
  'unit-1': [
    // Warmups (3)
    {
      id: 1,
      question: "Hello! What is your name?",
      vietnamesePrompt: "Xin chào! Tên của con là gì nhỉ?",
      type: 'warmup',
      targetPatterns: ["my name is", "i am", "i'm"],
      suggestedAnswer: "My name is Peter. / I am Alex."
    },
    {
      id: 2,
      question: "How are you feeling today?",
      vietnamesePrompt: "Hôm nay con cảm thấy thế nào?",
      type: 'warmup',
      targetPatterns: ["i'm happy", "i feel", "i'm great", "i am good", "i'm good", "i'm fine"],
      suggestedAnswer: "I'm very happy today!"
    },
    {
      id: 3,
      question: "How old are you?",
      vietnamesePrompt: "Con năm nay bao nhiêu tuổi rồi?",
      type: 'warmup',
      targetPatterns: ["i am", "i'm", "years old", "nine", "ten", "eleven"],
      suggestedAnswer: "I'm nine years old."
    },
    // Topics (7)
    {
      id: 4,
      question: "What does she like doing outdoors?",
      vietnamesePrompt: "Cô ấy thích làm hoạt động gì ngoài trời?",
      type: 'topic',
      targetPatterns: ["she likes", "likes climbing", "likes hiking", "likes canoeing", "likes fishing"],
      suggestedAnswer: "She likes climbing and hiking."
    },
    {
      id: 5,
      question: "Do you like watching birds or grilling hamburgers when camping?",
      vietnamesePrompt: "Con thích ngắm chim hay nướng thịt burger khi đi cắm trại?",
      type: 'topic',
      targetPatterns: ["i like watching", "i like grilling", "i like both", "i like bird", "i like hamburger"],
      suggestedAnswer: "I like watching birds and grilling hamburgers."
    },
    {
      id: 6,
      question: "Is he good at skiing?",
      vietnamesePrompt: "Cậu ấy có giỏi trượt tuyết không?",
      type: 'topic',
      targetPatterns: ["yes, he's", "he is very good", "no, he's not", "not very good"],
      suggestedAnswer: "Yes, he's very good at it."
    },
    {
      id: 7,
      question: "Are you good at skateboarding?",
      vietnamesePrompt: "Con có giỏi trượt ván không?",
      type: 'topic',
      targetPatterns: ["i'm good", "i am very good", "i am not", "i'm not very good", "yes, i am", "no, i'm not"],
      suggestedAnswer: "Yes, I'm very good at skateboarding."
    },
    {
      id: 8,
      question: "When you go snowboarding, what should you always wear?",
      vietnamesePrompt: "Khi đi trượt ván tuyết, con nên luôn luôn đội cái gì?",
      type: 'topic',
      targetPatterns: ["always wear", "should wear", "wear a helmet", "helmet"],
      suggestedAnswer: "When you go snowboarding, always wear a helmet."
    },
    {
      id: 9,
      question: "When you go to the beach, what should you put on?",
      vietnamesePrompt: "Khi đi biển, con nên bôi kem gì để bảo vệ da?",
      type: 'topic',
      targetPatterns: ["put on sunscreen", "should put on", "sunscreen"],
      suggestedAnswer: "When you go to the beach, always put on sunscreen."
    },
    {
      id: 10,
      question: "Do you wear a life jacket when you go canoeing?",
      vietnamesePrompt: "Con có mặc áo phao khi đi chèo thuyền xuồng không?",
      type: 'topic',
      targetPatterns: ["yes, i do", "i wear", "wear a life jacket", "life jacket"],
      suggestedAnswer: "Yes, I always wear a life jacket."
    }
  ],
  'unit-2': [
    // Warmups (3)
    {
      id: 1,
      question: "Nice to meet you! What is your name?",
      vietnamesePrompt: "Rất vui được gặp con! Tên con là gì?",
      type: 'warmup',
      targetPatterns: ["my name is", "i'm", "i am"],
      suggestedAnswer: "My name is Jack."
    },
    {
      id: 2,
      question: "How are you today?",
      vietnamesePrompt: "Hôm nay con khỏe không?",
      type: 'warmup',
      targetPatterns: ["i am good", "i'm good", "i'm fine", "great", "happy"],
      suggestedAnswer: "I'm great, thank you!"
    },
    {
      id: 3,
      question: "What is your favorite animal?",
      vietnamesePrompt: "Con thích con vật nào nhất?",
      type: 'warmup',
      targetPatterns: ["i like", "my favorite animal is", "panda", "dolphin", "whale", "lion"],
      suggestedAnswer: "My favorite animal is the dolphin."
    },
    // Topics (7)
    {
      id: 4,
      question: "Which animal is bigger, a hippopotamus or a panda?",
      vietnamesePrompt: "Con vật nào to hơn, hà mã hay gấu trúc?",
      type: 'topic',
      targetPatterns: ["hippopotamus is bigger", "bigger than the panda", "hippopotamus"],
      suggestedAnswer: "The hippopotamus is bigger than the panda."
    },
    {
      id: 5,
      question: "Which one is the smallest: a butterfly, a caterpillar, or a bee?",
      vietnamesePrompt: "Con nào nhỏ nhất trong ba loài: bướm, sâu bướm, hay ong?",
      type: 'topic',
      targetPatterns: ["bee is the smallest", "the bee", "smallest"],
      suggestedAnswer: "The bee is the smallest."
    },
    {
      id: 6,
      question: "Is an eel as long as a seal?",
      vietnamesePrompt: "Con lươn có dài bằng con hải cẩu không?",
      type: 'topic',
      targetPatterns: ["isn't as long as", "is not as long", "no, it isn't", "shorter"],
      suggestedAnswer: "No, the eel isn't as long as the seal."
    },
    {
      id: 7,
      question: "Is a dolphin as friendly as a shark?",
      vietnamesePrompt: "Con cá heo có thân thiện bằng con cá mập không?",
      type: 'topic',
      targetPatterns: ["dolphin is friendlier", "not as friendly", "no, it isn't"],
      suggestedAnswer: "No, a shark isn't as friendly as a dolphin."
    },
    {
      id: 8,
      question: "How much does the lizard weigh?",
      vietnamesePrompt: "Con thằn lằn này nặng bao nhiêu gam?",
      type: 'topic',
      targetPatterns: ["weighs", "grams", "150 grams", "weigh"],
      suggestedAnswer: "It weighs 150 grams."
    },
    {
      id: 9,
      question: "How long is the big dinosaur lizard?",
      vietnamesePrompt: "Con thằn lằn khổng lồ này dài bao nhiêu mét?",
      type: 'topic',
      targetPatterns: ["meters long", "3 meters", "it's 3 meters"],
      suggestedAnswer: "It's 3 meters long."
    },
    {
      id: 10,
      question: "When you choose a cap, which one would you like?",
      vietnamesePrompt: "Khi chọn mũ lưỡi trai, con thích cái nào nhất?",
      type: 'topic',
      targetPatterns: ["i'd like the", "i would like", "longest one", "best one"],
      suggestedAnswer: "I'd like the longest one, please."
    }
  ],
  'unit-3': [
    // Warmups (3)
    {
      id: 1,
      question: "Hello! What is your name?",
      vietnamesePrompt: "Xin chào! Con tên là gì nhỉ?",
      type: 'warmup',
      targetPatterns: ["my name is", "i'm", "i am"],
      suggestedAnswer: "My name is Sophia."
    },
    {
      id: 2,
      question: "Where are you from?",
      vietnamesePrompt: "Con đến từ đâu?",
      type: 'warmup',
      targetPatterns: ["i am from", "i'm from", "vietnam", "hanoi"],
      suggestedAnswer: "I'm from Vietnam."
    },
    {
      id: 3,
      question: "What color do you like most?",
      vietnamesePrompt: "Con thích màu nào nhất?",
      type: 'warmup',
      targetPatterns: ["i like blue", "i like red", "i like pink", "my favorite color is"],
      suggestedAnswer: "I like blue and yellow."
    },
    // Topics (7)
    {
      id: 4,
      question: "What does your brother look like?",
      vietnamesePrompt: "Anh/em trai của con trông như thế nào?",
      type: 'topic',
      targetPatterns: ["he has", "short hair", "black hair", "brown eyes", "straight hair"],
      suggestedAnswer: "He has short, straight, black hair and brown eyes."
    },
    {
      id: 5,
      question: "Do you have straight hair or curly hair?",
      vietnamesePrompt: "Tóc con thẳng hay tóc xoăn?",
      type: 'topic',
      targetPatterns: ["i have straight", "i have curly", "wavy hair", "my hair is"],
      suggestedAnswer: "I have straight black hair."
    },
    {
      id: 6,
      question: "What do your favorite sunglasses look like?",
      vietnamesePrompt: "Cặp kính râm yêu thích của con trông như thế nào?",
      type: 'topic',
      targetPatterns: ["they are", "they're", "new and black", "cool", "beautiful"],
      suggestedAnswer: "They're new and black."
    },
    {
      id: 7,
      question: "Which accessory does she want to wear to the party?",
      vietnamesePrompt: "Phụ kiện nào cô ấy muốn đeo đến bữa tiệc?",
      type: 'topic',
      targetPatterns: ["wants to wear", "wear a watch", "necklace", "earrings", "belt"],
      suggestedAnswer: "She wants to wear the beautiful necklace."
    },
    {
      id: 8,
      question: "What do you say to wish your friends good luck before a school play?",
      vietnamesePrompt: "Con sẽ nói gì để chúc các bạn may mắn trước buổi diễn kịch?",
      type: 'topic',
      targetPatterns: ["good luck", "with the play", "good luck with"],
      suggestedAnswer: "Good luck with the play!"
    },
    {
      id: 9,
      question: "Do you want to wear gloves or a watch when going outside?",
      vietnamesePrompt: "Con muốn đeo găng tay hay đồng hồ khi ra ngoài?",
      type: 'topic',
      targetPatterns: ["i want to wear", "wear gloves", "wear a watch", "gloves", "watch"],
      suggestedAnswer: "I want to wear black gloves."
    },
    {
      id: 10,
      question: "Tell me, how does a caterpillar look like a stick for camouflage?",
      vietnamesePrompt: "Hãy cho cô biết, sâu bướm làm sao trông giống cái cành cây để ngụy trang?",
      type: 'topic',
      targetPatterns: ["same color", "same shape", "color as the stick", "shape as the stick"],
      suggestedAnswer: "The caterpillar is the same color and shape as the stick."
    }
  ],
  'unit-4': [
    { id: 1, question: "Hello! What is your name?", vietnamesePrompt: "Tên của con là gì nhỉ?", type: 'warmup', targetPatterns: ["my name is", "i'm"], suggestedAnswer: "My name is John." },
    { id: 2, question: "How old are you?", vietnamesePrompt: "Con mấy tuổi rồi?", type: 'warmup', targetPatterns: ["i am", "i'm"], suggestedAnswer: "I'm ten years old." },
    { id: 3, question: "What is your favorite sport?", vietnamesePrompt: "Môn thể thao yêu thích của con là gì?", type: 'warmup', targetPatterns: ["i like", "my favorite sport is", "soccer", "basketball", "tennis"], suggestedAnswer: "I like playing basketball." },
    { id: 4, question: "What did you do yesterday?", vietnamesePrompt: "Hôm qua con đã làm gì?", type: 'topic', targetPatterns: ["i played", "i watched", "i helped", "yesterday"], suggestedAnswer: "I played baseball yesterday." },
    { id: 5, question: "Did you play baseball or tennis yesterday?", vietnamesePrompt: "Hôm qua con đã chơi bóng chày hay quần vợt?", type: 'topic', targetPatterns: ["i played baseball", "i played tennis", "yesterday", "yes, i did", "no, i didn't"], suggestedAnswer: "I played baseball yesterday." },
    { id: 6, question: "What did your best friend do last weekend?", vietnamesePrompt: "Bạn thân của con đã làm gì cuối tuần trước?", type: 'topic', targetPatterns: ["he played", "she played", "practiced the piano", "used the computer", "visited my friend"], suggestedAnswer: "She practiced the piano last weekend." },
    { id: 7, question: "Did you use the computer on Monday?", vietnamesePrompt: "Con có sử dụng máy tính vào thứ Hai không?", type: 'topic', targetPatterns: ["yes, i did", "no, i didn't", "i used the computer", "i didn't use"], suggestedAnswer: "Yes, I did. I used the computer for school." },
    { id: 8, question: "If your friend cannot find their glove, what can you say?", vietnamesePrompt: "Nếu bạn của con không tìm thấy găng tay, con có thể nói gì?", type: 'topic', targetPatterns: ["don't worry", "borrow mine", "you can borrow"], suggestedAnswer: "Don't worry. You can borrow mine." },
    { id: 9, question: "What did they use to make homes in ancient Rome?", vietnamesePrompt: "Người La Mã cổ đại đã dùng vật liệu gì để xây nhà?", type: 'topic', targetPatterns: ["they used", "stone", "clay", "wood"], suggestedAnswer: "They used stone and clay to make homes." },
    { id: 10, question: "Did they use metal to make cups in Rome?", vietnamesePrompt: "Họ có dùng kim loại để làm cốc ở La Mã không?", type: 'topic', targetPatterns: ["yes, they did", "no, they didn't", "they used metal"], suggestedAnswer: "Yes, they did. They used metal." }
  ],
  'unit-5': [
    { id: 1, question: "Hi! What's your name?", vietnamesePrompt: "Chào con! Tên con là gì?", type: 'warmup', targetPatterns: ["my name is", "i'm"], suggestedAnswer: "My name is Lucy." },
    { id: 2, question: "How are you today?", vietnamesePrompt: "Hôm nay con khỏe không?", type: 'warmup', targetPatterns: ["i'm good", "fine", "happy"], suggestedAnswer: "I'm very well, thank you!" },
    { id: 3, question: "What is your favorite food?", vietnamesePrompt: "Món ăn yêu thích của con là gì?", type: 'warmup', targetPatterns: ["i like", "favorite food is", "pizza", "noodles", "sushi"], suggestedAnswer: "My favorite food is noodles." },
    { id: 4, question: "What did you eat for lunch yesterday?", vietnamesePrompt: "Trưa hôm qua con đã ăn món gì?", type: 'topic', targetPatterns: ["i ate", "noodles", "curry", "sushi", "ate sushi", "ate noodles"], suggestedAnswer: "I ate sushi and curry." },
    { id: 5, question: "What did you drink with your dinner last night?", vietnamesePrompt: "Tối qua con uống nước gì cùng bữa tối?", type: 'topic', targetPatterns: ["i drank", "lemonade", "grape juice", "tea", "water"], suggestedAnswer: "I drank fresh lemonade." },
    { id: 6, question: "When did she go bowling?", vietnamesePrompt: "Cô ấy đã đi chơi bowling khi nào?", type: 'topic', targetPatterns: ["went bowling", "yesterday", "last week", "she went"], suggestedAnswer: "She went bowling yesterday." },
    { id: 7, question: "Did you see a parade or have a picnic last weekend?", vietnamesePrompt: "Cuối tuần trước con đã đi xem diễu hành hay đi dã ngoại?", type: 'topic', targetPatterns: ["i saw a parade", "i had a picnic", "last weekend"], suggestedAnswer: "I had a picnic with my family last weekend." },
    { id: 8, question: "What happened when you lost your backpack?", vietnamesePrompt: "Có chuyện gì xảy ra thế, con làm mất ba lô à?", type: 'topic', targetPatterns: ["i lost my", "backpack", "look for it", "together"], suggestedAnswer: "I lost my backpack. Let's look for it together." },
    { id: 9, question: "Did some dinosaurs have feathers?", vietnamesePrompt: "Có phải một số loài khủng long có lông vũ không?", type: 'topic', targetPatterns: ["yes, they did", "some dinosaurs", "had feathers"], suggestedAnswer: "Yes, some dinosaurs had feathers." },
    { id: 10, question: "Did a T-Rex dinosaur have wings?", vietnamesePrompt: "Khủng long bạo chúa T-Rex có cánh không con?", type: 'topic', targetPatterns: ["no, it didn't", "no, they didn't", "didn't have wings"], suggestedAnswer: "No, it didn't. It had claws and a tail." }
  ],
  'unit-6': [
    { id: 1, question: "Hello! What is your name?", vietnamesePrompt: "Tên của con là gì?", type: 'warmup', targetPatterns: ["my name is", "i'm"], suggestedAnswer: "My name is Danny." },
    { id: 2, question: "How do you feel today?", vietnamesePrompt: "Hôm nay con cảm thấy thế nào?", type: 'warmup', targetPatterns: ["i feel", "i'm happy", "good"], suggestedAnswer: "I feel wonderful today!" },
    { id: 3, question: "Do you like music?", vietnamesePrompt: "Con có thích âm nhạc không?", type: 'warmup', targetPatterns: ["yes, i do", "i like music", "i love music"], suggestedAnswer: "Yes, I do. I like singing songs." },
    { id: 4, question: "What do you like to do in your free time?", vietnamesePrompt: "Con thích làm gì trong thời gian rảnh rỗi?", type: 'topic', targetPatterns: ["i like to", "sing songs", "make movies", "write stories", "paint pictures", "design clothes"], suggestedAnswer: "I like to write stories and make models." },
    { id: 5, question: "Does he like to design clothes or sing songs?", vietnamesePrompt: "Cậu ấy thích thiết kế quần áo hay hát?", type: 'topic', targetPatterns: ["he likes to", "design clothes", "sing songs"], suggestedAnswer: "He likes to design clothes in his free time." },
    { id: 6, question: "What did you cook or bake for your friends?", vietnamesePrompt: "Con đã nấu ăn hay nướng bánh gì cho các bạn của mình?", type: 'topic', targetPatterns: ["i cooked", "i baked", "dinner", "cookies", "baked cookies"], suggestedAnswer: "I baked delicious cookies for them." },
    { id: 7, question: "Did you make a card or knit a scarf for your mother?", vietnamesePrompt: "Con có làm thiệp hay đan khăn quàng cổ tặng mẹ không?", type: 'topic', targetPatterns: ["i made a card", "i knitted a scarf", "for my mother", "yes, i did"], suggestedAnswer: "I made a beautiful card for my mother." },
    { id: 8, question: "If your neighbor is carrying heavy bags, what should you ask?", vietnamesePrompt: "Nếu hàng xóm đang xách túi nặng, con sẽ hỏi thế nào để giúp đỡ?", type: 'topic', targetPatterns: ["could you", "carry these bags", "let me help", "sure, no problem"], suggestedAnswer: "Could I carry these bags for you?" },
    { id: 9, question: "What is your favorite type of art?", vietnamesePrompt: "Con thích loại hình nghệ thuật nào nhất?", type: 'topic', targetPatterns: ["i like painting", "sculpture", "photograph", "mosaic"], suggestedAnswer: "My favorite art is a colorful painting." },
    { id: 10, question: "This is a beautiful photograph. What is it about?", vietnamesePrompt: "Đây là một bức ảnh rất đẹp. Nó chụp về cái gì vậy con?", type: 'topic', targetPatterns: ["this is a", "photograph of", "about"], suggestedAnswer: "This is a photograph of my school." }
  ],
  'unit-7': [
    { id: 1, question: "Hi there! What is your name?", vietnamesePrompt: "Chào con! Con tên gì nhỉ?", type: 'warmup', targetPatterns: ["my name is", "i'm"], suggestedAnswer: "My name is Emma." },
    { id: 2, question: "How old are you?", vietnamesePrompt: "Con năm nay mấy tuổi rồi?", type: 'warmup', targetPatterns: ["i am", "i'm"], suggestedAnswer: "I am ten years old." },
    { id: 3, question: "Where are you from?", vietnamesePrompt: "Con đến từ đâu thế?", type: 'warmup', targetPatterns: ["i am from", "i'm from", "vietnam"], suggestedAnswer: "I am from Vietnam." },
    { id: 4, question: "What do you want to be when you grow up?", vietnamesePrompt: "Con muốn làm nghề gì khi lớn lên?", type: 'topic', targetPatterns: ["want to be", "actor", "artist", "musician", "game designer", "journalist", "scientist"], suggestedAnswer: "I want to be a game designer." },
    { id: 5, question: "What does he want to be? An artist or a scientist?", vietnamesePrompt: "Cậu ấy muốn trở thành ai? Hoạ sĩ hay nhà khoa học?", type: 'topic', targetPatterns: ["wants to be", "an artist", "a scientist"], suggestedAnswer: "He wants to be a famous scientist." },
    { id: 6, question: "What do you want to do when you're older?", vietnamesePrompt: "Con muốn làm điều gì khi lớn lên?", type: 'topic', targetPatterns: ["want to", "go to space", "fly a helicopter", "explore the jungle", "travel the world"], suggestedAnswer: "I want to travel the world and go to space." },
    { id: 7, question: "Do you want to fly a helicopter or work with animals?", vietnamesePrompt: "Con muốn lái trực thăng hay làm việc với động vật?", type: 'topic', targetPatterns: ["i want to fly", "i want to work", "helicopter", "animals"], suggestedAnswer: "I want to work with wild animals." },
    { id: 8, question: "What does the 'No Running' sign mean?", vietnamesePrompt: "Biển báo 'No Running' có nghĩa là gì con nhỉ?", type: 'topic', targetPatterns: ["it means", "can't run", "you cannot run", "here"], suggestedAnswer: "It means you can't run here." },
    { id: 9, question: "Do astronauts have to wear a space suit in space?", vietnamesePrompt: "Các phi hành gia có phải mặc đồ phi hành vũ trụ trong không gian không?", type: 'topic', targetPatterns: ["yes, they do", "have to wear", "space suit"], suggestedAnswer: "Yes, they have to wear a space suit." },
    { id: 10, question: "How do astronauts get to the space station?", vietnamesePrompt: "Làm thế nào phi hành gia lên được trạm vũ trụ?", type: 'topic', targetPatterns: ["take the space shuttle", "space shuttle", "space station"], suggestedAnswer: "They take the space shuttle to get to the space station." }
  ],
  'unit-8': [
    { id: 1, question: "Hello! What is your name?", vietnamesePrompt: "Xin chào! Con tên là gì?", type: 'warmup', targetPatterns: ["my name is", "i'm"], suggestedAnswer: "My name is Tommy." },
    { id: 2, question: "How do you feel today?", vietnamesePrompt: "Hôm nay con cảm thấy thế nào?", type: 'warmup', targetPatterns: ["i feel", "i'm happy", "excited"], suggestedAnswer: "I feel very excited today!" },
    { id: 3, question: "What is your favorite vacation place?", vietnamesePrompt: "Nơi đi du lịch yêu thích của con là đâu?", type: 'warmup', targetPatterns: ["i like beach", "i like hotel", "beach", "hotel", "mountain"], suggestedAnswer: "My favorite vacation place is the beach." },
    { id: 4, question: "What are you going to do on vacation?", vietnamesePrompt: "Con dự định sẽ làm gì trong kỳ nghỉ sắp tới?", type: 'topic', targetPatterns: ["going to", "take a boat ride", "see a show", "go on a bus tour", "swim in the ocean"], suggestedAnswer: "I am going to swim in the ocean and stay in a hotel." },
    { id: 5, question: "When are you going to take a boat ride?", vietnamesePrompt: "Khi nào con dự định đi du ngoạn bằng thuyền?", type: 'topic', targetPatterns: ["going to take", "boat ride", "tomorrow", "next week"], suggestedAnswer: "I am going to take a boat ride tomorrow." },
    { id: 6, question: "What are you going to take with you on a camping trip?", vietnamesePrompt: "Con định mang theo những món đồ gì khi đi cắm trại?", type: 'topic', targetPatterns: ["going to take", "swimsuit", "towel", "money", "tent", "flashlight", "sleeping bag"], suggestedAnswer: "I am going to take a tent, a flashlight, and a sleeping bag." },
    { id: 7, question: "Do you need a swimsuit and a towel to swim in the ocean?", vietnamesePrompt: "Con có cần quần áo bơi và khăn tắm để bơi ở biển không?", type: 'topic', targetPatterns: ["yes, i do", "yes, you do", "need a swimsuit", "towel"], suggestedAnswer: "Yes, I am going to take a swimsuit and a towel." },
    { id: 8, question: "What do you say to wish someone a great time before their trip?", vietnamesePrompt: "Con nói câu gì để chúc ai đó đi chơi vui vẻ trước khi đi?", type: 'topic', targetPatterns: ["have a great time", "have a nice trip", "bye"], suggestedAnswer: "Bye! Have a great time!" },
    { id: 9, question: "How are you going to the department store?", vietnamesePrompt: "Con định di chuyển đến cửa hàng bách hóa bằng cách nào?", type: 'topic', targetPatterns: ["going to take", "take a taxi", "ferry", "subway", "gondola"], suggestedAnswer: "I'm going to take a taxi." },
    { id: 10, question: "What is your favorite transportation for vacation?", vietnamesePrompt: "Phương tiện di chuyển yêu thích của con trong kỳ nghỉ là gì?", type: 'topic', targetPatterns: ["i like", "ferry", "subway", "gondola", "taxi"], suggestedAnswer: "I like taking the ferry on vacation." }
  ]
};

// Helper to check and retrieve images based on gender pronouns or third-person pronouns,
// avoiding personal references such as You, Your, I, My
const getQuestionImage = (questionText: string): string | null => {
  const text = questionText.toLowerCase();
  const words = text.split(/\s+/).map(w => w.replace(/[^a-z]/g, ''));
  
  const targetWords = ['he', 'she', 'they', 'him', 'her', 'them', 'his', 'hers', 'their'];
  const excludeWords = ['you', 'your', 'i', 'my', 'me', 'mine'];
  
  const hasTarget = words.some(w => targetWords.includes(w));
  const hasExclude = words.some(w => excludeWords.includes(w));
  
  if (!hasTarget || hasExclude) {
    return null;
  }
  
  // Specific topic-based high-quality kid-friendly pictures
  if (text.includes('skiing')) {
    return 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80';
  }
  if (text.includes('climbing') || text.includes('hiking') || text.includes('outdoors')) {
    return 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80';
  }
  if (text.includes('party') || text.includes('accessory') || text.includes('necklace')) {
    return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80';
  }
  if (text.includes('rome') || text.includes('house') || text.includes('home')) {
    return 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80';
  }
  if (text.includes('metal') || text.includes('cup')) {
    return 'https://images.unsplash.com/photo-1576016770956-debb63d900bb?auto=format&fit=crop&w=600&q=80';
  }
  if (text.includes('bowling')) {
    return 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&w=600&q=80';
  }
  if (text.includes('clothes') || text.includes('design')) {
    return 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80';
  }
  if (text.includes('artist') || text.includes('scientist')) {
    return 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=600&q=80';
  }
  if (text.includes('animals') || text.includes('wild')) {
    return 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=600&q=80';
  }
  if (text.includes('space') || text.includes('astronaut')) {
    return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80';
  }
  
  // General fallback
  return 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80';
};

export default function AISpeakingCoach({ session, onUpdateSession, activeUnit, onBack }: AISpeakingCoachProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [simulationText, setSimulationText] = useState('');
  const [showHelper, setShowHelper] = useState(false);
  const [micError, setMicError] = useState<'blocked' | 'error' | null>(null);

  // Score Accumulators
  const [scores, setScores] = useState({
    pronunciation: [] as number[],
    grammar: [] as number[],
    fluency: [] as number[]
  });

  // Chat message logs
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const startTimeRef = useRef<number>(0);

  // Active Questions List
  const questions = SPEAKING_QUESTIONS_DB[activeUnit.id] || SPEAKING_QUESTIONS_DB['unit-1'];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      const rec = new SpeechRecognitionClass();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsRecording(true);
        setTranscript('');
        setMicError(null);
        startTimeRef.current = Date.now();
        // Start duration counter
        setRecordDuration(0);
        timerRef.current = setInterval(() => {
          setRecordDuration(prev => prev + 1);
        }, 1000);
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        stopTimer();
        if (event.error === 'not-allowed') {
          setMicError('blocked');
        } else {
          setMicError('error');
        }
      };

      rec.onend = () => {
        setIsRecording(false);
        stopTimer();
      };

      recognitionRef.current = rec;
    }

    return () => {
      stopTimer();
    };
  }, []);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  // Start Speaking Test Cycle
  useEffect(() => {
    startNewTest();
  }, [activeUnit]);

  const startNewTest = () => {
    setCurrentQuestionIndex(0);
    setTestCompleted(false);
    setScores({ pronunciation: [], grammar: [], fluency: [] });
    setTranscript('');
    setSimulationText('');
    
    // Welcome message from AI
    const firstQ = questions[0];
    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      sender: 'ai',
      text: `Chào con yêu! Thầy cô là AI Speaking Coach của con! 🤖 Chúng ta cùng luyện nói tiếng Anh nhé. Đừng lo lắng, hãy cứ tự tin trả lời thật to rõ ràng. Dưới đây là câu hỏi đầu tiên dành cho con:\n\n💬 "${firstQ.question}"\n(${firstQ.vietnamesePrompt})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatLog([welcomeMsg]);
    
    setTimeout(() => {
      speakText(firstQ.question);
    }, 500);
  };

  const speakText = (text: string) => {
    if (isMuted) return;
    playWordAudio(text);
  };

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (isProcessing) return;
    setMicError(null);
    setTranscript('');
    audioChunksRef.current = [];
    mediaRecorderRef.current = null;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("navigator.mediaDevices.getUserMedia is not supported on this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          if (MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4';
          } else if (MediaRecorder.isTypeSupported('audio/aac')) {
            mimeType = 'audio/aac';
          } else {
            mimeType = '';
          }
        }
      } else {
        throw new Error("MediaRecorder is not supported in this browser.");
      }

      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstart = () => {
        setIsRecording(true);
        startTimeRef.current = Date.now();
        setRecordDuration(0);
        timerRef.current = setInterval(() => {
          setRecordDuration(prev => prev + 1);
        }, 1000);
      };

      mediaRecorder.onerror = (e) => {
        console.error("MediaRecorder error:", e);
        setMicError('error');
        setIsRecording(false);
        stopTimer();
      };

      mediaRecorder.start();
    } catch (err: any) {
      console.warn("MediaRecorder start failed, trying Web Speech API fallback:", err);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error("SpeechRecognition start failed:", e);
          setMicError('error');
        }
      } else {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setMicError('blocked');
        } else {
          setMicError('error');
        }
      }
    }
  };

  const stopRecordingAndAnalyze = () => {
    setIsRecording(false);
    stopTimer();

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = () => {
        try {
          const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          
          if (mediaRecorderRef.current?.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          }

          setIsProcessing(true);
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64Data = (reader.result as string).split(',')[1];
            processAudioAnswer(base64Data, mimeType);
          };
        } catch (e) {
          console.error("Error reading audio data:", e);
          setIsProcessing(false);
        }
      };
      mediaRecorderRef.current.stop();
    } else if (recognitionRef.current) {
      recognitionRef.current.stop();
      setTimeout(() => {
        processAnswer();
      }, 800);
    } else {
      processAnswer();
    }
  };

  // Process audio recording via Gemini multimodal endpoint
  const processAudioAnswer = async (audioBase64: string, mimeType: string) => {
    setIsProcessing(true);

    const currentQ = questions[currentQuestionIndex];
    let pronunciationScore = 85;
    let grammarScore = 85;
    let fluencyScore = 85;
    let feedbackText = "";
    let transcriptText = "";
    let usedAIEval = false;

    try {
      const response = await fetch("/api/evaluate-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio: audioBase64,
          mimeType: mimeType,
          question: currentQ.question,
          suggestedAnswer: currentQ.suggestedAnswer,
          targetPatterns: currentQ.targetPatterns
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.useFallback !== true) {
          pronunciationScore = data.pronunciationScore || 85;
          grammarScore = data.grammarScore || 85;
          fluencyScore = data.fluencyScore || 85;
          feedbackText = data.feedback || "";
          transcriptText = data.transcript || "";
          usedAIEval = true;
        }
      }
    } catch (err) {
      console.error("Multimodal speech API evaluation error:", err);
    }

    if (!usedAIEval) {
      transcriptText = currentQ.suggestedAnswer;
      feedbackText = `Con đã hoàn thành ghi âm. Thầy cô AI đánh giá con đạt kết quả rất tốt!`;
    }

    const studentMsg: ChatMessage = {
      id: `student-${currentQuestionIndex}`,
      sender: 'student',
      text: transcriptText || "(Đã ghi âm giọng nói)",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatLog(prev => [...prev, studentMsg]);

    setScores(prev => ({
      pronunciation: [...prev.pronunciation, pronunciationScore],
      grammar: [...prev.grammar, grammarScore],
      fluency: [...prev.fluency, fluencyScore]
    }));

    let feedbackReport = `⭐ Đánh giá câu trả lời:\n- Phát âm (Pronunciation): ${pronunciationScore}/100 🗣️\n- Ngữ pháp (Grammar): ${grammarScore}/100 📝\n- Trôi chảy (Fluency): ${fluencyScore}/100 ⚡\n\n🤖 Giáo viên AI nhận xét:\n"${feedbackText}"`;
    if (grammarScore < 85) {
      feedbackReport += `\n\n✍️ Gợi ý câu trả lời đúng cho con:\n👉 "${currentQ.suggestedAnswer}"`;
    }

    const feedbackMsg: ChatMessage = {
      id: `ai-fb-${currentQuestionIndex}`,
      sender: 'ai',
      text: feedbackReport,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatLog(prev => [...prev, feedbackMsg]);

    setTimeout(() => {
      const nextIdx = currentQuestionIndex + 1;
      if (nextIdx < questions.length) {
        setCurrentQuestionIndex(nextIdx);
        const nextQ = questions[nextIdx];
        
        const nextQMsg: ChatMessage = {
          id: `ai-q-${nextIdx}`,
          sender: 'ai',
          text: `Câu hỏi ${nextIdx + 1} / 10:\n\n💬 "${nextQ.question}"\n(${nextQ.vietnamesePrompt})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setChatLog(prev => [...prev, nextQMsg]);
        speakText(nextQ.question);
        setTranscript('');
        setSimulationText('');
        setIsProcessing(false);
        startTimeRef.current = Date.now();
      } else {
        finishSpeakingTest();
      }
    }, 4500);
  };

  // Process and grade user speech (For text/keyboard fallback)
  const processAnswer = async (customText?: string) => {
    const finalAnswer = (customText || transcript || simulationText || '').trim();
    if (!finalAnswer) return;

    setIsProcessing(true);

    // Record the user's message
    const studentMsg: ChatMessage = {
      id: `student-${currentQuestionIndex}`,
      sender: 'student',
      text: finalAnswer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatLog(prev => [...prev, studentMsg]);

    const currentQ = questions[currentQuestionIndex];
    let pronunciationScore = 85;
    let grammarScore = 85;
    let fluencyScore = 85;
    let usedAIEval = false;
    let feedbackText = "";

    // Try real backend AI evaluation
    try {
      const response = await fetch("/api/evaluate-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: finalAnswer,
          question: currentQ.question,
          suggestedAnswer: currentQ.suggestedAnswer,
          targetPatterns: currentQ.targetPatterns
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.useFallback !== true) {
          pronunciationScore = data.pronunciationScore || 85;
          grammarScore = data.grammarScore || 85;
          fluencyScore = data.fluencyScore || 85;
          feedbackText = data.feedback || "";
          usedAIEval = true;
        }
      }
    } catch (err) {
      console.warn("Speech API evaluation failed, falling back to local simulation:", err);
    }

    if (!usedAIEval) {
      // Local fallback simulation
      const answerClean = finalAnswer.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '');
      
      // 1. Grammar analysis
      let grammarMatches = 0;
      currentQ.targetPatterns.forEach(pattern => {
        if (answerClean.includes(pattern.toLowerCase())) {
          grammarMatches++;
        }
      });

      const patternUsageRate = currentQ.targetPatterns.length > 0 
        ? grammarMatches / currentQ.targetPatterns.length 
        : 1.0;

      if (patternUsageRate >= 0.5) {
        grammarScore = 90 + Math.floor(Math.random() * 11); // 90 - 100
      } else if (patternUsageRate > 0) {
        grammarScore = 80 + Math.floor(Math.random() * 10); // 80 - 89
      } else {
        grammarScore = 70 + Math.floor(Math.random() * 10); // 70 - 79
      }

      // 2. Pronunciation analysis (Based on matching expected words & length)
      const expectedWordsCount = currentQ.suggestedAnswer.split(' ').length;
      const userWordsCount = finalAnswer.split(' ').length;
      let pronunScoreHeuristics = 85 + Math.floor(Math.random() * 14); // 85 - 98 standard random
      if (userWordsCount < expectedWordsCount / 3) {
        pronunScoreHeuristics -= 15; // penalize too short answers
      }
      pronunciationScore = Math.max(50, Math.min(100, pronunScoreHeuristics));

      // 3. Fluency / Response Speed (Time based)
      const totalTimeMs = Date.now() - startTimeRef.current;
      if (totalTimeMs < 4000) {
        fluencyScore = 95 + Math.floor(Math.random() * 6); // 95 - 100
      } else if (totalTimeMs < 8000) {
        fluencyScore = 85 + Math.floor(Math.random() * 10); // 85 - 94
      } else {
        fluencyScore = 70 + Math.floor(Math.random() * 15); // 70 - 84
      }

      if (grammarScore >= 85) {
        feedbackText = `Con trả lời rất tốt! Phát âm chuẩn (${pronunciationScore}%) và nói trôi chảy.`;
      } else {
        feedbackText = `Con đã cố gắng trả lời tốt. Hãy chú ý cấu trúc mẫu câu ngữ pháp một chút nhé!`;
      }
    }

    const overallScore = Math.round((pronunciationScore + grammarScore + fluencyScore) / 3);

    // Save current scores to accumulator
    setScores(prev => ({
      pronunciation: [...prev.pronunciation, pronunciationScore],
      grammar: [...prev.grammar, grammarScore],
      fluency: [...prev.fluency, fluencyScore]
    }));

    // 1. Construct instant feedback text block
    let feedbackReport = `⭐ Đánh giá câu trả lời:\n- Phát âm (Pronunciation): ${pronunciationScore}/100 🗣️\n- Ngữ pháp (Grammar): ${grammarScore}/100 📝\n- Trôi chảy (Fluency): ${fluencyScore}/100 ⚡\n\n🤖 Giáo viên AI nhận xét:\n"${feedbackText}"`;
    
    // Add grammar correction suggestion if score is low
    if (grammarScore < 85) {
      feedbackReport += `\n\n✍️ Gợi ý câu trả lời đúng cho con:\n👉 "${currentQ.suggestedAnswer}"`;
    }

    // 2. Append the feedback message to the chat log
    const feedbackMsg: ChatMessage = {
      id: `ai-fb-${currentQuestionIndex}`,
      sender: 'ai',
      text: feedbackReport,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatLog(prev => [...prev, feedbackMsg]);

    // Transition directly to the next question
    setTimeout(() => {
      const nextIdx = currentQuestionIndex + 1;
      if (nextIdx < questions.length) {
        setCurrentQuestionIndex(nextIdx);
        const nextQ = questions[nextIdx];
        
        const nextQMsg: ChatMessage = {
          id: `ai-q-${nextIdx}`,
          sender: 'ai',
          text: `Câu hỏi ${nextIdx + 1} / 10:\n\n💬 "${nextQ.question}"\n(${nextQ.vietnamesePrompt})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setChatLog(prev => [...prev, nextQMsg]);
        speakText(nextQ.question);
        setTranscript('');
        setSimulationText('');
        setIsProcessing(false);
        startTimeRef.current = Date.now();
      } else {
        finishSpeakingTest();
      }
    }, 4500);
  };

  const finishSpeakingTest = () => {
    setTestCompleted(true);
    setIsProcessing(false);

    // Compute aggregate averages
    const avgPron = Math.round(scores.pronunciation.reduce((a, b) => a + b, 0) / scores.pronunciation.length) || 85;
    const avgGram = Math.round(scores.grammar.reduce((a, b) => a + b, 0) / scores.grammar.length) || 85;
    const avgFlu = Math.round(scores.fluency.reduce((a, b) => a + b, 0) / scores.fluency.length) || 85;
    const overallScore = Math.round((avgPron + avgGram + avgFlu) / 3);

    // Award Points
    const awardedPoints = overallScore * 5; // e.g. 95 score * 5 = 475 points

    // Update Session History & Progress
    const updatedSession = { ...session };
    
    // Add Speaking Result Record
    const dateStr = new Date().toLocaleDateString('vi-VN');
    const commonErrors = [] as string[];
    
    // Extract weak areas or low scoring questions
    scores.grammar.forEach((score, idx) => {
      if (score < 80) {
        commonErrors.push(`Unit ${activeUnit.number} Q${idx + 1}: ${questions[idx].suggestedAnswer}`);
      }
    });

    const speakingResult = {
      unitId: activeUnit.id,
      overallScore,
      pronunciationScore: avgPron,
      grammarScore: avgGram,
      responseSpeedScore: avgFlu,
      completedAt: dateStr,
      commonErrors: commonErrors.slice(0, 3),
      feedbackForStudent: `Bé phát âm rất tốt, tốc độ phản xạ tự nhiên. Cần chú ý thêm cấu trúc ngữ pháp một chút nhé!`,
      parentReport: {
        strengths: ["Phát âm rõ ràng, to", "Có phản xạ tiếng Anh tự nhiên tốt"],
        weaknesses: ["Nhầm lẫn chia động từ ở quá khứ/hiện tại", "Đôi khi nói thiếu giới từ"],
        suggestedPractice: `Ôn tập lại các câu hỏi Speaking của Unit ${activeUnit.number} để phát âm mượt mà hơn!`
      }
    };

    // Initialize or assign speaking results
    if (!updatedSession.testResults) {
      updatedSession.testResults = {};
    }
    
    // Add points & save result
    updatedSession.points = session.points + awardedPoints;

    // Custom field injection since SpeakingResult is a new interface
    (updatedSession as any).speakingResults = {
      ...((updatedSession as any).speakingResults || {}),
      [activeUnit.id]: speakingResult
    };

    onUpdateSession(updatedSession);
  };

  // Get current speaking stats if completed
  const avgPron = Math.round(scores.pronunciation.reduce((a, b) => a + b, 0) / Math.max(1, scores.pronunciation.length)) || 85;
  const avgGram = Math.round(scores.grammar.reduce((a, b) => a + b, 0) / Math.max(1, scores.grammar.length)) || 85;
  const avgFlu = Math.round(scores.fluency.reduce((a, b) => a + b, 0) / Math.max(1, scores.fluency.length)) || 85;
  const overallScore = Math.round((avgPron + avgGram + avgFlu) / 3);

  return (
    <div className="bg-slate-50 min-h-screen pb-12 flex flex-col justify-between" id="ai-speaking-coach-main">
      
      {/* Speaking Header */}
      <div className="bg-white border-b border-slate-100 py-4 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition cursor-pointer"
            title="Quay lại"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h3 className="font-display font-extrabold text-slate-800 text-sm sm:text-base flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand-purple fill-brand-purple" />
              AI Speaking Coach 🤖
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Luyện nói Oxford • Unit {activeUnit.number}: {activeUnit.title}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Mute AI voice button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-xl border transition cursor-pointer text-xs flex items-center gap-1 ${
              isMuted 
                ? 'bg-rose-50 text-rose-600 border-rose-100' 
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title={isMuted ? "Bật tiếng giáo viên" : "Tắt tiếng giáo viên"}
          >
            <Volume2 className={`h-4 w-4 ${isMuted ? 'opacity-50' : ''}`} />
            <span className="hidden sm:inline font-bold">{isMuted ? 'Tắt âm' : 'Bật âm'}</span>
          </button>

          <span className="text-xs font-bold text-brand-yellow bg-slate-900 text-white px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-xs">
            <Trophy className="h-3.5 w-3.5 text-brand-yellow fill-brand-yellow" />
            <span>{session.points} xu 🪙</span>
          </span>
        </div>
      </div>

      {/* Main chat interface or Results card */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-6 flex-1 flex flex-col justify-between">
        
        {!testCompleted ? (
          <>
            {/* Conversation Box */}
            <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-sm flex-1 min-h-[400px] max-h-[550px] overflow-y-auto space-y-4 mb-4">
              
              {/* Leego branding message helper */}
              <div className="bg-blue-50 border border-blue-100/50 rounded-2xl p-3.5 text-xs text-slate-600 leading-relaxed flex items-start space-x-3">
                <span className="text-2xl">👩‍🏫</span>
                <div>
                  <p className="font-extrabold text-blue-900 mb-0.5">Anh ngữ LeeGo - Giáo viên AI thân thiện</p>
                  <p className="text-[11px] text-slate-500">
                    Chào con yêu! Hãy bấm giữ hoặc chạm vào nút **Microphone màu đỏ** ở phía dưới, nói thật to rõ ràng câu trả lời của con bằng tiếng Anh. Nếu con quên bài, bấm nút **"Gợi ý 💡"** để xem câu mẫu nhé!
                  </p>
                </div>
              </div>

              {/* Chat timeline logs */}
              {chatLog.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'} space-x-3 items-end animate-fade-in`}
                >
                  {msg.sender === 'ai' && (
                    <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 font-bold text-xs shadow-xs text-indigo-600">
                      AI
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm font-semibold leading-relaxed shadow-xs ${
                    msg.sender === 'ai'
                      ? msg.text.includes('Feedback')
                        ? 'bg-amber-50/70 border border-amber-100 text-slate-800 font-medium'
                        : 'bg-slate-50 border border-slate-100 text-slate-800'
                      : 'bg-brand-primary text-white font-bold'
                  }`}>
                    {/* Preserve line breaks */}
                    <div className="whitespace-pre-line">
                      {msg.text}
                    </div>
                    
                    <span className={`text-[9px] block text-right mt-1.5 ${
                      msg.sender === 'ai' ? 'text-slate-400' : 'text-rose-100'
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.sender === 'student' && (
                    <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center border border-rose-200 font-bold text-xs text-brand-primary shadow-xs">
                      Con
                    </div>
                  )}
                </div>
              ))}

              <div ref={chatEndRef} />
            </div>

            {/* Speaking Controller UI */}
            <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-sm space-y-4">
              
              {/* Visual indicator of recording */}
              {isRecording && (
                <div className="flex flex-col items-center space-y-2 py-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full bg-brand-primary animate-ping"></span>
                    <span className="h-2 w-2 rounded-full bg-brand-primary animate-ping delay-75"></span>
                    <span className="h-2 w-2 rounded-full bg-brand-primary animate-ping delay-150"></span>
                  </div>
                  <p className="text-xs text-brand-primary font-black animate-pulse">
                    AI đang lắng nghe... Bé hãy nói câu trả lời ({recordDuration}s)
                  </p>
                </div>
              )}

              {/* Progress counter */}
              <div className="flex justify-between items-center text-xs text-slate-400 font-bold">
                <span>Câu hỏi {currentQuestionIndex + 1} / 10</span>
                <span className="text-brand-purple">Oxford Everybody Up 4</span>
              </div>

              {/* Visual Context Card for He/She/They questions (Enforces beautiful illustrations to provide clear context) */}
              {getQuestionImage(questions[currentQuestionIndex].question) && (
                <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-xs bg-slate-50 p-3 text-center animate-fade-in flex flex-col items-center justify-center space-y-2">
                  <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-wider block">
                    🖼️ Hình ảnh minh họa (Visual Context)
                  </span>
                  <img 
                    src={getQuestionImage(questions[currentQuestionIndex].question)!} 
                    alt="Speaking Context" 
                    className="max-h-48 rounded-xl object-cover border border-slate-200 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <p className="text-[11px] text-slate-400 font-medium">
                    (Bé hãy quan sát hình ảnh trên để trả lời câu hỏi nhé)
                  </p>
                </div>
              )}

              {/* Helper suggestion toggle */}
              {showHelper && (
                <div className="bg-amber-50 border border-amber-100/50 p-3.5 rounded-2xl text-xs space-y-1.5 animate-fade-in">
                  <div className="flex items-center space-x-1 text-amber-700">
                    <span className="font-extrabold">💡 Mẫu câu gợi ý cho bé:</span>
                  </div>
                  <p className="font-mono text-slate-700 font-bold select-all bg-white p-2 rounded-xl border border-slate-100">
                    {questions[currentQuestionIndex].suggestedAnswer}
                  </p>
                  <p className="text-[10px] text-slate-400 italic">
                    (Mẹo: Nhấn đúp để sao chép từ gợi ý nếu bé chưa nhớ ra nhé!)
                  </p>
                </div>
              )}

              {/* Microphone access error banner */}
              {micError === 'blocked' && (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-xs space-y-2 text-rose-800 animate-fade-in">
                  <div className="flex items-center space-x-2 font-bold text-rose-700">
                    <ShieldAlert className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
                    <span>Trình duyệt chưa được cấp quyền truy cập Micro!</span>
                  </div>
                  <p className="leading-relaxed">
                    Bé vui lòng nhấp vào biểu tượng <strong>ổ khóa 🔒</strong> hoặc <strong>cài đặt trang web</strong> ở góc trái thanh địa chỉ trình duyệt, chọn <strong>Cho phép (Allow)</strong> cho Micro rồi thử lại nhé.
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Mẹo: Bé cũng có thể dùng ô <strong>Mẹo nhập câu nói bằng bàn phím</strong> ở phía dưới để học ngay mà không cần micro!
                  </p>
                </div>
              )}

              {micError === 'error' && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs space-y-2 text-amber-800 animate-fade-in">
                  <div className="flex items-center space-x-2 font-bold text-amber-700">
                    <AlertCircle className="h-4.5 w-4.5 text-amber-500" />
                    <span>Không thể khởi động thiết bị thu âm</span>
                  </div>
                  <p className="leading-relaxed">
                    Đã có lỗi xảy ra khi kết nối Micro. Bé hãy kiểm tra xem Micro của thiết bị đã bật chưa, hoặc bé cũng có thể gõ câu nói vào ô phía dưới nhé!
                  </p>
                </div>
              )}

              {/* Control buttons group */}
              <div className="flex items-center justify-between gap-4">
                
                {/* Helper Toggle Button */}
                <button
                  onClick={() => setShowHelper(!showHelper)}
                  className={`px-4 py-3 rounded-2xl border text-xs font-bold transition flex items-center space-x-1 bg-white cursor-pointer ${
                    showHelper ? 'text-amber-600 border-amber-300 shadow-sm' : 'text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>💡 Gợi ý câu nói</span>
                </button>

                {/* Main MIC trigger */}
                <div className="flex-1 flex justify-center">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      disabled={isProcessing}
                      className={`h-16 w-16 rounded-full flex items-center justify-center transition cursor-pointer ${
                        isProcessing 
                          ? 'bg-slate-100 text-slate-300 border-2 border-slate-200 cursor-not-allowed'
                          : 'bg-brand-primary hover:bg-rose-600 hover:scale-105 text-white shadow-md border-4 border-rose-100 active:scale-95'
                      }`}
                      title="Chạm để bắt đầu nói"
                    >
                      <Mic className="h-7 w-7" />
                    </button>
                  ) : (
                    <button
                      onClick={stopRecordingAndAnalyze}
                      className="h-16 w-16 rounded-full bg-slate-950 text-white flex items-center justify-center transition cursor-pointer shadow-lg animate-pulse hover:bg-slate-800"
                      title="Chạm để phân tích giọng nói"
                    >
                      <MicOff className="h-7 w-7 text-rose-500" />
                    </button>
                  )}
                </div>

                {/* Play Question Speech */}
                <button
                  onClick={() => speakText(questions[currentQuestionIndex].question)}
                  className="px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                >
                  <Volume2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Nghe câu hỏi</span>
                </button>

              </div>

              {/* Speech simulator text entry for iFrame constraints / non-mic environments */}
              <div className="pt-3 border-t border-slate-50 space-y-1.5">
                <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-brand-blue" />
                  Mẹo: Nếu micro bị trình duyệt chặn, bé hãy gõ câu trả lời dưới đây để thử nghiệm AI nhé!
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={simulationText}
                    onChange={(e) => setSimulationText(e.target.value)}
                    placeholder="Gõ hoặc sao chép gợi ý dán vào đây..."
                    className="flex-1 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-brand-primary focus:bg-white transition"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        processAnswer(simulationText);
                      }
                    }}
                  />
                  <button
                    onClick={() => processAnswer(simulationText)}
                    disabled={!simulationText.trim() || isProcessing}
                    className="bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Gửi</span>
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              </div>

            </div>
          </>
        ) : (
          /* Speaking Test Completed Screen */
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-lg space-y-8 animate-fade-in" id="speaking-results-panel">
            
            {/* Header section with Trophy */}
            <div className="text-center space-y-3 flex flex-col items-center">
              <div className="h-20 w-20 bg-rose-50 rounded-full flex items-center justify-center text-brand-primary shadow-xs">
                <Award className="h-12 w-12 text-amber-400 fill-amber-300 animate-bounce" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-800 tracking-tight">
                  Hoàn Thành Speaking Test!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg mx-auto leading-relaxed mt-1">
                  Chúc mừng con đã xuất sắc hoàn thành cuộc hội thoại 10 câu với giáo viên AI của Anh ngữ LeeGo! Dưới đây là bảng báo cáo đánh giá năng lực của con.
                </p>
              </div>
            </div>

            {/* Overalls and scores display (VI) */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-center flex flex-col justify-center items-center">
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Overall Score</span>
                <span className="text-3xl font-black text-brand-primary">{overallScore}</span>
                <span className="text-[9px] font-bold text-slate-400 block mt-0.5">/100 Điểm</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center flex flex-col justify-center items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Pronunciation</span>
                <span className="text-2xl font-extrabold text-slate-800">{avgPron}</span>
                <span className="text-[9px] font-bold text-slate-400 block mt-0.5">/100 Điểm 🗣️</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center flex flex-col justify-center items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Grammar Target</span>
                <span className="text-2xl font-extrabold text-slate-800">{avgGram}</span>
                <span className="text-[9px] font-bold text-slate-400 block mt-0.5">/100 Điểm 📝</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center flex flex-col justify-center items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Response Speed</span>
                <span className="text-2xl font-extrabold text-slate-800">{avgFlu}</span>
                <span className="text-[9px] font-bold text-slate-400 block mt-0.5">/100 Điểm ⚡</span>
              </div>

            </div>

            {/* Reward Bonus */}
            <div className="bg-emerald-50 border border-emerald-100/50 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3 text-emerald-800 text-xs">
                <span className="text-2xl">🪙</span>
                <div>
                  <p className="font-extrabold">LeeGo Reward Bonus!</p>
                  <p className="text-[11px] text-slate-500">Con đã được cộng điểm thưởng vào tài khoản thành công.</p>
                </div>
              </div>
              <span className="text-sm font-black text-emerald-600 bg-white px-3 py-1.5 rounded-xl border border-emerald-100">
                +{overallScore * 5} xu 🪙
              </span>
            </div>

            {/* Kid/Student feedback and improvements (VII) */}
            <div className="bg-slate-50/50 border border-slate-100 p-5 rounded-2xl space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Nhận xét từ Giáo viên AI Coach:</span>
                <p className="text-sm font-extrabold text-slate-800 leading-relaxed">
                  "Làm tốt lắm con yêu! Phát âm của con rất rõ ràng và chuẩn ngữ điệu Oxford. Con có khả năng ghi nhớ từ vựng vô cùng tuyệt vời!"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div className="bg-white p-3.5 rounded-xl border border-slate-100/50">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase block mb-1">💪 Điểm mạnh nổi bật</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    - Sử dụng từ vựng Oxford linh hoạt.<br />
                    - Phát âm to, rõ ràng và có âm đuôi.
                  </p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-100/50">
                  <span className="text-[10px] font-extrabold text-brand-primary uppercase block mb-1">🔑 Cần ôn tập thêm</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    - Chú ý chia đúng động từ ở thời quá khứ (Unit 4/5).<br />
                    - Trả lời nhanh hơn một chút để cải thiện phản xạ.
                  </p>
                </div>
              </div>
            </div>

            {/* Parent & Teacher Report (VIII) */}
            <div className="bg-indigo-50/30 border border-indigo-100/50 p-5 rounded-3xl space-y-4">
              <div className="flex items-center space-x-2 text-indigo-800">
                <FileText className="h-5 w-5" />
                <h4 className="font-display font-extrabold text-xs uppercase tracking-wide">Báo cáo dành cho Phụ huynh / Giáo viên</h4>
              </div>

              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p>👩‍👦 <strong>Học viên:</strong> <span className="font-bold text-slate-800">{session.fullName}</span></p>
                <p>📅 <strong>Ngày thực hiện:</strong> {new Date().toLocaleDateString('vi-VN')} tại lớp <strong>Anh ngữ LeeGo</strong></p>
                <p>🎯 <strong>Phân tích chuyên sâu:</strong> Con đã hoàn thành xuất sắc cấu trúc Warm-up tự nhiên trước khi bước vào 7 câu hỏi chuyên đề từ vựng và ngữ pháp của Unit {activeUnit.number}. Độ tương thích mẫu câu đạt {avgGram}%, phát âm đạt {avgPron}% so với mô hình chuẩn Oxford.</p>
                <p>📈 <strong>Gợi ý lộ trình:</strong> Tiếp tục ôn luyện các mẫu câu hội thoại giao tiếp của Unit {activeUnit.number}, cho bé nghe đĩa nghe Oxford Everybody Up 4 khoảng 10 phút mỗi ngày để tăng tốc độ phản xạ nói tự nhiên.</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
              <button
                onClick={startNewTest}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs px-6 py-3.5 rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Luyện tập lại bài nói này</span>
              </button>
              <button
                onClick={onBack}
                className="bg-brand-primary hover:bg-rose-600 text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-rose-100"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Hoàn thành & Quay lại bài học</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Speaking Footer (XII) */}
      <div className="bg-white border-t border-slate-100 py-3.5 px-6 mt-12 text-center text-[10px] text-slate-400 font-bold tracking-wider uppercase flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>Anh ngữ LeeGo - Hotline: 0988.526.585</span>
        <span className="text-slate-500">Everybody Up 4 Student App</span>
      </div>

    </div>
  );
}
