interface DeleteBody {
  photoId: number;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<DeleteBody>(event);
  return { statusCode: 200, message: "Delete successful" };
});
