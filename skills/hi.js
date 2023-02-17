module.exports.trigger = (sen) => {
    return sen.toLowerCase().includes("привет");
    // triggers = ["привет", "как дела", "помоги", "помочь", "помощь"];
    // for(var i = 0; i < triggers.length; i++){
    //     if(sen.includes(triggers[i])) return true;        
    // }
    // return false;
};
module.exports.resolve = () => new Promise((resolve) => {
  
  resolve("Привет, я цифровой помощник!");
});