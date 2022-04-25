const business = [
    {
        _id: "5ee9f9f8f9f9f9f9f9f9f9f9",
        abn: 12345678912,
        name: "Jet Mandarin",
        address: {
            streetNumber: 123,
            streetName: "Main St",
            city: "Brisbane",
            state: "NSW",
            postCode: 2000,
            country: "Australia"
        },
        phone: "0412345678",
        email: "jet@jetmandarin.com",
        businessRep: "623d340fd6dd133325228406",
        operatingHours: [
            { day: "Monday", startTime: "0900", endTime: "1700" },
            { day: "Tuesday", startTime: "0900", endTime: "1700" },
            { day: "Wednesday", startTime: "0900", endTime: "1700" },
            { day: "Thursday", startTime: "0900", endTime: "1700" },
            { day: "Friday", startTime: "0900", endTime: "1700" }
        ],
        services: [],
        appointments: [],
    }
]

export const services = [
    {
        name: "Casual Lessons",
        description: "A 1 hour lesson in Mandarin Chinese",
        duration: 55,
        break: 5,
        fee: 60
    },
    {
        name: "Long Session",
        description: "A 1 1/2 hour lesson in Mandarin Chinese",
        duration: 80,
        break: 10,
        fee: 85
    },
    {
        name: "Chinese for Kids!",
        description: "Classes tailored to children aged 3-6. Learn through play!",
        duration: 40,
        break: 5,
        fee: 45
    },
    {
        name: "Chinese for School!",
        description: "Classes tailored to school aged children in year 1-6.",
        duration: 55,
        break: 5,
        fee: 60
    },
    {
        name: "Chinese for Teens!",
        description: "Classes tailored to high school sturents year 7-12. Following a curriculum based learning approach, this coursework covers everything needed to achieve a high level of proficiency in Mandarin Chinese.",
        duration: 55,
        break: 5,
        fee: 75
    },
    {
        name: "Chinese for Business and Professionals",
        description: "A 1 1/2 hour lesson in Mandarin Chinese",
        duration: 55,
        break: 5,
        fee: 75
    }
]

export default business