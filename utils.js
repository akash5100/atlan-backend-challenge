/*
 * After CONSTRAINTS are defined, do we need to validate the data?
    For the phone number, yes.
 */

const validateData = (salary, savings, age, phone) => {
    if (age < 18) {
        return "Age must be greater than 18";
    }
    if (salary < 10000) {
        return "Salary must be greater than 10000";
    }
    if (savings > salary) {
        return "Savings must be less than salary";
    }
    if (String(phone).length !== 10) {
        return "Phone number must be 10 digits";
    }
    return null;
};

export { validateData };
export default validateData;
