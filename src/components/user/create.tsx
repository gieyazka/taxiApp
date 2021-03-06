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
    useSelect, useCreate, Icons
} from "@pankod/refine";
import React from 'react'
import moment from "moment";
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
    close: () => void
};

export const CreateUser: React.FC<CreateUserProps> = ({
    drawerProps,
    formProps,
    saveButtonProps,
    close
}) => {
    const { Option } = Select;
    const create = useCreate<any>();
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
    const onFinish = async (data: any) => {
        await create.mutate({
            resource: "drivers",
            values: { ...data, create_date: moment().format('YYYYMMDD') },
            successNotification: {
                icon: <Icons.CheckCircleTwoTone twoToneColor="#52c41a" />,
                message: '????????????????????????????????????????????????????????????'
            },
            errorNotification: {
                icon: <Icons.CloseCircleTwoTone twoToneColor="red" />,
                message: '??????????????????????????????????????????????????????????????????',
                description: '??????????????????????????????????????????????????????????????????'
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
                    // onFinish={(data) => onFinish(data)}

                    layout="vertical"
                    initialValues={{
                        isActive: true,
                    }}
                >
                    <Form.Item style={{ textAlign: 'center' }} label={t("??????????????????")}>
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
                        label={t("??????????????????????????????")}
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
                        label={t("????????????????????????")}
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
                        label={t("?????????????????????")}
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
                        label={t("????????????")}
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
                        label={t("?????????????????????")}
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
                        label={t("???????????????????????????????????????")}
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
                        label={t("???????????????")}
                        name="user_role"
                        rules={[
                            {
                                required: true,
                                type: "string",
                            },
                        ]}
                    >
                        <Select
                            showSearch

                            // placeholder="Select a person"
                            optionFilterProp="children"

                            filterOption={(input, option) =>
                                option?.children.indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value="superadmin">Super Admin</Option>
                            <Option value="admin">Admin</Option>

                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={t("???????????????")}
                        name="blocked"
                    >
                        <Radio.Group>
                            <Radio value={false}>{t("?????????????????????")}</Radio>
                            <Radio value={true}>{t("???????????????")}</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Create>
        </Drawer>
    );
};