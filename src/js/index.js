// step1 요구사항 구현을 위한한 전략

// TODO 메뉴 추가
// [x]에스프레소 메뉴에 새로운 메뉴를 확인 버튼 또는 엔터키 입력으로 추가한다.
// [x]추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
// [x]총 메뉴 갯수를 count하여 상단에 보여준다.
// [x]메뉴가 추가되면, input은 빈 값으로 초기화한다.
// [x]사용자 입력값이 빈 값이라면 추가되지 않는다.

// TODO 메뉴 수정
// [x]메뉴 수정시 브라우저에서 제공하는 prompt 인터페이스를 활용한다.
// [x]메뉴의 수정 버튼을 눌러 메뉴 이름 수정할 수 있다.

// TODO 메뉴 삭제
// [x]메뉴 삭제 버튼을 이용하여 메뉴 삭제할 수 있다.
// [x]메뉴 삭제시 브라우저에서 제공하는 confirm 인터페이스를 활용한다.
// [x]총 메뉴 갯수를 count하여 상단에 보여준다.
//--------------------------------------------------------------------------------------------------

// step2 TODO localStorage Read & Write
// (x)localStorage에 데이터를 저장한다.
//  - (x)메뉴를 추가할 때
//  - (x)메뉴를 수정할 때
//  - (x)메뉴를 삭제할 때
// (x)localStorage에 있는 데이터를 읽어온다.

// TODO 카테고리별 메뉴판 관리
// [x]에스프레소 메뉴판 관리
// [x]프라푸치노 메뉴판 관리
// [x]블렌디드 메뉴판 관리
// [x]티바나 메뉴판 관리
// [x]디저트 메뉴판 관리

// TODO 페이지 접근시 최초 데이터 Read & Rendering
// [x]페이지에 최초로 로딩될 떄 localStorage에 에스프레소 메뉴를 읽어온다.
// [x]에스프레소 메뉴를 페이지에 그려준다.

// TODO 품절 상태 관리
// [x]품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 sold-out class를 추가하여 상태를 변경한다.
// [x]품질 버튼을 추가한다.
// [x]품질 버튼을 클릭하면 localStorage에 상태값이 저장된다.
// [x]클릭이벤트시 가장 가까운 li태그의 class속성 값에 sold-out을 추가한다.

//-----------------------------------------------------------------------------

// step3

// TODO 서버 요청 부분
// [x]웹 서버를 띄운다.
// [x]서버에 새로운 메뉴명이 추가될 수 있도록 요청한다.
// [x]서버에 카테고리별 메뉴리스트를 불러온다.
// [x]서버에 메뉴가 수정될 수 있도록 요청한다.
// [x]서버에 메뉴의 품절상태를 toggle할 수 있도록 요청한다.
// [x]서버에 메뉴가 삭제될 수 있도록 요청한다.

// TODO 리펙터링 부분
// [x]localStorage에 저장하는 로직은 지운다.
// [x]fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

// TODO 사용자 경험
// [x]API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
// [x]중복되는 메뉴는 추가할 수 없다.

//오늘의 회고
//1. 웹서버 연동
//2. BASE_URL 웹 서버 변수명 먼저 선언
//3. 비동기 처리하는데 해당하는 부분이 어디인지 확인하고, 웹서버에 요청하게끔 코드 짜기
//4. 서버에 요청한 후 데이터를 받아서 화면에 렌더링 하기
//5. 리펙터링
// - localStrage 부분 지우기
// - API 폴더 따로 진행
// - 페이지 렌더링 관련 중복 제거
// - 서버 요청 할 떄 option 객체
// - 카테고리 버튼 클릭 시 콜백함수 분리
//6. 사용자 경험 부분

import { $ } from "./utils/dom.js";
import store from "./store/index.js";
import MenuApi from "./api/index.js";

