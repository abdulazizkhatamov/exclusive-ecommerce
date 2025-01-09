import React from "react";

interface PaymentMethodProps {
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  paymentMethod,
  setPaymentMethod,
}) => {
  return (
    <div className="space-y-3 py-4">
      <p className="font-medium">Payment method:</p>
      {["Card"].map((method, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            type="radio"
            name="payment"
            id={method.toLowerCase().replace(" ", "-")}
            className="w-4 h-4 accent-red-500"
            checked={paymentMethod === method}
            onChange={() => setPaymentMethod(method)}
          />
          <label htmlFor={method.toLowerCase().replace(" ", "-")}>
            {method}
          </label>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethod;
