
import { Item, User, Notification, AppState } from "@/types";

// Initialize storage if it doesn't exist
const initializeStorage = () => {
  if (!localStorage.getItem("klh-app")) {
    const initialState: AppState = {
      users: [
        {
          id: "admin",
          name: "Admin User",
          email: "admin@example.com",
          profileImage: "https://i.pravatar.cc/150?u=admin",
        },
      ],
      items: [],
      notifications: [],
      currentUser: null,
    };
    localStorage.setItem("klh-app", JSON.stringify(initialState));
  }
};

// Get app state from local storage
export const getAppState = (): AppState => {
  initializeStorage();
  return JSON.parse(localStorage.getItem("klh-app") || "{}");
};

// Set app state to local storage
export const setAppState = (state: AppState) => {
  localStorage.setItem("klh-app", JSON.stringify(state));
};

// User related functions
export const registerUser = (user: Omit<User, "id">): User | null => {
  const state = getAppState();
  
  // Check if email already exists
  const userExists = state.users.some((u) => u.email === user.email);
  if (userExists) return null;
  
  // Add user
  const newUser: User = {
    id: Date.now().toString(),
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
    contactInfo: user.contactInfo,
  };
  
  state.users.push(newUser);
  state.currentUser = newUser;
  setAppState(state);
  
  return newUser;
};

export const loginUser = (email: string): User | null => {
  const state = getAppState();
  const user = state.users.find((u) => u.email === email);
  
  if (user) {
    state.currentUser = user;
    setAppState(state);
    return user;
  }
  
  return null;
};

export const logoutUser = () => {
  const state = getAppState();
  state.currentUser = null;
  setAppState(state);
};

export const getCurrentUser = (): User | null => {
  const state = getAppState();
  return state.currentUser;
};

// Item related functions
export const getAllItems = (): Item[] => {
  const state = getAppState();
  return state.items;
};

export const getLostItems = (): Item[] => {
  const state = getAppState();
  return state.items.filter(item => item.status === "lost");
};

export const getFoundItems = (): Item[] => {
  const state = getAppState();
  return state.items.filter(item => item.status === "found");
};

export const getUserItems = (userId: string): Item[] => {
  const state = getAppState();
  return state.items.filter(item => item.userId === userId);
};

export const getItemById = (id: string): Item | null => {
  const state = getAppState();
  return state.items.find(item => item.id === id) || null;
};

export const addItem = (item: Omit<Item, "id" | "dateReported">): Item => {
  const state = getAppState();
  
  const newItem: Item = {
    id: Date.now().toString(),
    title: item.title,
    description: item.description,
    category: item.category,
    status: item.status,
    location: item.location,
    dateReported: new Date().toISOString(),
    userId: item.userId,
    image: item.image,
    claimedBy: item.claimedBy,
    dateResolved: item.dateResolved,
  };
  
  state.items.push(newItem);
  setAppState(state);
  
  return newItem;
};

export const updateItem = (item: Item): Item => {
  const state = getAppState();
  
  const index = state.items.findIndex(i => i.id === item.id);
  if (index >= 0) {
    state.items[index] = item;
    setAppState(state);
  }
  
  return item;
};

// Notification related functions
export const getNotificationsForUser = (userId: string): Notification[] => {
  const state = getAppState();
  return state.notifications.filter(notification => notification.userId === userId);
};

export const addNotification = (notification: Omit<Notification, "id" | "date">): Notification => {
  const state = getAppState();
  
  const newNotification: Notification = {
    id: Date.now().toString(),
    userId: notification.userId,
    message: notification.message,
    read: notification.read,
    date: new Date().toISOString(),
    relatedItemId: notification.relatedItemId,
  };
  
  state.notifications.push(newNotification);
  setAppState(state);
  
  return newNotification;
};

export const markNotificationAsRead = (id: string): void => {
  const state = getAppState();
  
  const notification = state.notifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
    setAppState(state);
  }
};

// User profile update function
export const updateUser = (userId: string, userData: Partial<User>): boolean => {
  const state = getAppState();
  
  const userIndex = state.users.findIndex(u => u.id === userId);
  if (userIndex < 0) return false;
  
  // Update user data
  state.users[userIndex] = {
    ...state.users[userIndex],
    ...userData
  };
  
  // Also update current user if it's the same user
  if (state.currentUser && state.currentUser.id === userId) {
    state.currentUser = {
      ...state.currentUser,
      ...userData
    };
  }
  
  setAppState(state);
  return true;
};
