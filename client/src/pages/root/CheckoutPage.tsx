import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Checkout from "@/features/checkout/Checkout.tsx";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store.ts";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?.cart?.length === 0) navigate("/");
  }, [user]);

  return (
    <main className={"container mx-auto px-4 pt-10 mb-32 font-inter"}>
      {/* Breadcrumb */}
      <nav className="text-sm mb-8">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-muted-foreground hover:text-primary">
              {t("home")}
            </Link>
          </li>
          <li className="text-muted-foreground">/</li>
          <li className="text-primary">{t("checkout")}</li>
        </ol>
      </nav>
      <Checkout cartItems={user?.cart || []} />
    </main>
  );
};

export default CheckoutPage;
