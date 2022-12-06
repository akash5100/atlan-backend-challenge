import React, { useState } from "react";

const index = () => {
    // Fetch data from server "http://localhost:3000/api/csv"
    const [data, setData] = useState("");
    const [data2, setData2] = useState("");
    useState(() => {
        fetch("/api/csv")
            .then((res) => res.json())
            .then((data) => {
                var temp = data.data.csv;
                setData(temp);
            });
        fetch("/api/csv2")
            .then((res) => res.json())
            .then((data) => {
                var temp = data.data.csv;
                setData2(temp);
            });
    }, []);

    const csv_to_table = (csv) => {
        var rows = csv.split("\n");
        var table = "<table>";
        for (var i = 0; i < rows.length; i++) {
            table += "<tr style='border: 1px solid black;'>";
            var cells = rows[i].split(",");
            for (var j = 0; j < cells.length; j++) {
                table += "<td style='border: 1px solid black;'>" + cells[j] + "</td>";
            }
            table += "</tr>";
        }
        table += "</table>";

        return table;
    };

    return (
        <>
            <p>
                <a href="https://akashverma.vercel.app/">Made by Akash Verma</a>
            </p>
            <h1>Index of /</h1>
            <hr></hr>
            <h2> employee table</h2>
            <div className="table" dangerouslySetInnerHTML={{ __html: csv_to_table(data) }} />
            <hr></hr>
            <h2> message queue table</h2>
            <p> When you add new employee, keep hitting refresh button to see the table update</p>
            <div className="table" dangerouslySetInnerHTML={{ __html: csv_to_table(data2) }} />
        </>
    );
};

export default index;
