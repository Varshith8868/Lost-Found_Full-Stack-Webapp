
import { supabase } from "@/integrations/supabase/client";
import { Item, ItemCategory, ItemStatus, Notification } from "@/types";

// Item related functions
export const getItems = async (): Promise<Item[]> => {
  const { data, error } = await supabase
    .from("items")
    .select("*");

  if (error) {
    console.error("Error fetching items:", error);
    return [];
  }

  // Map the data from snake_case to camelCase
  return data.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category as ItemCategory,
    status: item.status as ItemStatus,
    location: item.location,
    dateReported: item.date_reported,
    image: item.image || undefined,
    userId: item.user_id,
    claimedBy: item.claimed_by || undefined,
    dateResolved: item.date_resolved || undefined,
  }));
};

export const getLostItems = async (): Promise<Item[]> => {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("status", "lost");

  if (error) {
    console.error("Error fetching lost items:", error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category as ItemCategory,
    status: item.status as ItemStatus,
    location: item.location,
    dateReported: item.date_reported,
    image: item.image || undefined,
    userId: item.user_id,
    claimedBy: item.claimed_by || undefined,
    dateResolved: item.date_resolved || undefined,
  }));
};

export const getFoundItems = async (): Promise<Item[]> => {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("status", "found");

  if (error) {
    console.error("Error fetching found items:", error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category as ItemCategory,
    status: item.status as ItemStatus,
    location: item.location,
    dateReported: item.date_reported,
    image: item.image || undefined,
    userId: item.user_id,
    claimedBy: item.claimed_by || undefined,
    dateResolved: item.date_resolved || undefined,
  }));
};

export const getUserItems = async (userId: string): Promise<Item[]> => {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user items:", error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category as ItemCategory,
    status: item.status as ItemStatus,
    location: item.location,
    dateReported: item.date_reported,
    image: item.image || undefined,
    userId: item.user_id,
    claimedBy: item.claimed_by || undefined,
    dateResolved: item.date_resolved || undefined,
  }));
};

export const getItemById = async (id: string): Promise<Item | null> => {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    console.error("Error fetching item:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category as ItemCategory,
    status: data.status as ItemStatus,
    location: data.location,
    dateReported: data.date_reported,
    image: data.image || undefined,
    userId: data.user_id,
    claimedBy: data.claimed_by || undefined,
    dateResolved: data.date_resolved || undefined,
  };
};

export const addItem = async (item: Omit<Item, "id" | "dateReported">): Promise<Item | null> => {
  const { data, error } = await supabase
    .from("items")
    .insert({
      title: item.title,
      description: item.description,
      category: item.category,
      status: item.status,
      location: item.location,
      image: item.image,
      user_id: item.userId,
      claimed_by: item.claimedBy,
      date_resolved: item.dateResolved,
    })
    .select()
    .maybeSingle();

  if (error || !data) {
    console.error("Error adding item:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category as ItemCategory,
    status: data.status as ItemStatus,
    location: data.location,
    dateReported: data.date_reported,
    image: data.image || undefined,
    userId: data.user_id,
    claimedBy: data.claimed_by || undefined,
    dateResolved: data.date_resolved || undefined,
  };
};

export const updateItem = async (item: Item): Promise<Item | null> => {
  const { data, error } = await supabase
    .from("items")
    .update({
      title: item.title,
      description: item.description,
      category: item.category,
      status: item.status,
      location: item.location,
      image: item.image,
      user_id: item.userId,
      claimed_by: item.claimedBy,
      date_resolved: item.dateResolved,
    })
    .eq("id", item.id)
    .select()
    .maybeSingle();

  if (error || !data) {
    console.error("Error updating item:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category as ItemCategory,
    status: data.status as ItemStatus,
    location: data.location,
    dateReported: data.date_reported,
    image: data.image || undefined,
    userId: data.user_id,
    claimedBy: data.claimed_by || undefined,
    dateResolved: data.date_resolved || undefined,
  };
};

export const deleteItem = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting item:", error);
    return false;
  }

  return true;
};

// Notification related functions
export const getNotificationsForUser = async (userId: string): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }

  return data.map(notification => ({
    id: notification.id,
    userId: notification.user_id,
    message: notification.message,
    read: notification.read,
    date: notification.date,
    relatedItemId: notification.related_item_id || undefined,
  }));
};

export const addNotification = async (notification: Omit<Notification, "id" | "date">): Promise<Notification | null> => {
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: notification.userId,
      message: notification.message,
      read: notification.read,
      related_item_id: notification.relatedItemId,
    })
    .select()
    .maybeSingle();

  if (error || !data) {
    console.error("Error adding notification:", error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    message: data.message,
    read: data.read,
    date: data.date,
    relatedItemId: data.related_item_id || undefined,
  };
};

export const markNotificationAsRead = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id);

  if (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }

  return true;
};

// User related functions
export const updateUser = async (userId: string, userData: Partial<{
  name: string;
  contactInfo: string;
  profileImage: string;
}>): Promise<boolean> => {
  const { error } = await supabase
    .from("profiles")
    .update({
      name: userData.name,
      contact_info: userData.contactInfo,
      profile_image: userData.profileImage
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user profile:", error);
    return false;
  }

  return true;
};

export const getPublicImageUrl = (path: string): string => {
  const { data } = supabase.storage.from("items").getPublicUrl(path);
  return data?.publicUrl || "";
};
