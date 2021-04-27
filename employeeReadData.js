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

const startDirect = () => {
    inquirer.prompt(initQuestion).then((answers) => {
        switch (answers.todo) {
            case 'View All Employees':
                viewAllEmployees();
            break;
            case 'Update Employee Role':
                updateRole();
            break;
            case 'Add Employee':
                addEmployee();
            break;
            case 'Remove Employee':
                removeEmployee();
            break;
            case 'View All Roles': 
                viewRoles();
            break;
            case 'Add Role':
                addRole();
            break;
            case 'Remove Role': 
                removeRole();
            break;
            case 'View All Departments': 
                viewDepartments();
            break;

            case 'Add Department':
                addDepartment();
            break;
            case 'Remove Department':
                removeDep();
            break;
            case 'Exit':
                console.log('Have a Great Day!');
                connection.end();
        }
    })
};

const updateRole = () => {
    connection.query('SELECT CONCAT (first_name, " ", last_name) AS name, id AS value FROM employee', (err, employees) => {
        if (err) throw err;
    connection.query('SELECT title AS name, id AS value FROM role', (err, roles) => {
        if (err) throw err;
    inquirer.prompt([
        {
            type: 'list',
            message: 'Which employee would you like to change the role of?',
            name: 'id',
            choices: employees
        },
        {
            type: 'list',
            message: 'What role would you like to assign to this employee?',
            name: 'title',
            choices: roles
        }
    ]).then((answers) => {
        connection.query(`UPDATE employee SET role_id = ${answers.title} WHERE id = ${answers.id}`, (err, res) => {
            if (err) throw err;
            console.log('Role Updated!');
            startDirect();
        })
    })
    })
    })
};

const removeEmployee = () => {
    connection.query('SELECT CONCAT(first_name, " ", last_name) AS name, id AS value FROM employee', (err, employees) => {
        if (err) throw err;
    inquirer.prompt({
        type: 'list',
        message: 'Which employee would you like to remove?',
        name: 'id',
        choices: employees
    }).then((answer) => {
        connection.query('DELETE FROM employee WHERE id = ?', (answer.id), (err, res) => {
            if (err) throw err;
            console.log('Employee removed!');
            startDirect();
        })
    })
    })
};

const removeRole = () => {
    connection.query('SELECT title AS name FROM role', (err, roles) => {
        if (err) throw err;
    inquirer.prompt(
        {
            type: 'list',
            message: 'What role would you like to remove?',
            name: 'title',
            choices: roles
        }).then((answer) => {
            connection.query('DELETE FROM role WHERE ?', (answer), (err, res) => {
                if (err) throw err;
                console.log('Role removed!');
                startDirect();
            })
        })
    })
};

const removeDep = () => {
    connection.query('SELECT dep_name AS name FROM department', (err, departments) => {
        if (err) throw err;
        inquirer.prompt({
            type: 'list',
            message: 'Which department would you like to remove?',
            name: 'dep_name',
            choices: departments
        }).then((answer) => {
            console.log(answer);
            connection.query('DELETE FROM department WHERE ?', (answer), (err, res) => {
                if (err) throw err;
                console.log('Department Deleted!');
                startDirect();
            })
        })
    })
};

const addRole = () => {
    connection.query('SELECT dep_name AS name, id AS value FROM department', (err, departments) => {
        if (err) throw err;
        inquirer.prompt([{
            type: 'list',
            message: 'What department would you like to add a role to?',
            name: 'department_id',
            choices: departments
        },
        {
            type: 'input',
            message: 'What is the name of the role?',
            name: 'title',
        },
        {
            type: 'input',
            message: 'What is the salary of this role?',
            name: 'salary',
            validate: (salary) => {
                if (salary.match("[0-9]+(\.[0-9][0-9]?)?") && (salary.length < 10)) {
                    return true;
                } else {
                    console.log('You entered an invalid input!');
                } 
            },
        },
        ])
        .then((answers) => {
            connection.query('INSERT INTO role SET ?', answers, (err, res) => {
                if (err) throw err;
                console.log('Role Added!');
                startDirect();
            })
        })
    })
}

const addEmployee = () => {
    connection.query('SELECT CONCAT(first_name, " ", last_name) AS name, id AS value FROM employee', (err, managers) => {
        if (err) throw err;
    connection.query('SELECT title AS name, id AS value FROM role', (err, roles) => {
        if (err) throw err;
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

const viewRoles = () => {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
        startDirect();
    })
};

const viewAllEmployees = () => {
    connection.query('SELECT e.id, CONCAT (e.first_name, " ", e.last_name) AS employee, role.title, role.salary, department.dep_name AS department, CONCAT (m.first_name, " ", m.last_name) AS manager FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee m ON e.manager_id = m.id', (err, res) => {
        if (err) throw err;
        console.table(res);
        startDirect();
    })
};

const viewDepartments = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        startDirect();
    })
};




connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected as ID ' + connection.threadId);
    console.log('Welcome to Your Employee Directory!');
    startDirect();
});