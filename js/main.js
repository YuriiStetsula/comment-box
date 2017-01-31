(function () {
//Лучше использовать конструктор на прототипах для описания контроллеров или классы es6
function MainController (scope,commentModel) {
    var vm = this;
    
    this.scope = scope;
    
    this.model = commentModel
    this.newUserName = "";
    this.newUserText = "";
    this.editedMessage = {};
    
    this.mainButton = "Add"
   


  



  //  vm.addNewComment = function () {
  //       };

   vm.getCommentToEdit = function(data){
          
          vm.newUserName = data.author;
          vm.newUserText = data.text;
          vm.mainButton = "Edit"
         
          $scope.$watch ("vm.newUserText",function(n,o){
              console.log("Old param: " +  o)
              console.log("New param: " +  n)
              if (n!==o){

                    vm.editedMessage.date = new Date()
                    vm.editedMessage.text = n + "(edited)"
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
           }else vm.model.addEditedComment(vm.editedMessage).then(function(){
              
               vm.getData(vm)
              
               vm.mainButton = "Add"
           })
    

    }

       }
  
       console.log(vm.messages)
       console.log(vm.editedMessage)

   };


}






MainController.prototype = {
  //  test: function(){
   //     console.log(this.messages)
  //  },

    getData:  function(){
 // До выполнения .then() , this === MainController .
 // MainController {scope: b, model: CommentModel, newUserName: "", newUserText: "", editedMessage: Object…}

     console.log(this)  
    this.model.fetchData().then(function(resp){ 
    // Но после того как приходит resp - (Object {data: Array[15], status: 200, config: Object, statusText: "OK"})  
    //  this === window 
    //Window {speechSynthesis: SpeechSynthesis, caches: CacheStorage, localStorage: Storage, sessionStorage: Storage, webkitStorageInfo: DeprecatedStorageInfo…}






    // vm.messages = resp.data;
    console.log(resp)
    console.log(this)
    
})

},
    addNewComment: function(){
        if (this.newUserName === "" ||  this.newUserText === "" ){
             alert("some field is empty:)")
         } else
          this.model.addData(this.newUserName,this.newUserText).then(function(resp){
             this.getData(this)
            
           
    })
    }

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
      
       return  this.http.put(this.baseUrl+"/"+editedComment.id,editedComment)
       
    }

}


  
  



  
  angular.module("commentApp", [])
    
    .controller("mainController",["$scope","commentModel",function(scope,commentModel){
       
        return new MainController(scope,commentModel)
    }])
    .service("commentModel",CommentModel)
})()