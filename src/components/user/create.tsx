import {
    Create,
    Drawer,
    DrawerProps,
    Form,
    FormProps,
    Input,
    InputNumber,
    Radio,
    Select,
    Space,
    ButtonProps,
    useTranslate,
    Avatar,
    Typography,
    Upload,
    Grid,
    getValueFromEvent,
    useApiUrl,
    useSelect,
} from "@pankod/refine";
import React from 'react'
import {
    useStrapiUpload,
    getValueProps,
    mediaUploadMapper,
} from "@pankod/refine-strapi";
const { Text } = Typography;
interface DataType {
    key: React.Key;
    name: string;
    lastname: string;
    status: string;
    tel: string;
    id: string
}


type CreateUserProps = {
    drawerProps: DrawerProps;
    formProps: FormProps;
    saveButtonProps: ButtonProps;
};

export const CreateUser: React.FC<CreateUserProps> = ({
    drawerProps,
    formProps,
    saveButtonProps,
}) => {
    const t = useTranslate();
    const apiUrl = useApiUrl();
    const breakpoint = Grid.useBreakpoint();
    const [state, setState] = React.useState({ loading: false, imageUrl: null })
    const { selectProps: driversSelectProps } = useSelect<DataType>({
        resource: "drivers",
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
                    layout="vertical"
                    initialValues={{
                        isActive: true,
                    }}
                >
                    <Form.Item style={{ textAlign: 'center' }} label={t("Image")}>
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

                            <Upload.Dragger
                                name="files"
                                action={`${apiUrl}/upload?token=test01`}
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
                        label={t("username")}
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
                        label={t("password")}
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
                        label={t("email")}
                        name="email"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input type='email' />
                    </Form.Item>
                    <Form.Item
                        label={t("name")}
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
                        label={t("lastname")}
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
                        label={t("tel.")}
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
                        label={t("role")}
                        name="user_role"
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
                        label={t("สถานะ")}
                        name="blocked"
                    >
                        <Radio.Group>
                            <Radio value={false}>{t("อนุมัติ")}</Radio>
                            <Radio value={true}>{t("บล็อค")}</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Create>
        </Drawer>
    );
};