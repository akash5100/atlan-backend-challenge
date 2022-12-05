export default function handler(req, res) {
    const url = "http://localhost:5000/employee/csv";

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            res.status(200).json({ data });
        });
}
