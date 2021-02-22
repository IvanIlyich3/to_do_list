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

const LOCAL_STORAGE_LIST_KEY = 'task.list'
// Creat keys to use locale storage

const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
// Create key for selected list

let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)
// Get the selected element from locale storage

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
// Get the information from the local storage and, if the information exists,
// parse it into an object, else initialize into an empty array


listsContainer.addEventListener('click', event => {
    if ( event.target.tagName.toLowerCase() === 'li' ) {
        selectedListId = event.target.dataset.listId
        saveAndRender()
    }
})
// Add event listener for click to the container that contains all the elements we're adding,
// and if the tagName is equal to li, set the selectedListId to data attribute of the target
// element, then call saveAndRender function


deleteListButton.addEventListener('click', event => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    saveAndRender()
})
// On deleteListButton click, set the lists array equal to a new array which contains all
// the elements with id strict unequal to the selected element's id, set the selectedListId
// equal to null and then call saveAndRender function


newListForm.addEventListener('submit', event => {
    event.preventDefault()
    const listName = newListInput.value
    if ( listName == null || listName === '' ) return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveAndRender()
})
// Any time the form is submitted, we prevent the default action of refreshing the
// page, next we pass the value of the newListInput to a variable, we check if the 
// user gave a truthy value and if he gave one, we call createList function with 
// that value as an argument, next we clear out the value of newListInput, we push
// the new list object to lists array and we call saveAndRender function 


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
    }
}



function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`

}



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