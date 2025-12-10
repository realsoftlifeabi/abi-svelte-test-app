export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Editor';
}

export interface FormData {
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Editor';
}
