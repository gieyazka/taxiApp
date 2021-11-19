import { useState, CSSProperties } from "react";
import {
    AntdLayout,
    Menu,
    Grid,
    Link,
    useMenu,
    useTitle,
    useLogout, Button
} from "@pankod/refine";
import { DatabaseOutlined, LogoutOutlined } from '@ant-design/icons'
export const CustomMenu: React.FC = () => {
    const Title = useTitle();
    const { menuItems, selectedKey } = useMenu();
    const { mutate: logout } = useLogout();
    const [collapsed, setCollapsed] = useState<boolean>(false);

    const breakpoint = Grid.useBreakpoint();
    const isMobile = !breakpoint.lg;

    return (
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
            >
                <Menu.Item key={'dashboard'} icon={<img src='/images/icon/dashboard.png' />}>
                    <Link to={'dashboard'}>Dashboard</Link>
                </Menu.Item>
                {menuItems.map(({ icon, route, label }) => (
                    <Menu.Item key={route} icon={icon}>
                        <Link to={route}>{label}</Link>
                    </Menu.Item>
                ))}
                <Menu.Item key={'reportdriver'} 
                // icon={<img src='/images/icon/dashboard.png' />}
                >
                    <Link to={'reportdriver'}>รายงานคนขับรถ</Link>
                </Menu.Item>
                <Menu.Item key={'Logout'} icon={<LogoutOutlined />}>
                    <Link onClick={() => logout()} > ออกจากระบบ</Link>
                </Menu.Item>

            </Menu>
        </AntdLayout.Sider >
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