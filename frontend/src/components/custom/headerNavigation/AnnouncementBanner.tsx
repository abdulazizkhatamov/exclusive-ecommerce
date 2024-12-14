import React from "react";

const AnnouncementBanner: React.FC = () => {
  return (
    <div className="flex bg-black text-white text-center py-2 text-sm">
      <div className={"flex-none px-5"}></div>
      <div className={"grow px-5"}>
        <p>
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{" "}
          <span className="font-bold">Shop Now</span>
        </p>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
