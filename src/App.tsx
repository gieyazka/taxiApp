import { AuthProvider, Refine } from "@pankod/refine";

import routerProvider from "@pankod/refine-react-router";
import "@pankod/refine/dist/styles.min.css";
import { DataProvider, AuthHelper } from "@pankod/refine-strapi";
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
import { CreateDriver } from "components/driver/create"
import { EditDriver } from "components/driver/edit"
import axios from "axios";
const { RouterComponent } = routerProvider;
//@ts-ignore
const CustomRouterComponent = () => <RouterComponent basename="/#" />;
function App() {
  const { t, i18n } = useTranslation();
  const API_URL = "https://survey.powermap.live";
  const TOKEN_KEY = 'strapi-jwt-token'
  // const { authProvider, axiosInstance } = strapiAuthProvider("https://survey.powermap.live");
  // const dataProvider = DataProvider(API_URL, axiosInstance);

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };
  /// 2.xx.x.x.x.x
  const axiosInstance = axios.create();
  const strapiAuthHelper = AuthHelper(API_URL);
  const dataProvider = DataProvider(API_URL, axiosInstance);
  const authProvider: AuthProvider = {
    login: async ({ username, password }) => {
      const { data, status } = await strapiAuthHelper.login(
        username,
        password,
      );
      if (status === 200) {
        localStorage.setItem(TOKEN_KEY, data.jwt);

        // set header axios instance
        axiosInstance.defaults.headers = {
          Authorization: `Bearer ${data.jwt}`,
        };

        return Promise.resolve;
      }
      return Promise.reject;
    },
    logout: () => {
      localStorage.removeItem(TOKEN_KEY);
      return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        axiosInstance.defaults.headers = {
          Authorization: `Bearer ${token}`,
        };
        return Promise.resolve();
      }

      return Promise.reject();
    },
    getPermissions: () => Promise.resolve(),
    getUserIdentity: async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        return Promise.reject();
      }

      const { data, status } = await strapiAuthHelper.me(token);
      if (status === 200) {
        const { id, username, email } = data;
        return Promise.resolve({
          id,
          username,
          email,
        });
      }

      return Promise.reject();
    },
  };

  return (
    <Refine
      //@ts-ignore
      routerProvider={{
        ...routerProvider,

        RouterComponent: CustomRouterComponent,
        routes: [
          {
            exact: true,
            component: AuthenticatedCustomPage,
            path: "/dashboard",
          },
          {
            component: DriverReport,
            path: "/reportdriver",
          },
        ]
      }}
      LoginPage={Login}
      // routerProvider={routerProvider}
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
      resources={[
        {
          name: "drivers",
          list: PostList,
          icon: <img src='/images/icon/driver.png' />,
          options: { label: "รายการผู้ขับ", route: "drivers" }

        },
        {
          name: "vehicles",
          list: VehicleList,
          icon: <img src='/images/icon/car.png' />,
          options: { label: "รายการรถ" }

        },
        {
          name: "users",
          list: UserList,
          icon: <img src='/images/icon/user.png' />,
          options: { label: "รายการผู้ใช้งาน" }

        },
        {
          name: "bluetooths",
          list: Bluetooth,
          icon: <img style={{ width: 18 }} src='/images/icon/bluetoothIcon.png' />,
          options: { label: "รายการบลูทูธ" }

        },
      ]}

    >
      {/* <Resource icon={<img src='/images/icon/driver.png' />} name="drivers" list={PostList} options={{ label: "รายการผู้ขับ" }} />
      <Resource icon={<img src='/images/icon/car.png' />} name="vehicles" list={VehicleList} options={{ label: "รายการรถ" }} />
      <Resource icon={<img src='/images/icon/user.png' />} name="users" list={UserList} options={{ label: "รายการผู้ใช้งาน" }} />
      <Resource icon={<img style={{ width: 18 }} src='/images/icon/bluetoothIcon.png' />} name="bluetooths" list={Bluetooth} options={{ label: "รายการบลูทูธ" }} /> */}
    </Refine >
  );
}

export default App;
