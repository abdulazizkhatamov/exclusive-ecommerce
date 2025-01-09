import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/auth-slice.ts";
import uiCategoryReducer from "@/features/ui/ui-category-slice.ts";
import uiProductReducer from "@/features/ui/ui-product-slice.ts";
import uiVariantReducer from "@/features/ui/ui-variant-slice.ts";

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui_category: uiCategoryReducer,
    ui_product: uiProductReducer,
    ui_variant: uiVariantReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
