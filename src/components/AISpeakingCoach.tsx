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
    { id: 1, question: "Nice to meet you! What is your name?", vietnamesePrompt: "Rất vui được gặp con! Tên con là gì?", type: 'warmup', targetPatterns: ["my name is", "i'm"], suggestedAnswer: "My name is Jack." },
    { id: 2, question: "How are you today?", vietnamesePrompt: "Hôm nay con khỏe không?", type: 'warmup', targetPatterns: ["i am good", "i'm good", "i'm fine"], suggestedAnswer: "I'm great, thank you!" },
    { id: 3, question: "What is your favorite animal?", vietnamesePrompt: "Con thích con vật nào nhất?", type: 'warmup', targetPatterns: ["i like", "my favorite animal is"], suggestedAnswer: "My favorite animal is the dolphin." },
    { id: 4, question: "Which animal is bigger, a hippopotamus or a panda?", vietnamesePrompt: "Con vật nào to hơn, hà mã hay gấu trúc?", type: 'topic', targetPatterns: ["hippopotamus is bigger", "bigger than the panda"], suggestedAnswer: "The hippopotamus is bigger than the panda." },
    { id: 5, question: "Which one is the smallest: a butterfly, a caterpillar, or a bee?", vietnamesePrompt: "Con nào nhỏ nhất trong ba loài: bướm, sâu bướm, hay ong?", type: 'topic', targetPatterns: ["bee is the smallest", "the bee"], suggestedAnswer: "The bee is the smallest." },
    { id: 6, question: "Is an eel as long as a seal?", vietnamesePrompt: "Con lươn có dài bằng con hải cẩu không?", type: 'topic', targetPatterns: ["isn't as long as", "is not as long"], suggestedAnswer: "No, the eel isn't as long as the seal." },
    { id: 7, question: "Is a dolphin as friendly as a shark?", vietnamesePrompt: "Con cá heo có thân thiện bằng con cá mập không?", type: 'topic', targetPatterns: ["dolphin is friendlier", "not as friendly"], suggestedAnswer: "No, a shark isn't as friendly as a dolphin." },
    { id: 8, question: "How much does the lizard weigh?", vietnamesePrompt: "Con thằn lằn này nặng bao nhiêu gam?", type: 'topic', targetPatterns: ["weighs", "grams"], suggestedAnswer: "It weighs 150 grams." },
    { id: 9, question: "How long is the big dinosaur lizard?", vietnamesePrompt: "Con thằn lằn khổng lồ này dài bao nhiêu mét?", type: 'topic', targetPatterns: ["meters long", "3 meters"], suggestedAnswer: "It's 3 meters long." },
    { id: 10, question: "When you choose a cap, which one would you like?", vietnamesePrompt: "Khi chọn mũ lưỡi trai, con thích cái nào nhất?", type: 'topic', targetPatterns: ["i'd like the", "longest one"], suggestedAnswer: "I'd like the longest one, please." }
  ],
  'unit-3': [
    { id: 1, question: "Hello! What is your name?", vietnamesePrompt: "Xin chào! Con tên là gì nhỉ?", type: 'warmup', targetPatterns: ["my name is", "i'm"], suggestedAnswer: "My name is Sophia." },
    { id: 2, question: "Where are you from?", vietnamesePrompt: "Con đến từ đâu?", type: 'warmup', targetPatterns: ["i am from", "i'm from"], suggestedAnswer: "I'm from Vietnam." },
    { id: 3, question: "What color do you like most?", vietnamesePrompt: "Con thích màu nào nhất?", type: 'warmup', targetPatterns: ["i like blue", "i like red"], suggestedAnswer: "I like blue and yellow." },
    { id: 4, question: "What does your brother look like?", vietnamesePrompt: "Anh/em trai của con trông như thế nào?", type: 'topic', targetPatterns: ["he has", "short hair", "black hair"], suggestedAnswer: "He has short, straight, black hair and brown eyes." },
    { id: 5, question: "Do you have straight hair or curly hair?", vietnamesePrompt: "Tóc con thẳng hay tóc xoăn?", type: 'topic', targetPatterns: ["i have straight", "i have curly"], suggestedAnswer: "I have straight black hair." },
    { id: 6, question: "What do your favorite sunglasses look like?", vietnamesePrompt: "Cặp kính râm yêu thích của con trông như thế nào?", type: 'topic', targetPatterns: ["they are", "they're"], suggestedAnswer: "They're new and black." },
    { id: 7, question: "Which accessory does she want to wear to the party?", vietnamesePrompt: "Phụ kiện nào cô ấy muốn đeo đến bữa tiệc?", type: 'topic', targetPatterns: ["wants to wear", "necklace"], suggestedAnswer: "She wants to wear the beautiful necklace." },
    { id: 8, question: "What do you say to wish your friends good luck before a school play?", vietnamesePrompt: "Con sẽ nói gì để chúc các bạn may mắn trước buổi diễn kịch?", type: 'topic', targetPatterns: ["good luck", "with the play"], suggestedAnswer: "Good luck with the play!" },
    { id: 9, question: "Do you want to wear gloves or a watch when going outside?", vietnamesePrompt: "Con muốn đeo găng tay hay đồng hồ khi ra ngoài?", type: 'topic', targetPatterns: ["i want to wear", "gloves", "watch"], suggestedAnswer: "I want to wear black gloves." },
    { id: 10, question: "Tell me, how does a caterpillar look like a stick for camouflage?", vietnamesePrompt: "Hãy cho cô biết, sâu bướm làm sao trông giống cái cành cây để ngụy trang?", type: 'topic', targetPatterns: ["same color", "same shape"], suggestedAnswer: "The caterpillar is the same color and shape as the stick." }
  ],
  'unit-4': [
    { id: 1, question: "Hello! What is your name?", vietnamesePrompt: "Tên của con là gì nhỉ?", type: 'warmup', targetPatterns: ["my name is", "i'm"], suggestedAnswer: "My name is John." },
    { id: 2, question: "How old are you?", vietnamesePrompt: "Con mấy tuổi rồi?", type: 'warmup', targetPatterns: ["i am", "i'm"], suggestedAnswer: "I'm ten years old." },
    { id: 3, question: "What is your favorite sport?", vietnamesePrompt: "Môn thể thao yêu thích của con là gì?", type: 'warmup', targetPatterns: ["i like", "my favorite sport is"], suggestedAnswer: "I like playing basketball." },
    { id: 4, question: "What did you do yesterday?", vietnamesePrompt: "Hôm qua con đã làm gì?", type: 'topic', targetPatterns: ["i played", "i watched"], suggestedAnswer: "I played baseball yesterday." },
    { id: 5, question: "Did you play baseball or tennis yesterday?", vietnamesePrompt: "Hôm qua con đã chơi bóng chày hay quần vợt?", type: 'topic', targetPatterns: ["i played baseball", "i played tennis"], suggestedAnswer: "I played baseball yesterday." },
    { id: 6, question: "What did your best friend do last weekend?", vietnamesePrompt: "Bạn thân của con đã làm gì cuối tuần trước?", type: 'topic', targetPatterns: ["he played", "she played"], suggestedAnswer: "She practiced the piano last weekend." },
    { id: 7, question: "Did you use the computer on Monday?", vietnamesePrompt: "Con có sử dụng máy tính vào thứ Hai không?", type: 'topic', targetPatterns: ["yes, i did", "no, i didn't"], suggestedAnswer: "Yes, I did. I used the computer for school." },
    { id: 8, question: "If your friend cannot find their glove, what can you say?", vietnamesePrompt: "Nếu bạn của con không tìm thấy găng tay, con có thể nói gì?", type: 'topic', targetPatterns: ["don't worry", "borrow mine"], suggestedAnswer: "Don't worry. You can borrow mine." },
    { id: 9, question: "What did they use to make homes in ancient Rome?", vietnamesePrompt: "Người La Mã cổ đại đã dùng vật liệu gì để xây nhà?", type: 'topic', targetPatterns: ["they used", "stone", "clay"], suggestedAnswer: "They used stone and clay to make homes." },
    { id: 10, question: "Did they use metal to make cups in Rome?", vietnamesePrompt: "Họ có dùng kim loại để làm cốc ở La Mã không?", type: 'topic', targetPatterns: ["yes, they did", "no, they didn't"], suggestedAnswer: "Yes, they did. They used metal." }
  ],
  'unit-5': [
    { id: 1, question: "Hi! What's your name?", vietnamesePrompt: "Chào con! Tên con là gì?", type: 'warmup', targetPatterns: ["my name is", "i'm"], suggestedAnswer: "My name is Lucy." },
    { id: 2, question: "How are you today?", vietnamesePrompt: "Hôm nay con khỏe không?", type: 'warmup', targetPatterns: ["i'm good", "fine"], suggestedAnswer: "I'm very well, thank you!" },
    { id: 3, question: "What is your favorite food?", vietnamesePrompt: "Món ăn yêu thích của con là gì?", type: 'warmup', targetPatterns: ["i like", "favorite food is"], suggestedAnswer: "My favorite food is noodles." },
    { id: 4, question: "What did you eat for lunch yesterday?", vietnamesePrompt: "Trưa hôm qua con đã ăn món gì?", type: 'topic', targetPatterns: ["i ate", "noodles", "sushi"], suggestedAnswer: "I ate sushi and curry." },
    { id: 5, question: "What did you drink with your dinner last night?", vietnamesePrompt: "Tối qua con uống nước gì cùng bữa tối?", type: 'topic', targetPatterns: ["i drank", "lemonade", "water"], suggestedAnswer: "I drank fresh lemonade." },
    { id: 6, question: "When did she go bowling?", vietnamesePrompt: "Cô ấy đã đi chơi bowling khi nào?", type: 'topic', targetPatterns: ["went bowling", "yesterday"], suggestedAnswer: "She went bowling yesterday." },
    { id: 7, question: "Did you see a parade or have a picnic last weekend?", vietnamesePrompt: "Cuối tuần trước con đã đi xem diễu hành hay đi dã ngoại?", type: 'topic', targetPatterns: ["i saw a parade", "i had a picnic"], suggestedAnswer: "I had a picnic with my family last weekend." },
    { id: 8, question: "What happened when you lost your backpack?", vietnamesePrompt: "Có chuyện gì xảy ra thế, con làm mất ba lô à?", type: 'topic', targetPatterns: ["i lost my", "backpack"], suggestedAnswer: "I lost my backpack. Let's look for it together." },
    { id: 9, question: "Did some dinosaurs have feathers?", vietnamesePrompt: "Có phải một số loài khủng long có lông vũ không?", type: 'topic', targetPatterns: ["yes, they did", "had feathers"], suggestedAnswer: "Yes, some dinosaurs had feathers." },
    { id: 10, question: "Did a T-Rex dinosaur have wings?", vietnamesePrompt: "Khủng long bạo chúa T-Rex có cánh không con?", type: 'topic', targetPatterns: ["no, it didn't", "didn't have wings"], suggestedAnswer: "No, it didn't. It had claws and a tail." }
  ],
  'unit-6': [
    { id: 1, question: "Hello! What is your name?", vietnamesePrompt: "Tên của con là gì?", type: 'warmup', targetPatterns: ["my name is", "i'm"], suggestedAnswer: "My name is Danny." },
    { id: 2, question: "How do you feel today?", vietnamesePrompt: "Hôm nay con cảm thấy thế nào?", type: 'warmup', targetPatterns: ["i feel", "good"], suggestedAnswer: "I feel wonderful today!" },
    { id: 3, question: "Do you like music?", vietnamesePrompt: "Con có thích âm nhạc không?", type: 'warmup', targetPatterns: ["yes, i do", "i like music"], suggestedAnswer: "Yes, I do. I like singing songs." },
    { id: 4, question: "What do you like to do in your free time?", vietnamesePrompt: "Con thích làm gì trong thời gian rảnh rỗi?", type: 'topic', targetPatterns: ["i like to", "sing songs", "write stories"], suggestedAnswer: "I like to write stories and make models." },
    { id: 5, question: "Does he like to design clothes or sing songs?", vietnamesePrompt: "Cậu ấy thích thiết kế quần áo hay hát?", type: 'topic', targetPatterns: ["he likes to", "design clothes"], suggestedAnswer: "He likes to design clothes in his free time." },
    { id: 6, question: "What did you cook or bake for your friends?", vietnamesePrompt: "Con đã nấu ăn hay nướng bánh gì cho các bạn của mình?", type: 'topic', targetPatterns: ["i cooked", "i baked"], suggestedAnswer: "I baked delicious cookies for them." },
    { id: 7, question: "Did you make a card or knit a scarf for your mother?", vietnamesePrompt: "Con có làm thiệp hay đan khăn quàng cổ tặng mẹ không?", type: 'topic', targetPatterns: ["i made a card", "i knitted a scarf"], suggestedAnswer: "I made a beautiful card for my mother." },
    { id: 8, question: "If your neighbor is carrying heavy bags, what should you ask?", vietnamesePrompt: "Nếu hàng xóm đang xách túi nặng, con sẽ hỏi thế nào để giúp đỡ?", type: 'topic', targetPatterns: ["could you", "carry these bags"], suggestedAnswer: "Could I carry these bags for you?" },
    { id: 9, question: "What is your favorite type of art?", vietnamesePrompt: "Con thích loại hình nghệ thuật nào nhất?", type: 'topic', targetPatterns: ["i like painting", "sculpture"], suggestedAnswer: "My favorite art is a colorful painting." },
    { id: 10, question: "This is a beautiful photograph. What is it about?", vietnamesePrompt: "Đây là một bức ảnh rất đẹp. Nó chụp về cái gì vậy con?", type: 'topic', targetPatterns: ["this is a", "photograph of"], suggestedAnswer: "This is a photograph of my school." }
  ],
  'unit-7': [
    { id: 1, question: "Hi there! What is your name?", vietnamesePrompt: "Chào con! Con tên gì nhỉ?", type: 'warmup', targetPatterns: ["my name is", "i'm"], suggestedAnswer: "My name is Emma." },
    { id: 2, question: "How old are you?", vietnamesePrompt: "Con năm nay mấy tuổi rồi?", type: 'warmup', targetPatterns: ["i am", "i'm"], suggestedAnswer: "I am ten years old." },
    { id: 3, question: "Where are you from?", vietnamesePrompt: "Con đến từ đâu thế?", type: 'warmup', targetPatterns: ["i am from", "i'm from"], suggestedAnswer: "I am from Vietnam." },
    { id: 4, question: "What do you want to be when you grow up?", vietnamesePrompt: "Con muốn làm nghề gì khi lớn lên?", type: 'topic', targetPatterns: ["want to be", "scientist"], suggestedAnswer: "I want to be a game designer." },
    { id: 5, question: "What does he want to be? An artist or a scientist?", vietnamesePrompt: "Cậu ấy muốn trở thành ai? Hoạ sĩ hay nhà khoa học?", type: 'topic', targetPatterns: ["wants to be", "a scientist"], suggestedAnswer: "He wants to be a famous scientist." },
    { id: 6, question: "What do you want to do when you're older?", vietnamesePrompt: "Con muốn làm điều gì khi lớn lên?", type: 'topic', targetPatterns: ["want to", "travel the world"], suggestedAnswer: "I want to travel the world and go to space." },
    { id: 7, question: "Do you want to fly a helicopter or work with animals?", vietnamesePrompt: "Con muốn lái trực thăng hay làm việc với động vật?", type: 'topic', targetPatterns: ["i want to fly", "work with animals"], suggestedAnswer: "I want to work with wild animals." },
    { id: 8, question: "What does the 'No Running' sign mean?", vietnamesePrompt: "Biển báo 'No Running' có nghĩa là gì con nhỉ?", type: 'topic', targetPatterns: ["it means", "can't run"], suggestedAnswer: "It means you can't run here." },
    { id: 9, question: "Do astronauts have to wear a space suit in space?", vietnamesePrompt: "Các phi hành gia có phải mặc đồ phi hành vũ trụ trong không gian không?", type: 'topic', targetPatterns: ["yes, they do", "space suit"], suggestedAnswer: "Yes, they have to wear a space suit." },
    { id: 10, question: "How do astronauts get to the space station?", vietnamesePrompt: "Làm thế nào phi hành gia lên được trạm vũ trụ?", type: 'topic', targetPatterns: ["space shuttle", "space station"], suggestedAnswer: "They take the space shuttle to get to the space station." }
  ],
  'unit-8': [
    { id: 1, question: "Hello! What is your name?", vietnamesePrompt: "Xin chào! Con tên là gì?", type: 'warmup', targetPatterns: ["my name is", "i'm"], suggestedAnswer: "My name is Tommy." },
    { id: 2, question: "How do you feel today?", vietnamesePrompt: "Hôm nay con cảm thấy thế nào?", type: 'warmup', targetPatterns: ["i feel", "excited"], suggestedAnswer: "I feel very excited today!" },
    { id: 3, question: "What is your favorite vacation place?", vietnamesePrompt: "Nơi đi du lịch yêu thích của con là đâu?", type: 'warmup', targetPatterns: ["i like beach", "beach"], suggestedAnswer: "My favorite vacation place is the beach." },
    { id: 4, question: "What are you going to do on vacation?", vietnamesePrompt: "Con dự định sẽ làm gì trong kỳ nghỉ sắp tới?", type: 'topic', targetPatterns: ["going to", "swim in the ocean"], suggestedAnswer: "I am going to swim in the ocean and stay in a hotel." },
    { id: 5, question: "When are you going to take a boat ride?", vietnamesePrompt: "Khi nào con dự định đi du ngoạn bằng thuyền?", type: 'topic', targetPatterns: ["going to take", "tomorrow"], suggestedAnswer: "I am going to take a boat ride tomorrow." },
    { id: 6, question: "What are you going to take with you on a camping trip?", vietnamesePrompt: "Con định mang theo những món đồ gì khi đi cắm trại?", type: 'topic', targetPatterns: ["going to take", "tent", "flashlight"], suggestedAnswer: "I am going to take a tent, a flashlight, and a sleeping bag." },
    { id: 7, question: "Do you need a swimsuit and a towel to swim in the ocean?", vietnamesePrompt: "Con có cần quần áo bơi và khăn tắm để bơi ở biển không?", type: 'topic', targetPatterns: ["yes, i do", "swimsuit", "towel"], suggestedAnswer: "Yes, I am going to take a swimsuit and a towel." },
    { id: 8, question: "What do you say to wish someone a great time before their trip?", vietnamesePrompt: "Con nói câu gì để chúc ai đó đi chơi vui vẻ trước khi đi?", type: 'topic', targetPatterns: ["have a great time", "nice trip"], suggestedAnswer: "Bye! Have a great time!" },
    { id: 9, question: "How are you going to the department store?", vietnamesePrompt: "Con định di chuyển đến cửa hàng bách hóa bằng cách nào?", type: 'topic', targetPatterns: ["take a taxi", "subway"], suggestedAnswer: "I'm going to take a taxi." },
    { id: 10, question: "What is your favorite transportation for vacation?", vietnamesePrompt: "Phương tiện di chuyển yêu thích của con trong kỳ nghỉ là gì?", type: 'topic', targetPatterns: ["i like", "ferry"], suggestedAnswer: "I like taking the ferry on vacation." }
  ]
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
  const [micError, setMicError] = useState<'blocked' | 'error' | null>(null);
  const [answersLog, setAnswersLog] = useState<{ question: string, answer: string }[]>([]);

  // Real Gemini evaluation state
  const [evalResultState, setEvalResultState] = useState<any>(null);
  const [evalErrorState, setEvalErrorState] = useState<boolean>(false);

  // Chat message logs
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const startTimeRef = useRef<number>(0);

  // Active Questions List
  const questions = SPEAKING_QUESTIONS_DB[activeUnit.id] || SPEAKING_QUESTIONS_DB['unit-1'];

  // Lifecycle setup
  useEffect(() => {
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
    setEvalResultState(null);
    setEvalErrorState(false);
    setTranscript('');
    setSimulationText('');
    setAnswersLog([]);
    
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

  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>('');
  const latestFullTextRef = useRef<string>('');
  const isStoppingRef = useRef<boolean>(false);

  const startRecording = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setMicError(null);
    setTranscript('');
    finalTranscriptRef.current = '';
    latestFullTextRef.current = '';
    isStoppingRef.current = false;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsProcessing(false);
      alert("Speech recognition is not supported on this browser. Please use Chrome or Microsoft Edge.");
      setMicError('error');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      recognition.continuous = !isMobile;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log("Recognition started");
        setIsRecording(true);
        setIsProcessing(false);
        startTimeRef.current = Date.now();
        setRecordDuration(0);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setRecordDuration(prev => prev + 1);
        }, 1000);
      };

      recognition.onresult = (event: any) => {
        let interimText = '';
        let finalAccumulated = '';

        for (let i = 0; i < event.results.length; ++i) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalAccumulated += text + ' ';
          } else {
            interimText += text;
          }
        }

        if (finalAccumulated.trim()) {
          finalTranscriptRef.current = finalAccumulated.trim();
        }

        const fullDisplayText = (finalAccumulated + interimText).trim();
        latestFullTextRef.current = fullDisplayText;
        setTranscript(fullDisplayText);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        setIsProcessing(false);
        stopTimer();
        if (event.error === 'not-allowed') {
          setMicError('blocked');
          alert("Quyền truy cập micro đã bị từ chối. Con hãy cho phép micro rồi thử lại nhé!");
        } else if (event.error !== 'no-speech') {
          setMicError('error');
        }
      };

      recognition.onend = () => {
        console.log("Recognition ended");
        setIsRecording(false);
        stopTimer();

        if (isStoppingRef.current) {
          isStoppingRef.current = false;
          const capturedText = (finalTranscriptRef.current || latestFullTextRef.current || transcript).trim();
          console.log("Final transcript:", capturedText);

          if (!capturedText) {
            console.warn("[AISpeakingCoach] Final transcript is empty. Staying on current question.");
            setIsProcessing(false);
            alert("I couldn't hear you clearly. Please try again.");
            return;
          }

          console.log("Processing answer...");
          processAnswer(capturedText);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error("Failed to start SpeechRecognition:", err);
      setIsProcessing(false);
      setIsRecording(false);
      stopTimer();
      alert("Speech recognition is not supported on this browser. Please use Chrome or Microsoft Edge.");
    }
  };

  const stopRecordingAndAnalyze = () => {
    setIsRecording(false);
    stopTimer();
    isStoppingRef.current = true;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn("Recognition stop error:", e);
      }
    } else {
      isStoppingRef.current = false;
      processAnswer();
    }
  };

  const processAnswer = async (customText?: string) => {
    const finalAnswer = (customText || transcript || simulationText || '').trim();
    
    // Require real typed input - NEVER auto-insert suggested answer!
    if (!finalAnswer) {
      console.warn("[AISpeakingCoach] Empty text answer submitted. Stopping pipeline.");
      alert("Bé hãy gõ hoặc nói câu trả lời của mình nhé! (Please record or type your answer.)");
      return;
    }

    setIsProcessing(true);

    const currentQIndex = answersLog.length;
    const currentQ = questions[currentQIndex] || questions[0];

    const studentMsg: ChatMessage = {
      id: `student-${currentQIndex}`,
      sender: 'student',
      text: finalAnswer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatLog(prev => [...prev, studentMsg]);

    const answerItem = { question: currentQ.question, answer: finalAnswer };
    const updatedLog = [...answersLog, answerItem];
    setAnswersLog(updatedLog);

    const nextIdx = updatedLog.length;
    const nextQ = nextIdx < questions.length ? questions[nextIdx] : null;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: updatedLog,
          currentQuestion: currentQ,
          nextQuestion: nextQ
        })
      });

      if (response.ok) {
        const chatData = await response.json();
        console.log("API response:", chatData);

        if (chatData.reply) {
          const teacherReplyMsg: ChatMessage = {
            id: `ai-reply-${currentQIndex}`,
            sender: 'ai',
            text: chatData.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setChatLog(prev => [...prev, teacherReplyMsg]);
        }
      }
    } catch (err) {
      console.error("AI Teacher chat generation error:", err);
    }

    // Advance to next question or run comprehensive evaluation
    setTimeout(() => {
      if (nextIdx < questions.length) {
        setCurrentQuestionIndex(nextIdx);

        const nextQMsg: ChatMessage = {
          id: `ai-q-${nextIdx}`,
          sender: 'ai',
          text: `Câu hỏi ${nextIdx + 1} / 10:\n\n💬 "${questions[nextIdx].question}"\n(${questions[nextIdx].vietnamesePrompt})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatLog(prev => [...prev, nextQMsg]);
        speakText(questions[nextIdx].question);
        setTranscript('');
        setSimulationText('');
        setIsProcessing(false);
        startTimeRef.current = Date.now();
      } else {
        runComprehensiveEvaluation(updatedLog);
      }
    }, 1200);
  };

  const runComprehensiveEvaluation = async (finalLog: { question: string, answer: string }[]) => {
    setIsProcessing(true);
    setEvalErrorState(false);

    const loadingMsg: ChatMessage = {
      id: `ai-loading-eval`,
      sender: 'ai',
      text: `🤖 Thầy cô AI đang tổng hợp và đánh giá chi tiết bài nói của con. Con chờ một chút nhé...`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatLog(prev => [...prev, loadingMsg]);

    console.log("Transcript:", JSON.stringify(finalLog, null, 2));

    const requestPayload = {
      history: finalLog,
      unitId: activeUnit.id
    };
    console.log("Gemini Request:", JSON.stringify(requestPayload, null, 2));

    try {
      const response = await fetch("/api/evaluate-speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Gemini Raw Response:", JSON.stringify(data));
        
        if (data && data.useFallback !== true) {
          console.log("Parsed JSON:", JSON.stringify(data, null, 2));

          const evalObj = {
            overallScore: Number(data.overallScore),
            pronunciationScore: Number(data.pronunciationScore ?? data.pronunciation),
            grammarScore: Number(data.grammarScore ?? data.grammar),
            fluencyScore: Number(data.fluencyScore ?? data.fluency),
            feedback: data.feedback || "",
            strengths: Array.isArray(data.strengths) ? data.strengths : [],
            weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
            commonMistakes: Array.isArray(data.commonMistakes) ? data.commonMistakes : (Array.isArray(data.corrections) ? data.corrections : []),
            suggestedPractice: data.suggestedPractice || ""
          };

          console.log("Evaluation Object:", JSON.stringify(evalObj, null, 2));
          console.log("Displayed Scores:", {
            overallScore: evalObj.overallScore,
            pronunciationScore: evalObj.pronunciationScore,
            grammarScore: evalObj.grammarScore,
            fluencyScore: evalObj.fluencyScore
          });

          setEvalResultState(evalObj);
          setEvalErrorState(false);

          let reportText = `🏆 **KẾT QUẢ ĐÁNH GIÁ BÀI NÓI AI (SPEECH REPORT)**\n\n`;
          reportText += `⭐ **Điểm số chi tiết:**\n`;
          reportText += `- Phát âm (Pronunciation): ${evalObj.pronunciationScore}/100 🗣️\n`;
          reportText += `- Ngữ pháp (Grammar): ${evalObj.grammarScore}/100 📝\n`;
          reportText += `- Trôi chảy (Fluency): ${evalObj.fluencyScore}/100 ⚡\n`;
          reportText += `- **Điểm tổng quát (Overall): ${evalObj.overallScore}/100 🏆**\n\n`;
          reportText += `🤖 **Giáo viên AI nhận xét:**\n"${evalObj.feedback}"\n\n`;

          if (evalObj.strengths.length > 0) {
            reportText += `💪 **Điểm mạnh của con (Strengths):**\n`;
            evalObj.strengths.forEach((s: string) => { reportText += `• ${s}\n`; });
            reportText += `\n`;
          }

          if (evalObj.weaknesses.length > 0) {
            reportText += `✍️ **Điểm cần cải thiện (Areas to improve):**\n`;
            evalObj.weaknesses.forEach((w: string) => { reportText += `• ${w}\n`; });
            reportText += `\n`;
          }

          if (evalObj.commonMistakes.length > 0) {
            reportText += `❌ **Lỗi thường gặp / Gợi ý sửa:**\n`;
            evalObj.commonMistakes.forEach((m: string) => { reportText += `• ${m}\n`; });
            reportText += `\n`;
          }

          if (evalObj.suggestedPractice) {
            reportText += `💡 **Gợi ý luyện tập:**\n• ${evalObj.suggestedPractice}\n`;
          }

          const reportMsg: ChatMessage = {
            id: `ai-final-report`,
            sender: 'ai',
            text: reportText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          setChatLog(prev => prev.filter(m => m.id !== 'ai-loading-eval').concat(reportMsg));

          setTimeout(() => {
            finishSpeakingTest(evalObj);
          }, 1500);
          return;
        }
      }
    } catch (err) {
      console.error("Comprehensive speaking evaluation error:", err);
    }

    setChatLog(prev => prev.filter(m => m.id !== 'ai-loading-eval'));
    setEvalErrorState(true);
    setIsProcessing(false);
  };

  const finishSpeakingTest = (evalResult?: any) => {
    setTestCompleted(true);
    setIsProcessing(false);

    if (!evalResult) return;

    const overallScore = evalResult.overallScore;
    const awardedPoints = overallScore * 5;

    const updatedSession = { ...session };
    const dateStr = new Date().toLocaleDateString('vi-VN');

    const speakingResult = {
      unitId: activeUnit.id,
      overallScore,
      pronunciationScore: evalResult.pronunciationScore,
      grammarScore: evalResult.grammarScore,
      responseSpeedScore: evalResult.fluencyScore,
      completedAt: dateStr,
      commonErrors: evalResult.commonMistakes || [],
      feedbackForStudent: evalResult.feedback,
      parentReport: {
        strengths: evalResult.strengths || [],
        weaknesses: evalResult.weaknesses || [],
        suggestedPractice: evalResult.suggestedPractice || ""
      }
    };

    if (!updatedSession.testResults) {
      updatedSession.testResults = {};
    }

    updatedSession.points = session.points + awardedPoints;
    (updatedSession as any).speakingResults = {
      ...((updatedSession as any).speakingResults || {}),
      [activeUnit.id]: speakingResult
    };

    onUpdateSession(updatedSession);
  };

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

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 w-full flex-grow">
        
        {/* Unit Info Banner */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-rose-50 rounded-xl flex items-center justify-center text-brand-primary font-display font-extrabold text-base sm:text-lg">
              {activeUnit.number}
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">{activeUnit.title}</h4>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Tiến độ bài học: Câu {Math.min(currentQuestionIndex + 1, questions.length)} / {questions.length}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-24 sm:w-32 bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-brand-primary h-full rounded-full transition-all duration-500" 
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-extrabold text-slate-600 font-mono">
              {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
            </span>
          </div>
        </div>

        {evalErrorState ? (
          /* Error Screen when Gemini fails completely */
          <div className="bg-white rounded-3xl border border-rose-100 p-8 sm:p-12 shadow-lg text-center space-y-5 animate-fade-in max-w-lg mx-auto my-12">
            <div className="h-16 w-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-extrabold text-slate-800">Không thể đánh giá bài nói. Vui lòng thử lại.</h4>
              <p className="text-xs text-slate-500 font-medium">Hệ thống chưa nhận được kết quả đánh giá từ AI.</p>
            </div>
            <button
              onClick={() => runComprehensiveEvaluation(answersLog)}
              className="bg-brand-primary hover:bg-rose-600 text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl transition cursor-pointer inline-flex items-center justify-center gap-2 shadow-md shadow-rose-100"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Thử lại</span>
            </button>
          </div>
        ) : !testCompleted ? (
          /* Active Chat View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left/Main Chat Panel */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Chat Message List */}
              <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-xs min-h-[380px] max-h-[500px] overflow-y-auto space-y-4">
                {chatLog.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 shadow-xs ${
                      msg.sender === 'student'
                        ? 'bg-brand-primary text-white rounded-tr-none'
                        : 'bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none'
                    }`}>
                      <div className="flex items-center justify-between mb-1.5 text-[10px] opacity-75">
                        <span className="font-bold">
                          {msg.sender === 'student' ? 'Học viên (Con)' : 'Giáo viên AI 🤖'}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold whitespace-pre-line leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Speech Input & Control Area */}
              <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-xs space-y-4">
                
                {/* Realtime Microphone / Transcript Feedback */}
                {isRecording && (
                  <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-2xl flex items-center space-x-3 animate-pulse">
                    <div className="h-3 w-3 bg-brand-primary rounded-full animate-ping" />
                    <p className="text-xs font-bold text-brand-primary flex-grow">
                      Đang lắng nghe... ({recordDuration}s)
                    </p>
                  </div>
                )}

                {transcript && (
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs font-semibold text-slate-700">
                    💬 "{transcript}"
                  </div>
                )}

                {/* Main Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      disabled={isProcessing}
                      className={`w-full py-4 rounded-2xl font-extrabold text-sm transition cursor-pointer flex items-center justify-center space-x-2 shadow-md ${
                        isProcessing
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-brand-primary hover:bg-rose-600 text-white shadow-rose-100'
                      }`}
                    >
                      <Mic className="h-5 w-5" />
                      <span>{isProcessing ? 'Đang xử lý...' : 'Nhấn vào đây để Nói'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopRecordingAndAnalyze}
                      className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-extrabold text-sm transition cursor-pointer flex items-center justify-center space-x-2 shadow-md shadow-amber-100"
                    >
                      <MicOff className="h-5 w-5" />
                      <span>Gửi câu trả lời (Dừng nói)</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Right Side Helper Panel */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-xs space-y-4">
                <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-brand-purple" />
                  Gợi ý từ vựng & Cấu trúc
                </h4>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Mẫu câu gợi ý:</span>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">
                    "{questions[currentQuestionIndex]?.suggestedAnswer}"
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Từ khóa quan trọng:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {questions[currentQuestionIndex]?.targetPatterns.map((pat) => (
                      <span key={pat} className="text-[10px] font-bold bg-white text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200">
                        {pat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) : evalResultState ? (
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

            {/* Overalls and scores display */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-center flex flex-col justify-center items-center">
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider block mb-1">Overall Score</span>
                <span className="text-3xl font-black text-brand-primary">{evalResultState.overallScore}</span>
                <span className="text-[9px] font-bold text-slate-400 block mt-0.5">/100 Điểm</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center flex flex-col justify-center items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Pronunciation</span>
                <span className="text-2xl font-extrabold text-slate-800">{evalResultState.pronunciationScore}</span>
                <span className="text-[9px] font-bold text-slate-400 block mt-0.5">/100 Điểm 🗣️</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center flex flex-col justify-center items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Grammar Target</span>
                <span className="text-2xl font-extrabold text-slate-800">{evalResultState.grammarScore}</span>
                <span className="text-[9px] font-bold text-slate-400 block mt-0.5">/100 Điểm 📝</span>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center flex flex-col justify-center items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Response Speed</span>
                <span className="text-2xl font-extrabold text-slate-800">{evalResultState.fluencyScore}</span>
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
                +{evalResultState.overallScore * 5} xu 🪙
              </span>
            </div>

            {/* Kid/Student feedback and improvements */}
            <div className="bg-slate-50/50 border border-slate-100 p-5 rounded-2xl space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Nhận xét từ Giáo viên AI Coach:</span>
                <p className="text-sm font-extrabold text-slate-800 leading-relaxed">
                  "{evalResultState.feedback}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div className="bg-white p-3.5 rounded-xl border border-slate-100/50">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase block mb-1">💪 Điểm mạnh nổi bật</span>
                  <div className="text-xs text-slate-600 leading-relaxed font-semibold space-y-1">
                    {evalResultState.strengths.map((s: string, idx: number) => (
                      <p key={idx}>• {s}</p>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-100/50">
                  <span className="text-[10px] font-extrabold text-brand-primary uppercase block mb-1">🔑 Cần ôn tập thêm</span>
                  <div className="text-xs text-slate-600 leading-relaxed font-semibold space-y-1">
                    {evalResultState.weaknesses.map((w: string, idx: number) => (
                      <p key={idx}>• {w}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Parent & Teacher Report */}
            <div className="bg-indigo-50/30 border border-indigo-100/50 p-5 rounded-3xl space-y-4">
              <div className="flex items-center space-x-2 text-indigo-800">
                <FileText className="h-5 w-5" />
                <h4 className="font-display font-extrabold text-xs uppercase tracking-wide">Báo cáo dành cho Phụ huynh / Giáo viên</h4>
              </div>

              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p>👩‍👦 <strong>Học viên:</strong> <span className="font-bold text-slate-800">{session.fullName}</span></p>
                <p>📅 <strong>Ngày thực hiện:</strong> {new Date().toLocaleDateString('vi-VN')} tại lớp <strong>Anh ngữ LeeGo</strong></p>
                <p>🎯 <strong>Phân tích chuyên sâu:</strong> Con đã hoàn thành xuất sắc cuộc hội thoại 10 câu của Unit {activeUnit.number}. Đánh giá cấu trúc ngữ pháp đạt {evalResultState.grammarScore}%, phát âm đạt {evalResultState.pronunciationScore}%, trôi chảy đạt {evalResultState.fluencyScore}%.</p>
                {evalResultState.suggestedPractice && (
                  <p>📈 <strong>Gợi ý lộ trình:</strong> {evalResultState.suggestedPractice}</p>
                )}
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
        ) : null}

      </div>

      {/* Speaking Footer */}
      <div className="bg-white border-t border-slate-100 py-3.5 px-6 mt-12 text-center text-[10px] text-slate-400 font-bold tracking-wider uppercase flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>Anh ngữ LeeGo - Hotline: 0988.526.585</span>
        <span className="text-slate-500">Everybody Up 4 Student App</span>
      </div>

    </div>
  );
}
