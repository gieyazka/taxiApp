import {
    Create,
    Drawer,
    DrawerProps,
    Form,
    FormProps,
    Input,
    InputNumber, DatePicker,
    Radio,
    Select,
    Space,
    ButtonProps,
    useTranslate,
    Avatar,
    Icons,
    Typography,
    Upload,
    Grid,
    getValueFromEvent,
    useApiUrl,
    useSelect, useCreate
} from "@pankod/refine";
import React from 'react'

import moment from 'moment'
const { Text } = Typography;
interface DataType {
    key: React.Key;
    name: string;
    lastname: string;
    status: string;
    tel: string;
    id: string
}


type CreateDriverProps = {
    drawerProps: DrawerProps;
    formProps: FormProps;
    saveButtonProps: ButtonProps;
    close: () => void
};

export const CreateDriver: React.FC<CreateDriverProps> = ({
    drawerProps,
    formProps,
    saveButtonProps,
    close
}) => {
    const create = useCreate<any>();
    const t = useTranslate();
    const apiUrl = useApiUrl();
    const breakpoint = Grid.useBreakpoint();
    const [state, setState] = React.useState({ loading: false, imageUrl: null })
    const { selectProps: driversSelectProps } = useSelect<DataType>({
        resource: "users",
    });
    function getBase64(img: Blob, callback: { (imageUrl: any): void; (arg0: string | ArrayBuffer | null): any; }) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    const [form] = Form.useForm();

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setState({ ...state, loading: true });
            return;
        }

        if (info.file.status === 'done') {
            // Get this url from response in real world.
            //@ts-ignore
            getBase64(info.file.originFileObj, imageUrl =>
                setState({
                    imageUrl,
                    loading: false,
                }),
            );

        }
    };
    function beforeUpload(file: { type: string; size: number; }) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            //@ts-ignore
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            //@ts-ignore
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }
    const onFinish = async (data: any) => {
        data.end_license_date = moment(data.end_license_date).format('YYYYMMDD')
        data.expire_card_id = moment(data.expire_card_id).format('YYYYMMDD')
        data.license_date = moment(data.license_date).format('YYYYMMDD')
        // console.log(data);
        // return null

        await create.mutate({
            resource: "drivers",
            values: { ...data, create_date: moment().format('YYYYMMDD') },
            successNotification: {
                icon: <Icons.CheckCircleTwoTone twoToneColor="#52c41a" />,
                message: 'เพิ่มผู้ขับรถสำเร็จ'
            },
            errorNotification: {
                icon: <Icons.CloseCircleTwoTone twoToneColor="red" />,
                message: 'เพิ่มผู้ขับรถไม่สำเร็จ',
                description: 'กรุณาตรวจสอบชื่อผู้ใช้หรือเลขที่ใบขับขี่'
            }
        }, {
            onSuccess: () => {
                close()

            }
        });

    }
    return (
        <Drawer
            {...drawerProps}
            width={breakpoint.sm ? "500px" : "100%"}
            bodyStyle={{ padding: 0 }}
        >
            <Create saveButtonProps={saveButtonProps}>
                {/* <Create saveButtonProps={saveButtonProps}> */}
                <Form
                    {...formProps}
                    onFinish={(data) => onFinish(data)}
                    layout="vertical"
                    initialValues={{
                        isActive: true,
                    }}
                >
                    <Form.Item style={{ textAlign: 'center' }} label={t("ภาพคนขับ")}>
                        <Form.Item
                            style={{ height: 128, width: 128 }}
                            name="picture"
                            valuePropName="fileList"
                            // getValueFromEvent={getValueFromEvent}
                            getValueFromEvent={getValueFromEvent}
                            noStyle
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            {/* <div
                                style={{ textAlign: 'center', height: 128 }}
                            > */}

                            {/* <Upload
                                name="files"
                                listType="picture"
                                className="avatar-uploader"
                                showUploadList={false}
                                action={`${apiUrl}/upload?token=${localStorage.getItem('Token')}`}
                                beforeUpload={beforeUpload}
                                onChange={handleChange}

                            >

                                {    //@ts-ignore
                                    state.imageUrl ? <img src={state.imageUrl} alt="avatar" style={{ height: 128, width: '128px' }} /> :
                                        <img src='/images/defaultDriver.png' alt="avatar" style={{ height: 128, width: '128px' }} />
                                }
                            </Upload> */}
                            {/* </div> */}
                            <Upload.Dragger
                                name="files"
                                action={`${apiUrl}/upload?token=${localStorage.getItem('Token')}`}
                                listType="picture"
                                maxCount={1}
                                accept=".png"

                            >
                                <Space direction="vertical" size={2}>
                                    <Avatar
                                        style={{
                                            width: "128px",
                                            height: "128px",
                                            borderRadius: '50%'
                                        }}
                                        src="/images/defaultDriver.png"
                                        alt="Store Location"
                                    />


                                </Space>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item
                        label={t("ชื่อผู้ใช้")}
                        name="username"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t("รหัสผ่าน")}
                        name="password"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t("เลขบัตรประชาชน")}
                        name="card_id"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t("ที่อยู่ตามทะเบียนบ้าน")}
                        name="home_address"
                        rules={[
                            {
                                required: true,
                                type: "string",
                            },
                        ]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item
                        label={t("วันหมดอายุบัตรประชาชน")}
                        name="expire_card_id"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label={t("ชื่อผู้ขับ")}
                        name="name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t("นามสกุล")}
                        name="lastname"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t("เบอร์โทรศัพท์")}
                        name="tel"
                        rules={[
                            {
                                required: true,
                                type: "string",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t("เลขที่ใบขับขี่")}
                        name="driver_license"
                        rules={[
                            {
                                required: true,
                                type: "string",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t("วันอนุญาติใบขับขี่")}
                        name="license_date"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label={t("วันหมดอายุใบขับขี่")}
                        name="end_license_date"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label={t("ที่อยู่ กทม. และปริมณฑล")}
                        name="address"
                        rules={[
                            {
                                required: true,
                                type: "string",
                            },
                        ]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item
                        label={t("ละติจูด")}
                        name="lat"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t("ลองจิจูด")}
                        name="lon"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label={t("สถานะ")}
                        name="status"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value={'approve'}>{t("อนุมัติ")}</Radio>
                            <Radio value={'block'}>{t("บล็อค")}</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Create>
        </Drawer>
    );
};