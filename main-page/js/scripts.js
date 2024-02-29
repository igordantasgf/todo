const API_IP = window.apiUrl;
console.log(API_IP);

// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoFilter = document.querySelector("#todo-filter");
const todoList = document.querySelector("#todo-list");
let filterState = NaN;
var currentTodo = Object.create(null);

//Funções
const saveTodo = (text, status, id) =>{
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3")
  todoTitle.innerText = text
  todo.appendChild(todoTitle)

  const progressBtn = document.createElement('button')
  if (status=="Em progresso"){
    progressBtn.classList.add('state-todo', 'progress')
    progressBtn.innerText = 'Em progresso'
    todo.appendChild(progressBtn)
  }else{
    progressBtn.classList.add('state-todo', 'done')
    progressBtn.innerText = 'Pronto'
    todo.appendChild(progressBtn)
  }
  
  const removeBtn = document.createElement('button')
  removeBtn.classList.add('remove-todo')
  removeBtn.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>'
  todo.appendChild(removeBtn)

  todoList.appendChild(todo)

  if(id!=0){ 
    currentTodo[id] = ([text, status]);
  }

  todoInput.value = ''
  todoInput.focus()
};

const switchState = (button, text, message) =>{
  id = findValueWithKey(currentTodo, message);
  switch(text){
    case "progress":
      button.classList.replace('progress','done');
      button.innerText = 'Pronto';
      currentTodo[id] = ([message, 'Pronto']);
      fetchAndUpdateStatus(id,'Pronto');
      break
    case  "done":
      button.classList.replace('done','progress');
      button.innerText = 'Em progresso';
      currentTodo[id] = ([message, 'Em progresso']);
      fetchAndUpdateStatus(id,'Em progresso');
      break;
  }
}

const filterTodo = (button, text) =>{
  const todoItems = todoList.querySelectorAll('.todo');
  text = text.replace('filter', '');
  buttonList = document.querySelectorAll('.state-filter');

  if(filterState == text){
    button.style.backgroundColor = "#ffffff";
  }else{
    switch(text){
      case "progress":
        button.style.backgroundColor = "#ffcb46";
        buttonList[1].style.backgroundColor = "#ffffff";
        break;
      case "done":
        button.style.backgroundColor = "#80e265";
        buttonList[0].style.backgroundColor = "#ffffff";
        break;
      }
  }

  if(filterState == text){
    todoItems.forEach(item => {
      item.style.display = 'flex';
    });
    filterState = NaN;
  }else{
    todoItems.forEach(item => {
      stateBtn = item.querySelector('.state-todo');
      if(stateBtn.classList[1] == text){
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
    filterState = text;
  }
}

function findValueWithKey(dictionary, targetKey) {
  for (const[key, value] of Object.entries(dictionary)) {
    if(dictionary[key][0].trim() === targetKey.trim()){
      return key
    }
  };
}

// API Calls
const fetchAndDisplayTodos = () => {// display de todos os todo's do bd
  const endIp = API_IP+'/mensagens'
  console.log(endIp);
  fetch(endIp)
    .then(response => response.json())
    .then(data => {
      mensagens = data.mensagens;
      mensagens.forEach(mensagem => {
        saveTodo(mensagem.message, mensagem.status, mensagem.id);
      });
    })
    .catch(error => console.error('Error:', error));
};

const fectchAndInsertTodo = (text) => {//inserir novo todo no bd
  const endIp = API_IP+'/mensagens';
  fetch(endIp, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: text,
    }),
  })
  .then(response => response.json())
  .then(data => {
    atributos = data.inserido;
    currentTodo[atributos.id] = ([atributos.message, atributos.status])
  })
  .catch(error => console.error('Error:', error));
};

const fetchAndUpdateStatus = (id, newStatus) => {
  const endIp = API_IP+'/mensagens/'+String(id)+'/status'
  fetch(endIp, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: newStatus
    }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to update TODO status');
    }
    
  })
  .catch(error => console.error('Error:', error));
};

const fetchAndDeleteTodo = (message) => {//remover um todo do bd
  id = findValueWithKey(currentTodo, message);
  const endIp = API_IP+'/mensagens/'+String(id)
  fetch(endIp, {
    method: 'DELETE',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to delete TODO item');
    }
    delete currentTodo[id];
  })
  .catch(error => console.error('Error:', error));
};


//Eventos
document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayTodos();
});

todoForm.addEventListener("submit", (e) => {//inserir todo
  e.preventDefault();

  const inputValue = todoInput.value;

  if(inputValue){//salvar todo
    saveTodo(inputValue, "Em progresso", 0);
    fectchAndInsertTodo(inputValue);
  }
});

document.addEventListener("click", (e)=>{//ações de click
  const targetEl = e.target
  const parentEl = targetEl.closest("div");

  if(targetEl.closest('.remove-todo')){
    var message = parentEl.innerText;
    parentEl.remove();
    fetchAndDeleteTodo(message.replace("Em progresso", '').replace("Pronto", ''));
  }

  if(targetEl.closest('.state-todo')){
    let btnState = targetEl.classList[1];
    const todoDiv = targetEl.closest('.todo');
    const h3Element = todoDiv.querySelector('h3').textContent;
    switchState(targetEl, btnState, h3Element);
  }

  if(targetEl.closest('.state-filter')){
    let btnState = targetEl.classList[1];
    filterTodo(targetEl, btnState)
  }

})


