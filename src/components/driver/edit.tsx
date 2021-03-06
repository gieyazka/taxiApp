import {
    Edit,
    Drawer,
    DrawerProps,
    Form,
    FormProps,
    Input,
    InputNumber,
    Radio,
    Icons,
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
    useCreate,
    useUpdate,
    useResource,
    DatePicker
} from "@pankod/refine";
import React from 'react'
import axios from 'axios'
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

type EditDriverProps = {
    drawerProps: DrawerProps;
    formProps: FormProps;
    saveButtonProps: ButtonProps;
    close: () => void
};

export const EditDriver: React.FC<EditDriverProps> = ({
    drawerProps,
    formProps,
    saveButtonProps,
    close
}) => {


    const [form] = Form.useForm()
    const t = useTranslate();
    const apiUrl = useApiUrl();
    const breakpoint = Grid.useBreakpoint();
    function getBase64(img: Blob, callback: { (imageUrl: any): void; (arg0: string | ArrayBuffer | null): any; }) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    const update = useUpdate<any>();

    const create = useCreate<any>();
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

    const onFinish: any = async (newData: { cancle_date?: string, update_log: {}[]; tel: string, name: string; lastname: string; picture: [{}]; status: string; driver_license: string }) => {
        // console.log(data);
        console.log(newData);
        return null
        let id: string = formProps.form?.getFieldsValue(true).id
        // console.log(id, apiUrl);

        await axios.get(apiUrl + `/drivers/${id}`).then(async res => {
            let oldData = res.data


            let setUpdate_log = {
                tel: oldData.tel,
                name: oldData.name,
                lastname: oldData.lastname,
                picture: oldData.picture,
                status: oldData.status,
                driver_license: oldData.driver_license
            }



            let logArr: { driver_id: string, date: string, log: {} } = {
                driver_id: id,
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
                    resource: "drivers",
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

                update.mutate({
                    resource: "drivers",
                    id: id,
                    values: newData,
                    successNotification: {
                        icon: <Icons.CheckCircleTwoTone twoToneColor="#52c41a" />,
                        message: '???????????????????????????????????????????????????????????????????????????'
                    },
                    errorNotification: {
                        icon: <Icons.CloseCircleTwoTone twoToneColor="red" />,
                        message: '????????????????????????????????????????????????????????????????????????????????????'
                    }
                }, {
                    onSuccess: (data: any) => {
                        create.mutate({
                            resource: "tracker-logs",
                            values: logArr,
                            successNotification: {
                                icon: <Icons.CheckCircleTwoTone twoToneColor="#52c41a" />,
                                message: '?????????????????????????????????????????????????????????????????????????????????????????????????????????'
                            },
                            errorNotification: {
                                icon: <Icons.CloseCircleTwoTone twoToneColor="red" />,
                                message: '??????????????????????????????????????????????????????????????????????????????????????????????????????????????????'
                            }
                        }, {
                            onSuccess: () => {
                                close();

                            }
                        });

                    }
                })
            }

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
                        label={t("????????????????????????")}>
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
                                action={`${apiUrl}/upload?token=${localStorage.getItem('Token')}`}
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
                        label={t("???????????????????????????????????????????????????????????????")}
                        name="expire_card_id"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        getValueProps={(value) => ({
                            value: value ? moment(value, 'YYYYMMDD') : "",
                        })}
                     
                    >

                         <DatePicker
                            // format={'YYYYMMDD'}
                            style={{ width: '100%' }} /> 
                        {/* <Input /> */}
                    </Form.Item>
                    <Form.Item
                        label={t("??????????????????????????????")}
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
                        label={t("??????????????????????????????????????????")}
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
                        label={t("???????????????")}
                        name="status"
                    >
                        <Radio.Group>
                            <Radio value={'approve'}>{t("?????????????????????")}</Radio>
                            <Radio value={'block'}>{t("???????????????")}</Radio>
                            <Radio value={'cancle'}>{t("??????????????????")}</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Edit>
        </Drawer>
    );
};