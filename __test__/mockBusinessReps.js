import bcrypt from 'bcrypt';

const businessReps = [
    {
        email: "w.crofton@gmail.com",
        password: bcrypt.hashSync("Abc-1234", 6),
        fname: "William",
        lname: "Crofton",
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
    }, {
        _id: "623d340fd6dd133325228406",
        email: "j.chen@chencorp.com",
        password: bcrypt.hashSync("Abc-1234", 6),
        fname: "John",
        lname: "Chen",
        phone: "0746372891",
        address: {
            streetNumber: "333",
            streetName: "Margaret Street",
            city: "The Peak",
            state: "HK",
            postCode: "4600",
            country: "Hong Kong",
        },
        dob: new Date(1980, 5, 23),
    },
]

export default businessReps;