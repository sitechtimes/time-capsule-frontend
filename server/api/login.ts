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

  if (body.email !== "admin@gmail.com" || body.password !== "admin") {
    throw createError({
      statusCode: 400,
      statusMessage: "Incorrect email or password"
    });
  }

  return {
    id: 1,
    email: body.email,
    firstName: "John",
    lastName: "Doe",
    userType: "supervisor",
  } satisfies LoginResponse;
});
