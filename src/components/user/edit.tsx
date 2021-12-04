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
    Typography, Icons,
    Upload,
    Grid,
    getValueFromEvent,
    useApiUrl,
    useSelect, useUpdate, useCreate, useOne
} from "@pankod/refine";
import React from 'react'
import axios from "axios";
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

type EditUserProps = {
    drawerProps: DrawerProps;
    formProps: FormProps;
    saveButtonProps: ButtonProps;
    close: () => void
};

export const EditUser: React.FC<EditUserProps> = ({
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
        resource: "users",
    });
    const [state, setState] = React.useState({ loading: false, imageUrl: null })
    const onFinish: any = async (newData: { cancle_date?: string, update_log: {}[]; tel: string, name: string; lastname: string; picture: [{}]; status: string; driver_license: string }) => {
        // console.log(data);

        let id: string = formProps.form?.getFieldsValue(true).id
        // console.log(id, apiUrl);

        await axios.get(apiUrl + `/users/${id}`).then(async res => {
            let oldData = res.data



            let setUpdate_log = {
                tel: oldData.tel,
                username: oldData.username,
                email: oldData.email,
                name: oldData.name,
                lastname: oldData.lastname,
                picture: oldData.picture,
                blocked: oldData.status,

            }



            let logArr: { user_id: string, date: string, log: {} } = {
                user_id: id,
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
            // await create.mutate({
            //     resource: "tracker-logs",
            //     values: logArr
            // });
            if (newData.status === 'cancle') {
                newData.cancle_date = moment().format('YYYYMMDD')
                await update.mutate({
                    resource: "users",
                    id: id,
                    values: newData,

                }, {
                    onSuccess: (data: any) => {
                        create.mutate({
                            resource: "tracker-logs",
                            values: logArr
                        });

                    }
                })
            } else {

                await update.mutate({
                    resource: "users",
                    id: id,
                    values: newData,
                    successNotification: {
                        icon: <Icons.CheckCircleTwoTone twoToneColor="#52c41a" />,
                        message: 'แก้ไขข้อมูลใช้งานสำเร็จ'
                    },
                    errorNotification: {
                        icon: <Icons.CloseCircleTwoTone twoToneColor="red" />,
                        message: 'แก้ไขข้อมูลใช้งานไม่สำเร็จ'
                    }
                }, {
                    onSuccess: (data: any) => {
                        create.mutate({
                            resource: "tracker-logs",
                            values: logArr,
                            successNotification: {
                                icon: <Icons.CheckCircleTwoTone twoToneColor="#52c41a" />,
                                message: 'บันทึกข้อมูลการแก้ไข้ผู้ใช้งานสำเร็จ'
                            },
                            errorNotification: {
                                icon: <Icons.CloseCircleTwoTone twoToneColor="red" />,
                                message: 'บันทึกข้อมูลการแก้ไข้ผู้ใช้งานไม่สำเร็จ'
                            }
                        });

                    }
                })
            }
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
                    onFinish={(d) => onFinish(d)}
                    layout="vertical"
                // initialValues={{
                //     isActive: true,
                // }}
                >

                    <Form.Item
                        style={{ textAlign: 'center' }}
                        label={t("ภาพผู้ใช้งาน")}>
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

                            <Upload.Dragger
                                name="files"
                                action={`${apiUrl}/upload?token=${localStorage.getItem('Token')}`}

                                listType="picture"
                                maxCount={1}
                            >
                                <p className="ant-upload-text">
                                    Drag & drop a file in this area
                                </p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item
                        label={t("Username")}
                        name="username"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item
                        label={t("อีเมลล์")}
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
                        label={t("ชื่อผู้ใช้งาน")}
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
                        label={t("สถานะ")}
                        name="blocked"
                    >
                        <Radio.Group>
                            <Radio value={false}>{t("อนุมัติ")}</Radio>
                            <Radio value={true}>{t("บล็อค")}</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Edit>
        </Drawer>
    );
};