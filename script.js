/* 입력에 대한 이벤트 리스너 등록하기 */
//할 일을 추가하기 위해서 <input> 요소로부터 이벤트 리스너를 등록하여, 이벤트를 캐치 후, 입력받은 데이터를 배열에 순차적으로 담아주기
const todoInputElem = document.querySelector('.todo-input');
const todoListElem = document.querySelector('.todo-list');
const completeAllBtnElem = document.querySelector('.complete-all-btn');
const leftItemsElem = document.querySelector('.left-items');

const showAllBtnElem = document.querySelector('.show-all-btn');	// All 버튼 (전체 투두리스트를 보여줌)
const showActiveBtnElem = document.querySelector('.show-active-btn'); // Active 버튼 (완료되지 않은 할 일 리스트를 보여줌)
const showCompletedBtnElem = document.querySelector('.show-completed-btn'); // Completed 버튼 (완료된 할 일 리스트를 보여줌)
const clearCompletedBtnElem = document.querySelector('.clear-completed-btn'); // Completed Clear 버튼 (완료된 할 일 리스트를 전체 투두리스트에서 삭제함)



let id = 0;  //local storage에 todoList 변수명을 저장한 상수
const setId = (newId) => {id = newId};

let isAllCompleted = '';  //전체 todos 체크 여부
const setIsAllCompleted = (bool) => { isAllCompleted = bool};

let currentShowType = 'all';  // all | active | complete
const setCurrentShowType = (newShowType) => currentShowType = newShowType;

/* 할 일 추가하기 */
let todos = [];  // todos 할일을 담을 배열
const setTodos = (newTodos) => {
    todos = newTodos;  //newId 새롭게 저장되는 할일의 id값
}

const getAllTodos = () => {
    return todos;
}

const getCompletedTodos = () => {
    return todos.filter(todo => todo.isCompleted === true );
}

//현재 완료되지 않은 할 일 리스트를 반환
const getActiveTodos = () => {
    return todos.filter(todo => todo.isCompleted === false);
}

//완료 처리가 되는 부분 마다 적용하여 남은 할 일 개수를 갱신
const setLeftItems = () => {
    const leftTodos = getActiveTodos()
    leftItemsElem.innerHTML = `${leftTodos.length} items left`

    //todos의 배열의 길이와 완료상태가 변할 때 호출되는 함수[ init(), appendTodos(), deleteTodo(), completeTodo(), onClickCompleteAll() ]에 각각 적용
}

const completeAll = () => {
    completeAllBtnElem.classList.add('checked');
    const newTodos = getAllTodos().map(todo => ({...todo, isCompleted: true }) )
    setTodos(newTodos)
}

const incompleteAll = () => {
    completeAllBtnElem.classList.remove('checked');
    const newTodos =  getAllTodos().map(todo => ({...todo, isCompleted: false }) );
    setTodos(newTodos)
}

//전체 todos의 check 여부 (isCompleted)
const checkIsAllCompleted = () => {
//completeAllBtnElem 요소는 클릭 될 때만 isAllCompleted상태 값이 변하는 것이 아니라, 
//각각의 할 일 들을 완료 처리 할때와 새로운 할 일이 추가 될때도 isAllCompleted의 상태가 변하고, HTML에 표시해주어야하기 때문에 만들어 주는 함수
    if( getAllTodos().length === getCompletedTodos().length ){  //현재 todos배열의 길이와 완료된 todos배열의 길이를 비교
        setIsAllCompleted(true);
        completeAllBtnElem.classList.add('checked');
    } else {
        setIsAllCompleted(false);
        completeAllBtnElem.classList.remove('checked');
    }
}

const onClickCompleteAll = () => {  //현재 todos의 완료 상태 여부를 파악하여, 전체 완료를 처리
    //기존의 todos를 배열의 isCompleted를 바뀌는 isAllChecked 상태에 맞춰서 바꿔주기
    if(!getAllTodos().length) return; // todos배열의 길이가 0이면 return;

    if(isAllCompleted) incompleteAll(); // isAllCompleted가 true이면 todos를 전체 미완료 처리 
    else completeAll(); // isAllCompleted가 false이면 todos를 전체 완료 처리 
    setIsAllCompleted(!isAllCompleted); // isAllCompleted 토글
    paintTodos(); // 새로운 todos를 렌더링
    setLeftItems();
}


