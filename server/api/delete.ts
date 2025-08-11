interface DeleteBody {
  photoId: number;
}

export default defineEventHandler(async (event) => {
  const _body = await readBody<DeleteBody>(event);
  return { statusCode: 200, message: "Delete successful" };
});
