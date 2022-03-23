const bcrypt = require('bcrypt');

const users = [
    {
        email: "e.rodder@gmail.com",
        password: bcrypt.hashSync("sdfvdf", 6),
        fname: "Emily",
        lname: "Rodder",
        phone: "0473982982",
        address: {
            streetNumber: "32",
            streetName: "High Street",
            city: "Berkshire",
            state: "QLD",
            postCode: "4557",
            country: "Australia",
        },
        dob: new Date(1972, 1, 12),
        appointments: [],
    }, {
        email: "j.hampton@gmail.com",
        password: bcrypt.hashSync("sdfvdf", 6),
        fname: "John",
        lname: "Hampton",
        phone: "0746372891",
        address: {
            streetNumber: "333",
            streetName: "Margaret Street",
            city: "Brisbane",
            state: "QLD",
            postCode: "4000",
            country: "Australia",
        },
        dob: new Date(1980, 5, 23),
        appointments: [],
    },
]

module.exports = users;