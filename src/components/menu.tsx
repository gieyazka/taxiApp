import { useState, CSSProperties } from "react";
import {
    AntdLayout,
    Menu,
    Grid,
    Icons,
    useNavigation,
    useMenu,
    useTitle,
    useLogout, Button
} from "@pankod/refine";
import { Link, BrowserRouter as Router } from "react-router-dom";
import { DatabaseOutlined, LogoutOutlined } from '@ant-design/icons'
export const CustomMenu: React.FC = () => {
    const Title = useTitle();
    const { menuItems, selectedKey } = useMenu();
    const { mutate: logout } = useLogout();
    const { push } = useNavigation();
    const [collapsed, setCollapsed] = useState<boolean>(false);

    const breakpoint = Grid.useBreakpoint();
    const isMobile = !breakpoint.lg;

    return (
        <Router>
            <AntdLayout.Sider

                collapsible
                collapsed={collapsed}
                onCollapse={(collapsed: boolean): void => setCollapsed(collapsed)}
                collapsedWidth={isMobile ? 0 : 80}
                breakpoint="lg"
                style={isMobile ? antLayoutSiderMobile : antLayoutSider}
            >
                <Title collapsed={collapsed} />

                <Menu
                    selectedKeys={[selectedKey]}
                    mode="inline"
                    onClick={({ key }) => {
                        if (key === "logout") {
                            logout();
                            return;
                        }

                        push(key as string);
                    }}
                >
                    <Menu.Item key={'dashboard'} icon={<img src='/images/icon/dashboard.png' />}>
                        <Link to={'dashboard'}>Dashboard</Link>
                    </Menu.Item>
                    {menuItems.map(({ icon, route, label }) => (
                        <Menu.Item key={route} icon={icon}>
                            <Link to={route}>{label}</Link>
                        </Menu.Item>
                    ))}
                    {/* <Menu.Item key={'reportdriver'} icon={<img style={{ width: 18 }} src='/images/icon/reportDriver.png' />}
                    // icon={<img src='/images/icon/dashboard.png' />}
                    >
                        <Link to={'reportdriver'}>รายงานผู้ขับรถ</Link>
                    </Menu.Item> */}
                    {/* <Menu.Item key={'reportbluetooth'} icon={<img style={{ width: 18 }} src='/images/icon/reportDriver.png' />}
                    // icon={<img src='/images/icon/dashboard.png' />}
                    >
                        <Link to={'reportbluetooth'}>รายงานผู้ขับรถ</Link>
                    </Menu.Item> */}
                    <Menu.SubMenu key="sub1"  icon={<img style={{ width: 18 }} src='/images/icon/reportDriver.png' />} title="รายงาน">
                        <Menu.Item icon={<img style={{ width: 18 }} src='/images/icon/reportDriver.png' />} key="reportdriver">ผู้ขับรถ</Menu.Item>
                        <Menu.Item icon={<img style={{ width: 18 }} src='/images/icon/reportDriver.png' />} key="reportvehicle">รถยนต์</Menu.Item>
                        <Menu.Item icon={<img style={{ width: 18 }} src='/images/icon/reportDriver.png' />} key="reportbluetooth">การไม่แสดงตัวตน</Menu.Item>
               
                    </Menu.SubMenu>
                    <Menu.Item key={'logout'} icon={<LogoutOutlined />}>
                        <Link onClick={() => logout()} to={""} > ออกจากระบบ</Link>
                    </Menu.Item>

                </Menu>
            </AntdLayout.Sider >
        </Router>
    );
};

const antLayoutSider: CSSProperties = {
    backgroundColor: '#1d336d',
    position: "relative",
};
const antLayoutSiderMobile: CSSProperties = {
    backgroundColor: '#1d336d',
    position: "fixed",
    height: "100vh",
    zIndex: 999,
};