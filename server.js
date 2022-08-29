// Include packages needed for this application
const inquirer = require('inquirer')
const mysql = require ('mysql2');

require('console.table')

// Connect to database

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
    // switch cases according to user's choice
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


// view all employees
const viewEmployee = () => {
    const query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.department_name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r
	  ON e.role_id = r.id
    LEFT JOIN department d
      ON d.id = r.department_id
    LEFT JOIN employee m
	  ON m.id = e.manager_id`

    db.query(query, function (err, results) {
        if (err) throw err;
        console.table(results);
        
        mainQuestion();
    });
};


// add employee
const addEmployee = () => {

    // select roles from mysql table
    const query =
    `SELECT r.id, r.title
    FROM role r`

    db.query(query, function (err, results) {
        if (err) throw err;

        const roleChoice = results.map(({ id, title }) => ({
            value: id, name: `${id} ${title}`
        }));
 
        sManager(roleChoice)
    });

    const sManager = (roleChoice) => {

        // select employees from mysql table
        const queryM =
        `SELECT e.id, e.first_name, e.last_name, r.title, d.department_name AS department, r.salary
        FROM employee e
        JOIN role r
          ON e.role_id = r.id
        JOIN department d
          ON d.id = r.department_id`

        db.query(queryM, function (err, results) {
            if (err) throw err;

        const managerChoice = results.map(({ id, first_name, last_name }) => ({
            value: id, name: `${first_name} ${last_name}`
        }));
 
        iPrompt(roleChoice, managerChoice)
    });
    }
        
    const iPrompt = (roleChoice, managerChoice) => {
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
                choices: roleChoice,
                name: "roleChoice"
            },
            {
                type: "list",
                message: "Who is the employee's manager?",
                choices: managerChoice,
                name: "managerChoice"
            },
        ])
    
        .then((data) => {
            // insert user's input into mysql table
            db.query("INSERT INTO employee SET ?", {
                first_name: data.firstName,
                last_name: data.lastName,
                role_id: data.roleChoice,
                manager_id: data.managerChoice
            }, 
            function(err){
                if (err) throw err;
                console.log(`Added ${data.firstName} ${data.lastName} to the database`);
            });

            mainQuestion();
        });    
    };
}; 


// update role
const updateRole = () => {

    // select employees from mysql table
    const query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.department_name AS department, r.salary
    FROM employee e
    JOIN role r
      ON e.role_id = r.id
    JOIN department d
      ON d.id = r.department_id`

    db.query(query, function (err, results) {
        if (err) throw err;

        const employeeChoice = results.map(({ id, first_name, last_name }) => ({
            value: id, name: `${first_name} ${last_name}`
        }));
 
        sRole(employeeChoice)
    });

    // select roles from mysql table
    const sRole = (employeeChoice) => {
        const query =
        `SELECT r.id, r.title, r.salary 
        FROM role r`

        db.query(query, function (err, results) {
            if (err) throw err;

            const roleChoice = results.map(({ id, title }) => ({
                value: id, name: `${id} ${title}`      
            }));

            iPrompt(employeeChoice, roleChoice)
        })
    };

    const iPrompt = (employeeChoice, roleChoice) => {
        inquirer
        .prompt([
            {
                type: "list",
                message: "Which employee's role do you want to update?",
                choices: employeeChoice,
                name: "employeeChoice"
            },
            {
                type: "list",
                message: "Which role do you want to assign the selected employee?",
                choices: roleChoice,
                name: "roleChoice"        
            },
        ])
        .then((data) => {
            // insert user's input into mysql table
            db.query("UPDATE employee SET role_id = ? WHERE id = ?", [
                data.roleChoice,
                data.employeeChoice,  
            ], 
            function(err){
                if (err) throw err;
                console.log(`Updated ${data.employeeChoice}'s role`);
            });
        
            mainQuestion();
        });   
    }
}


// view all roles
const viewRole = () => {
    const query =
    // join department name to role table
    `SELECT r.id, r.title, d.department_name AS department, r.salary
    FROM role r
    JOIN department d
      ON d.id = r.department_id`

    db.query(query, function (err, results) {
        if (err) throw err;
        console.table(results);

        mainQuestion();
    })
};


// add role
const addRole = () => {

    // select departments from mysql table

    db.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;

        const departmentChoice = results.map(({ id, department_name }) => ({
            value: id, name: `${id} ${department_name}`
          }));
        iPrompt(departmentChoice)
    })
    
    const iPrompt = (departmentChoice) => {
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
                choices: departmentChoice,
                name: "departmentChoice"
            },
        ])
        .then ((data) =>{
            // insert user's input into mysql table
            db.query("INSERT INTO role SET ?", {
                title: data.roleName,
                salary: data.roleSalary,
                department_id: data.departmentChoice
            }, 
            function(err){
                if (err) throw err;
                console.log(`Added ${data.roleName} to the database`);
            });
        
            mainQuestion();
        }); 
    }
};


// view all departments
const viewDepartment = () => {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);

        mainQuestion();
    })  
};


// add department
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
        // insert user's input into mysql table
        db.query("INSERT INTO department SET ?", {
            department_name: data.departmentName
        }, 
        function(err){
            if (err) throw err;
            console.log(`Added ${data.departmentName} to the database`);
        });

        mainQuestion();
    })
}



