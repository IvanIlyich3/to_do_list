const listsContainer = document.querySelector('[data-lists]')
//  listContainer is corresponding with the ul element, which  
//  contains all of our items 

const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
// Selecting the form and input elements from HTML and 

const LOCAL_STORAGE_LIST_KEY = "task.list"
// Creating keys to use locale storage

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
// we get the information from the local storage and, if the information exists,
// we parse it into an object, else we initialize into an empty array


newListForm.addEventListener('submit', event => {
    event.preventDefault()
    const listName = newListInput.value
    if ( listName == null || listName === '' ) return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    render()
})
// Any time the form is submitted, we prevent the default action of refreshing the
// page, next we pass the value of the newListInput to a variable, we check if the 
// user gave a truthy value and if he gave one, we call createList function with 
// that value as an argument, next we clear out the value of newListInput, we push
// the new list object to lists array and we call render function 


function createList(name) {
    return {
        id: Date.now().toString(),
        name: name,
        tasks: []
    }
}
// createList function takes as an argument a name, which is the name of the list
// that we want to create, and returns an object with a uniq id, a name which a 
// value of the functions argument, and a task which by default is an empty array


function saveAndRender() {
    save()
    render()
}


function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
}
// saving the lists to the local storage LOCAL_STORAGE_LIST_KEY key as a JASON string


function render() {
    clearElement(listsContainer)
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.classList.add('list-name')
        listElement.dataset.listId = list.id
        listElement.innerText = list.name
        listsContainer.appendChild(listElement)
        console.log(listElement);
    });
}
// render function loops through lists, and for each element, it creates 
// a new li element, adds a data-list-id attribute equal to list.id, adds 
// to it  a class of 'list-name', and passes the current value as it's innerText 


function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}
// clearElement function is clearing out all elements of
// the argument we are passing in

saveAndRender()
render()