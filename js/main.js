(function () {
//Лучше использовать конструктор на прототипах для описания контроллеров или классы es6
function MainController (commentModel,$scope) {
    var vm = this;
    
    vm.model = commentModel
    vm.newUserName = "";
    vm.newUserText = "";
    vm.editedMessage = {};
    
    vm.mainButton = "Add"

    vm.addNewComment = function () {
         if (vm.newUserName === "" ||  vm.newUserText === "" ){
             alert("some field is empty:)")
         } else
          vm.model.addData(vm.newUserName,vm.newUserText).then(function(resp){
             vm.messages = resp.data
            
           
    })
        vm.newUserName = "";
        vm.newUserText = "";
    };

    vm.model.fetchData().then(function(resp){
      
        vm.messages = resp.data;
    })

    vm.getCommentToEdit = function(data){
          
          vm.newUserName = data.author;
          vm.newUserText = data.text;
          vm.mainButton = "Edit"
         
          $scope.$watch ("vm.newUserText",function(n,o){
              console.log("Old param: " +  o)
              console.log("New param: " +  n)
              if (n!==o){

                    vm.editedMessage.date = new Date()
                    vm.editedMessage.text = n + "(edited on " + vm.editedMessage.date + ")"
                    vm.editedMessage.id = data.id
                    
                       
              } else {
                    vm.editedMessage.text = data.text 
                    vm.editedMessage.id = data.id
                 
              }
          })
    }
   
   vm.editComment = function(){
       for(var i=0; i<vm.messages.length; i++){
       if(vm.messages[i].id === vm.editedMessage.id ){
           if(vm.messages[i].text === vm.editedMessage.text){
               alert("they are the same dude")
           }else vm.model.addEditedComment(vm.editedMessage)
    

    }

       }
  
       console.log(vm.messages)
       console.log(vm.editedMessage)

   };


}


function CommentModel ($http) {
 
    this.baseUrl ="http://localhost:4001/comments";
    this.http = $http;

    this.fetchData = function(){
        return this.http.get(this.baseUrl)
    }

    this.addData = function (userName,userText) {
        var newObj = {
            author: userName,
            text: userText,
            date: new Date()
        }
        
        return this.http.post(this.baseUrl,newObj)
   
    }  

    this.addEditedComment = function(editedComment){
        console.log(editedComment)
    }

}


  
  
  
  angular.module("commentApp", [])
    .controller("mainController",MainController)
    .service("commentModel",CommentModel)
})()