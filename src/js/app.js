App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("ToDo.json", function(todo) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.ToDo = TruffleContract(todo);
      // Connect provider to interact with contract
      App.contracts.ToDo.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  listenForEvents: function(){
    App.contracts.ToDo.deployed().then(function(instance){
      instance.addTaskEvent({},{
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error,event){
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },
  
  render: function() {
    var todoInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.ToDo.deployed().then(function(instance) {
      todoInstance = instance;
      return todoInstance.tasksCount();
    }).then(function(tasksCount) {
      var tasksList = $("#tasksList");
      tasksList.empty();

      for (var i = 1; i <= tasksCount; i++) {
        todoInstance.tasks(i).then(function(task) {
          var id = task[0];
          var name = task[1];
          var category = task[2];

          // Render task list
          var taskTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + category + "</td></tr>"
          tasksList.append(taskTemplate);
        });
      }

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
    
  },

  addTask() {
    var name = $("#name").val();
    var category = $("#categorySelect").val();
    App.contracts.ToDo.deployed().then(function(instance){
      return instance.addTask(name,category);
    }).then(function(result){
      loader.hide();
      content.show();
    }).catch(function(err){
      console.error(err);
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
