
App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  loadWeb3: async() => {
    if(typeof web3 !== 'undefined'){
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Por favor conecte con Metamask...")
    }
    if(window.ethereum){
      window.web3 = new Web3(ethereum)
      try {
        // Peticion de acceso a la cuenta.
        await ethereum.enable()
        web3.eth.sendTransaction({ })
      } catch(err){
        console.log(err)
      }
    }
    else if(window.web3){
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      web3.eth.sendTransaction({ })
    } else {
      console.log("Navegador incompatible")
    }
  },

  loadAccount: async () => {
    App.account = web3.eth.accounts[0];
    console.log(App.account);
  },

  loadContract: async () => {
    const todoList = await $.getJSON('TodoList.json')
    App.contracts.TodoList = TruffleContract(todoList)
    App.contracts.TodoList.setProvider(App.web3Provider)

    App.todoList = await App.contracts.TodoList.deployed()
  },

  render: async () => {
    if(App.loading){
      return
    }

    App.setLoading(true)
    $('#account').html(App.account)
    await App.renderTasks()
    App.setLoading(false)
  },

  renderTasks: async () => {
    const taskCount = await App.todoList.taskCount();
    const $taskTemplate = $('.taskTemplate');

    for(let i= 1; i < taskCount; i++){
     const task = await App.todoList.tasks(i);
     const taskId = task[0].toNumber(); 
     const taskContent = task[1];
     const taskCompleted = task[2];

     const $newTaskTemplate = $taskTemplate.clone();
     $newTaskTemplate.find('.content').html(taskContent);
     $newTaskTemplate.find('input')
                      .prop('name', taskId)
                      .prop('checked', taskCompleted)
                      // .on('click', App.toggleCompleted)

      if(taskCompleted){
        $('#completedTaskList').append($newTaskTemplate)
      } else {
        $('#taskList').append($newTaskTemplate)
      }
      $newTaskTemplate.show()
    }
  },

  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $('#loader')
    const content = $('#content')
    if(boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})