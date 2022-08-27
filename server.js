// Include packages needed for this application
const inquirer = require('inquirer')
const fs = require ('fs');
const mysql = require ('mysql2');

// Connect to database
requestAnimationFrame('dotenv').config()

const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
)


// Command line questions
const mainQuestion = () => {
    inquirer
    .prompt ([
        {
            type: "list",
            message: "What would you like to do?",
            choice: ['View All Employees', 
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
    db.query('SELECT * FROM employee', function (err, results) {
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
            choice: ['Sales', 'Salesperson', 
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
            choice: ['None', 
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
        console.log(`Added ${data.firstName} ${data.lastName} to the database`)
    }); 
    mainQuestion()
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
            choice: ['Sales', 'Engineering', 'Finance', 'Legal'
            // newly add department
            ],
            name: "departmentChoice"
        },
    ])
    .then ((data) =>{
        db.query('INSERT INTO roll', 'VALUES', (data.roleName, data.roleSalary)
        ),
        console.log(`Added ${data.roleName} to the database`)
    }); 
    mainQuestion()
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
        console.log(`Added ${data.departmentName} to the database`)
    }); 
    mainQuestion()
}