function App() {
  // 상태 = 변할 수 있는 데이터, 이 앱에서 변하는 것이 무엇인가 - 메뉴명
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = "espresso"; // 기본 default값을 espresso로 화면 첫화면이 espresso화면으로 된다.
  this.init = async () => {
    //맨처음 실행했을 떄 카테고리별로 메뉴를 불러와주는 작업
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    initEventListeners(this.menu[this.currentCategory]);
  };

  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    const template = this.menu[this.currentCategory]
      .map((menuItem) => {
        //map은 배열로 들어간 menu를 하나하나 순회하면서 return한 값들을 모아서 또 하나의 새로운 배열로 만듦!
        return ` 
        <li data-menu-id="${
          menuItem.id
        }" class="menu-list-item d-flex items-center py-2"> 
            <span class="w-100 pl-2 menu-name ${
              menuItem.isSoldOut ? "sold-out" : ""
            }">${menuItem.name}</span>
            <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
            >
                품절
            </button>
            <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
            >
                수정
            </button>
            <button
                type="button"
                class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
            >
                삭제
            </button>
        </li>`;
      })
      .join(""); // join을 사용해야 ["<li>~</li>", "<li></li>"] 이렇게 배열로된 것이
    // <li>~</li>", "<li></li>하나의 마크업으로 사용가능하다

    //innerHTML은 새롭게 만든 것을 기존거에 덮어쓰여져 기존것이 없어진다.
    //-> insertAdjacentHTML을 써야한다!
    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length; //최대한 html에 있는 명과 일치시키면 가독성이 좋아진다!
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const addMenuName = async () => {
    if ($("#menu-name").value === "") {
      // 값이 빈칸일 때
      alert("값을 입력해주세요.");
      return; //return을 해줘야 뒷 부분이 실행이 안돼서 추가가안된다!
    }

    const duplicatedItem = this.menu[this.currentCategory].find(
      (menuItem) => menuItem.name === $("#menu-name").value
    );
    console.log(duplicatedItem);
    if (duplicatedItem) {
      alert("이미 등록된 메뉴입니다. 다시 입력해주세요.");
      $("#menu-name").value = "";
      return;
    }
    //엔터 입력했고, input에 값이 있으면 실행
    const menuName = $("#menu-name").value;
    await MenuApi.createMenu(this.currentCategory, menuName);

    render();
    $("#menu-name").value = ""; // 메뉴가 추가되면, input은 빈 값으로 초기화한다.
  };
  // 1. ul태그에 이벤트 위임을한다
  const updateMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId; // li태그에 data-mene-id 라고 속성을 줬기 떄문에 dataset으로 불러올 수 있음.
    //현재 e.target을 classList 배열형태로 가지고오고 그것이 수정버튼일 때만
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    //현재 e.target인 수정버튼의 가까운 상위요소 li로 가서 그 li안의 menu-name의 text값을 가져온다.
    const editMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    await MenuApi.updateMenu(this.currentCategory, editMenuName, menuId);
    render();
  };

  const removeMenuName = async (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      render();
    }
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    render();
  };

  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      // 해당 클래스가 있는지 확인하는 if문
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      //새롭게 받아온 데이터들을 메뉴에 추가해주고 렌더링!
      render();
    }
  };

  const initEventListeners = () => {
    //form태그가 자동으로 전솔되는 걸 막아준다.
    $("#menu-list").addEventListener("click", (e) => {
      // TODO 메뉴 수정
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }
      // TODO 메뉴 삭제
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-submit-button").addEventListener("click", addMenuName);
    //메뉴의 이름을 입력받아서 e.key가 엔터일 때 값을 출력한다.
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        //엔터값이 아닐 떄 리턴을 해줘야 엔터아닌 다른 값들을 입력했을 때 밑 alert창을 실행하지않음.
        return;
      }
      addMenuName();
    });

    $("nav").addEventListener("click", changeCategory);
  };
}

const app = new App(); // Arrow function에서 this를 사용할 경우 window 객체를 가리킨다는 것을 새롭게 알았습니다! 또한, new 키워드 사용은 function이나 class로 부터 객체를 만들어내는 문법이라는 것을 알았습니다!
app.init();

// localStorage에 데이터를 저장하여 새로고침해도 데이터가 남아있게 한다.
// 에스프레소, 프라푸치노, 블렌디드, 티바나, 디저트 각각의 종류별로 메뉴판을 관리할 수 있게 만든다.
// 페이지에 최초로 접근할 때는 에스프레소 메뉴가 먼저 보이게 한다.
// 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 sold-out class를 추가하여 상태를 변경한다.
// 품절 상태 메뉴의 마크업
