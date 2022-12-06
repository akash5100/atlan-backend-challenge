// Schemas

// Import the schema definitions

const formSchema = `CREATE TABLE IF NOT EXISTS form (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
    )`;

const questionSchema = `CREATE TABLE IF NOT EXISTS question (
    id INTEGER PRIMARY KEY,
    form_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        FOREIGN KEY (form_id) REFERENCES form (id)
    )`;

const responseSchema = `CREATE TABLE IF NOT EXISTS response (
    id INTEGER PRIMARY KEY,
    form_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (form_id) REFERENCES form (id)
    )`;

const answerSchema = `CREATE TABLE IF NOT EXISTS answer (
    id INTEGER PRIMARY KEY,
    response_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (response_id) REFERENCES response (id),
    FOREIGN KEY (question_id) REFERENCES question (id)
    )`;

const citiesSchema = `CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT NOT NULL
    )`;

const slangsSchema = `CREATE TABLE IF NOT EXISTS slangs (
    id INTEGER PRIMARY KEY,
    slang TEXT NOT NULL,
    translation TEXT,
    city_id INTEGER NOT NULL,
    FOREIGN KEY (city_id) REFERENCES cities(id)
    )`;

const employeesSchema = `CREATE TABLE IF NOT EXISTS employee (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    salary INTEGER NOT NULL,
    savings INTEGER NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL UNIQUE,
    form_id INTEGER NULL,
    CONSTRAINT age_check CHECK (age > 18),
    CONSTRAINT salary_check CHECK (salary > 10000),
    CONSTRAINT savings_check CHECK (savings < salary)
    CONSTRAINT form_id FOREIGN KEY (form_id) REFERENCES forms(id)
    )`;

const queueSchema = `CREATE TABLE IF NOT EXISTS queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL
    )`;

export { formSchema, questionSchema, responseSchema, answerSchema, citiesSchema, slangsSchema, employeesSchema, queueSchema };
export default formSchema;
