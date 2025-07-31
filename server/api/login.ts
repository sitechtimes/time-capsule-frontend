interface LoginBody {
  email: string;
  password: string;
}

interface LoginResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: "supervisor" | "user";
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event);

  return {
    id: 1,
    email: body.email,
    firstName: "John",
    lastName: "Doe",
    userType: "user",
  } satisfies LoginResponse;
});
