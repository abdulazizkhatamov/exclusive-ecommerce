import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cart from "@/features/cart/Cart.tsx";

const CartPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <main className={"container mx-auto px-4 pt-10 mb-32"}>
      {/* Breadcrumb */}
      <nav className="text-sm mb-8">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-muted-foreground hover:text-primary">
              {t("home")}
            </Link>
          </li>
          <li className="text-muted-foreground">/</li>
          <li className="text-primary">{t("cart")}</li>
        </ol>
      </nav>
      <Cart />
    </main>
  );
};

export default CartPage;
