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
    useSelect, useCustom
} from "@pankod/refine";
import React from 'react'
import {
    useStrapiUpload,
    getValueProps,
    mediaUploadMapper,
} from "@pankod/refine-strapi";
import axios from "axios";
const { Text } = Typography;
interface DataType {
    key: React.Key;
    name: string;
    lastname: string;
    status: string;
    tel: string;
    id: string
}
interface carType {
    planteNo: string
}

type CreateBluetoothProps = {
    drawerProps: DrawerProps;
    formProps: FormProps;
    saveButtonProps: ButtonProps;
    vehicleState: {}[] | undefined

};
interface PostUniqueCheckResponse {
    isAvailable: boolean;
}
export const CreateBluetooth: React.FC<CreateBluetoothProps> = ({
    drawerProps,
    formProps,
    saveButtonProps,
    vehicleState
}) => {

    const { Option } = Select;
    const apiUrl = useApiUrl();

    const t = useTranslate();
    const breakpoint = Grid.useBreakpoint();
    const [state, setState] = React.useState({ loading: false, imageUrl: null })
    // const { selectProps: driversSelectProps } = useSelect<DataType>({
    //     resource: "users",
    // });
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

                    <Form.Item
                        label={t("ทะเบียนรถ")}
                        name="vehicle"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select>

                            {
                                vehicleState?.map((d: any) =>
                                    <Option value={d.id}>{d.plateNo}</Option>
                                )
                            }
                        </Select>
                        {/* <Select {...selectProps} /> */}
                    </Form.Item>
                    <Form.Item
                        label={t("mac_address")}
                        name="mac_address"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>


                </Form>
            </Create>
        </Drawer>
    );
};