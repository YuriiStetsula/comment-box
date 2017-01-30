(function () {
//Лучше использовать конструктор на прототипах для описания контроллеров или классы es6
function MainController (commentModel) {
    var vm = this;
    
    vm.model = commentModel
    vm.newUserName = "";
    vm.newUserText = "";
  

    vm.addNewComment= function () {
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

}


  
  
  
  angular.module("commentApp", [])
    .controller("mainController",MainController)
    .service("commentModel",CommentModel)
})()