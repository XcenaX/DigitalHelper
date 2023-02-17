module.exports.trigger = (sen) => {
    // если мы находимся на главной странице
    var pageTitle = document.getElementsByTagName("title")[0].textContent;
    if(pageTitle.toLocaleLowerCase().includes("главная")) return true;
    return false;
};
module.exports.resolve = () => new Promise((resolve) => {
  
  resolve("");
});