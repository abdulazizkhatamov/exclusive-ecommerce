import React from "react";
import { IAddress } from "@/types/user.ts";
import { X } from "lucide-react";

interface AddressListProps {
  addresses: IAddress[];
  selectedAddress: IAddress | null;
  onSelect: (address: IAddress) => void;
  onDelete: (id: string) => void;
}

const AddressList: React.FC<AddressListProps> = ({
  addresses,
  selectedAddress,
  onSelect,
  onDelete,
}) => {
  return (
    <ul className="space-y-4">
      {addresses.length > 0 ? (
        addresses.map((address) => (
          <li
            key={address._id}
            className={`relative p-4 border rounded-lg cursor-pointer ${selectedAddress?._id === address._id ? "border-red-500 bg-red-100" : "border-gray-300"}`}
            onClick={() => onSelect(address)}
          >
            <button
              className="absolute right-5"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(address._id);
              }}
            >
              <X className="w-5 h-5 text-primary_red" />
            </button>
            <p className="font-medium">{address.fullName}</p>
            <p>
              {address.street}, {address.apartment}
            </p>
            <p>
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p>{address.phone}</p>
          </li>
        ))
      ) : (
        <p>No addresses found. Please add an address.</p>
      )}
    </ul>
  );
};

export default AddressList;
