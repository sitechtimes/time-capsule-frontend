interface LoginBody {
  email: string;
  password: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event);

  return { token: "a" };
});
