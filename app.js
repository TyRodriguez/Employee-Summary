const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let team =[]

const managerQ = [
    {
        type: "input",
        name: "name",
        message: "What is your name?",
        validate: async (input) => {
            if (input == "") {
                return "Please enter name.";
            }
            return true;
        }
    },
    {
        type: "input",
        name: "email",
        message: "What is your email?",
        validate: async (input) => {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
                return true;
            }
            return "Please enter a valid email.";
        }
    },
    {
        type: "input",
        name: "offNum",
        message: "What is your office #?",
        validate: async (input) => {
            if (isNaN(input)) {
                return "Please enter a number.";
            }
            return true;
        }
    }
]

const empQ = [
    {
        type: "input",
        name: "name",
        message: "What is the team member's name?",
        validate: async (input) => {
            if (input == "") {
                return "Please enter name.";
            }
            return true
        }
    },
    {
        type: "input",
        name: "email",
        message: "What is the team member's email?",
        validate: async (input) => {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
                return true;
            }
            return "Please enter a valid email.";
        }
    },
    {
        type: "list",
        name: "role",
        message: "What is their role?",
        choices: [
            "Engineer",
            "Intern"]
    },
    //Engineer only
    {
        when: (input) => {
            return input.role == "Engineer"
        },
        type: "input",
        name: "github",
        message: "What is the engineer's GitHub username?",
        validate: async (input) => {
            if (input == "" || /\s/.test(input)) {
                return "Please enter a valid username.";
            }
            return true;
        }
    },

    //Intern Only
    {
        when: (input) => {
            return input.role == "Intern"
        },
        type: "input",
        name: "school",
        message: "What is the intern's school/university name?",
        validate: async (input) => {
            if (input == "") {
                return "Please enter a name.";
            }
            return true;
        }
    },
    //Only if adding another employee
    {
        type: "list",
        name: "add",
        message: "Would you like to add another team member?",
        choices: ["Yes", "No"]
    }
]
let newMember = {}

function createTeam() {
    inquirer.prompt(empQ).then(emp => {
        if (emp.role == "Engineer") {
            newMember = new Engineer(emp.name, team.length + 1, emp.email, emp.github);
        } else {
            newMember = new Intern(emp.name, team.length + 1, emp.email, emp.school);
        }
        team.push(newMember);
        if (emp.add === "Yes") {
            console.clear()
            createTeam();
        } else {
            createHTML()
            console.log(team);
        }
    })
}

async function init() {
    inquirer.prompt(managerQ).then(manager => {
        let teamManager = new Manager(manager.name, 1, manager.email, manager.officeNum);
        team.push(teamManager);
        createTeam()
    })
}
function createHTML(){
    fs.writeFile(outputPath, render(team), (err)=>console.log(err || 'Success!'))
}

init();


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
