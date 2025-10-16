export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: "supervisor" | "user";
}

export interface Student extends User {
  userType: 'user';
  graduationYear: number
}

export interface PhotoUpload {
  id: number;
  uploadDate: Date;
  graduationYear: number;
  event: string;
  location: string;
  people: string[];
  imageData: string;
  author: User["id"];
}

export interface Photo {
  id: number;
  uploadDate: Date;
  graduationYear: number;
  event: string;
  location: string;
  people: string[];
  imageData: string;
  author: string;
}
