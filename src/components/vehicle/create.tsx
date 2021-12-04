import {
    Create,
    Drawer,
    AutoComplete,
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
    useSelect, useCreate
} from "@pankod/refine";
import React from 'react'
import {
    useStrapiUpload,
    getValueProps,
    mediaUploadMapper,
} from "@pankod/refine-strapi";
import ProvinceData from '../../province.json'
import moment from "moment";
import _ from 'lodash'
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
interface brand_vehicle {
    id: string, brand: string, model: string
}

type CreateVehicleProps = {
    drawerProps: DrawerProps;
    formProps: FormProps;
    saveButtonProps: ButtonProps;
    close: () => void;
    brandState: brand_vehicle[] | undefined
    handleBradeState: () => void
};

export const CreateVehicle: React.FC<CreateVehicleProps> = ({
    drawerProps,
    formProps,
    saveButtonProps,
    close,
    brandState,
    handleBradeState
}) => {
    const { Option } = Select;
    const create = useCreate<any>();
    const t = useTranslate();
    const apiUrl = useApiUrl();
    const breakpoint = Grid.useBreakpoint();
    const [state, setState] = React.useState({ loading: false, imageUrl: null })
    const { selectProps: vehiclesSelectProps } = useSelect<DataType>({
        resource: "vehicles",
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
    const [brandChange, setBrandChange] = React.useState<string>()
    const onFinish = async (data: any) => {
        data.car_model = data.car_model.toUpperCase()
        data.car_brand = data.car_brand.toUpperCase()
        let checkBrand = brandState?.filter(d => (d.model === data.car_model.toUpperCase()))
        // console.log(checkBrand);
        // return null
        await create.mutate({
            resource: "vehicles",
            values: { ...data, create_date: moment().format('YYYYMMDD') },
            successNotification: {
                icon: <Icons.CheckCircleTwoTone twoToneColor="#52c41a" />,
                message: 'บันทึกข้อมูลรถยนต์สำเร็จ'
            },
            errorNotification: {
                icon: <Icons.CloseCircleTwoTone twoToneColor="red" />,
                message: 'บันทึกข้อมูลรถยนต์ไม่สำเร็จ'
            }
        }, {
            onSuccess: (d: any) => {
                if (checkBrand && !checkBrand[0]) {

                    create.mutate({
                        resource: "band-cars",
                        values: {
                            model: data.car_model.toUpperCase(),
                            brand: data.car_brand.toUpperCase()
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
                    onFinish={(d) => onFinish(d)}
                    layout="vertical"
                    initialValues={{
                        isActive: true,
                    }}
                >
                    <Form.Item style={{ textAlign: 'center' }} label={t("ภาพรถยนต์")}>
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
                                // maxCount={1}
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
                                    console.log(d, brandChange);
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
        </Drawer >
    );
};