import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IAddress, ICartItem } from "@/types/user.ts";
import { useMutation } from "react-query";
import { deleteDeleteAddress, postCreateAddress } from "@/api/requests.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store.ts";
import { postCreateOrder } from "@/features/checkout/requests.ts";
import { updateAddress } from "@/features/auth/auth-slice.ts";
import SelectedAddress from "@/features/checkout/SelectedAddress.tsx";
import OrderSummary from "@/features/checkout/OrderSummary.tsx";
import PaymentMethod from "@/features/checkout/PaymentMethod.tsx";
import AddressForm from "@/features/checkout/AddressForm.tsx";
import AddressList from "@/features/checkout/AddressList.tsx";

const Checkout: React.FC<{ cartItems: ICartItem[] }> = ({ cartItems }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [accordionIndex, setAccordionIndex] = useState<string>("item-1");
  const [paymentMethod, setPaymentMethod] = useState<string>("Card");

  const mutationCreateAddress = useMutation({ mutationFn: postCreateAddress });
  const mutationDeleteAddress = useMutation({
    mutationFn: deleteDeleteAddress,
  });
  const mutationCreateOrder = useMutation({ mutationFn: postCreateOrder });

  const calculateSubtotal = () =>
    cartItems.reduce(
      (acc, item) => acc + item.variant.price * item.quantity,
      0,
    );

  useEffect(() => {
    if (user?.addresses && user?.addresses.length > 0) {
      setAccordionIndex("item-2");
    }
  }, [user]);

  const handleAddressSelect = (address: IAddress) =>
    setSelectedAddress(address);

  const handleDeleteAddress = (id: string) => {
    mutationDeleteAddress.mutate(id, {
      onSuccess: (response) => {
        // Ensure response has addresses or modify the payload structure accordingly
        dispatch(updateAddress(response.addresses));
        if (selectedAddress?._id === id) {
          setSelectedAddress(null); // Reset selected address if it's deleted
        }
      },
    });
  };

  console.log(cartItems);

  const handlePlaceOrder = () => {
    if (selectedAddress && paymentMethod) {
      mutationCreateOrder.mutate(
        {
          _id: "",
          user: "",
          products: cartItems.map((item) => ({
            _id: "",
            product: item.product,
            variant: item.variant,
            quantity: item.quantity,
            price: item.variant.price * item.quantity,
          })),
          billingDetails: selectedAddress,
          paymentMethod,
          paymentStatus: "Pending",
          paymentUrl: null,
          orderStatus: "Placed",
          totalAmount: calculateSubtotal(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          onSuccess: (response) => {
            window.location.href = response.order.paymentUrl;
          },
        },
      );
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-12">
      {/* Left Column - Billing Details */}
      <div>
        <h2 className="text-2xl font-medium mb-6">
          Billing & Shipping Details
        </h2>
        <Accordion
          type="single"
          collapsible
          value={accordionIndex}
          onValueChange={setAccordionIndex}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Add a New Details</AccordionTrigger>
            <AccordionContent>
              <AddressForm
                onSubmit={(values) =>
                  mutationCreateAddress.mutate(values, {
                    onSuccess: (response) => {
                      dispatch(updateAddress(response.addresses));
                      setAccordionIndex("item-2"); // Open "Your Details" accordion after adding address
                    },
                  })
                }
                isLoading={mutationCreateAddress.isLoading}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Your Details</AccordionTrigger>
            <AccordionContent>
              <AddressList
                addresses={user?.addresses || []}
                selectedAddress={selectedAddress}
                onSelect={handleAddressSelect}
                onDelete={handleDeleteAddress}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <SelectedAddress selectedAddress={selectedAddress} />
      </div>

      {/* Right Column - Order Summary */}
      <div>
        <OrderSummary
          cartItems={cartItems}
          calculateSubtotal={calculateSubtotal}
        />
        <PaymentMethod
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
        <Button
          className="max-w-max w-full rounded py-5 px-10 bg-red-500 hover:bg-red-600 mt-4"
          disabled={!selectedAddress}
          onClick={handlePlaceOrder}
        >
          Place Order
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
