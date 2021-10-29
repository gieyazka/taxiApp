import { Refine } from "@pankod/refine";

import "@pankod/refine/dist/styles.min.css";
import { DataProvider } from "@pankod/refine-strapi";
import strapiAuthProvider from "authProvider";
import { useTranslation } from "react-i18next";
import { Header } from "components";

function App() {
  const { t, i18n } = useTranslation();
  const API_URL = "your-strapi-api-url";

  const { authProvider, axiosInstance } = strapiAuthProvider(API_URL);
  const dataProvider = DataProvider(API_URL, axiosInstance);

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <Refine
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      Header={Header}
    ></Refine>
  );
}

export default App;
