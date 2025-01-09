import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store.ts";
import OrdersTable from "@/features/orders/OrdersTable.tsx";
import { useQuery } from "react-query";
import { getOrdersByUserID } from "@/features/orders/requests.ts";
import PrimaryInput from "@/components/custom/PrimaryInput.tsx";
import { IOrder } from "@/types/order.ts";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const Orders: React.FC = () => {
  const [filter, setFilter] = React.useState("");
  const { user } = useSelector((state: RootState) => state.auth);

  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("id");

  const { data } = useQuery({
    queryKey: ["orders", user?._id],
    queryFn: () => {
      if (user && user._id) {
        return getOrdersByUserID(user._id);
      }
      return Promise.reject(new Error("User or User ID is not available"));
    },
    enabled: !!user?._id,
  });

  // Apply filter to orders
  const filteredOrders = (data?.orders || [])
    .sort(
      (a: IOrder, b: IOrder) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ) // Sort by createdAt (newest first)
    .filter(
      (order: IOrder) => order._id.toLowerCase().includes(filter.toLowerCase()), // Apply filter by Order ID
    );

  return data?.orders && data.orders.length > 0 ? (
    <div>
      <div className={"relative"}>
        <Search className={"absolute w-5 h-5 top-[30px] left-2"} />
        <PrimaryInput
          type={"text"}
          placeholder="Filter by Order ID"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={"my-5 pl-10 py-2"}
        />
      </div>
      <OrdersTable orders={filteredOrders} orderId={orderId || ""} />
    </div>
  ) : (
    <div className={"max-w-max w-full mx-auto my-5"}>
      You don't have any orders yet.
    </div>
  );
};

export default Orders;
