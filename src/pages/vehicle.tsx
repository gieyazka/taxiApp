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
export const VehicleList: React.FC = (props) => {
    const apiUrl = useApiUrl();

    const { RangePicker } = DatePicker;
    const { Text } = Typography;
    const { tableProps, searchFormProps } = useTable<DataType, HttpError, { name: string }>({
        onSearch: (params) => {

            const filters: CrudFilters = [];
            const { name } = params;
            filters.push(
                {
                    field: "plateNo",
                    operator: "eq",
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
                        <Form.Item label="Search" name="name">
                            <Input
                                placeholder="Plate No"
                                prefix={<Icons.SearchOutlined />}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button htmlType="submit" style={{ backgroundColor: '#1d336d', color: 'white' }}>
                                ค้นหา
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col lg={24} xs={24}>
                    <List pageHeaderProps={{ extra: <CreateButton children={'เพิ่มข้อมูลรถ'} style={{ backgroundColor: '#1d336d', color: 'white' }} onClick={() => createShow()} /> }}>
                        <Table rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }} {...tableProps} rowKey="id">
                            <Table.Column dataIndex="picture" title="รูปภาพ"
                                render={(value) => {
                                    if (value) {
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
                            <Table.Column dataIndex="plateNo" title="ทะเบียนรถ"
                                render={(value) => value}
                                sorter

                            />
                            <Table.Column
                                dataIndex="province"
                                title="จังหวัด"
                                render={(value) => value}
                                sorter
                            />
                            <Table.Column
                                dataIndex="createdAt"
                                title="วันที่บันทึก"
                                render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
                            />
                            <Table.Column
                                dataIndex="status"
                                title="สถานะ"
                                render={(value) => value === 'block' ? <Tag color="error">บล็อค</Tag> : value === 'approve' ? <Tag color="success">อนุมัติ</Tag> : <Tag color="default">ยกเลิก</Tag>}

                                sorter
                            />
                            <Table.Column
                                dataIndex="cancle_date"
                                title="วันที่ยกเลิก"
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
                                title="Actions"
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
                drawerProps={createDrawerProps}
                formProps={createFormProps}
                saveButtonProps={createSaveButtonProps}
            />
            <EditVehicle
                close={handleClose}
                drawerProps={editDrawerProps}
                formProps={editFormProps}
                saveButtonProps={editSaveButtonProps}
            />

        </React.Fragment >
    );
};


