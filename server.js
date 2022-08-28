// Include packages needed for this application
const inquirer = require('inquirer')
const mysql = require ('mysql2');

require('console.table')

// Connect to database
require('dotenv').config()

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
)


db.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + db.threadId);
    console.log(`
    ╔═══╗─────╔╗──────────────╔═╗╔═╗
    ║╔══╝─────║║──────────────║║╚╝║║
    ║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗
    ║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝
    ║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣║║║║║║╔╗║║║║╔╗║╚╝║║═╣║
    ╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝
    ───────║║──────╔═╝║─────────────────────╔═╝║
    ───────╚╝──────╚══╝─────────────────────╚══╝`)
    // runs the app
    mainQuestion();
});


// Command line questions
const mainQuestion = () => {
    inquirer
    .prompt ([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ['View All Employees', 
                    'Add Employee', 
                    'Update Employee Role', 
                    'View All Roles', 
                    'Add Role', 
                    'View All Departments', 
                    'Add Department'],
            name: "task"
        },
    ])
    .then((choice) => {
        switch (choice.task){
            case 'View All Employees': 
            viewEmployee();
            break;

            case 'Add Employee': 
            addEmployee();
            break;

            case 'Update Employee Role': 
            updateRole();
            break;

            case 'View All Roles': 
            viewRole();
            break;

            case 'Add Role': 
            addRole();
            break;

            case 'View All Departments': 
            viewDepartment();
            break;

            case 'Add Department': 
            addDepartment();
            break;
        }
    })
};


const viewEmployee = () => {
    const query = 
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r
      ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
      ON m.id = e.manager_id`

    db.query(query, function (err, results) {
        console.table(results);
      });
    mainQuestion()
};


const addEmployee = () => {
    inquirer
    .prompt ([
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "firstName"
        },
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "lastName"
        },
        {
            type: "list",
            message: "What is the employee's role?",
            // change choices
            choices: ['Sales', 'Salesperson', 
                     'Lead Engineer', 'Software Engineer', 
                     'Account Manager', 'Accountant', 
                     'Legal Team Lead', 'Lawyer'
                // newly add role
            ],
            name: "roleChoice"
        },
        {
            type: "list",
            message: "Who is the employee's manager?",
            // change choices
            choices: ['None', 
                     'John Doe', 'Mike Chan',
                     'Ashley Rodriguez', 'Kevin Tupik',
                     'Kunal Singh', 'Malia Brown',
                     'Sarah Lourd', 'Tom Allen'
                // newly add role
            ],
            name: "managerChoice"
        },
    ])
    then((data) => {
        db.query('INSERT INTO employee', 'VALUES', (data.firstName, data.lastName)
        ),
        console.log(`Added ${data.firstName} ${data.lastName} to the database`),
        mainQuestion()
    });    
}


const viewRole = () => {
    db.query('SELECT * FROM role', function (err, results) {
        console.table(results);
      });
    mainQuestion()
};


const addRole = () => {
    inquirer
    .prompt ([
        {
            type: "input",
            message: "What is the name of the role?",
            name: "roleName"
        },
        {
            type: "input",
            message: "What is the salary of the role?",
            name: "roleSalary" 
        },
        {
            type: "list",
            message: "Which department does the role belong to?",
            // change choices
            choices: ['Sales', 'Engineering', 'Finance', 'Legal'
            // newly add department
            ],
            name: "departmentChoice"
        },
    ])
    .then ((data) =>{
        db.query('INSERT INTO roll', 'VALUES', (data.roleName, data.roleSalary)
        ),
        console.log(`Added ${data.roleName} to the database`),
        mainQuestion()
    });   
};


const viewDepartment = () => {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
      });
    mainQuestion()
};


const addDepartment = () => {
    inquirer
    .prompt ([
        {
            type: "input",
            message: "What is the name of the department?",
            name: "departmentName"
        },
    ])
    .then ((data) =>{
        db.query('INSERT INTO department', 'VALUES', (data.departmentName)
        ),
        console.log(`Added ${data.departmentName} to the database`),
        mainQuestion()
    }); 
}


