// 2과정 기하 첫 화면. 권 카드는 course2-list.js(사고력 문제은행 「2과정」 탭과 같은 것).
import { course2Html } from "./course2-list.js?v=20261122e";
document.getElementById("books").innerHTML = await course2Html();
