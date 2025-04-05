
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getItemById, updateItem, addNotification } from "@/utils/supabaseUtil";
import { useAuth } from "@/components/auth/AuthContext";
import { Item } from "@/types";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchItem = async () => {
      if (id) {
        const fetchedItem = await getItemById(id);
        if (fetchedItem) {
          setItem(fetchedItem);
        } else {
          toast({
            title: "Error",
            description: "Item not found",
            variant: "destructive",
          });
          navigate("/dashboard");
        }
        setIsLoading(false);
      }
    };
    
    fetchItem();
  }, [id, toast, navigate]);

  const handleStatusChange = async (status: "claimed" | "resolved") => {
    if (!item || !user) return;

    setIsSubmitting(true);
    try {
      const updatedItem: Item = {
        ...item,
        status,
        claimedBy: status === "claimed" ? user.id : item.claimedBy,
        dateResolved: status === "resolved" ? new Date().toISOString() : item.dateResolved,
      };

      const result = await updateItem(updatedItem);
      if (result) {
        setItem(result);
        
        // Invalidate related queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['items'] });
        queryClient.invalidateQueries({ queryKey: ['lostItems'] });
        queryClient.invalidateQueries({ queryKey: ['foundItems'] });
        queryClient.invalidateQueries({ queryKey: ['userItems'] });
        
        // Add notification for the item owner
        if (item.userId !== user.id) {
          await addNotification({
            userId: item.userId,
            message: `Your ${item.status} item "${item.title}" has been ${status}.`,
            read: false,
            relatedItemId: item.id,
          });
        }

        toast({
          title: "Status Updated",
          description: `The item has been marked as ${status}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "lost":
        return "bg-red-100 text-red-800 border-red-200";
      case "found":
        return "bg-green-100 text-green-800 border-green-200";
      case "claimed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-10 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container-custom py-10">
        <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
        <p>The item you're looking for doesn't exist.</p>
      </div>
    );
  }

  const isOwner = user && user.id === item.userId;
  const canClaim = user && !isOwner && (item.status === "lost" || item.status === "found");
  const canResolve = user && (isOwner || item.claimedBy === user.id) && item.status === "claimed";
  const formattedDate = format(new Date(item.dateReported), "MMMM d, yyyy 'at' h:mm a");

  return (
    <div className="container-custom py-10">
      <Card className="max-w-4xl mx-auto overflow-hidden">
        <CardHeader className="bg-klh-light">
          <div className="flex flex-wrap justify-between items-start gap-2">
            <div>
              <h2 className="text-2xl font-bold mb-1">{item.title}</h2>
              <p className="text-sm text-gray-500">{item.category}</p>
            </div>
            <Badge className={getStatusColor(item.status)}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-klh-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-1">Description</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-1">Details</h3>
                <div className="space-y-2">
                  <p className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-klh-primary mt-1">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span><strong>Location:</strong> {item.location}</span>
                  </p>
                  <p className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-klh-primary mt-1">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span><strong>Reported:</strong> {formattedDate}</span>
                  </p>
                  <p className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-klh-primary mt-1">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span><strong>Status:</strong> {item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                  </p>
                </div>
              </div>

              <div className="pt-4">
                {canClaim && (
                  <Button 
                    onClick={() => handleStatusChange("claimed")}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Processing..." : `Claim this ${item.status === "lost" ? "Lost" : "Found"} Item`}
                  </Button>
                )}
                
                {canResolve && (
                  <Button 
                    onClick={() => handleStatusChange("resolved")}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Processing..." : "Mark as Resolved"}
                  </Button>
                )}
                
                {item.status === "resolved" && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-md mt-4">
                    <p className="text-green-800 font-medium">This item has been successfully returned to its owner.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 py-3 px-6 flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
          {isOwner && item.status !== "resolved" && (
            <Button variant="outline" onClick={() => navigate(`/edit-item/${item.id}`)}>
              Edit Item
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ItemDetail;
