
import { Link } from "react-router-dom";
import { Item } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublicImageUrl } from "@/utils/supabaseUtil";
import { formatDistanceToNow } from "date-fns";

interface ItemCardProps {
  item: Item;
}

// const ItemCard = ({ item }: ItemCardProps) => {
//   const getStatusColor = () => {
//     switch (item.status) {
//       case "lost":
//         return "bg-red-100 text-red-800 border-red-200";
//       case "found":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "claimed":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case "resolved":
//         return "bg-blue-100 text-blue-800 border-blue-200";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

  // const formatDate = (dateString: string) => {
  //   try {
  //     return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  //   } catch (error) {
  //     return "Invalid date";
  //   }
  // };

//   return (
//     <Link to={`/item/${item.id}`}>
//       <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
//         <div className="aspect-square relative overflow-hidden bg-gray-100">
//           {item.image ? (
//             <img
//               src={item.image}
//               alt={item.title}
//               className="object-cover w-full h-full"
//             />
//           ) : (
//             <div className="flex items-center justify-center h-full bg-klh-muted">
//               <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
//                 <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
//                 <circle cx="9" cy="9" r="2" />
//                 <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
//               </svg>
//             </div>
//           )}
//           <div className="absolute top-2 right-2">
//             <Badge className={`${getStatusColor()}`}>
//               {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
//             </Badge>
//           </div>
//         </div>
//         <CardContent className="p-4">
//           <h3 className="font-medium text-lg mb-1 line-clamp-1">{item.title}</h3>
//           <p className="text-sm text-gray-500 mb-2">
//             <span className="inline-block mr-1">
//               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline text-gray-400 mr-1">
//                 <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
//                 <circle cx="12" cy="10" r="3" />
//               </svg>
//             </span>
//             {item.location}
//           </p>
//           <p className="text-sm line-clamp-2 text-gray-600">{item.description}</p>
//         </CardContent>
//         <CardFooter className="px-4 py-3 text-xs text-gray-500 border-t bg-gray-50">
//           {formatDate(item.dateReported)}
//         </CardFooter>
//       </Card>
//     </Link>
//   );
// };

// export default ItemCard;

// filepath: c:\Users\konal\klh-campus-finds-tracker\updated-klh-Lost-Found\klh-campus-finds-tracker\src\components\items\ItemCard.tsx

const ItemCard = ({ item }: ItemCardProps) => {
  const getStatusColor = () => {
    switch (item.status) {
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

  const imageUrl = item.image ? getPublicImageUrl(item.image) : "/public/placeholder.svg";

  return (
    <Link to={`/item/${item.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={item.title}
            className="object-cover w-full h-full"
            onError={(e) => {
              // Fallback to a placeholder image if the image fails to load
              (e.target as HTMLImageElement).src = "/public/placeholder.svg";
            }}
          />
        </div>
        <CardContent>
          <h3 className="text-lg font-bold">{item.title}</h3>
        </CardContent>
        <CardFooter>
          <Badge className={getStatusColor()}>{item.status}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
};  

export default ItemCard;
