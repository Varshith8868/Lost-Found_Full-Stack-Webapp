
export type User = {
  id: string;
  name: string;
  email: string;
  contactInfo?: string;
  profileImage?: string;
};

export type ItemCategory = 
  | 'Electronics'
  | 'Books'
  | 'Accessories'
  | 'Clothing'
  | 'Documents'
  | 'Keys'
  | 'Other';

export type ItemStatus = 
  | 'lost'
  | 'found'
  | 'claimed'
  | 'resolved';

export type Item = {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  status: ItemStatus;
  location: string;
  dateReported: string;
  image?: string;
  userId: string;
  claimedBy?: string;
  dateResolved?: string;
};

export type Notification = {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  date: string;
  relatedItemId?: string;
};

export type AppState = {
  users: User[];
  items: Item[];
  notifications: Notification[];
  currentUser: User | null;
};

export interface ProtectedRouteProps {
  children: React.ReactNode;
}
