//users endpoint should have a way to filter students/admin

interface Student {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  // uploads is foreign key
}

export default defineEventHandler(()=> {
    return [{
        id: 1,
        email: "tinaz@gmail.com",
        firstName: "Tina",
        lastName: "Zhen"
    },{
        id: 2,
        email: "elisac@gmail.com",
        firstName: "Elisa",
        lastName: "Chen"
}] satisfies Student[]
})