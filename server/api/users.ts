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

export default defineEventHandler(()=> {
    return [{
        id: 1,
        email: "tinaz@gmail.com",
        firstName: "Tina",
        lastName: "Zhen",
        userType: "supervisor"
    },{
        id: 2,
        email: "elisac@gmail.com",
        firstName: "Elisa",
        lastName: "Chen",
        userType: 'user',
        graduationYear: 2026
}] satisfies User[] |Student[]
})
