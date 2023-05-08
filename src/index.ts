const inquirer = require('inquirer');
const consola = require('consola');

enum Action {
  List = "list",
  Add = "add",
  Remove = "remove",
  Quit = "quit"
}

enum Status {
  Success = "success",
  Error = "error",
  Info = "info"
}

interface User {
  name: string,
  age: number,
}

type InquirerAnswers = {
  action : Action
}

class Message {
  content : string

  constructor(content : string) {
    this.content = content;
  }

  public show() : void {
    console.log(this.content);
  }

  public capitalize() : void {
    const firstLetter : string = this.content.charAt(0).toUpperCase();
    const restOfContent : string = this.content.slice(1).toLowerCase();
    
    this.content =  firstLetter + restOfContent
  }

  public toUpperCase(): void {
    this.content = this.content.toUpperCase();
  }

  public toLowerCase(): void {
    this.content = this.content.toLowerCase();
  }

  static showColorized(variant : Status, anyText : string) {
    if ( variant === "success" ) {
      consola.success(anyText);
    } else if ( variant === "error") {
      consola.error(anyText);
    } else if ( variant === "info" ) {
      consola.info(anyText);
    }
  }
}

class UsersData {
  data : User[] = [];

  showAll(): void {
    Message.showColorized(Status.Info, 'Users data');
    if(this.data.length === 0){
      console.log('No data...');
    } else {
      console.table(this.data);
    }
  }

  public add(user : User) : void {
    if (typeof user.name !== 'string' || typeof user.age !== 'number' || user.name.length < 0 || user.age < 0) {
      Message.showColorized(Status.Error, 'Wrong data');
    } else {
      this.data.push(user);
      Message.showColorized(Status.Success, 'User has been successfully added!');
    }
  }

  public remove(userName : string) : void {
    
    const index = this.data.findIndex(user => user.name === userName);
    
    if(index !== -1) {
      this.data.splice(index, 1);
      Message.showColorized(Status.Success, 'User deleted!');
    } else {
      Message.showColorized(Status.Info, 'User not found...');
    }
  }
}

const users = new UsersData();
console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(Status.Info, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("remove – remove user from the list");
console.log("quit – quit the app");
console.log("\n");

const startApp = () => {
  inquirer.prompt([{
    name: 'action',
    type: 'input',
    message: 'How can I help you?',
  }]).then(async (answers: InquirerAnswers) => {
    console.log(answers.action);
    switch (answers.action) {
      case Action.List:
        users.showAll();
        break;
      case Action.Add:
        const user = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }, {
          name: 'age',
          type: 'number',
          message: 'Enter age',
        }]);
        users.add(user);
        break;
      case Action.Remove:
        const name = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }]);
        users.remove(name.name);
        break;
      case Action.Quit:
        Message.showColorized(Status.Info, "Bye bye!");
        return;
    }
  });
}

startApp();