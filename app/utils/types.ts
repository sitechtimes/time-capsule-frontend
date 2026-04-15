export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: "supervisor" | "user";
}

export interface Student extends User {
  userType: "user";
  graduationYear: number;
}

export interface uploadedPhoto {
  event: string;
  imageFile: File;
  imageName: string;
  people: string[];
  location: string;
}
export interface Photo {
  id: User["id"];
  uploadDate: string;
  graduationYear: number;
  event: string;
  location: string;
  people: string[];
  imageFile: File;
  imageName: string;
  author?: number;
}
