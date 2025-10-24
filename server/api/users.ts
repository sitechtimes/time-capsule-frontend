//users endpoint should have a way to filter students/admin

interface User {
    id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: "supervisor" | "user";                                              
  // uploads is foreign key
}

interface Student extends User {
    userType: 'user',
    graduationYear: number
}

//below is only for students (user and student will be made separate)
export default defineEventHandler(()=> {
    return [{
        id: 1,
        email: "tinaz@gmail.com",
        firstName: "Tina",
        lastName: "Zhen",
        userType: "user",
        graduationYear: 2027
    },{
        id: 2,
        email: "elisac@gmail.com",
        firstName: "Elisa",
        lastName: "Chen",
        userType: 'user',
        graduationYear: 2026
},{
        id: 3,
        email: "agnes@gmail.com",
        firstName: "Agnes",
        lastName: "Lin",
        userType: 'user',
        graduationYear: 2023
}] satisfies Student[]
})
