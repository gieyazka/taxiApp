import {
    List,
    TextField,
    TagField,
    DateField,
    Table, Tag,
    useTable, Input, Form, useEditableTable,
    Icons, Button,
    DatePicker, Row,
    Col,
    CrudFilters, FormProps, CreateButton,
    HttpError, EditButton, useDrawerForm, DeleteButton, useDelete, Typography, useApiUrl
} from "@pankod/refine";
import React from "react";
import { CreateVehicle } from "components/vehicle/create"
import { EditVehicle } from "components/vehicle/edit"
import moment from 'moment'
import axios from "axios";
export const VehicleList: React.FC = (props) => {
    const apiUrl = useApiUrl();

    const [brandState, setBrandState] = React.useState<{ id: string, brand: string, model: string }[]>()
    React.useMemo(async () => {
        await axios.get(`${apiUrl}/band-cars?token=${localStorage.getItem('Token')}`).then(res => {
            setBrandState(res.data);

        })
    }, [])
    const handleBradeState = async () => {
        await axios.get(`${apiUrl}/band-cars?token=${localStorage.getItem('Token')}`).then(res => {
            setBrandState(res.data);

        })
    }
    const { RangePicker } = DatePicker;
    const { Text } = Typography;
    const { tableProps, searchFormProps } = useTable<DataType, HttpError, { name: string }>({
        onSearch: (params) => {

            const filters: CrudFilters = [];
            const { name } = params;
            filters.push(
                {
                    field: "plateNo",
                    operator: "contains",
                    value: name,
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

    //Create Drawer
    const {
        drawerProps: createDrawerProps,
        formProps: createFormProps,
        saveButtonProps: createSaveButtonProps,
        show: createShow,
        close: handleCreateClose,
    } = useDrawerForm<DataType>({
        action: "create",
        resource: "vehicles",
        redirect: false,
    });

    //Edit Drawer
    const {
        drawerProps: editDrawerProps,
        formProps: editFormProps,
        saveButtonProps: editSaveButtonProps,
        show: editShow,
        close: handleClose,

    } = useDrawerForm<DataType>({

        action: "edit",
        resource: "vehicles",
        redirect: false,
    });

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
                    <Form style={{ justifyContent: 'end' }} layout="inline" {...searchFormProps}>
                        <Form.Item name="name">
                            <Input
                                placeholder="??????????????????????????????????????????"
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
                    <List pageHeaderProps={{ title: '????????????????????????', extra: <CreateButton children={'???????????????????????????????????????'} style={{ backgroundColor: '#1d336d', color: 'white' }} onClick={() => createShow()} /> }}>
                        <Table
                            // rowSelection={{
                            //     type: selectionType,
                            //     ...rowSelection,
                            // }}
                            {...tableProps} rowKey="id">
                            <Table.Column dataIndex="picture" title="??????????????????"
                                render={(value) => {
                                    if (value[value.length - 1].status !== 'error') {
                                        return <img style={{ width: '48px', height: '48px' }} src={apiUrl + value[0].response[0].url} />
                                        // console.log(value.length);

                                    } else
                                        return <div>

                                            <img style={{ width: '48px', height: '48px' }} src='/images/default_car.png' />
                                        </div>
                                }

                                }
                                sorter

                            />
                            <Table.Column dataIndex="plateNo" title="???????????????????????????"
                                render={(value) => value}
                                sorter

                            />
                            <Table.Column
                                dataIndex="province"
                                title="?????????????????????"
                                render={(value) => value}
                                sorter
                            />
                            <Table.Column
                                dataIndex="identification_number"
                                title="???????????????????????????????????????"
                                render={(value) => value}
                                sorter
                            />
                            <Table.Column
                                dataIndex="motor_no"
                                title="??????????????????????????????????????????"
                                render={(value) => value}
                                sorter
                            />
                            <Table.Column
                                dataIndex="car_brand"
                                title="????????????????????????????????????"
                                render={(value) => value}
                                sorter
                            />
                            <Table.Column
                                dataIndex="car_model"
                                title="??????????????????????????????"
                                render={(value) => value}
                                sorter
                            />
                            <Table.Column
                                dataIndex="type_car"
                                title="????????????????????????????????????"
                                render={(value) => value}
                                sorter
                            />
                            <Table.Column
                                dataIndex="year_cae"
                                title="????????????"
                                render={(value) => value}
                                sorter
                            />
                            <Table.Column
                                dataIndex="cc"
                                title="??????????????????"
                                render={(value) => value}
                                sorter
                            />
                            <Table.Column
                                dataIndex="insurance_type"
                                title="??????????????????????????????????????????"
                                render={(value) => value}
                                sorter
                            />
                            <Table.Column
                                dataIndex="power_type"
                                title="???????????????????????????????????????"
                                render={(value) => value}
                                sorter
                            />
                            <Table.Column
                                dataIndex="create_date"
                                title="????????????????????????????????????"
                                render={(value) => moment(value, 'YYYYMMDD').format('DD/MM/YYYY')}

                            />
                            <Table.Column
                                dataIndex="status"
                                title="???????????????"
                                render={(value) => value === 'block' ? <Tag color="error">???????????????</Tag> : value === 'approve' ? <Tag color="success">?????????????????????</Tag> : <Tag color="default">??????????????????</Tag>}

                                sorter
                            />
                            <Table.Column
                                dataIndex="cancle_date"
                                title="????????????????????????????????????"
                                render={(value) => {
                                    if (value) {
                                        return <DateField format="DD/MM/YYYY" value={value} />

                                    } else {
                                        return '-'
                                    }
                                }
                                }

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
            <CreateVehicle
                handleBradeState={handleBradeState}
                brandState={brandState}
                drawerProps={createDrawerProps}
                formProps={createFormProps}
                saveButtonProps={createSaveButtonProps}
                close={handleCreateClose}
            />
            <EditVehicle
               handleBradeState={handleBradeState}
               brandState={brandState}
                close={handleClose}
                drawerProps={editDrawerProps}
                formProps={editFormProps}
                saveButtonProps={editSaveButtonProps}
            />

        </React.Fragment >
    );
};


