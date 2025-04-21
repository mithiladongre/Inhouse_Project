-- Create database
CREATE DATABASE IF NOT EXISTS university_paper_db;
USE university_paper_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create papers table
CREATE TABLE IF NOT EXISTS papers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    type ENUM('subjective', 'objective', 'both') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create subjective_questions table
CREATE TABLE IF NOT EXISTS subjective_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    paper_id INT,
    question TEXT NOT NULL,
    marks INT NOT NULL,
    FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE
);

-- Create objective_questions table
CREATE TABLE IF NOT EXISTS objective_questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    paper_id INT,
    question TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE
);

-- Create options table
CREATE TABLE IF NOT EXISTS options (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_id INT,
    option_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (question_id) REFERENCES objective_questions(id) ON DELETE CASCADE
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    auto_save BOOLEAN DEFAULT false,
    dark_mode BOOLEAN DEFAULT false,
    show_marks BOOLEAN DEFAULT true,
    default_paper_type ENUM('subjective', 'objective', 'both') DEFAULT 'objective',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
); 