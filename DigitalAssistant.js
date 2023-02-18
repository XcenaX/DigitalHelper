// Нужно вынести в отдельный файл
//import { PUBLIC_KEY, PRIVATE } from "./env.js";
const PUBLIC_KEY = "BJa3I1_xBoM-ClXcJovm2Xyeo3EvdCP61ANrvXE0_Beey4yFllJ4VZ1eopBHL0DbwMWDNGg5XWAyY4BFTlpTDD4"
const PRIVATE_KEY = "GN1_gOI8PrZtx3hr4P_fCTSNywBlvabSdzCCoLWrM_E"

console.log("PUBLIC_KEY:", PUBLIC_KEY);

const defaults = {
    skills: [],
    name: 'Oleg',
    language: 'ru',
    reply: "Извини, не понимаю тебя",
};

const skills = [
    {
        "Hi": {
            resolve: () => new Promise((resolve) => {
                resolve("Привет, я цифровой помощник!");
            }),
            trigger: function(){
                return sen.toLowerCase().includes("привет");
            }
        }
    },
    {
        "NavigateStep1": {
            resolve: () => new Promise((resolve) => {
                resolve("Для начала тебе нужно создать проект. Для этого для начала нажми на кнопку 'Мои Проекты'");
            }),
            trigger: function(){
                var pageTitle = document.getElementsByTagName("title")[0].textContent;
                if(pageTitle.toLocaleLowerCase().includes("главная")) return true;
                return false;
            }
        }
    }
]

const chatComponentId = "chat";
  
class DigitalAssistant {
    constructor(config = {}) {
        // путь к html файлу помощника (заменить на нужный)
        this.assistantFile = "file:///C:/Users/vlad-/OneDrive/Рабочий стол/Projects/Hackaton2023/DigitalHelper/index.html";
        
        // id елементов подсказок для каждой страницы
        this.guideBlocks = {
            "mainPage": ["mainPageGuideBlock1", "mainPageGuideBlock2", "mainPageGuideBlock3", "mainPageGuideBlock4", "mainPageGuideBlock5", "mainPageGuideBlock6"],
            "projectsPage": ["projectsPageGuideBlock1"],            
        }

        this.config = { ...defaults, ...config };
        
        // распознавание голоса
        this.recognizer = new SpeechRecognition();
        this.recognizer.lang = this.config.language;
        this.recognizer.addEventListener('end', () => {
        this.recognizer.start();
        });
        this.recognizer.addEventListener('result', (instance) => {
        const transcript = Array.from(instance.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .map(str => str.toLowerCase())[0];
        const words = transcript.split(' ');
        if (words[0] === this.config.name.toLocaleLowerCase()) {
            this.process(words.slice(1).join(' '));
        }
        });
    }
    start() {
        this.recognizer.start();
        
        if ('PushManager' in window) { 
            Notification.requestPermission();
        }
        
        // добавление html помощника на страницу
        var html = readTextFile(this.assistantFile); 
        var div = document.createElement('div');
        div.innerHTML = html.trim();
        document.getElementsByTagName("body")[0].append(div);
    }
    process(sentence) {
        for (const skill of this.config.skills)
        if (skill.trigger(sentence))
            return skill.resolve(sentence).then(s => this.say(s));
        return this.say(this.config.reply);
    }

    addMessageToChat(message){
        var chatElement = document.getElementById(chatComponentId);   
        messageElement = document.createElement("div");
        messageElement.innerHTML = ```
        html сообщения
        
        ```
        chatElement.appendChild(messageElement);
    }

    say(sentence) {
        const filtered = sentence.replace(/[&\/\\#,+()$~%.'"*?<>{}]/g, '');
        const msg = new SpeechSynthesisUtterance(filtered);
        addMessageToChat(msg);
        window.speechSynthesis.speak(msg);
    }

    // для каждой страницы будет свой набор подсказок
    startGuide(page){
        if(this.guideBlocks[page] == undefined){
            return
        }
        for(var i = 0; i < this.guideBlocks[page].length; i++){
            
        }        
    }
}

document.addEventListener('DOMContentLoaded', function(){
    const assistant = new DigitalAssistant({
        name: "Oleg",
        skills: skills,        
    })

    assistant.start();
    assistant.process("Привет");
});