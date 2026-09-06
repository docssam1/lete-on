import { boardSvg } from "./render.js?v=shape-transform-5";
import { icon } from "./ui-icons.js?v=shape-transform-5";
import { activityCopy } from "./activity-copy.js?v=shape-transform-5";
import { neutralPose, setPose, posedPoints, poseDiagnosis } from "./manipulation.js?v=shape-transform-5";

export function manipulationController({ board, controls, readout, check, language, onCheck, onEdit }) {
  const text = activityCopy(language);
  let problem, pose = neutralPose(), drag = null, locked = false;
  const pointAt = event => {
    const box = board.getBoundingClientRect();
    return [(event.clientX-box.left) * 100/box.width, (event.clientY-box.top) * 100/box.height];
  };
  function draw() {
    const points = posedPoints(problem,pose);
    board.innerHTML = boardSvg(problem,points,{label:text.myShape});
    if (problem.operation.kind === "rotate") {
      const [x,y] = points[1];
      board.querySelector("svg").insertAdjacentHTML("beforeend",`<circle class="turn-handle" cx="${x}" cy="${y}" r="4.5"/>`);
    }
    board.dataset.dx = String(pose.dx); board.dataset.dy = String(pose.dy); board.dataset.angle = String(pose.angle);
    const angle = pose.angle === 270 ? -90 : pose.angle;
    readout.textContent = problem.operation.kind === "rotate" ? (angle ? `${text[angle < 0 ? "counterTurn" : "turn"]} ${Math.abs(angle)}°` : "0°") :
      [pose.dx ? text[pose.dx > 0 ? "right":"left"].replace("1",String(Math.abs(pose.dx)/10)) : "",
       pose.dy ? text[pose.dy > 0 ? "down":"up"].replace("1",String(Math.abs(pose.dy)/10)) : ""].filter(Boolean).join(" · ") || "0";
    controls.querySelectorAll("button[data-move]").forEach(button => {
      const candidate = changed(button.dataset.move);
      button.disabled = locked || JSON.stringify(candidate) === JSON.stringify(pose);
    });
  }
  function changed(action) {
    const next = {...pose};
    if (action === "left") next.dx -= 10;
    if (action === "right") next.dx += 10;
    if (action === "up") next.dy -= 10;
    if (action === "down") next.dy += 10;
    if (action === "ccw") next.angle -= 90;
    if (action === "cw") next.angle += 90;
    return setPose(problem,next);
  }
  function update(next) {
    if (locked || JSON.stringify(next) === JSON.stringify(pose)) return;
    pose = next; onEdit(); draw();
  }
  function submit() { if (problem && !locked) onCheck(poseDiagnosis(problem,pose),{...pose}); }
  function stopDrag(event) {
    if (!drag || (event && event.pointerId !== drag.id)) return;
    if (board.hasPointerCapture(drag.id)) board.releasePointerCapture(drag.id);
    drag = null; board.classList.remove("dragging");
  }
  board.addEventListener("pointerdown",event => {
    if (locked || !problem || event.button !== 0 || !event.isPrimary) return;
    const point = pointAt(event);
    if (problem.operation.kind === "rotate" && Math.hypot(point[0]-50,point[1]-50) < 8) return;
    board.focus({preventScroll:true}); event.preventDefault();
    drag = { id:event.pointerId, point, pose:{...pose} };
    board.setPointerCapture(event.pointerId); board.classList.add("dragging");
  });
  board.addEventListener("pointermove",event => {
    if (!drag || event.pointerId !== drag.id || locked) return;
    const point = pointAt(event), next = {...drag.pose};
    if (problem.operation.kind === "translate") {
      next.dx += point[0]-drag.point[0]; next.dy += point[1]-drag.point[1];
    } else {
      const start = Math.atan2(drag.point[1]-50,drag.point[0]-50);
      const finish = Math.atan2(point[1]-50,point[0]-50);
      next.angle += (finish-start)*180/Math.PI;
    }
    update(setPose(problem,next));
  });
  for (const name of ["pointerup","pointercancel","lostpointercapture"]) board.addEventListener(name,stopDrag);
  board.addEventListener("keydown",event => {
    if (locked || !problem) return;
    const actions = problem.operation.kind === "rotate" ? {ArrowLeft:"ccw",ArrowRight:"cw"} :
      {ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down"};
    if (actions[event.key]) { event.preventDefault(); update(changed(actions[event.key])); }
    else if (event.key === "Enter") { event.preventDefault(); submit(); }
  });
  controls.addEventListener("click",event => {
    const button = event.target.closest("button[data-move]");
    if (button && !locked) update(changed(button.dataset.move));
  });
  check.addEventListener("click",submit);
  return {
    mount(item) {
      stopDrag(); problem = item; pose = neutralPose(); locked = false;
      const rotation = problem.operation.kind === "rotate";
      const buttons = rotation ? [["ccw","retry"],["cw","clockwise"]] : [["left","back"],["up","up"],["down","down"],["right","next"]];
      controls.innerHTML = buttons.map(([name,graphic]) => `<button type="button" class="icon-button" data-move="${name}" title="${text[name]}" aria-label="${text[name]}">${icon(graphic)}</button>`).join("");
      board.setAttribute("aria-label",text.myShape); board.setAttribute("aria-disabled","false");
      board.dataset.kind = problem.operation.kind;
      check.innerHTML = icon("check") + `<span>${text.check}</span>`; check.disabled = false;
      draw();
    },
    lock() {
      locked = true; stopDrag(); check.disabled = true;
      board.setAttribute("aria-disabled","true");
      controls.querySelectorAll("button").forEach(button => {button.disabled = true;});
    },
    reset() { stopDrag(); problem = null; board.replaceChildren(); }
  };
}
