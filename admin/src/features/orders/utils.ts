export const statuses = ["Placed", "Processing", "Shipped", "Delivered"];

export const getCurrentStep = (currentStatus: string) => {
  const currentIndex = statuses.findIndex(
    (status) => status.toLowerCase() === currentStatus.toLowerCase(),
  );
  return currentIndex === -1 ? 0 : currentIndex;
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};
