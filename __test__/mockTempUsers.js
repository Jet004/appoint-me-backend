const bcrypt = require('bcrypt');

const tempUsers = [
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
    },
]

module.exports = tempUsers;