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
    useSelect, useCustom, useUpdate, useCreate
} from "@pankod/refine";
import React from 'react'
import moment from "moment";
import axios from 'axios'
const { Text } = Typography;
interface DataType {
    key: React.Key;
    name: string;
    lastname: string;
    status: string;
    tel: string;
    id: string
}

type EditBluetoothProps = {
    drawerProps: DrawerProps;
    formProps: FormProps;
    saveButtonProps: ButtonProps;
    close: () => void
};

export const EditBluetooth: React.FC<EditBluetoothProps> = ({
    drawerProps,
    formProps,
    saveButtonProps,
    close
}) => {
    const update = useUpdate<any>();

    const create = useCreate<any>();
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
    const OnFinish: any = async (newData: { cancle_date?: string, update_log: {}[]; tel: string, name: string; lastname: string; picture: [{}]; status: string; driver_license: string }) => {
        // console.log(data);

        let id: string = formProps.form?.getFieldsValue(true).id
        // console.log(id, apiUrl);


        await axios.get(apiUrl + `/bluetooths/${id}`).then(async res => {
            let oldData = res.data



            let setUpdate_log = {


                mac_address: oldData.mac_address,
                plate: oldData.plate,

            }


            let logArr: { bluetooth_id: string, date: string, log: {} } = {
                bluetooth_id: id,
                date: moment().format("YYYYMMDD"),
                log: {
                    old_data: setUpdate_log,
                    new_data: newData
                }
            }
            // if (oldData.update_log) {
            //     logArr = oldData.update_log
            // }

            // newData.update_log = logArr
            // console.log(oldData);
            // console.log(newData);


            update.mutate({
                resource: "bluetooths",
                id: id,
                values: newData,

            }, {
                onSuccess: (data: any) => {
                    create.mutate({
                        resource: "tracker-logs",
                        values: logArr
                    });

                }
            }
            )



            close()

        })

    }
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
                    onFinish={(d) => OnFinish(d)}
                    layout="vertical"
                    initialValues={{
                        isActive: true,
                    }}
                >

                    <Form.Item
                        label={t("ทะเบียนรถ")}
                        name="plate"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
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
            </Edit>
        </Drawer>
    );
};
