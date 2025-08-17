export interface Card {
  id: string;
  user_id: string;
  name: string;
  number: string;
  isQRCode: boolean;
  color: string;
  imageUrl?: string;
  openCount: number;
  createdAt: string;
}