import readTextFile from "./functions.js"

const defaults = {
    skills: [],
    name: 'Oleg',
    language: 'ru',
    reply: "Извини, не понимаю тебя",
};
  
export default class DigitalAssistant {
    constructor(config = {}) {
        // путь к html файлу помощника (заменить на нужный)
        this.assistantFile = "file:///C:/Users/vlad-/OneDrive/Рабочий стол/Projects/Hackaton2023/DigitalHelper/index.html";
        this.config = { ...defaults, ...config };
        
        this.recognizer = new webkitSpeechRecognition();
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
    say(sentence) {
        const filtered = sentence.replace(/[&\/\\#,+()$~%.'"*?<>{}]/g, '');
        const msg = new SpeechSynthesisUtterance(filtered);
        window.speechSynthesis.speak(msg);
    }
}

document.addEventListener('DOMContentLoaded', function(){
    const assistant = new DigitalAssistant({
        name: "Oleg",
        skills: [
            require("./skills/hi.js"),
            require("./skills/navigate_step1.js"),
        ],        
    })

    assistant.process("Привет")
});