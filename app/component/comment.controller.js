

function MainController (scope,commentModel) {
    
    this.scope = scope;
    this.model = commentModel
    
    this.editedMessage = {};
    this.mainButton = "Add"
   
    
    this.getData()
}






MainController.prototype = {

  getData:  function(){
            console.log(this)  
            this.model.fetchData().then((resp)=>{ 
            console.log(this)
            this.setMessages(resp.data) 
    })
    },
 addNewComment: function(){
            if (this.newUserName === "" ||  this.newUserText === "" ){
                alert("some field is empty:)")
            } else
            this.model.addData(this.newUserName,this.newUserText).then((resp) => {
                this.getData()
                })
    },

setMessages: function (data){
            this.messages =  data
            this.newUserName = "";
            this.newUserText = "";
    },

getCommentToEdit: function(data){
            this.newUserName = data.author;
            this.newUserText = data.text;
            this.mainButton = "Edit"
            
            this.scope.$watch ("vm.newUserText",(n,o) => {
                console.log("Old param: " +  o)
                console.log("New param: " +  n)
                if (n!==o){
                        this.editedMessage.date = new Date()
                        this.editedMessage.text = n + "(edited)"
                        this.editedMessage.id = data.id
                        
                  } else {
                        this.editedMessage.text = data.text 
                        this.editedMessage.id = data.id
                 }
            })
    },
    
 editComment: function (){
            for(var i=0; i<this.messages.length; i++){
                if(this.messages[i].id === this.editedMessage.id ){
                    if(this.messages[i].text === this.editedMessage.text){
                        alert("they are the same dude")
                    }else this.model.addEditedComment(this.editedMessage).then(()=>{    
                        this.getData()
                        this.mainButton = "Add"
                     })
            }
        }
    
        console.log(this.messages)
        console.log(this.editedMessage)
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


angular.module("commentApp")
    .controller("mainController",["$scope","commentModel",MainController])
    .service("commentModel",CommentModel)