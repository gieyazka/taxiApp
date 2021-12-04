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
    Space, AutoComplete,
    ButtonProps,
    useTranslate,
    Avatar,
    Typography,
    Upload,
    Grid,
    Icons,
    getValueFromEvent,
    useApiUrl,
    useSelect,
    useUpdate, useCreate,
} from "@pankod/refine";
import React from 'react'
import axios from 'axios'
import moment from 'moment'
import ProvinceData from '../../province.json'
import _ from 'lodash'

const { Text } = Typography;
interface DataType {
    key: React.Key;
    name: string;
    lastname: string;
    status: string;
    tel: string;
    id: string
}
interface brand_vehicle {
    id: string, brand: string, model: string
}

type EditVehicleProps = {
    drawerProps: DrawerProps;
    formProps: FormProps;
    saveButtonProps: ButtonProps;
    close: () => void;
    brandState: brand_vehicle[] | undefined
    handleBradeState: () => void
};
export const EditVehicle: React.FC<EditVehicleProps> = ({
    drawerProps,
    formProps,
    saveButtonProps,
    close,
    brandState,
    handleBradeState
}) => {
    const [brandChange, setBrandChange] = React.useState<string>()

    const update = useUpdate<any>();
    const { Option } = Select;
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
    const onFinish: any = async (newData: { car_brand: string; car_model: string, cancle_date?: string, update_log: {}[]; tel: string, name: string; lastname: string; picture: [{}]; status: string; driver_license: string }) => {
        // console.log(data);
        newData.car_model = newData.car_model.toUpperCase()
        newData.car_brand = newData.car_brand.toUpperCase()
        let checkBrand = brandState?.filter(d => (d.model === newData.car_model.toUpperCase()))


        // return null
        let id: string = formProps.form?.getFieldsValue(true).id
        // console.log(id, apiUrl);

        await axios.get(apiUrl + `/vehicles/${id}`).then(async res => {
            let oldData = res.data

            let setUpdate_log = {
                picture: oldData.picture,
                plateNo: oldData.plateNo,
                status: oldData.status,
                province: oldData.province
            }


            let logArr: { driver_id: string, date: string, log: {} } = {
                driver_id: id,
                date: moment().format("YYYYMMDD"),
                log: {
                    old_data: setUpdate_log,
                    new_data: newData
                }
            }


            // await create.mutate({
            //     resource: "tracker-logs",
            //     values: logArr
            // });

            if (newData.status === 'cancle') {
                newData.cancle_date = moment().format('YYYYMMDD')
                await update.mutate({
                    resource: "vehicles",
                    id: id,
                    values: newData,
                    successNotification: {
                        icon: <Icons.CheckCircleTwoTone twoToneColor="#52c41a" />,
                        message: 'แก้ไขข้อมูลรถยนต์สำเร็จ'
                    },
                    errorNotification: {
                        icon: <Icons.CloseCircleTwoTone twoToneColor="red" />,
                        message: 'แก้ไขข้อมูลรถยนต์ไม่สำเร็จ'
                    }
                }, {
                    onSuccess: (data: any) => {

                        create.mutate({
                            resource: "tracker-logs",
                            values: logArr,
                            successNotification: {
                                icon: <Icons.CheckCircleTwoTone twoToneColor="#52c41a" />,
                                message: 'บันทึกข้อมูลการแก้ไข้ผู้ขับรถสำเร็จ'
                            },
                            errorNotification: {
                                icon: <Icons.CloseCircleTwoTone twoToneColor="red" />,
                                message: 'บันทึกข้อมูลการแก้ไข้ผู้ขับรถไม่สำเร็จ'
                            }
                        }, {
                            onSuccess: () => {
                                if (checkBrand && !checkBrand[0]) {

                                    create.mutate({
                                        resource: "band-cars",
                                        values: {
                                            model: newData.car_model.toUpperCase(),
                                            brand: newData.car_brand.toUpperCase()
                                        },
                                        successNotification: {
                                            icon: <Icons.CheckCircleTwoTone twoToneColor="#52c41a" />,
                                            message: 'บันทึกข้อมูลยี่ห้อรถยนต์สำเร็จ'
                                        },
                                        errorNotification: {
                                            icon: <Icons.CloseCircleTwoTone twoToneColor="red" />,
                                            message: 'บันทึกข้อมูลยี่ห้อรถยนต์ไม่สำเร็จ'
                                        }
                                    }, {
                                        onSuccess: () => {
                                            handleBradeState()

                                        }
                                    });

                                }
                                close()
                            }
                        });

                    }
                })
            } else {

                await update.mutate({
                    resource: "vehicles",
                    id: id,
                    values: newData,
                    successNotification: {
                        icon: <Icons.CheckCircleTwoTone twoToneColor="#52c41a" />,
                        message: 'แก้ไขข้อมูลรถยนต์สำเร็จ'
                    },
                    errorNotification: {
                        icon: <Icons.CloseCircleTwoTone twoToneColor="red" />,
                        message: 'แก้ไขข้อมูลรถยนต์ไม่สำเร็จ'
                    }
                }, {
                    onSuccess: (data: any) => {
                        create.mutate({
                            resource: "tracker-logs",
                            values: logArr,
                            successNotification: {
                                icon: <Icons.CheckCircleTwoTone twoToneColor="#52c41a" />,
                                message: 'บันทึกข้อมูลการแก้ไข้ผู้ขับรถสำเร็จ'
                            },
                            errorNotification: {
                                icon: <Icons.CloseCircleTwoTone twoToneColor="red" />,
                                message: 'บันทึกข้อมูลการแก้ไข้ผู้ขับรถไม่สำเร็จ'
                            }
                        }, {
                            onSuccess: () => {
                                if (checkBrand && !checkBrand[0]) {

                                    create.mutate({
                                        resource: "band-cars",
                                        values: {
                                            model: newData.car_model.toUpperCase(),
                                            brand: newData.car_brand.toUpperCase()
                                        },
                                        successNotification: {
                                            icon: <Icons.CheckCircleTwoTone twoToneColor="#52c41a" />,
                                            message: 'บันทึกข้อมูลยี่ห้อรถยนต์สำเร็จ'
                                        },
                                        errorNotification: {
                                            icon: <Icons.CloseCircleTwoTone twoToneColor="red" />,
                                            message: 'บันทึกข้อมูลยี่ห้อรถยนต์ไม่สำเร็จ'
                                        }
                                    }, {
                                        onSuccess: () => {
                                            handleBradeState()

                                        }
                                    });

                                }
                                close()
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
                        label={t("ภาพรถยนต์")}>
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
                            // maxCount={1}
                            >
                                <p className="ant-upload-text">
                                    Drag & drop a file in this area
                                </p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item
                        label={t("ทะเบียนรถ")}
                        name="plateNo"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t("จังหวัด")}
                        name="province"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            // style={{ width: 200 }}
                            // placeholder="Select a person"
                            optionFilterProp="children"

                            filterOption={(input, option) =>
                                //@ts-ignore
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {
                                ProvinceData.map(d =>
                                    <Option key={d.PROVINCE_ID} value={d.PROVINCE_NAME}>{d.PROVINCE_NAME}</Option>

                                )
                            }

                        </Select>
                    </Form.Item>



                    <Form.Item
                        label={t("หมายเลขตัวถัง")}
                        name="identification_number"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t("หมายเลขมอเตอร์")}
                        name="motor_no"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t("ปีรถ")}
                        name="year_car"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t("ยี่ห้อรถยนต์")}
                        name="car_brand"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <AutoComplete
                            onChange={(d) => setBrandChange(d)}

                            // placeholder="try to type `b`"
                            filterOption={(inputValue, option) =>
                                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                        >
                            {
                                brandState && _.unionBy(brandState, 'brand').map((d: brand_vehicle) => {


                                    return < AutoComplete.Option key={d.id} value={d.brand} >
                                        {d.brand}
                                    </AutoComplete.Option>
                                })
                            }

                        </AutoComplete>
                    </Form.Item>
                    <Form.Item
                        label={t("รุ่นรถยนต์")}
                        name="car_model"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <AutoComplete
                            // BrandChage
                            // placeholder="try to type `b`"
                            filterOption={(inputValue, option) =>
                                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                        >
                            {
                                brandState && brandChange && brandState.map((d: brand_vehicle) => {
                                    // console.log(d, brandChange);
                                    if (d.brand === brandChange) {

                                        return <AutoComplete.Option key={d.id} value={d.model}>
                                            {d.model}
                                        </AutoComplete.Option>
                                    }
                                })
                            }


                        </AutoComplete>
                    </Form.Item>
                    <Form.Item
                        label={t("ลักษณะรถยนต์")}
                        name="type_car"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="เลือกลักษณะรถยนต์"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value="รถเก๋งสองตอน">รถเก๋งสองตอน</Option>
                            <Option value="รถเก๋งสองตอนแวน">รถเก๋งสองตอนแวน</Option>
                            <Option value="รถเก๋งสามตอน">รถเก๋งสามตอน</Option>
                            <Option value="รถยนต์นั่งสองตอน">รถยนต์นั่งสองตอน</Option>
                            <Option value="รถยนต์นั่งสองตอนแวน">รถยนต์นั่งสองตอนแวน</Option>
                            <Option value="รถยนต์นั่งสามตอนแวน">รถยนต์นั่งสามตอนแวน</Option>
                            <Option value="รถยนต์นั่งสามตอนแวน">รถยนต์นั่งสามตอนแวน</Option>

                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={t("ซีซีรถ")}
                        name="cc"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input type='number' />
                    </Form.Item>

                    <Form.Item
                        label={t("ระดับประกันภัย")}
                        name="insurance_type"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="เลือกลักษณะรถยนต์"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value="ชั้น 1">ชั้น 1</Option>
                            <Option value="ชั้น 2">ชั้น 2</Option>
                            <Option value="ชั้น 2+">ชั้น 2+</Option>
                            <Option value="ชั้น 3">ชั้น 3</Option>
                            <Option value="ชั้น 3+">ชั้น 3+</Option>


                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={t("การใช้พลังงาน")}
                        name="power_type"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="เลือกประเภทการใช้พลังงาน"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value="ใช้ก๊าซ NGV">ใช้ก๊าซ NGV</Option>
                            <Option value="ใช้ก๊าซ NGV ร่วมกับน้ำมัน">ใช้ก๊าซ NGV ร่วมกับน้ำมัน</Option>
                            <Option value="ใช้ไฟฟ้า">ใช้ไฟฟ้า</Option>

                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={t("สถานะ")}
                        name="status"
                    >
                        <Radio.Group>
                            <Radio value={'approve'}>{t("อนุมัติ")}</Radio>
                            <Radio value={'block'}>{t("บล็อค")}</Radio>
                            <Radio value={'cancle'}>{t("ยกเลิก")}</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Edit>
        </Drawer>
    );
};