DROP DATABASE IF EXISTS employee_DB;

CREATE DATABASE employee_DB;

USE employee_DB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    dep_name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL(6,3) NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id)
);


CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name  VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id)
);


INSERT INTO department (dep_name) 
VALUES ("Sales"), 
("Finance"), 
("Engineering"),
("Maintenance");

INSERT INTO roles (title, salary, dep_id) 
VALUES ("Sales Rep", 90.500, 1), 
("Sales Supervisor", 120.000, 1), 
("Software Engineer", 115.000, 3), 
("Lead Accountant", 140.000, 2),
("Custodian", 70.000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Snow", 2, 1), ("Holly", "Smith", 1, 1), ("William", "Broboski", 3, 2), ("Alex", "Hall", 5, 3), ("Margie", "Holland", 4, 4);