import { Refine, Resource } from "@pankod/refine";

import "@pankod/refine/dist/styles.min.css";
import { DataProvider } from "@pankod/refine-strapi";
import strapiAuthProvider from "authProvider";
import { useTranslation } from "react-i18next";
import { Header } from "components";
import { PostList } from "./pages/driver";
import { VehicleList } from "./pages/vehicle";
import { UserList } from "./pages/user";
import { Bluetooth } from "./pages/bluetooth";
import { BookingList } from "./pages/booking";
import { AuthenticatedCustomPage } from "./pages/dashboard";
import { DriverReport } from "./pages/report";
import { CustomMenu } from "./components/menu";
import { Login } from "pages/login";
function App() {
  const { t, i18n } = useTranslation();
  const API_URL = "https://survey.powermap.live";

  const { authProvider, axiosInstance } = strapiAuthProvider("https://survey.powermap.live");
  const dataProvider = DataProvider(API_URL, axiosInstance);

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <Refine
      LoginPage={Login}
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      Title={({ collapsed }) => (
        <div style={{ backgroundColor: '#007EFF', paddingTop: 12, paddingBottom: 12, textAlign: "center", color: 'white', width: '100%' }}>
          {/* {collapsed && <img src="./images/AapicoIcon.png" alt="Logo" />} */}
          {<img style={{ width: '48px' }} src="./images/aapicoLogo.png" alt="Logo" />}
          {/* <span>TEST</span> */}
        </div>
      )}
      // Header={Header}
      Sider={CustomMenu}
      routes={[
        {
          exact: true,
          component: AuthenticatedCustomPage,
          path: "/dashboard",
        },
        {
          exact: true,
          component: DriverReport,
          path: "/reportdriver",
        },
      ]}
    >
      <Resource icon={<img src='/images/icon/driver.png' />} name="drivers" list={PostList} options={{ label: "รายการผู้ขับ" }} />
      <Resource icon={<img src='/images/icon/car.png' />} name="vehicles" list={VehicleList} options={{ label: "รายการรถ" }} />
      <Resource icon={<img src='/images/icon/user.png' />} name="users" list={UserList} options={{ label: "รายการผู้ใช้งาน" }} />
      <Resource name="bluetooths" list={Bluetooth} options={{ label: "รายการบลูทูธ" }} />
    </Refine>
  );
}

export default App;
