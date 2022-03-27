const bcrypt = require('bcrypt');

const tempUsers = [
    {
        email: "temp.user@gmail.com",
        password: bcrypt.hashSync("sdfvdf", 6),
        fname: "Temp",
        lname: "User",
        phone: "0473982982",
        address: {
            streetNumber: 32,
            streetName: "Fake Street",
            city: "Brisbane",
            state: "QLD",
            postCode: "4000",
            country: "Australia",
        },
        dob: new Date(1995, 1, 12),
    },{
        email: "temp.user1@gmail.com",
        password: bcrypt.hashSync("sdfvdf", 6),
        fname: "Temp",
        lname: "User1",
        phone: "0473982982",
        address: {
            streetNumber: "",
            streetName: "",
            city: "",
            state: "",
            postCode: "",
            country: "",
        },
        dob: "",
    },
]

module.exports = tempUsers;