

import { Typography, Row, Col, Refine, useApiUrl, Authenticated, AuthProvider, LayoutWrapper, useSelect } from "@pankod/refine";
import React from 'react'
import {
    DailyOrders

} from "components/report";
const Dashboard = () => {
    const apiUrl = useApiUrl();
    const { Text, Title } = Typography
    const [driverState, setDriverState] = React.useState<{ approve: number, block: number }>()
    const [carState, setCarState] = React.useState<{ approve: number, block: number }>()
    React.useEffect(() => {
        fetch(`${apiUrl}/drivers?token=test01`)
            .then(response => response.json())
            .then(data => {
                let countApprove: number = data.filter((d: { status: string; }) => d.status === 'approve').length
                let countBlock: number = data.filter((d: { status: string; }) => d.status === 'block').length
                setDriverState({ approve: countApprove, block: countBlock })
            });
        fetch(`${apiUrl}/vehicles?token=test01`)
            .then(response => response.json())
            .then(data => {
                let countApprove: number = data.filter((d: { status: string; }) => d.status === 'approve').length
                let countBlock: number = data.filter((d: { status: string; }) => d.status === 'block').length
                setCarState({ approve: countApprove, block: countBlock })
            });
    }, [])

    return (
        <div style={{}}>
            <Row gutter={[0, 24]}>
                <Col span={8}>
                    {/* <div  style={{textAlign : 'center'}}> */}
                    <div style={{ backgroundPosition : '120% 50%',backgroundRepeat : 'no-repeat',backgroundImage : 'url("/images/driver1.png")',backgroundSize : '10vw',display: 'flex',justifyContent : 'space-between', marginLeft: "auto", marginRight: 'auto', borderRadius: 20, padding: 24, backgroundColor: '#A7F3D0', width: '25vw' }}>
                       
                        <div>

                            <Text style={{ fontSize: '1.5em' }}>รายการผู้ขับรถ</Text> <br />
                            <Text style={{ fontSize: '2em', textAlign: 'left' }}>{driverState?.approve}</Text>
                        </div>
                        {/* <img style={{ width:  '10vw',opacity : 0.5 }} src='/images/driver1.png' /> */}

                    </div>
                    {/* </div> */}
                </Col>
                <Col span={8}>
                    <div style={{ backgroundPosition : '120% 50%',backgroundRepeat : 'no-repeat',backgroundImage : 'url("/images/taxi.png")',backgroundSize : '12vw', marginLeft: "auto", marginRight: 'auto', borderRadius: 20, padding: 24, backgroundColor: '#BFDBFE', width: '25vw' }}>
                        <Text style={{ fontSize: '1.5em' }}>รายการรถ</Text> <br />
                        <Text style={{ fontSize: '2em', textAlign: 'left' }}>{carState?.approve}</Text>
                    </div>
                </Col>
                <Col span={8}>
                    <div style={{ backgroundPosition : '120% 50%',backgroundRepeat : 'no-repeat',backgroundImage : 'url("/images/userDashboard.png")',backgroundSize : '12vw',marginLeft: "auto", marginRight: 'auto', borderRadius: 20, padding: 24, backgroundColor: '#C7D2FE', width: '25vw' }}>
                        <Text style={{ fontSize: '1.5em' }}>รายการผู้ใช้งาน</Text> <br />
                        <Text style={{ fontSize: '2em', textAlign: 'left' }}>{driverState?.approve}</Text>
                    </div>
                </Col>
                <Col span={8}>
                    {/* <div  style={{textAlign : 'center'}}> */}
                    <div style={{ marginLeft: "auto", marginRight: 'auto', borderRadius: 20, padding: 24, backgroundColor: '#EF4444', width: '25vw' }}>
                        <Text style={{ fontSize: '1.5em', color: 'white' }}>รายการผู้ขับรถที่ถูกบล็อค</Text> <br />
                        <Text style={{ fontSize: '2em', textAlign: 'left', color: 'white' }}>{driverState?.block}</Text>
                    </div>
                    {/* </div> */}
                </Col>
                <Col span={8}>
                    <div style={{ marginLeft: "auto", marginRight: 'auto', borderRadius: 20, padding: 24, backgroundColor: '#EF4444', width: '25vw' }}>
                        <Text style={{ fontSize: '1.5em', color: 'white' }}>รายการรถที่ถูกบล็อค</Text> <br />
                        <Text style={{ fontSize: '2em', textAlign: 'left', color: 'white' }}>{carState?.block}</Text>
                    </div>
                </Col>
                <Col span={8}>
                    <div style={{ marginLeft: "auto", marginRight: 'auto', borderRadius: 20, padding: 24, backgroundColor: '#EF4444', width: '25vw' }}>
                        <Text style={{ fontSize: '1.5em', color: 'white' }}>รายการผู้ใช้งานที่ถูกบล็อค</Text> <br />
                        <Text style={{ fontSize: '2em', textAlign: 'left', color: 'white' }}>{driverState?.block}</Text>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export const AuthenticatedCustomPage = () => {
    return (
        <Authenticated>
            <LayoutWrapper>
                <Dashboard />
            </LayoutWrapper>
        </Authenticated>
    );
};


