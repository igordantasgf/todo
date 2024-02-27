// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoFilter = document.querySelector("#todo-filter");
const todoList = document.querySelector("#todo-list");

//Funções
const saveTodo = (text) =>{
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3")
  todoTitle.innerText = text
  todo.appendChild(todoTitle)

  const progressBtn = document.createElement('button')
  progressBtn.classList.add('state-todo', 'progress')
  progressBtn.innerText = 'Em progresso'
  todo.appendChild(progressBtn)

  const removeBtn = document.createElement('button')
  removeBtn.classList.add('remove-todo')
  removeBtn.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>'
  todo.appendChild(removeBtn)

  todoList.appendChild(todo)

  todoInput.value = ''
  todoInput.focus()
};

//Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if(inputValue){//salvar todo
    saveTodo(inputValue);
  }
});