const appendTodos = (text) => {
    const newId = id++;  // ++연산자를 통해 1씩 증가시킴으로써 id값이 중복되지 않도록 해줌
    const newTodos = getAllTodos().concat({ id: newId, isCompleted: false, content: text })  
    // const newTodos = [...getAllTodos(), {id: newId, isCompleted: false, content: text }]
    //새롭게 저장될 todos 배열로 getAllTodos() 함수를 통해 이전 todos 배열을 가져온 후, 새롭게 추가된 할 일을 concat()을 통해 추가된 배열을 newTodos에 저장

    setTodos(newTodos);
    setLeftItems();
    checkIsAllCompleted();  // 전체 완료처리 확인
    paintTodos();  //할 일이 추가될 때마다, paintTodos() 함수를 실행하여 렌더링
}

/* 할 일 목록에서 리스트 삭제 */
//'delBtn' 클래스 네임을 가지는 삭제 버튼 요소를 click 하면 deleteTodo() 함수가 실행되고 인자로 todo.id를 받음
const deleteTodo = (todoId) => {
    alert('해당 리스트를 삭제하시겠습니까?');
    const newTodos = getAllTodos().filter(todo => todo.id !== todoId );  //입력받은 todo의 id 값과 Array filter()를 이용해 삭제하고자 하는 할 일을 제외한 새로운 할 일 목록을 가지는 배열 만들기
    setTodos(newTodos);  //기존의 todos 배열 바꾸기
    setLeftItems();
    paintTodos();  //삭제된 todos배열로 다시 HTML를 다시 렌더링 
}

/* 할 일 완료 처리 */
const completeTodo = (todoId) => {
    const newTodos = getAllTodos().map(todo => todo.id === todoId ? {...todo,  isCompleted: !todo.isCompleted} : todo );
    //Array map()을 사용하여 완료 처리하고자 하는 할 일의 isCompleted 값을 토글(true이면 false로, false면 true로) 처리 
    setTodos(newTodos);  //새로운 todos 배열을 저장
    paintTodos();
    setLeftItems();
    checkIsAllCompleted();  // 전체 todos의 완료 상태를 파악하여 전체 완료 처리 버튼 CSS 반영
}

/* 리스트 수정하기 */
const updateTodo = (text, todoId) => {
    const newTodos = getAllTodos().map(todo => todo.id === todoId ? ({...todo, content: text}) : todo);
    //getAllTodos() 함수로 todos 배열을 가져와서 map을 통해 id값을 비교하여 할 일의 내용을 수정하는 새로운 todos 배열 생성
    setTodos(newTodos);  //setTodos() 함수를 통해 새로운 todos배열을 저장
    paintTodos();  //paintTodos() 함수를 통해 변경된 todos 배열로 할 일 리스트를 다시 렌더링
}

/* 리스트 더블클릭으로 수정 */
const onDbclickTodo = (e, todoId) => {
    const todoElem = e.target;
    const inputText = e.target.innerText;
    const todoItemElem = todoElem.parentNode;
    const inputElem = document.createElement('input');  //createElement() 함수를 통해 inputElem이라는 input 요소를 만들고,
    inputElem.value = inputText;  //inputElem의 value 값으로 event 객체의 target.innerText를 넣어줌
    inputElem.classList.add('edit-input');

    inputElem.addEventListener('keypress', (e)=>{
        if(e.key === 'Enter') {
            updateTodo(e.target.value, todoId); // todo 수정
            document.body.removeEventListener('click', onClickBody); // 이벤트리스너 제거
        }
    })

    // todoItemElem 요소를 제외한 영역을 클릭 시, 수정모드 종료
    const onClickBody = (e) => {
        if(e.target !== inputElem)  {
            todoItemElem.removeChild(inputElem);
            document.body.removeEventListener('click', onClickBody );
        }
    }
    
    document.body.addEventListener('click', onClickBody)  // body에 클릭에 대한 이벤트 리스너 등록
    todoItemElem.appendChild(inputElem); // todoItemElem 요소에 자식 요소로 inputElem 요소 추가
}

