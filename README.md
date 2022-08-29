# EmployeeTracker

 ## Table of Contents
  - [Project Description](#description)
  - [Installation](#installation)
  - [Demo Video](#Demo-Video)

  ## Description
   This app is an employee tracker where user can easily access employee information from using command line.

   User is firstly prompted with a main question for what he/she wants to do.
   User has options to view departments, roles and employees of the company. When selecting, the corresponding information is presented to user with concole.table.

   User can also edit the data with "add" and "update" function, selecting from the main question.
   To be detailed, new department is added after user entering the name of the department.
   New role needs user to input role name, role salary and the department this role belongs to.
   New employee needs the input of employee's first and last name, name of the role and manager's name. 
   Role of employees can changed using update function.

   With completion of each function, user is taken back to the main question, where the app is ready for the next action.

  ## Installation
   To install necessary dependencies, user needs to install the mysql database.
   
   then run the following command in terminal:
   ```
   npm i 
   ```
   ```
   npm i inquirer
   ```
   ```
   npm i mysql
   ```
   ```
   npm i console.table
   ```
   then start with the app with:
   ```
   npm start
   ```

  ## Demo Video
   Please click [here](https://watch.screencastify.com/v/7tRtdVrGRrTQzCaHEj3e) to watch the demo video of this app.