const inquirer = require('inquirer');
const mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: 'password',

    database: 'employee_DB'
});

const initQuestion = {
    type: 'list',
    message: 'What would you like to do?',
    name: 'todo',
    choices: ['View All Employees', 'Update Employee Role', 'Add Employee', 'Remove Employee', 'View All Roles', 'Add Role', 'Remove Role', 'View All Departments', 'Add Department', 'Remove Department', 'Exit']
};

const addRoleQs = [];



const startDirect = () => {
    inquirer.prompt(initQuestion).then((answers) => {
        console.log(answers);
        switch (answers.todo) {
            case 'View All Employees':
                viewAllEmployees();
            break;
            // case 'Update Employee Role':


            case 'Add Employee':
                addEmployee();
            break;
            // case 'Remove Employee':
            

            // case 'View All Roles': 
            

            // case 'Add Role':
            

            // case 'Remove Role': 
            

            case 'View All Departments': 
                viewDepartments();
            break;

            case 'Add Department':
                addDepartment();
            break;
            // case 'Remove Department':


            case 'Exit':
                console.log('Have a Great Day!');
                connection.end();
        }
    })
};

const addEmployee = () => {
    connection.query('SELECT CONCAT(first_name, " ", last_name) AS name, id AS value FROM employee', (err, managers) => {
        if (err) throw err;
    connection.query('SELECT title AS name, id AS value FROM role', (err, roles) => {
        if (err) throw err;
        console.log(roles, managers);
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the employees first name?',
            name: 'first_name'
        },
        {
            type: 'input',
            message: 'What is the employees last name?',
            name: 'last_name'
        },
        {
            type: 'list',
            message: 'What is the employees role?',
            name: 'role_id',
            choices: roles
        },
        {
            type: 'list',
            message: 'Who is the employees manager?',
            name: 'manager_id',
            choices: managers
        }
    ])
    .then((answers) => {
        connection.query('INSERT INTO employee SET ?', answers, (err, res) => {
            if (err) throw err;
            console.log('Employee Added!');
            startDirect();
        })
    })
})
    });
    }






const viewAllEmployees = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        startDirect();
    })
}

const viewDepartments = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        startDirect();
    })
};


const addDepartment = () => {
    inquirer.prompt({
        type: 'input',
        message: 'What department would you like to add?',
        name: 'dep_name'
    }).then((answers) => {
        connection.query('INSERT INTO department SET ?', answers, (err, res) => {
            if (err) throw err;
            console.log('Department Added!');
            startDirect();
        })
    })
};




connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected as ID ' + connection.threadId);
    console.log('Welcome to Your Employee Directory!');
    startDirect();
});