/* 완료리스트 삭제 */
const clearCompletedTodos = () => {
    const newTodos = getActiveTodos();  // todos 배열을 현재 완료되지 않은 할 일 리스트로 변경해 준 후
    completeAllBtnElem.classList.remove('checked');
    setTodos(newTodos);
    paintTodos();  //재렌더링
}

/* HTML에 추가된 할 일 그려주기 */
const paintTodo = (todo) => {
    
	//const allTodos = getAllTodos(); // todos 배열 가져오기

    //"todo-item"에 해당하는 HTML을 그려서 "todo-list"에 추가하기
    const todoItemElem = document.createElement('li');
    todoItemElem.classList.add('todo-item');

    todoItemElem.setAttribute('data-id', todo.id );
        
    const checkboxElem = document.createElement('div');
    checkboxElem.classList.add('checkbox');
    checkboxElem.addEventListener('click', () => completeTodo(todo.id)); // 'click'이벤트 발생 시, 완료 처리

    const todoElem = document.createElement('div');
    todoElem.classList.add('todo');
    todoElem.addEventListener('dblclick', (event) => onDbclickTodo(event, todo.id));  //'double click'이벤트 발생 시, 수정 모드 전환
    //두 개의 파라미터 입력받기(첫 번째 파라미터 : event객체, 두 번째 파라미터 : 할 일의 id 
    todoElem.innerText = todo.content;

    const delBtnElem = document.createElement('button');
    delBtnElem.classList.add('delBtn');
    delBtnElem.addEventListener('click', () => deleteTodo(todo.id)); // 'click'이벤트 발생 시, 해당 할 일 삭제
    delBtnElem.innerHTML = 'X';

    if(todo.isCompleted) {
        todoItemElem.classList.add('checked');
        checkboxElem.innerText = '✔';
    }

    //"todo-list" 요소에 appendChild()를 사용하여 자식 요소로 추가
    todoItemElem.appendChild(checkboxElem);
    todoItemElem.appendChild(todoElem);
    todoItemElem.appendChild(delBtnElem);
    todoListElem.appendChild(todoItemElem);
}

const paintTodos = () => {
    todoListElem.innerHTML = ''; //todoListElem 요소 안의 HTML 초기화

    switch (currentShowType) {
        case 'all':
            const allTodos = getAllTodos();
            allTodos.forEach(todo => { paintTodo(todo); });
            break;

        case 'active' :
            const activeTodos = getActiveTodos();
            activeTodos.forEach(todo => { paintTodo(todo); });
            break;

        case 'completed': 
            const completedTodos = getCompletedTodos();
            completedTodos.forEach(todo => { paintTodo(todo); });
            break;

        default:
            break;
    }
}

const onClickShowTodosType = (e) => {  //click된 todos의 타입에 따라 투두리스트를 보여주는 함수
    const currentBtnElem = e.target;
    const newShowType = currentBtnElem.dataset.type;  //현재 클릭된 버튼 요소인 currentBtnElem의 dataset을 사용해 type을 가져오기

    if ( currentShowType === newShowType ) return;

    const preBtnElem = document.querySelector(`.show-${currentShowType}-btn`);
    preBtnElem.classList.remove('selected');

    currentBtnElem.classList.add('selected');
    setCurrentShowType(newShowType);

    paintTodos();
}


//js파일이 실행되자마자 호출되는 함수
const init = () => {
    todoInputElem.addEventListener('keypress', (e) =>{
        if( e.key === 'Enter' ){
            appendTodos(e.target.value); 
            todoInputElem.value ='';
        }
    })

    showAllBtnElem.addEventListener('click', onClickShowTodosType);
    showActiveBtnElem.addEventListener('click', onClickShowTodosType);
    showCompletedBtnElem.addEventListener('click', onClickShowTodosType);
    clearCompletedBtnElem.addEventListener('click', clearCompletedTodos);

    completeAllBtnElem.addEventListener('click',  onClickCompleteAll);
    setLeftItems();
}

init()