const store = {
  setLocalStorage(menu) {
    return localStorage.setItem("menu", JSON.stringify(menu)); // localStorage에는 배열로 저장이 되어야함. 그래서 JSON.stringify가 필요함!
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu")); //그 문자열을 JSON 형태로 바꿔줘야함
  },
};

export default store;
