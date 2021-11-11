import {
    Edit,
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
const { Text } = Typography;
interface DataType {
    key: React.Key;
    name: string;
    lastname: string;
    status: string;
    tel: string;
    id: string
}

type EditDriverProps = {
    drawerProps: DrawerProps;
    formProps: FormProps;
    saveButtonProps: ButtonProps;
};

export const EditDriver: React.FC<EditDriverProps> = ({
    drawerProps,
    formProps,
    saveButtonProps,

}) => {

    const t = useTranslate();
    const apiUrl = useApiUrl();
    const breakpoint = Grid.useBreakpoint();
    function getBase64(img: Blob, callback: { (imageUrl: any): void; (arg0: string | ArrayBuffer | null): any; }) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
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
    const { selectProps: categorySelectProps } = useSelect<DataType>({
        resource: "drivers",
    });
    const [state, setState] = React.useState({ loading: false, imageUrl: null })
    return (
        <Drawer
            {...drawerProps}
            width={breakpoint.sm ? "500px" : "100%"}
            bodyStyle={{ padding: 0 }}
        >
            <Edit
                saveButtonProps={saveButtonProps}
                pageHeaderProps={{ extra: null }}
            >
                <Form
                    {...formProps}
                    layout="vertical"
                // initialValues={{
                //     isActive: true,
                // }}
                >

                    <Form.Item
                        style={{ textAlign: 'center' }}
                        label={t("ภาพคนขับ")}>
                        <Form.Item
                            name="picture"
                            valuePropName="fileList"
                            getValueFromEvent={getValueFromEvent}
                            noStyle
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            {/* <Upload
                                name="files"
                                listType="picture"
                                className="avatar-uploader"
                                showUploadList={false}
                                action={`${apiUrl}/upload?token=test01`}
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                            >
                                {    //@ts-ignore
                                    //formProps.form?.getFieldValue('picture')
                                    formProps.form?.getFieldValue('picture') !== undefined ?
                                        state.imageUrl ? <img src={state.imageUrl} alt="avatar" style={{ height: 128, width: '128px' }} /> :
                                            <img src={` ${apiUrl}${formProps.form?.getFieldValue('picture')[formProps.form?.getFieldValue('picture').length - 1].response[0].url}`} alt="avatar" style={{ height: 128, width: '128px' }} /> :
                                        <img src='/images/defaultDriver.png' alt="avatar" style={{ height: 128, width: '128px' }} />

                                }
                            </Upload> */}
                            <Upload.Dragger
                                name="files"
                                action={`${apiUrl}/upload?token=test01`}

                                listType="picture"
                            // maxCount={1}
                            >
                                <p className="ant-upload-text">
                                    Drag & drop a file in this area
                                </p>
                            </Upload.Dragger>
                        </Form.Item>
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
                        label={t("สถานะ")}
                        name="status"
                    >
                        <Radio.Group>
                            <Radio value={'approve'}>{t("อนุมัติ")}</Radio>
                            <Radio value={'block'}>{t("บล็อค")}</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Edit>
        </Drawer>
    );
};