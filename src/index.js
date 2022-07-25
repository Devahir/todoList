import {render} from 'react-dom';
import {useEffect, useState} from 'react';

function App(){

    const [toDo, settoDo] = useState([]);
    const [item, setitam] = useState('');
    const [serchV, setsearch] = useState('');
    const [editItem, seteditItem] = useState('');

    const addItem = ()=>{
        if(item.length===0) return;
        // fetch("http://127.0.0.1:3000/createTodo?title="+item)
        //     .then((response) => response.json())
        //     .then((json) => {
        //         const newToDos = [...toDo , json];
        //         settoDo(newToDos); 
        //         localStorage.setItem('todos', JSON.stringify(newToDos));
        //         setsearch('');
        //     });
            fetch("http://127.0.0.1:3002/createTodo",
            {
                method: "POST",
            
                // whatever data you want to post with a key-value pair
            
                body: "title="+item,
                headers: 
                {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            
            })
            .then((response) => response.json())
            .then((json) => 
            { 
                console.log(json);
                const newToDos = [...toDo ,json];
                settoDo(newToDos); 
                localStorage.setItem('todos', JSON.stringify(newToDos));
                setsearch('');    
                // do something awesome that makes the world a better place
            });

    }

    const deleteToDo = (id)=>{
        fetch("http://127.0.0.1:3002/deleteTodo?id="+id)
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            console.log("deleteToDo");
        })
        const newDeletedtoDos = toDo.filter(todo=>{
            return todo.id !== id;
        })

        settoDo(newDeletedtoDos)
        localStorage.setItem('todos', JSON.stringify(newDeletedtoDos));
    }

    const updateToDo = (id)=>{
        if(editItem.length===0) return;
        fetch("http://127.0.0.1:3002/updateTodo",
        {
            method: "POST",
        
            // whatever data you want to post with a key-value pair
        
            body: "title="+editItem+"&id="+id,
            // body: JSON.stringify({
            //     data:{
            //       "title":item,
            //       'id':id
            //     }}),
            headers: 
            {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        
        })
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            console.log("getResponse");
            const newDeletedtoDos = toDo.filter(todo=>{
                return todo.id !== id;
            })
    
            settoDo(newDeletedtoDos)
            localStorage.setItem('todos', JSON.stringify(newDeletedtoDos));
        })

        const newUpdatedArray = toDo.map(todo=>{
            if(todo.id !== id){
                todo.title=editItem;
            }

            return todo;
        })

        settoDo(newUpdatedArray)
        localStorage.setItem('todos', JSON.stringify(newUpdatedArray));
        // .then((response) => response.json())
        //     .then((json) => 
        //     { 
        //         console.log(json); 
        //         // do something awesome that makes the world a better place
        //     });

    }

    useEffect(()=>{
        if(localStorage.getItem('todos')){
            settoDo(JSON.parse(localStorage.getItem('todos')))
        }else{
            fetch("http://127.0.0.1:3000/getallTodo")
                .then((response) => response.json())
                .then((json) => {
                    settoDo(json);
                    localStorage.setItem('todos', JSON.stringify(json));
                });
        }

    },[])
    let todoList = "";
    if(serchV==="")
    {todoList= toDo.map((element)=>{
        return(<div>{element.title}
        <button id={element.id} onClick={()=>deleteToDo(element.id)}>Delete</button>
        <button onClick={()=>updateToDo(element.id)}>Update</button>
        </div>);
    })
    }else {
        todoList = toDo.map((element)=>{
             if(element.text.search(serchV) !== -1){
                 return(<div>{element.text}
                     <button id={element.id} onClick={()=>deleteToDo(element.id)}>Delete</button>
                     <button onClick={()=>updateToDo(element.id)}>Update</button>
                     </div>);
             }
             else return "";
        })
    }
    return(
        <>
            <input id="placeholder" value={editItem} type="text" placeholder='editor' onChange={(e)=>seteditItem(e.target.value)}/>
            <input id="placeholder" value={item} type="text" placeholder='your task' onChange={(e)=>setitam(e.target.value)}/>
            <input value={serchV} type="search" placeholder='search your task' onChange={(e)=>setsearch(e.target.value)}/>
                <button id="button" onClick={addItem}>Add</button>
                <button id="button" onClick={updateToDo}>Update</button>
                <div>
            </div>
            <div>{todoList}</div>
        </>
    )
}

render(<App/>, document.getElementById('root'));