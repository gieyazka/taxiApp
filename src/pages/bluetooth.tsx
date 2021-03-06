import {
    List,
    TextField,
    TagField,
    DateField,
    Table,
    useTable, Input, Form, useEditableTable,
    Icons, Button,
    DatePicker, Row,
    Col,
    CrudFilters, FormProps, CreateButton,
    HttpError, EditButton, useDrawerForm, DeleteButton, useDelete, useApiUrl

} from "@pankod/refine";
import axios from "axios";
import React from "react";
import { CreateBluetooth } from "components/bluetooth/create"
import { EditBluetooth } from "components/bluetooth/edit"
export const Bluetooth: React.FC = (props) => {

    const { RangePicker } = DatePicker;
    const { tableProps, searchFormProps } = useTable<DataType, HttpError, { name: string, mac: string }>({
        onSearch: (params) => {

            const filters: CrudFilters = [];
            const { name, mac } = params;

            filters.push(
                {
                    field: "plate",
                    operator: "contains",
                    value: name,
                }, {
                field: "mac_address",
                operator: "contains",
                value: mac
            },

            );

            return filters;
        }
    });
    interface DataType {
        key: React.Key;
        name: string;
        lastname: string;
        status: string;
        tel: string;
        id: string;
        picture: [{}];
    }
    const apiUrl = useApiUrl();
    const [vehicleState, setVehicleState] = React.useState<{}[]>()

    React.useMemo(async () => {
        await axios.get(apiUrl + `/vehicles?token=${localStorage.getItem('Token')}`).then(async res => {
            // res.data.map((d : any) => console.log(d.plateNo,d.bluetooth))

            setVehicleState(res.data.filter((d: any) => !d.bluetooth));
            // setVehicleState(res.data);

        })
    }, [])
    //Create Drawer
    const {
        drawerProps: createDrawerProps,
        formProps: createFormProps,
        saveButtonProps: createSaveButtonProps,
        show: createShow,

    } = useDrawerForm<DataType>({
        action: "create",
        resource: "bluetooths",
        redirect: false,
        onMutationSuccess: () => checkBluetooth(),
        successNotification: {
            icon: <Icons.CheckCircleTwoTone twoToneColor="#52c41a" />,
            message: '????????????????????????????????????????????????????????????????????????'
        },
        errorNotification: {
            icon: <Icons.CloseCircleTwoTone twoToneColor="red" />,
            message: '?????????????????????????????????????????????????????????????????????????????????'
        }
    });

    //Edit Drawer
    const {
        drawerProps: editDrawerProps,
        formProps: editFormProps,
        saveButtonProps: editSaveButtonProps,
        show: editShow,
        close: handleClose
    } = useDrawerForm<DataType>({
        action: "edit",
        resource: "bluetooths",
        redirect: false,
        metaData: { fields: ['test1', 'test2'] }
    });
    const checkBluetooth = async () => {
        
        await axios.get(apiUrl + `/vehicles?token=${localStorage.getItem('Token')}`).then(async res => {
            setVehicleState(res.data.filter((d: any) => !d.bluetooth));
            // setVehicleState(res.data);

        })

    }
    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record: DataType) => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
    };
    const [selectionType, setSelectionType] = React.useState<'checkbox' | 'radio'>('checkbox');

    return (
        <React.Fragment>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Form style={{ justifyContent: 'end' }} layout="inline"  {...searchFormProps}>
                        <Form.Item name="name">
                            <Input
                                placeholder="??????????????????????????????????????????"
                                prefix={<Icons.SearchOutlined />}
                            />
                        </Form.Item>
                        <Form.Item name="mac">
                            <Input
                                placeholder="?????????????????????????????????"
                                prefix={<Icons.SearchOutlined />}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button htmlType="submit" style={{ backgroundColor: '#1d336d', color: 'white' }}>
                                ???????????????
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col lg={24} xs={24}>
                    <List pageHeaderProps={{ title: "????????????????????????????????????", extra: <CreateButton children={'???????????????????????????????????????????????????'} style={{ backgroundColor: '#1d336d', color: 'white' }} onClick={() => createShow()} /> }}>
                        <Table rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }} {...tableProps} rowKey="id">
                            {/* <Table.Column dataIndex="id" title="id"
                                render={(value) => value}
                                sorter

                            /> */}
                            <Table.Column
                                // dataIndex="vehicle"
                                dataIndex={["vehicle", "plateNo"]}
                                title="???????????????????????????"
                                render={(value) => {


                                    // console.log(value.plateNo)
                                    if (value) {
                                        return value
                                    } else {
                                        return " - "

                                    }
                                }
                                }
                                sorter
                            />
                            <Table.Column
                                dataIndex="mac_address"
                                title="mac_address"
                                render={(value) => value}
                                sorter
                            />

                            <Table.Column<DataType>
                                title=""
                                dataIndex="actions"
                                key="actions"
                                render={(_, record) => (
                                    <>
                                        <img style={{ width: 40, cursor: 'pointer', marginBottom: 4 }} src='/images/icon/editIcon.png' onClick={() => editShow(record.id)} />
                                        {/* <DeleteButton style={{ border: 0 }} hideText size="large" recordItemId={record.id} /> */}

                                    </>
                                )}
                            />
                        </Table>
                    </List>
                </Col>
            </Row>
            <CreateBluetooth
                checkBluetooth={checkBluetooth}
                vehicleState={vehicleState}
                drawerProps={createDrawerProps}
                formProps={createFormProps}
                saveButtonProps={createSaveButtonProps}
            />
            <EditBluetooth
                checkBluetooth={checkBluetooth}
                vehicleState={vehicleState}
                close={handleClose}
                drawerProps={editDrawerProps}
                formProps={editFormProps}
                saveButtonProps={editSaveButtonProps}
            />

        </React.Fragment>
    );
};


