"use strict";
const addBtn = document.querySelector(".add-btn");
const tasksContainer = document.querySelector(".tasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
function saveToStorage(tasks) {
  return localStorage.setItem("tasks",JSON.stringify(tasks));
}
function generatedId() {
  return Date.now();
}
let taskMessage;
function generateHTML() {
    tasksContainer.innerHTML = "";
    tasks.forEach(task => {
        let html = `
        <div class="task">
              <span class="check">
                <input type="checkbox" onchange="todoDone(${task.id})" ${
                    task.status === "COMPLETED" ? "checked" : ""
                }/>
              </span>
              <p class="task-message ${
                  task.status === "COMPLETED" ? "complete" : ""
              }">${task.taskMessage}</p>
              <span class="material-symbols-rounded delete" type="submit" onClick="deleteTask(${
                  task.id
              })" >cancel</span>
              </div>
              `;
        tasksContainer.innerHTML += html;
    });
    document.querySelector(
        ".footer"
    ).innerHTML = `                <h3 class="footer">Your remaining To do: ${tasks.length}</h3>
    `;
    taskMessage = "";
}

addBtn.addEventListener("click", () => {
    taskMessage = document.querySelector("#todo-input").value;
    tasks.push({ taskMessage, id: generatedId(), status: "NOT-COMPLETE" });
    saveToStorage(tasks)
    document.querySelector("#todo-input").value = "";
    generateHTML();
});
function deleteTask(id) {
    let newTasks = tasks.filter(task => task.id !== id);
    tasks = [...newTasks];
    saveToStorage(tasks);
    generateHTML();
}

    
function todoDone(id) {
  tasks = tasks.map((task) => task.id === id? {...task,status: task.status === "NOT-COMPLETE"? "COMPLETED":"NOT-COMPLETE"}:task);
  saveToStorage(tasks);
  generateHTML();
}

generateHTML();