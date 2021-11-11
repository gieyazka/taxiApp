import React from "react";
import {
    Row,
    Col,
    AntdLayout,
    Card,
    Typography,
    Form,
    Input,
    Button,
    Checkbox,
} from "@pankod/refine";
import "./styles.css";

import { UserOutlined } from '@ant-design/icons';
import { useLogin } from "@pankod/refine";

const { Text, Title } = Typography;

export interface ILoginForm {
    username: string;
    password: string;
    remember: boolean;
}

export const Login: React.FC = () => {
    const [form] = Form.useForm<ILoginForm>();

    const { mutate: login } = useLogin<ILoginForm>();

    const CardTitle = (
        <Title level={3} className="title">
            Sign in your account
        </Title>
    );

    return (
        <div >
            <Row style={{ fontFamily: "Bai Jamjuree" }}>
                <Col>
                    <div style={{ position: 'relative', backgroundColor: '#E5E5E5', height: '100vh', width: '75vw' }}>
                        <img style={{ position: 'absolute', transform: 'translate(-20%,-50%)',left : '20%', top: '50%', width: '40vw', height: '60vh' }} src='/images/login.png' ></img>
                    </div>
                </Col>
                <div style={{ position: 'absolute', right: '0', backgroundColor: '#003FA5', height: '100vh', width: '25vw' }}></div>
                <Form<ILoginForm> layout="vertical"
                    form={form}
                    onFinish={(values) => {
                        login(values);
                    }}
                    requiredMark={false}

                >
                    <Card style={{ zIndex: 20, boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), -4px -4px 4px rgba(0, 0, 0, 0.05)', position: 'fixed', right: '16.5vw', top: '12vh', width: '18vw', paddingBottom: '20vh' ,paddingTop : '10vh'}}>

                        <h1 style={{ textAlign: 'center', color: '#003FA5' }}>Welcome</h1>

                        <Form.Item
                            name="username"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="username" style={{ borderTop: 0, borderLeft: 0, borderRight: 0, borderBottom: ' 1px solid #d9d9d9', borderRadius: '0' }} prefix={<UserOutlined />} />

                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true }]}
                            style={{ marginBottom: "12px" }}
                        >
                            <Input.Password placeholder='password' prefix={<img src='/images/icon/password.png' />} style={{ borderTop: 0, borderLeft: 0, borderRight: 0, borderBottom: ' 1px solid #d9d9d9', borderRadius: '0' }} />

                        </Form.Item>
                        <div style={{ marginBottom: "12px" }}>
                            <Form.Item
                                name="remember"
                                valuePropName="checked"
                                noStyle
                            >
                                <Checkbox
                                    style={{
                                        fontSize: "12px",
                                    }}
                                >
                                    Remember me
                                </Checkbox>
                            </Form.Item>
                            <br />
                            <a
                                style={{
                                    float: "right",
                                    fontSize: "12px",
                                }}
                                href="#"
                            >
                                ลืมรหัสผ่าน?
                            </a>
                        </div>
                        <div style={{ marginTop: '24px', textAlign: 'right' }}>
                            {/* <button type='button' onClick={() => { window.open('https://ess.aapico.com/#/register') }} style={{ cursor: 'pointer', border: '1.5px solid ', borderColor: '#1D366D', borderRadius: '10px', color: '#FFF',backgroundColor : '#1D366D', padding: '3px 12px ' }}> Register</button> */}
                            <Button htmlType="submit"
                                block style={{ width: '100%', marginTop: 24, cursor: 'pointer', border: '1.5px solid ', borderColor: '#1D366D', borderRadius: '24px', color: '#FFF', backgroundColor: '#1D366D', padding: '3px 12px ' }}> เข้าสู่ระบบ</Button>

                            {/* <button type="submit" onClick={(e) => onLogin(e)} style={{ zIndex: 5, cursor: 'pointer', marginLeft: '8px', backgroundColor: '#1D366D', borderRadius: '10px', color: '#FFF', border: '0', padding: '4px 12px ' }}> {language == 'TH' ? 'เข้าสู่ระบบ' : 'Sign In'}</button> */}

                        </div>
                    </Card>
                </Form>
            </Row>
        </div >
    );
};