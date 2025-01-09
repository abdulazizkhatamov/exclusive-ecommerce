import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { formatPrice } from "@/features/cart/utils.ts";
import { IOrder } from "@/types/order.ts";
import { Check, Clock } from "lucide-react";
import { isProduct, isVariant } from "@/features/orders/utils.ts";

interface OrdersTableProps {
  orders: IOrder[];
  orderId?: string;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, orderId }) => {
  const statuses = ["Placed", "Processing", "Shipped", "Delivered"];

  const getCurrentStep = (currentStatus: string) => {
    const currentIndex = statuses.findIndex(
      (status) => status.toLowerCase() === currentStatus.toLowerCase(),
    );
    return currentIndex === -1 ? 0 : currentIndex;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Orders</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const totalQuantity = order.products.reduce(
            (acc, item) => acc + item.quantity,
            0,
          );

          const totalAmount = order.products.reduce((acc, item) => {
            if (typeof item.variant !== "string") {
              // Safe to access item.variant.price since it's an IVariant
              return acc + item.variant.price * item.quantity;
            }
            // If variant is a string (ID), skip adding to the total amount
            return acc;
          }, 0);

          // Get the current step for each order based on the order status
          const currentStep = getCurrentStep(order.orderStatus);

          return (
            <TableRow key={order._id} className={"cursor-default"}>
              <TableCell>
                <Accordion
                  type="single"
                  collapsible
                  defaultValue={orderId === order._id ? order._id : undefined}
                >
                  <AccordionItem
                    value={order._id}
                    className={"border-b-transparent"}
                  >
                    <AccordionTrigger className="flex items-center justify-between px-5">
                      <span className="flex-grow">Order #{order._id}</span>
                      <span className="text-left px-4">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </AccordionTrigger>

                    <AccordionContent className={"p-5"}>
                      {/* Order Details */}
                      <p className={"font-medium"}>Order details:</p>
                      <div className="flex justify-between">
                        <div className={"text-left"}>
                          <div className={"my-1"}>
                            <span className="text-gray-700">
                              Payment Method:{" "}
                            </span>
                            {order.paymentMethod}
                          </div>
                          <div className={"my-1"}>
                            <span className="text-gray-700">
                              Payment Status:{" "}
                            </span>
                            <Badge variant="outline">
                              {order.paymentStatus}
                            </Badge>
                          </div>
                        </div>

                        {/* Total Quantity and Total Amount */}
                        <div className="text-left">
                          <div className={"my-1"}>
                            <span className="font-medium text-gray-700">
                              Total Quantity:{" "}
                            </span>
                            {totalQuantity}
                          </div>
                          <div className={"my-1"}>
                            <span className="font-medium text-gray-700">
                              Total Amount:{" "}
                            </span>
                            {formatPrice(totalAmount)}
                          </div>
                        </div>
                      </div>

                      <div className={"my-10"}>
                        {/* Step Timeline */}
                        <div className={"mb-5 max-w-max w-full mx-auto"}>
                          <div className="relative flex justify-between items-center">
                            {statuses.map((status, index) => (
                              <div
                                key={status}
                                className="flex flex-col items-center relative"
                              >
                                <div
                                  className={`z-50 w-8 h-8 mx-8 rounded-full border-2 flex items-center justify-center
                                  ${index < currentStep ? "bg-green-500 border-green-500" : "border-gray-300 bg-white"}
                                  ${index === currentStep ? "bg-yellow-400 border-yellow-400" : ""}`}
                                >
                                  {index < currentStep ? (
                                    <Check className="h-5 w-5 text-white" />
                                  ) : index === currentStep ? (
                                    <Clock className="h-5 w-5 text-yellow-600" />
                                  ) : (
                                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                                  )}
                                </div>
                                <div className="text-sm mt-2 font-medium">
                                  {status}
                                </div>
                                {index < statuses.length - 1 && (
                                  <div
                                    className={`absolute w-[calc(100%+2rem)] h-0.5 top-4 left-8
                                    ${index < currentStep ? "bg-green-500" : "bg-gray-300"}`}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Step Explanation */}
                        <div className="max-w-prose mx-auto w-full text-center">
                          {order.orderStatus === "Placed" && (
                            <p>
                              You have created the order, but you haven't paid
                              yet. Please proceed with the payment by clicking
                              the invoice link:{" "}
                              {order.paymentUrl && (
                                <a
                                  href={order.paymentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600"
                                >
                                  Pay Now
                                </a>
                              )}
                              .
                            </p>
                          )}

                          {order.orderStatus === "Processing" && (
                            <p>
                              Your payment has been received, and we are now
                              processing your order. We will ship your items as
                              soon as possible.
                            </p>
                          )}

                          {order.orderStatus === "Shipped" && (
                            <p>
                              Your order has been shipped, and your purchased
                              products are on the way! You will receive tracking
                              details soon.
                            </p>
                          )}

                          {order.orderStatus === "Delivered" && (
                            <p>
                              Your order has been completed, and the products
                              have been delivered to you. Thank you for shopping
                              with us!
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Loop through products */}
                      {order.products.map((item) => (
                        <div
                          key={item._id}
                          className="flex justify-between items-center gap-4 mb-4 border border-gray-200 rounded px-5 py-2"
                        >
                          <div className="flex gap-4">
                            {isVariant(item.variant) && (
                              <img
                                src={`/${item.variant.images[0]}`}
                                alt={
                                  isProduct(item.product)
                                    ? item.product.name
                                    : "Product"
                                }
                                className="w-[3rem] h-[3rem] rounded-md object-cover"
                              />
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {isProduct(item.product)
                                  ? item.product.name
                                  : "Product ID"}
                              </span>
                              {isVariant(item.variant) && (
                                <div className="text-sm text-muted-foreground">
                                  {item.variant.attributes.map(
                                    (attr, index) => (
                                      <Badge
                                        key={index}
                                        variant="secondary"
                                        className="mx-1"
                                      >
                                        {attr.value}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <div>
                              <span className="font-medium">Quantity: </span>
                              {item.quantity}
                            </div>
                            <div>
                              <span className="font-medium">Subtotal: </span>
                              {isVariant(item.variant)
                                ? formatPrice(
                                    item.variant.price * item.quantity,
                                  )
                                : "N/A"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;
