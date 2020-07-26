import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      activeItem:{
        id:null,
        task: '',
        completed: false
      },
      editing: false,
    }
  }
  componentWillMount() {
    this.fetchTasks()
    
  }
  getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }

  fetchTasks = ()=>{
    fetch('http://127.0.0.1:8000/api/')
    .then(res => res.json())
    .then(data => 
      this.setState({todos: data})
    )
  }

  handleChange =(e) =>{
    let name = e.target.name
    let value = e.target.value
    this.setState({
      activeItem:{
        ...this.state.activeItem,
        task:value
      }
    })
  }

  handleSubmit = (e) =>{
    e.preventDefault();
    const csrftoken = this.getCookie('csrftoken');
    let url = 'http://127.0.0.1:8000/api/create_task/'
    if (this.state.editing==true){
      url = `http://127.0.0.1:8000/api/update_task/${this.state.activeItem.id}/`
      this.setState({
        editing:false,
      })
    }
    console.log(this.state.activeItem)
    fetch(url,{
      'method': 'POST',
      headers:{
        'content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
      body: JSON.stringify(this.state.activeItem)
    })
    .then(res => {
      this.fetchTasks()
      this.setState({
        activeItem:{
          id:null,
          task: '',
          completed: false,
        }
      })
    })
    .catch(
      err => console
    )

  }

  deleteClick= (task) =>{
    const csrftoken = this.getCookie('csrftoken');
    let url = `http://127.0.0.1:8000/api/delete_task/${task.id}/`
    fetch(url,{
      'method': 'DELETE',
      headers:{
        'content-type':'application/json',
        'X-CSRFToken':csrftoken,
      }
    })
    .then(res => {
      this.fetchTasks()
      this.setState({
        activeItem:{
          id:null,
          task: '',
          completed: false,
        },
        editing:false,
      })
    })
  }

  editClick= (task)=>{
    this.setState({
      activeItem:task,
      editing: true
    })
  }

  completeUncomplete = (task) =>{
    task.completed = !task.completed
    const csrftoken = this.getCookie('csrftoken');
    let url = `http://127.0.0.1:8000/api/update_task/${task.id}/`
    fetch(url,{
      'method': 'POST',
      headers:{
        'content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },  
      body:JSON.stringify({'task': task.task, 'completed': task.completed})
    })
    .then(res => {
      this.fetchTasks()
    })
  }



  render(){
    let todos = this.state.todos

    
    return(
        <div className="container">

          <div id="task-container">
              <div  id="form-wrapper">
                 <form onSubmit={this.handleSubmit} id="form">
                    <div className="flex-wrapper">
                        <div style={{flex: 6}}>
                            <input onChange={this.handleChange} className="form-control" id="title" value={this.state.activeItem.task} type="text" name="title" placeholder="Add task.." />
                         </div>
                         <div style={{flex: 1}}>
                            <input id="submit" className="btn btn-warning" type="submit" name="Add" />
                          </div>
                      </div>
                </form>
              </div>
              <div  id="list-wrapper">   
              {todos.map((task, index) => {
                return(
                  <div key={index} className="task-wrapper flex-wrapper">
                    <div onClick={() => this.completeUncomplete(task)} style={{flex:7}}>
                    {task.completed == true ? 
                      <strike>{task.task}</strike>:
                      <span>{task.task}</span>
                    }
                    </div>
                    <div style={{flex:1}}>
                        <button onClick={() => this.editClick(task)} className="btn btn-sm btn-outline-info">Edit</button>
                    </div>
                    <div style={{flex:1}}>
                        <button onClick={() => this.deleteClick(task)} className="btn btn-sm btn-outline-dark delete">-</button>
                    </div>
                  </div>
                )
              })}                     
                    
              </div>
          </div>
          
        </div>
      )
  }
}

export default App;
