export type Role = "admin" | "faculty" | "student";

export type AttendanceStatus = "present" | "late" | "absent";

export type LeaveStatus = "pending" | "approved" | "rejected";

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  avatar?: string;
  status?: string;
  requiresPasswordChange?: boolean;
  profile?: {
    fullName: string;
    phone?: string;
    address?: string;
    bio?: string;
    department?: string;
    designation?: string;
    qualification?: string;
    officeHours?: string;
    enrollmentNumber?: string;
    employeeId?: string;
    studentId?: string;
    semester?: number;
    currentSemester?: number;
    batch?: string;
    parentPhone?: string;
    parentEmail?: string;
  };
}
