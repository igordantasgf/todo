// declaração explícita do API
const API_IP = 'https://'+ 'todo-api-kohl-tau.vercel.app';
// const API_IP = 'http://localhost:8000'

// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
let filterState = NaN; // Estado atual do filtro
var currentTodo = Object.create(null); // Armazenamento em memória dos TODO's atuais


//
//Funções
//__________________________________________________________________________________//

const saveTodo = (text, status, id) =>{// Salvar TODO no display
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

const switchState = (button, text, message) =>{ // Alterar estado do TODO
  id = findValueWithKey(currentTodo, message);
  switch(text){
    case "progress":
      button.classList.replace('progress','done');
      button.innerText = 'Pronto';
      currentTodo[id] = ([message, 'Pronto']);
      fetchAndUpdateStatus(id,'Pronto'); // Atualização no BD via API
      break
    case  "done":
      button.classList.replace('done','progress');
      button.innerText = 'Em progresso';
      currentTodo[id] = ([message, 'Em progresso']);
      fetchAndUpdateStatus(id,'Em progresso');
      break;
  }
}

const filterTodo = (button, text) =>{ // Filtrando display por status dos TODO's
  const todoItems = todoList.querySelectorAll('.todo');
  text = text.replace('filter', '');
  buttonList = document.querySelectorAll('.state-filter');

  if(filterState == text){// Modificação de botões de filtro
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

  if(filterState == text){// Modificação do display
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

function findValueWithKey(dictionary, targetKey) {// função extra para achar valores no dicionario
  for (const[key, value] of Object.entries(dictionary)) {
    if(dictionary[key][0].trim() === targetKey.trim()){
      return key
    }
  };
}


//
// API Calls
//__________________________________________________________________________________//

const fetchAndDisplayTodos = () => {// display de todos os TODO's do bd
  const endIp = API_IP+'/mensagens'
  console.log(endIp);
  fetch(endIp)
    .then(response => response.json())
    .then(data => {
      mensagens = data.mensagens;
      mensagens.forEach(mensagem => {// para cada item no JSON, convoca a função básica de criar um TODO
        saveTodo(mensagem.message, mensagem.status, mensagem.id);
      });// ps: ao contrário da inserção normal, o status "Em progresso" não é padrão, então é dado como parâmetro pra função
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

const fetchAndUpdateStatus = (id, newStatus) => {//Atualização do status de um TODO no BD
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

const fetchAndDeleteTodo = (message) => {// Remover um TODO do BD
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

//
// Eventos
//__________________________________________________________________________________//

document.addEventListener("DOMContentLoaded", () => {// Ação ao incializar a página: 
  fetchAndDisplayTodos(); // consulta + display de todos os TODO's no BD
});

todoForm.addEventListener("submit", (e) => {// Inserir TODO no display
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

  if(targetEl.closest('.remove-todo')){ // Botão de remover TODO
    var message = parentEl.innerText;
    parentEl.remove(); // remoção visual
    fetchAndDeleteTodo(message.replace("Em progresso", '').replace("Pronto", ''));
  }

  if(targetEl.closest('.state-todo')){// Mudança do estado do TODO
    let btnState = targetEl.classList[1];
    const todoDiv = targetEl.closest('.todo');
    const h3Element = todoDiv.querySelector('h3').textContent;
    switchState(targetEl, btnState, h3Element);
  }

  if(targetEl.closest('.state-filter')){// Filtro de TODO's por status
    let btnState = targetEl.classList[1];
    filterTodo(targetEl, btnState)
  }

})


