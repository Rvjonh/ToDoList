import ToDoList from "./todoList.js";
import ToDoItem from "./todoItem.js";

const toDoList = new ToDoList();

// Lunch App
document.addEventListener("readystatechange", (event)=>{
    if(event.target.readyState === "complete"){
        initApp();
    }
})

//which handle the Data on the computer
const uptadePersistanceData = (listArray)=>{
    localStorage.setItem("myToDoList", JSON.stringify(listArray));
    changeStateButtom();
}

const initApp = () => {
    const itemEntryForm = document.getElementById("ItemEntryForm");
    itemEntryForm.addEventListener("submit", event =>{
        event.preventDefault();
        processSubmission();
    })

    const clearItemButton = document.getElementById("clearItems");
    changeStateButtom();
    clearItemButton.addEventListener("click", event =>{
        if(toDoList.getList().length>0){
            const confirmed = confirm("Are you sure of delete the list?");
            if(confirmed){
                toDoList.clearList();
                uptadePersistanceData(toDoList.getList());
                refreshThePage();
            }
        }
    })
    
    loadPersistenData();
    refreshThePage();
}

const loadPersistenData = ()=>{
    const localList = localStorage.getItem("myToDoList");
    if(typeof localList !== "string") return;

    const dataJustify = JSON.parse(localList);

    dataJustify.forEach((itemData)=>{
        const toDoItem = createNewItem(itemData._id, itemData._item);
        toDoList.addItemToList(toDoItem);
    })
}
const changeStateButtom = ()=>{
    const clearItemButton = document.getElementById("clearItems");
    if(toDoList.getList().length>0){
        clearItemButton.title = "clear the list";
    }else{
        clearItemButton.title = "there is no item to delete";
    }
}

const refreshThePage = () => {
    clearListDisplay();
    renderList();
    clearItemEntryField();
    setFocusOnItemEntry();
}

const clearListDisplay = () =>{
    const parentElement = document.getElementById("listItems");
    deleteContentes(parentElement);
}

const deleteContentes = (parentElement) =>{
    let child = parentElement.lastElementChild; 
    while (child){
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
}

const renderList = ()=>{
    const list = toDoList.getList();
    list.forEach(item =>{
        buildListItem(item);
    });
}

const buildListItem = (item)=>{
    const div = document.createElement("div");
    div.className = "item";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.tabIndex = "0";
    check.id = item.getId();
    addEventListenerToCheckbox(check);

    const label = document.createElement("label");
    label.htmlFor = item.getId();
    label.textContent = item.getItem();

    div.appendChild(check);
    div.appendChild(label);

    const container = document.getElementById("listItems");
    container.appendChild(div);
}
const addEventListenerToCheckbox = (check)=>{
    check.addEventListener("click", (event)=>{
        toDoList.removeItemFromTheList(check.id);
        uptadePersistanceData(toDoList.getList());
        check.parentNode.className +=" disappear";
        setTimeout(() => {
            refreshThePage();
        }, 1000);
    })
}

const clearItemEntryField = ()=>{
    document.getElementById("newItem").value = "";
}
const setFocusOnItemEntry = ()=>{
    document.getElementById("newItem").focus();
}

///Add new item to the list
const processSubmission = ()=>{
    const newEntryText = getNewEntry();
    if(!newEntryText.length) return;

    const nextItemId = calcNextItemId();

    const toDoItem = createNewItem(nextItemId, newEntryText);
    toDoList.addItemToList(toDoItem);
    uptadePersistanceData(toDoList.getList());
    refreshThePage();
}

const getNewEntry = ()=>{
    return document.getElementById("newItem").value.trim();
}
const calcNextItemId = ()=>{
    let nextItemId = 1;
    const list = toDoList.getList();
    if(list.length > 0){
        nextItemId = list[list.length - 1].getId() + 1;
    }
    return nextItemId;
}

const createNewItem = (nextItemId, newEntryText)=>{
    const toDoItem = new ToDoItem();
    toDoItem.setId(nextItemId);
    toDoItem.setItem(newEntryText);
    return toDoItem;
}