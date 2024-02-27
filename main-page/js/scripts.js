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

const switchState = (button, text) =>{
  console.log(text);
  switch(text){
    case "progress":
      button.classList.replace('progress','done');
      button.innerText = 'Pronto';
      break
    case  "done":
      button.classList.replace('done','progress');
      button.innerText = 'Em progresso';
      break;
  }
}

const filterTodo = (button, text) =>{
  const todoItems = todoList.querySelectorAll('.todo');
  text = text.replace('filter', '');

  switch(text){
    case 'progress':
      
  }
  

  //seleção de itens
  todoItems.forEach(item => {
    stateBtn = item.querySelector('.state-todo');
    console.log("State do botao:", stateBtn.classList[1]);
    if(stateBtn.classList[1] == text){
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }

  });
}

//Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if(inputValue){//salvar todo
    saveTodo(inputValue);
  }
});

document.addEventListener("click", (e)=>{
  const targetEl = e.target
  const parentEl = targetEl.closest("div");

  if(targetEl.closest('.remove-todo')){
    parentEl.remove();
  }

  // Mudança do estado da tarefa
  if(targetEl.closest('.state-todo')){
    let btnState = targetEl.classList[1];
    switchState(targetEl, btnState);
  }

  if(targetEl.closest('.state-filter')){
    let btnState = targetEl.classList[1];
    filterTodo(targetEl, btnState)
  }

})


