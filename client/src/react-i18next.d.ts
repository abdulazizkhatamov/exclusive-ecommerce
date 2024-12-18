import "react-i18next";

declare module "react-i18next" {
  interface CustomTypeOptions {
    // Define the shape of your translation JSONs
    resources: {
      translation: {
        sign_in: string;
        sign_up: string;
      };
    };
  }
}
