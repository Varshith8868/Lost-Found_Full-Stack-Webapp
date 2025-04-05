
import { useState, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { ItemCategory, ItemStatus, Item } from "@/types";
import { useAuth } from "@/components/auth/AuthContext";
import { addItem, getLostItems, updateItem, deleteItem } from "@/utils/supabaseUtil";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ItemFormProps {
  type: "lost" | "found";
}

const ItemForm = ({ type }: ItemFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ItemCategory>("Electronics");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLostItemDialog, setShowLostItemDialog] = useState(type === "found");
  const [selectedLostItem, setSelectedLostItem] = useState<Item | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch lost items for the found form
  const { data: lostItems = [], isLoading: loadingLostItems } = useQuery({
    queryKey: ['lostItems'],
    queryFn: getLostItems,
    enabled: type === "found"
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    
    try {
      setUploadProgress(0);
      
      const { error: uploadError, data } = await supabase.storage
        .from('items')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percent);
          },
        });

      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: publicUrl } = supabase.storage
        .from('items')
        .getPublicUrl(filePath);
        
      return publicUrl.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSelectLostItem = (item: Item) => {
    setSelectedLostItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setCategory(item.category);
    setLocation(item.location);
    setImage(item.image || null);
    setShowLostItemDialog(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      // First handle image upload if there is a selected file
      let imageUrl = image;
      if (selectedFile && (!selectedLostItem || type === "lost")) {
        imageUrl = await uploadImage(selectedFile);
        if (!imageUrl && image?.startsWith("data:")) {
          // If upload failed but we have a data URL, don't use it
          imageUrl = null;
        }
      }
      
      // For found items that match a lost item
      if (type === "found" && selectedLostItem) {
        // Update the lost item to found status
        const updatedItem = await updateItem({
          ...selectedLostItem,
          status: "resolved", // Mark as resolved instead of found
          claimedBy: user.id,
          dateResolved: new Date().toISOString(),
        });

        if (updatedItem) {
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ['items'] });
          queryClient.invalidateQueries({ queryKey: ['lostItems'] });
          queryClient.invalidateQueries({ queryKey: ['foundItems'] });
          queryClient.invalidateQueries({ queryKey: ['userItems'] });
          
          toast({
            title: "Success!",
            description: "Item has been marked as found and removed from the lost items list.",
          });
          navigate("/dashboard");
          return;
        }
      } else {
        // Add a new item
        const newItem = await addItem({
          title,
          description,
          category,
          status: type as ItemStatus,
          location,
          userId: user.id,
          image: imageUrl || undefined,
        });

        if (newItem) {
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ['items'] });
          queryClient.invalidateQueries({ queryKey: ['lostItems'] });
          queryClient.invalidateQueries({ queryKey: ['foundItems'] });
          queryClient.invalidateQueries({ queryKey: ['userItems'] });
          
          toast({
            title: "Success!",
            description: `Your ${type} item has been reported.`,
          });
          navigate("/dashboard");
        } else {
          throw new Error("Failed to create item");
        }
      }
    } catch (error) {
      console.error("Error submitting item:", error);
      toast({
        title: "Error",
        description: "Failed to submit your item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {type === "found" && (
        <Dialog open={showLostItemDialog} onOpenChange={setShowLostItemDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Select a Lost Item</DialogTitle>
              <DialogDescription>
                Did you find an item that someone reported as lost? Select it from the list below or create a new found item report.
              </DialogDescription>
            </DialogHeader>
            
            {loadingLostItems ? (
              <div className="flex justify-center py-5">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : lostItems.length === 0 ? (
              <div className="text-center py-5">
                <p>No lost items have been reported yet.</p>
              </div>
            ) : (
              <div className="grid gap-4 max-h-[50vh] overflow-y-auto py-2">
                {lostItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSelectLostItem(item)}
                  >
                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLostItemDialog(false)}>
                Report New Found Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {selectedLostItem 
              ? "Mark Item as Found" 
              : `Report ${type === "lost" ? "a Lost" : "a Found"} Item`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Item Title</Label>
              <Input
                id="title"
                placeholder="Brief name of the item"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={!!selectedLostItem}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the item"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="min-h-[100px]"
                disabled={!!selectedLostItem}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as ItemCategory)}
                disabled={!!selectedLostItem}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Books">Books</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Documents">Documents</SelectItem>
                  <SelectItem value="Keys">Keys</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Where was the item lost or found?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                disabled={!!selectedLostItem}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Item Image</Label>
              <div className="flex flex-col items-center space-y-4">
                {image && (
                  <div className="relative w-full max-w-md aspect-video">
                    <img 
                      src={image}
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-md border" 
                    />
                    {!selectedLostItem && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImage(null);
                          setSelectedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                )}
                
                {!selectedLostItem && !image && (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-md p-10 w-full flex flex-col items-center justify-center cursor-pointer hover:border-gray-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-2">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    <span className="text-gray-600">Click to upload an image</span>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  id="image"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={!!selectedLostItem}
                />
              </div>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full mt-2">
                  <div className="bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-center mt-1">{uploadProgress}% uploaded</p>
                </div>
              )}
            </div>

            {type === "found" && (
              <Button 
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowLostItemDialog(true)}
              >
                Select a Different Lost Item
              </Button>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? "Submitting..." 
                : selectedLostItem 
                  ? "Confirm Item Found" 
                  : `Submit ${type === "lost" ? "Lost" : "Found"} Item Report`
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default ItemForm;
