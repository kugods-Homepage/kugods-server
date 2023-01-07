import { UserPosition } from '@prisma/client';

export type RequestUserType = {
  id: string;
  studentId: number;
  name: string;
  phone: string;
  position: UserPosition;
  isActive: boolean;
  isAdmin: boolean;
  generation: number;
  createdAt: Date;
  updatedAt: Date;
};
