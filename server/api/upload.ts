interface UploadBody {
  uploadDate: number;
  graduationYear: number;
  event: string;
  location: string;
  people: string[];
  imageData: string;
  author: number;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<UploadBody>(event);
  return { statusCode: 200, message: "Upload successful", data: body };
});
