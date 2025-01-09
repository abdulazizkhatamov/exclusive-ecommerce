import React from "react";
import { IAddress } from "@/types/user.ts";

interface SelectedAddressProps {
  selectedAddress: IAddress | null;
}

const SelectedAddress: React.FC<SelectedAddressProps> = ({
  selectedAddress,
}) => {
  if (!selectedAddress) return null;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium">Selected Address:</h3>
      <p className="font-medium">{selectedAddress.fullName}</p>
      <p>
        {selectedAddress.street}, {selectedAddress.apartment}
      </p>
      <p>
        {selectedAddress.city}, {selectedAddress.state}{" "}
        {selectedAddress.postalCode}
      </p>
      <p>{selectedAddress.phone}</p>
    </div>
  );
};

export default SelectedAddress;
