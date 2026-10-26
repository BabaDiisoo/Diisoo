/* Diisoo : autres examens d'anglais (TOEFL, TOEIC, Cambridge, Duolingo, PTE).
   Meme moteur que le simulateur IELTS (4 phases, voix, minuteur). Aucune donnee existante n'est modifiee. */
(function () {
  "use strict";
  if (window.DiisooExams) return;
  var $ = function (id) { return document.getElementById(id); };
  var skin = ["#8a5a3c", "#6e4a30", "#a9714b", "#5b3a26"];
  function P(x, y, c, s) { return '<circle cx="' + x + '" cy="' + y + '" r="11" fill="' + skin[s % 4] + '"/><rect x="' + (x - 10) + '" y="' + (y + 12) + '" width="20" height="34" rx="6" fill="' + c + '"/>'; }
  function R(x, y, w, h, f, r) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"' + (r ? ' rx="' + r + '"' : "") + ' fill="' + f + '"/>'; }
  function T(x, y, t, sz, f) { return '<text x="' + x + '" y="' + y + '" font-family="sans-serif" font-size="' + (sz || 14) + '" fill="' + (f || "#333") + '">' + t + "</text>"; }
  function svg(bg, body) { return '<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg">' + R(0, 0, 400, 260, bg) + body + "</svg>"; }
  var SC = {
    office: function () { return svg("#e9eef5", R(0, 190, 400, 70, "#c9b99a") + R(60, 130, 280, 18, "#8b6b45") + R(150, 90, 100, 36, "#2f3a4f", 4) + R(160, 98, 80, 20, "#9fd0f0") + P(90, 140, "#2f5ca3", 0) + P(200, 150, "#c2542d", 1) + P(310, 140, "#2f8f5c", 2) + T(20, 40, "MEETING ROOM", 16, "#445")); },
    library: function () { return svg("#f2e6d0", R(0, 30, 400, 120, "#8b6b45") + R(10, 40, 380, 8, "#5a3f24") + R(10, 80, 380, 8, "#5a3f24") + R(10, 120, 380, 8, "#5a3f24") + R(30, 50, 14, 30, "#c2542d") + R(48, 50, 14, 30, "#2f5ca3") + R(66, 50, 14, 30, "#2f8f5c") + R(200, 90, 14, 30, "#c2542d") + R(120, 175, 160, 14, "#a07a50") + P(160, 150, "#2f5ca3", 0) + P(240, 150, "#8e44ad", 1) + R(145, 168, 28, 10, "#fff") + T(150, 28, "LIBRARY", 16, "#fff")); },
    classroom: function () { return svg("#e8f0e0", R(60, 20, 280, 90, "#2c4a3a", 4) + T(110, 70, "ENGLISH CLASS", 18, "#fff") + R(0, 200, 400, 60, "#c9b99a") + P(80, 150, "#c2542d", 0) + P(160, 150, "#2f5ca3", 1) + P(240, 150, "#2f8f5c", 2) + P(320, 150, "#8e44ad", 3) + R(60, 190, 40, 8, "#8b6b45") + R(140, 190, 40, 8, "#8b6b45") + R(220, 190, 40, 8, "#8b6b45")); },
    market: function () { return svg("#fbeed2", R(0, 190, 400, 70, "#c9a46a") + R(30, 90, 140, 12, "#c2542d") + R(40, 102, 120, 70, "#e8d8b0") + '<circle cx="70" cy="150" r="12" fill="#d9381e"/><circle cx="100" cy="150" r="12" fill="#f0a030"/><circle cx="130" cy="150" r="12" fill="#5aa02c"/>' + R(230, 90, 140, 12, "#2f8f5c") + R(240, 102, 120, 70, "#e8d8b0") + P(210, 165, "#2f5ca3", 0) + P(190, 170, "#c2542d", 2) + T(60, 80, "FRUITS", 13, "#7a3b12")); },
    bus: function () { return svg("#d8e8f5", R(0, 180, 400, 80, "#9a9a9a") + R(40, 80, 220, 90, "#f0b429", 10) + R(55, 92, 40, 30, "#cfe6f5") + R(105, 92, 40, 30, "#cfe6f5") + R(155, 92, 40, 30, "#cfe6f5") + '<circle cx="90" cy="172" r="14" fill="#333"/><circle cx="215" cy="172" r="14" fill="#333"/>' + R(300, 70, 8, 110, "#555") + R(285, 60, 40, 22, "#2f5ca3", 3) + T(290, 76, "BUS", 12, "#fff") + P(340, 160, "#c2542d", 1) + P(365, 165, "#2f8f5c", 3)); },
    kitchen: function () { return svg("#f6eee0", R(0, 175, 400, 85, "#b79b73") + R(40, 120, 320, 55, "#d9c9a8") + R(70, 90, 70, 30, "#aaa", 4) + '<ellipse cx="105" cy="90" rx="35" ry="8" fill="#888"/>' + R(220, 100, 90, 20, "#fff", 4) + '<circle cx="250" cy="96" r="9" fill="#d9381e"/><circle cx="278" cy="96" r="9" fill="#5aa02c"/>' + P(190, 130, "#c2542d", 1) + R(20, 30, 90, 50, "#e8dcc0", 4) + T(30, 60, "RECIPE", 14, "#7a3b12")); },
    beach: function () { return svg("#bfe3f5", R(0, 130, 400, 40, "#3aa6d8") + R(0, 170, 400, 90, "#f0dba0") + '<circle cx="330" cy="50" r="26" fill="#ffd34d"/>' + R(90, 110, 6, 70, "#7a4b22") + '<path d="M50 112 Q93 70 136 112 Z" fill="#d9381e"/>' + P(220, 180, "#2f5ca3", 0) + P(270, 185, "#8e44ad", 2) + P(160, 190, "#c2542d", 3)); },
    shop: function () { return svg("#eef2e8", R(0, 195, 400, 65, "#bdb7a8") + R(30, 60, 100, 135, "#d9c9a8") + R(40, 75, 80, 8, "#8b6b45") + R(40, 110, 80, 8, "#8b6b45") + R(40, 145, 80, 8, "#8b6b45") + R(150, 130, 120, 25, "#8b6b45") + R(150, 155, 8, 40, "#8b6b45") + R(262, 155, 8, 40, "#8b6b45") + P(310, 150, "#c2542d", 1) + P(190, 120, "#2f5ca3", 0) + T(150, 50, "SUPERMARKET", 15, "#445")); },
    gym: function () { return svg("#ece8f5", R(0, 190, 400, 70, "#b9b0c9") + R(60, 150, 100, 10, "#555") + R(50, 135, 14, 40, "#333") + R(156, 135, 14, 40, "#333") + P(110, 105, "#c2542d", 1) + '<ellipse cx="260" cy="170" rx="50" ry="12" fill="#2f8f5c"/>' + P(260, 125, "#2f5ca3", 2) + T(150, 40, "HEALTH CLUB", 16, "#445")); },
    tech: function () { return svg("#e6edf5", R(0, 200, 400, 60, "#c9b99a") + R(110, 90, 180, 100, "#2f3a4f", 6) + R(120, 100, 160, 80, "#9fd0f0") + R(80, 190, 240, 10, "#555") + R(310, 130, 40, 70, "#222", 6) + R(315, 140, 30, 45, "#9fd0f0") + P(60, 150, "#8e44ad", 0) + T(150, 60, "TECHNOLOGY", 16, "#445")); },
    cafe: function () { return svg("#f7e8d4", R(0, 190, 400, 70, "#b79b73") + R(50, 130, 110, 10, "#8b6b45") + R(100, 140, 8, 50, "#8b6b45") + R(240, 130, 110, 10, "#8b6b45") + R(290, 140, 8, 50, "#8b6b45") + R(65, 112, 24, 18, "#fff", 3) + R(260, 112, 24, 18, "#fff", 3) + P(40, 165, "#2f5ca3", 0) + P(190, 165, "#c2542d", 1) + P(370, 165, "#2f8f5c", 3) + R(130, 20, 140, 36, "#c2542d", 6) + T(150, 45, "RESTAURANT", 16, "#fff")); },
    family: function () { return svg("#f6efe0", R(0, 190, 400, 70, "#c9b99a") + R(110, 120, 180, 50, "#a9714b", 8) + P(140, 120, "#c2542d", 0) + P(190, 118, "#2f5ca3", 1) + P(240, 120, "#2f8f5c", 2) + P(165, 150, "#8e44ad", 3) + R(20, 40, 70, 60, "#cfe6f5") + R(300, 50, 80, 8, "#8b6b45")); },
    airport: function () { return svg("#d9ecf8", R(0, 190, 400, 70, "#bdbdbd") + R(30, 100, 140, 70, "#e8dcc0") + T(45, 135, "CHECK-IN", 14, "#333") + P(230, 150, "#2f5ca3", 0) + P(270, 150, "#c2542d", 1) + R(300, 170, 32, 24, "#a33f3f", 4) + R(330, 175, 28, 20, "#2f8f5c", 4) + '<polygon points="250,40 380,70 250,80" fill="#f4f4f4"/>'); }
  };
  var PH = {
    toefl: ["Warm-up Interview", "Campus Life Questions", "Describe the Image", "Independent Opinion"],
    toeic: ["Personal Information", "Respond to Questions", "Describe a Picture", "Express an Opinion"],
    cambridge: ["Part 1 · Interview", "Part 1 · Daily Life", "Part 2 · The Photo", "Part 3 · Discussion"],
    duolingo: ["Warm-up", "Speak About the Topic", "Describe the Image", "Extended Speaking"],
    pte: ["Personal Introduction", "Answer Short Questions", "Describe Image", "Respond to a Situation"]
  };
  var INTRO = "Regarde bien la photo pendant quelques secondes. Tu vas décrire ce que tu vois : les personnes, le lieu et ce qu'elles font. Réponds en phrases complètes.";
  function mk(exam, id, topic, scene, a, b, c, d, lvl) {
    var L = PH[exam];
    return { exam: exam, id: exam + "-" + id, topic: topic, scene: scene, lvl: lvl || "A2", phases: [
      { id: "1a", label: L[0], questions: a }, { id: "1b", label: L[1], questions: b },
      { id: "2a", label: L[2], introFR: INTRO, questions: c }, { id: "2b", label: L[3], questions: d }] };
  }
  var TESTS = [
    mk("toefl", "library", "Campus Library", "library",
      ["What is your name?", "Where are you from?", "What do you study or what do you do?"],
      ["Do you like to study alone or with friends?", "Where do you usually study?", "How do you prepare for an exam?", "What is the most difficult subject for you?"],
      ["What can you see in this picture?", "What do you think the students are doing?"],
      ["Some students prefer to study in a library. Others prefer to study at home. Which do you prefer?", "Why is that better for you?", "Give one example from your own life."]),
    mk("toefl", "course", "Choosing a Course", "classroom",
      ["Can you tell me your name?", "Which city do you live in?", "Why are you learning English?"],
      ["What kind of courses do you enjoy?", "Do you prefer small classes or big classes?", "What do you do when you do not understand a lesson?", "Do you like homework? Why or why not?"],
      ["Describe the people in this classroom.", "What is the teacher probably doing?"],
      ["Is it better to learn from a teacher or from the internet?", "Explain your choice with reasons.", "What advice would you give to a new student?"]),
    mk("toefl", "student-life", "Student Life", "cafe",
      ["Tell me your name and your age.", "What do you like to do in your free time?", "Who is your best friend?"],
      ["Do you like to eat on campus or at home?", "How do you travel to school or to work?", "What do you do on weekends?", "Do you work and study at the same time?"],
      ["What is happening in this picture?", "What are the people talking about, do you think?"],
      ["Do you think students should have a part-time job?", "Why do you think so?", "Tell me about a time you were very busy."]),
    mk("toeic", "office", "Office Meeting", "office",
      ["Please tell me your name.", "What is your job?", "Where do you work?"],
      ["What time does your workday start?", "Do you prefer to work alone or in a team?", "How do you go to work every day?", "What do you usually do at lunch time?"],
      ["Describe this picture in detail.", "What are the people in the picture doing?"],
      ["Do you think meetings are useful at work?", "Explain your opinion with two reasons.", "How can a company make meetings shorter?"]),
    mk("toeic", "business-trip", "Business Trip", "airport",
      ["What is your name?", "What kind of work do you do?", "How long have you worked there?"],
      ["Have you ever travelled for work?", "What do you take with you on a trip?", "Do you prefer to travel by plane or by bus?", "Where would you like to go for a meeting?"],
      ["What can you see in this airport picture?", "What are the travellers going to do next?"],
      ["Is it better to have a meeting online or in person?", "Give reasons for your answer.", "What problems can happen when you travel for work?"]),
    mk("toeic", "customer", "Customer Service", "shop",
      ["Please say your name.", "Do you work with customers?", "What do you sell or what service do you offer?"],
      ["How do you greet a new customer?", "What do you say when a customer is angry?", "How do you give the price of a product?", "What do you say at the end of a sale?"],
      ["Describe what you see in this shop.", "What is the customer doing?"],
      ["What makes good customer service?", "Explain with examples.", "Why do customers leave a shop and never come back?"]),
    mk("cambridge", "family", "Family Weekend", "family",
      ["What is your name?", "Where do you live?", "Who do you live with?"],
      ["What do you like to do at the weekend?", "Do you help at home? What do you do?", "What is your favourite meal?", "How often do you see your family?"],
      ["What can you see in the photo?", "Where are the people, and what are they doing?"],
      ["Do you prefer to spend time with family or with friends?", "Why?", "What can families do together on Sunday?"]),
    mk("cambridge", "shopping", "Shopping Day", "market",
      ["Tell me your name, please.", "Where are you from?", "What do you do every day?"],
      ["Where do you buy your food?", "Do you like shopping? Why or why not?", "What did you buy last week?", "Do you go shopping alone or with someone?"],
      ["Look at the photo. What can you see?", "What do you think they are buying?"],
      ["Do you prefer to shop in a market or in a big shop?", "Why do you prefer it?", "What do you do when something is too expensive?"]),
    mk("cambridge", "beach", "Holiday at the Beach", "beach",
      ["What is your name?", "How old are you?", "What is your favourite place in Senegal?"],
      ["Do you like the sea? Why?", "What do you do on holiday?", "Who do you go on holiday with?", "What do you take to the beach?"],
      ["What can you see in this photo?", "What are the people doing at the beach?"],
      ["Which is better for a holiday, the beach or a big city?", "Tell me why.", "Describe your best holiday."]),
    mk("duolingo", "market", "At the Market", "market",
      ["Say your name.", "Where are you from?", "What do you do?"],
      ["Describe a market you know.", "What fruits and vegetables do you like?", "How do you ask for a lower price?", "Who do you go to the market with?"],
      ["Look at the picture and say what you see.", "What do you think will happen next?"],
      ["Talk about your favourite place to buy food. Say what you buy and why you like it.", "Talk about a time you made a good deal.", "Explain how a market is different from a supermarket."]),
    mk("duolingo", "transport", "Public Transport", "bus",
      ["Tell me your name.", "How old are you?", "Do you work or study?"],
      ["How do you go to work or school?", "Do you like to take the bus? Why?", "How long is your trip every day?", "What do you do on the bus?"],
      ["Describe the picture in a few sentences.", "Who do you see at the bus stop?"],
      ["Talk about the good and bad things about public transport.", "Explain what a city can do to make travel easier.", "Describe a long trip you remember."]),
    mk("duolingo", "cooking", "Cooking at Home", "kitchen",
      ["What is your name?", "Where do you live?", "Who cooks at your home?"],
      ["What is your favourite dish?", "Can you cook? What can you cook?", "What do you eat for breakfast?", "Do you cook for friends?"],
      ["What can you see in this kitchen?", "What is the person doing?"],
      ["Explain how to cook a simple meal you like.", "Talk about a special meal with your family.", "Is it better to cook at home or to eat in a restaurant? Why?"]),
    mk("pte", "health", "Health and Fitness", "gym",
      ["Please introduce yourself.", "Where are you from?", "What do you like to do after work?"],
      ["Do you play any sport?", "How often do you exercise?", "What do you do when you feel tired?", "Why is water important?"],
      ["Describe what you see in the image.", "Why do people go to a place like this?"],
      ["Your friend wants to be healthier but has little time. What advice do you give?", "Explain why sleep matters.", "How can a company help workers stay healthy?"]),
    mk("pte", "technology", "Technology Daily", "tech",
      ["Tell me about yourself.", "What is your job?", "Where do you work or study?"],
      ["What do you use your phone for?", "Do you use a computer every day?", "What app do you use the most?", "Is the internet easy to find in your area?"],
      ["Describe the image in detail.", "What technology can you see?"],
      ["A friend asks you how to use video calls. Explain what to do.", "Talk about one good and one bad thing about phones.", "How can technology help a small business?"]),
    mk("pte", "restaurant", "Local Restaurant", "cafe",
      ["Please say your full name.", "What is your favourite food?", "Where do you usually eat lunch?"],
      ["Do you eat in restaurants?", "What do you order when you go out?", "Do you prefer hot or cold drinks?", "How do you ask for the bill?"],
      ["Describe this restaurant scene.", "What are the waiters and customers doing?"],
      ["You ordered a meal but the wrong dish arrived. What do you say to the waiter?", "Describe the best restaurant you know.", "What makes a good restaurant?"])
    ,mk("toefl", "online", "Online Learning", "tech",
      ["Tell me your name and where you study or work.", "How long have you been learning English?", "What are your goals for the next year?"],
      ["Is learning online as good as learning in a classroom?", "What technology do you use to study?", "Describe a skill you learned recently.", "What distracts you when you study?"],
      ["Describe the image. What is the person doing?", "How can this kind of technology help students?"],
      ["Some people say that universities should be free for everyone. Do you agree or disagree?", "Give two reasons and one example.", "What could be a problem with your opinion?"], "B1"),
    mk("toefl", "city-village", "City or Village Life", "bus",
      ["What is your name and what do you do?", "Where did you grow up?", "Do you plan to stay in your town in the future?"],
      ["What do you like most about the place where you live?", "How do people travel in your city?", "Is it easy to find a job where you live?", "What would you change in your neighbourhood?"],
      ["Describe the scene in the picture.", "What problems might people have in this place?"],
      ["Do you think young people should move to big cities to find work? Why or why not?", "Give examples from your own experience.", "How does life change when people leave their village?"], "B1"),
    mk("toefl", "group-work", "Group Project", "gym",
      ["Please introduce yourself.", "What is your favourite activity after class or work?", "Who inspires you the most?"],
      ["Do you prefer to work in a group or alone?", "What is your role when you work in a team?", "How do you solve a disagreement with a colleague?", "Describe a team project you enjoyed."],
      ["What is happening in the picture?", "How do the people in the picture work together?"],
      ["Is it better to be a leader or a team member? Explain your choice.", "Support your answer with details.", "How can a team become stronger?"], "B1"),
    mk("toeic", "interview", "Job Interview", "office",
      ["Please state your name and your current job.", "How long have you worked in this field?", "Why do you want a new job?"],
      ["What are your main strengths at work?", "Tell me about a difficult situation at work.", "How do you manage your time?", "Where do you see yourself in five years?"],
      ["Describe this picture. Who is speaking and who is listening?", "What do you think they are discussing?"],
      ["Do you think experience is more important than education when you hire someone?", "Explain your opinion with reasons.", "What question would you ask a new employer?"], "B1"),
    mk("toeic", "event", "Planning an Event", "cafe",
      ["What is your name?", "Do you organise events in your work or community?", "What was the last event you attended?"],
      ["What do you need to plan a meeting or a party?", "How do you invite people?", "Who helps you prepare an event?", "What do you do if the place is too small?"],
      ["Describe the place in the picture.", "Would this place be good for a small event? Why?"],
      ["Is it better to organise an event in a restaurant or at the office?", "Give two reasons.", "How can you keep a budget under control?"], "B1"),
    mk("toeic", "refund", "Complaint and Refund", "shop",
      ["Please say your name.", "Have you ever returned something to a shop?", "What do you usually buy online or in a shop?"],
      ["What do you do if a product does not work?", "How do you ask for a refund politely?", "What information do you give a customer service agent?", "How long should a company take to answer a complaint?"],
      ["What can you see in the picture?", "What problem could the customer have?"],
      ["Imagine you bought a phone that stopped working after two days. What do you say to the manager?", "What solution do you want?", "Why is good after-sales service important for a business?"], "B1"),
    mk("cambridge", "birthday", "Birthday Party", "family",
      ["What is your name and how old are you?", "What do you do in your free time?", "Tell me about your family."],
      ["How do you celebrate your birthday?", "Who was at your last party?", "What present would you like to receive?", "Do you prefer a big party or a quiet evening?"],
      ["Describe what is happening in the photo.", "How do you think the people feel?"],
      ["Do you think it is important to celebrate birthdays? Why?", "Tell me about the best party you have been to.", "What can you do if a friend is sad on their birthday?"], "B1"),
    mk("cambridge", "hobbies", "Sports and Hobbies", "gym",
      ["Tell me your name and where you live.", "What sport do you like?", "How often do you practise it?"],
      ["Which hobby would you like to try?", "Do you prefer to play or to watch sport?", "Who do you do sport with?", "How much does it cost to practise your hobby?"],
      ["What can you see in the photo?", "Why do you think these people chose this activity?"],
      ["Is it better to do sport in a club or alone? Explain.", "What can sport teach young people?", "Describe a match or a race that you remember."], "B1"),
    mk("cambridge", "city-trip", "A Trip to the City", "bus",
      ["What is your name?", "Which city do you know best?", "How do you usually travel to the city?"],
      ["What would you do on a day trip to Dakar?", "What do you take with you when you travel?", "Do you prefer to travel with friends or with family?", "Tell me about a trip you want to make."],
      ["Describe the people and the vehicle in the photo.", "Where do you think they are going?"],
      ["Which is better for a long trip, the bus or the car? Give reasons.", "What problems can happen on a journey?", "How can you save money when you travel?"], "B1"),
    mk("duolingo", "memorable", "A Memorable Day", "beach",
      ["Say your name and your age.", "Where do you live?", "What did you do yesterday?"],
      ["Describe a day you will never forget.", "Who was with you that day?", "How did you feel at the end of the day?", "What did you learn from that experience?"],
      ["Describe the picture in as much detail as you can.", "Say what the people might talk about."],
      ["Talk about the best day of your life and why it was special.", "Explain what you would do differently if you could live that day again.", "Give advice to a friend who wants to make good memories."], "B1"),
    mk("duolingo", "tech-friends", "Technology and Friends", "tech",
      ["What is your name?", "What do you do?", "How often do you use your phone?"],
      ["How do you keep in touch with friends who live far away?", "Do you prefer to call or to send a message?", "What apps do you use every day?", "Is it healthy to spend a lot of time online?"],
      ["Look at the picture and describe it.", "What do you think the person is looking at?"],
      ["Talk about the way technology has changed friendships.", "Explain one danger of social media and how to avoid it.", "Describe how you would teach an older person to use a smartphone."], "B1"),
    mk("duolingo", "neighbourhood", "My Neighbourhood", "market",
      ["Please say your name.", "Where do you live in the city or the village?", "Who are your neighbours?"],
      ["What shops are near your house?", "Is your neighbourhood safe and clean?", "What do people do in the evening there?", "How do neighbours help each other?"],
      ["Describe what you see in the picture.", "How is this place different from your neighbourhood?"],
      ["Talk about what makes a good neighbourhood.", "Explain what you would improve if you were the mayor.", "Describe a festival or an event in your area."], "B1"),
    mk("pte", "bus-problem", "Public Transport Problem", "bus",
      ["Please introduce yourself.", "Where do you work or study?", "How do you travel there?"],
      ["Is public transport good in your city?", "What is the biggest problem for travellers?", "How much do you spend on transport each week?", "What would make your journey better?"],
      ["Describe the image in detail.", "What problems could passengers have here?"],
      ["Your bus is always late and you will miss an important meeting. What do you say to your manager?", "Suggest two solutions to the problem.", "Explain how the city can improve its buses."], "B1"),
    mk("pte", "abroad", "Studying Abroad", "airport",
      ["Tell me about yourself.", "What would you like to study?", "Which country would you like to visit?"],
      ["What are the benefits of studying in another country?", "What would be difficult for you abroad?", "How would you stay in touch with your family?", "What documents do you need for a trip abroad?"],
      ["Describe what you see in the image.", "What are the travellers feeling, do you think?"],
      ["A friend is afraid to study abroad. What advice do you give?", "Explain the good and bad sides of living in another country.", "How can a student find a part-time job abroad?"], "B1"),
    mk("pte", "remote-work", "Working from Home", "family",
      ["Please say your full name.", "What is your job?", "Where do you work, at home or in an office?"],
      ["What are the advantages of working from home?", "How do you stay focused at home?", "What tools do you need for remote work?", "Do you miss your colleagues when you work alone?"],
      ["Describe the image in detail.", "What kind of work could this person be doing?"],
      ["Your company wants everyone to work from home two days a week. Give your opinion.", "Explain how to keep good communication in a remote team.", "Describe a typical day of someone who works from home."], "B1")
  ];
  /* Reponses types : description de photo (par scene) et opinion (par test). Servent au pourcentage de precision. */
  var M2A = {
    office: ["In the picture, I can see three people in a meeting room. They are sitting around a table and talking.", "There is a screen on the table and the colleagues are looking at it together.", "The photo shows a business meeting in an office."],
    library: ["In the picture, I can see two students in a library. They are sitting at a desk with books.", "There are many books on the shelves behind them and the students are studying.", "The photo shows a quiet place where people read and learn."],
    classroom: ["In the picture, I can see a classroom with four students. They are sitting at their desks.", "There is a green board at the front with the words English class.", "The photo shows students who are learning English together."],
    market: ["In the picture, I can see a market with fruits and vegetables. There are tomatoes, oranges and green fruits.", "Two people are standing near the stall and they are buying food.", "The photo shows a busy market where people buy and sell."],
    bus: ["In the picture, I can see a yellow bus at a bus stop. There are people waiting for the bus.", "A man and a woman are standing near the stop and they look ready to travel.", "The photo shows public transport in a city."],
    kitchen: ["In the picture, I can see a kitchen. A person is cooking near the table.", "There is a pot on the stove and vegetables on the counter.", "The photo shows someone who prepares a meal at home."],
    beach: ["In the picture, I can see a beach with the sea and a bright sun. Three people are on the sand.", "There is a red umbrella and the people are relaxing.", "The photo shows people on holiday at the beach."],
    shop: ["In the picture, I can see a shop with shelves full of products. A customer is standing near the counter.", "Another person is looking at the products on the shelf.", "The photo shows people who are shopping in a supermarket."],
    gym: ["In the picture, I can see a health club. One person is lifting weights and another is doing exercise on a mat.", "They are practising sport to stay healthy.", "The photo shows people who are exercising in a gym."],
    tech: ["In the picture, I can see a person at a desk with a big computer screen and a phone.", "The person is using technology to work or to study.", "The photo shows a modern workplace with a computer."],
    cafe: ["In the picture, I can see a restaurant. Three people are sitting at tables with cups and plates.", "They are eating, drinking and talking together.", "The photo shows customers in a restaurant."],
    family: ["In the picture, I can see a family at home. Four people are sitting together near a sofa.", "They are smiling and spending time together.", "The photo shows a happy family in their living room."],
    airport: ["In the picture, I can see an airport. Two travellers are standing near the check-in desk with their bags.", "A plane is flying in the sky behind the building.", "The photo shows people who are going to travel."]
  };
  var M2B = {
    "toefl-library": ["I prefer to study in a library because it is quiet and I can focus.", "For example, at home my family talks and I cannot concentrate."],
    "toefl-course": ["I think a teacher is better because he can explain and answer my questions.", "The internet is useful too, but I do not always understand alone."],
    "toefl-student-life": ["I think students should have a part-time job because they learn to manage money.", "However, they must not forget their studies."],
    "toefl-online": ["I agree that universities should be free because education is a right for everyone.", "For example, many talented students cannot pay the fees."],
    "toefl-city-village": ["I think young people should move to the city because there are more jobs.", "However, they can also build a business in their village."],
    "toefl-group-work": ["I think it is better to be a team member because every person has a role.", "A good leader also listens to the team and helps everyone."],
    "toeic-office": ["I think meetings are useful because they help the team share information.", "They should be short and have a clear plan."],
    "toeic-business-trip": ["I think meeting in person is better because we can build trust.", "Online meetings are cheaper and save time."],
    "toeic-customer": ["Good customer service means to listen, to be polite and to solve the problem quickly.", "Customers come back when they feel respected."],
    "toeic-interview": ["I think experience is very important because it shows that you can do the job.", "Education is also useful because it gives you a good base."],
    "toeic-event": ["I think a restaurant is better for an event because the food and the room are ready.", "The office is cheaper but less comfortable."],
    "toeic-refund": ["Good morning, I bought this phone two days ago and it does not work. I would like a refund or a new phone.", "Good after-sales service makes customers trust the company."],
    "cambridge-family": ["I prefer to spend time with my family because they know me well.", "On Sunday we can cook, eat and talk together."],
    "cambridge-shopping": ["I prefer the market because the products are fresh and the prices are lower.", "When something is too expensive, I ask for a discount."],
    "cambridge-beach": ["I think the beach is better for a holiday because it is calm and the air is fresh.", "A big city is exciting but it is noisy."],
    "cambridge-birthday": ["I think it is important to celebrate birthdays because it makes people feel special.", "The best party I went to was with my family and friends."],
    "cambridge-hobbies": ["I think it is better to do sport in a club because you meet people and you have a coach.", "Sport teaches young people discipline and teamwork."],
    "cambridge-city-trip": ["I think the bus is better for a long trip because it is cheaper.", "To save money, we can travel with friends and bring our own food."],
    "duolingo-market": ["My favourite place to buy food is the market near my house.", "I buy fresh vegetables and fish because the quality is good and the prices are fair."],
    "duolingo-transport": ["Public transport is cheap but it is often crowded and slow.", "A city can build more bus lines and respect the timetable."],
    "duolingo-cooking": ["First, I wash the rice and I cook the fish with onions and tomatoes.", "I prefer to cook at home because it is cheaper and healthier."],
    "duolingo-memorable": ["The best day of my life was when I passed my exam and my family was proud of me.", "I would not change anything because it was perfect."],
    "duolingo-tech-friends": ["Technology helps friends to stay in touch, but people can also spend too much time on their phones.", "To avoid problems, we should limit screen time and meet in person."],
    "duolingo-neighbourhood": ["A good neighbourhood is safe, clean and friendly, with shops and schools nearby.", "If I were the mayor, I would improve the roads and the lighting."],
    "pte-health": ["I would advise my friend to walk for twenty minutes every day and to drink water.", "Sleep is important because the body needs rest to stay strong."],
    "pte-technology": ["First, open the app, then press the video button and wait for your friend to answer.", "Phones are useful and fast, but they can distract us."],
    "pte-restaurant": ["Excuse me, I ordered chicken but you brought fish. Could you please change it?", "A good restaurant has tasty food, clean tables and friendly staff."],
    "pte-bus-problem": ["Good morning, my bus was late again and I will miss the meeting. I am very sorry.", "The city can add more buses and publish a clear timetable."],
    "pte-abroad": ["I would tell my friend that studying abroad is a great chance to learn and to meet new people.", "It can be hard because you are far from your family, but you grow stronger."],
    "pte-remote-work": ["I think working from home two days a week is a good idea because it saves time and money.", "To communicate well, the team should have a daily call and use a group chat."]
  };
  var M1 = {
    toefl: ["My name is [nom] and I study English because I want to continue my studies.", "I am from Thiès in Senegal and I live with my family.", "In my free time, I like to read and to study with my friends."],
    toeic: ["My name is [nom] and I work as a [métier] in Thiès.", "I have worked in this job for three years and I like working with customers.", "I start work at eight o'clock and I finish at five."],
    cambridge: ["My name is [nom] and I am [âge] years old. I live in Thiès with my family.", "In my free time I like to listen to music and to play football with my friends.", "I usually go to the market on Saturday with my mother."],
    duolingo: ["My name is [nom] and I am from Senegal. I live in Thiès.", "I work as a [métier] and I like my job.", "Yesterday I went to the market and I cooked dinner for my family."],
    pte: ["My name is [nom] and I am from Senegal. I work as a [métier].", "After work I like to relax, to read and to see my friends.", "I usually have lunch at home with my family."]
  };
  var DEFAULT_MODELS = null;
  function setModels(t) {
    try {
      if (!DEFAULT_MODELS) DEFAULT_MODELS = { "1": MODEL_ANSWERS["1"].slice(), "2a": MODEL_ANSWERS["2a"].slice(), "2b": MODEL_ANSWERS["2b"].slice() };
      var ex = t && TESTS.indexOf(t) >= 0;
      MODEL_ANSWERS["1"] = ex ? M1[t.exam].slice() : DEFAULT_MODELS["1"];
      MODEL_ANSWERS["2a"] = ex ? M2A[t.scene].slice() : DEFAULT_MODELS["2a"];
      MODEL_ANSWERS["2b"] = ex ? (M2B[t.id] || DEFAULT_MODELS["2b"]).slice() : DEFAULT_MODELS["2b"];
    } catch (e) {}
  }
  /* Vraies photos : si photos/examens/<id>.jpg existe, elle remplace le dessin. */
  var PHOTO_OK = {};
  function sonder(t) {
    return new Promise(function (res) {
      if (PHOTO_OK[t.id] !== undefined) return res();
      var urls = ["photos/examens/" + t.id + ".jpg", "photos/examens/scene-" + t.scene + ".jpg"], k = 0, done = false;
      function fin(u) {
        if (done) return; done = true; PHOTO_OK[t.id] = !!u;
        if (u) TEST_PHOTOS[t.id] = '<img src="' + u + '" alt="Photo du test" style="width:100%;max-height:260px;object-fit:cover;border-radius:12px">';
        res();
      }
      function essai() {
        if (k >= urls.length) return fin(null);
        var u = urls[k++], im = new Image();
        im.onload = function () { fin(u); }; im.onerror = essai; im.src = u;
      }
      setTimeout(function () { fin(null); }, 3000);
      essai();
    });
  }
  var EXAMS = [["ielts", "IELTS"], ["toefl", "TOEFL"], ["toeic", "TOEIC"], ["cambridge", "Cambridge"], ["duolingo", "Duolingo"], ["pte", "PTE"]];
  var NAMES = { ielts: "IELTS Life Skills A1", toefl: "TOEFL Speaking", toeic: "TOEIC Speaking", cambridge: "Cambridge A2/B1 Speaking", duolingo: "Duolingo English Test", pte: "PTE Academic Speaking" };
  TESTS.forEach(function (t) { try { TEST_PHOTOS[t.id] = SC[t.scene](); } catch (e) {} });
  var cur = "ielts";
  try { var sv = localStorage.getItem("diisoo_exam"); if (sv && NAMES[sv]) cur = sv; } catch (e) {}
  function list(ex) { return TESTS.filter(function (t) { return t.exam === ex; }); }
  function chipCls(on) { return "px-3 py-1.5 rounded-full text-[11px] font-bold border transition " + (on ? "bg-[#C2542D] border-[#E1693F] text-white" : "bg-[#0B0F1C] border-[#1E2740] text-[#A69C86]"); }
  function setExam(ex) {
    cur = ex;
    try { localStorage.setItem("diisoo_exam", ex); } catch (e) {}
    try {
      if (ex === "ielts") { if (currentTest && /^[a-z]+-/.test(currentTest.id) && TESTS.some(function (t) { return t.id === currentTest.id; })) currentTest = TEST_BANK[0]; }
      else { var l = list(ex); if (!l.some(function (t) { return currentTest && t.id === currentTest.id; })) currentTest = l[0]; }
    } catch (e) {}
    window.renderTestPicker();
  }
  function ui() {
    var box = $("test-topic-buttons"); if (!box) return;
    var old = $("autres-examens"); if (old) old.style.display = "none";
    var tabs = $("exam-tabs");
    if (!tabs) { tabs = document.createElement("div"); tabs.id = "exam-tabs"; tabs.className = "flex flex-wrap justify-center gap-1.5"; box.parentNode.insertBefore(tabs, box); }
    tabs.innerHTML = "";
    EXAMS.forEach(function (e) {
      var b = document.createElement("button"); b.type = "button"; b.className = chipCls(e[0] === cur); b.textContent = e[1];
      b.onclick = function () { setExam(e[0]); }; tabs.appendChild(b);
    });
    var lab = $("test-phase-label"), top = $("test-topic-label");
    if (cur === "ielts") { window.__examList = null; if (top && /^Simulateur /.test(top.textContent)) top.textContent = "Simulateur IELTS Life Skills A1"; return; }
    var l = list(cur); window.__examList = l;
    if (top && /^Simulateur /.test(top.textContent)) top.textContent = "Simulateur " + NAMES[cur];
    if (lab && /tests? (complets?)?/.test(lab.textContent) && !/^Phase/.test(lab.textContent)) lab.textContent = l.length + " tests complets";
    var seen = {}; try { (JSON.parse(localStorage.getItem("diisoo_tests") || "[]") || []).forEach(function (h) { if (h && h.topic) seen[h.topic] = 1; }); } catch (e) {}
    box.innerHTML = "";
    l.forEach(function (t, idx) {
      var verrou = idx >= 1 && !aAcces("premium");
      var active = currentTest && currentTest.id === t.id;
      var b = document.createElement("button");
      b.className = "w-full text-left px-4 py-3 rounded-xl text-sm font-semibold border transition " + (active ? "bg-[#C2542D] border-[#E1693F] text-white" : "bg-[#141A2B] border-[#1E2740] text-[#C9BFA8]");
      b.textContent = (verrou ? "⭐ " : "") + (seen[t.topic] ? "✅ " : "") + "Test : " + t.topic + " · " + t.lvl;
      b.onclick = verrou ? function () { toast("Ce test est réservé aux abonnés Premium."); openPremium(); }
        : function () { currentTest = t; window.renderTestPicker(); runTest(); };
      box.appendChild(b);
    });
  }
  var orp = window.renderTestPicker;
  if (typeof orp !== "function") return;
  window.renderTestPicker = function () { var r = orp.apply(this, arguments); try { ui(); } catch (e) { console.warn("[diisoo] examens", e); } return r; };
  try { var tile = document.querySelector('button[onclick="startTestSimulation()"] p'); if (tile) tile.textContent = "IELTS, TOEFL, TOEIC, Cambridge, Duolingo, PTE"; } catch (e) {}
  var ort = window.runTest;
  if (typeof ort === "function") {
    window.runTest = async function () {
      var t = null; try { t = currentTest; } catch (e) {}
      setModels(t);
      try { if (t && TESTS.indexOf(t) >= 0) await sonder(t); } catch (e) {}
      return ort.apply(this, arguments);
    };
  }
  window.DiisooExams = { version: 3, tests: TESTS.length };
})();
