interface LoginBody {
  email: string;
  password: string;
}

export default defineEventHandler(async (event) => {
  return { statusCode: 200, message: "Delete successful" };
});
