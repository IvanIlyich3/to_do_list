const listsContainer = document.querySelector('[data-lists]')
//  listContainer is corresponding with the ul element, which  
//  contains all of our items 

const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
// Select the form and input elements from HTML 

const deleteListButton = document.querySelector('[data-delete-list-button]')
// Select the button element with data attribute equal to 'delete-list-button'

const listDisplayContainer = document.querySelector('[data-list-display-container]')
// Select div element with data attribute of list-display-container
const listTitleElement = document.querySelector('[data-list-title]')
// Select h2 element with data attribute of list-title
const listCountElement = document.querySelector('[data-list-count]')
// Select p element with data attribute of list-count
const tasksContainer = document.querySelector('[data-tasks]')

const newTaskForm = document.querySelector('[data-new-task-form]')
// Select form element
const newTaskInput = document.querySelector('[data-new-task-input]')
// Select input element

const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')
// Select button element

const LOCAL_STORAGE_LIST_KEY = 'task.list'
// Creat keys to use local storage

const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
// Create key for selected list

let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)
// Get the selected element from local storage

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
// Get the information from the local storage and, if the information exists,
// parse it into an object, else initialize into an empty array

const taskTemplate = document.getElementById('task-template')
// Get template element


listsContainer.addEventListener('click', e => {
    if ( e.target.tagName.toLowerCase() === 'li' ) {
        selectedListId = e.target.dataset.listId
        console.log('i am the selected list id >>', selectedListId)
        saveAndRender()
    }
})
// Add event listener for click to the container that contains all the elements we're adding
// and, if the tagName of the selected element is equal to li, set the selectedListId equal
// to the value of data-list-id attribute of the target element, then call saveAndRender function


deleteListButton.addEventListener('click', event => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    saveAndRender()
})
// On button click, set the lists array equal to a new array which contains all
// the elements with id strict unequal to the selected element's id, set the selectedListId
// equal to null, then call saveAndRender function


clearCompleteTasksButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
})
// On button click, create a variable selectedList with value equal to the id of the list that
// has been clicked, loop through the selectedList.tasks and remove all the tasks that have
// a truthy task.complete value (keep the tasks that are not completed)


newTaskForm.addEventListener('submit', event => {
    event.preventDefault()
    const taskName = newTaskInput.value
    if ( taskName == null || taskName === '' ) return
    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
})
// On form submission, prevent the default action of refreshing the
// page, create a variable taskName with a value equal to newTaskInput.value, check if the 
// user gave a truthy value and if he gave one, call createTask function with 
// that value as an argument and pass the returned value to task variable, clear 
// out the value of newTaskInput, loop through lists, find the list with list.id equal
// to selectedListId and save that list to selectedList variable, push the task into the 
// tasks of the selectedList, call saveAndRender


newListForm.addEventListener('submit', event => {
    event.preventDefault()
    const listName = newListInput.value
    if ( listName == null || listName === '' ) return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveAndRender()
})
// On form submission, prevent the default action of refreshing the
// page, create listName variable and pass it the value of newListInput, check if the 
// user gave a truthy value and if he gave one, call createList function with 
// that value as an argument and pass the returned value to list variable, clear 
// out the value of newListInput, push the new list object to lists array and call 
// saveAndRender function 


tasksContainer.addEventListener('click', e => {
    if ( e.target.tagName.toLowerCase() === 'input' ) {
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        renderTaskCount(selectedList)
    }
})
// On click, check if the tagName of the target element is equal to input, get the selected list
// and pass it as a value to a selectedList variable, get the selected task from the selectedList
// and pass it as a value to selectedTask, check or uncheck the selectedTask accordingly to the 
// current state, call save function, call renderTaskCount function


function createList(name) {
    return {
        id: Date.now().toString(),
        name: name,
        tasks: []
    }
}
// CreateList function takes as an argument a name, which is the name of the list
// that we want to create, and returns an object with a uniq id, a name which a 
// value of the functions argument, and a task which by default is an empty array


function createTask(name) {
    return {
        id: Date.now().toString(),
        name: name,
        complete: false
    }
}
// Takes an argument and returns an object with a unique key id, a name key equal to 
// the passed argument and a complete key with a falsy value


function saveAndRender() {
    save()
    render()
}


function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
}
// Save the lists to the local storage LOCAL_STORAGE_LIST_KEY key as a JSON string,
// set the LOCAL_STORAGE_SELECTED_LIST_ID_KEY key to selectedListId and save it 


function render() {
    clearElement(listsContainer)
    renderList()

    const selectedList = lists.find(list => list.id === selectedListId)
    if (selectedListId == null) {
        listDisplayContainer.style.display = 'none'
    } else {
        listDisplayContainer.style.display = ''
        listTitleElement.innerText = selectedList.name
        renderTaskCount(selectedList)
        clearElement(tasksContainer)
        renderTasks(selectedList)
    }
}
//


function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer.appendChild(taskElement)
    })
}



function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
}
// 


function renderList() {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.classList.add('list-name')
        listElement.dataset.listId = list.id
        listElement.innerText = list.name
        if ( list.id === selectedListId ) {
            listElement.classList.add('active-list')
        }
        console.log(listElement);
        listsContainer.appendChild(listElement)
    });
}
// Loop through lists, and for each element, it create a new li element, add a 
// data-list-id attribute equal to list.id, add a class of 'list-name', and pass
// the current value as it's innerText, if the list.id is equal to the selected list 
// id, add a different class of 'active-list', append the new li element into ul element
                //    CHANGES


function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}
// ClearElement function is clearing out all elements of
// the argument we are passing in

//saveAndRender()
 render()