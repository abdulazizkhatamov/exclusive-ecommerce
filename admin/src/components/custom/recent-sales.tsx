import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";

interface IRecentSales {
  data: {
    email: string;
    fullName: string;
    totalAmount: number;
    userId: string;
    avatarUrl?: string; // Optional for avatars
  };
}

const RecentSales: React.FC<IRecentSales> = ({ data }) => {
  return (
    <div className="space-y-8 first:mt-0 mt-7">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          {data.avatarUrl ? (
            <AvatarImage src={data.avatarUrl} alt={data.fullName} />
          ) : (
            <AvatarFallback>
              {data.fullName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">{data.fullName}</p>
          <p className="text-sm text-muted-foreground">{data.email}</p>
        </div>
        <div className="ml-auto font-medium">
          +${data.totalAmount.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default RecentSales;
