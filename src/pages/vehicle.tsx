import {
    List,
    TextField,
    TagField,
    DateField,
    Table,Tag,
    useTable, Input, Form, useEditableTable,
    Icons, Button,
    DatePicker, Row,
    Col,
    CrudFilters, FormProps, CreateButton,
    HttpError, EditButton, useDrawerForm, DeleteButton, useDelete, Typography
} from "@pankod/refine";
import React from "react";
import { CreateVehicle } from "components/vehicle/create"
import { EditVehicle } from "components/vehicle/edit"
export const VehicleList: React.FC = (props) => {
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
                    <Form layout="vertical" {...searchFormProps}>
                        <Form.Item label="Search" name="name">
                            <Input
                                placeholder="Plate No"
                                prefix={<Icons.SearchOutlined />}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button htmlType="submit" style={{ backgroundColor: '#1d336d', color: 'white' }}>
                                Filter
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col lg={24} xs={24}>
                    <List pageHeaderProps={{ extra: <CreateButton style={{ backgroundColor: '#1d336d', color: 'white' }} onClick={() => createShow()} /> }}>
                        <Table rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }} {...tableProps} rowKey="id">
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
                                dataIndex="status"
                                title="สถานะ"
                                render={(value) => <Text style={value === 'approve' ? { color: '#00A524' } : { color: '#FF4F00' }}> {value === 'approve' ? "อนุมัติ" : "บล็อค"} </Text>}
                                sorter
                            />
                            <Table.Column
                                dataIndex="createdAt"
                                title="วันที่บันทึก"
                                render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
                            />
                            <Table.Column<DataType>
                                title="Actions"
                                dataIndex="actions"
                                key="actions"
                                render={(_, record) => (
                                    <>
                                        <img style={{ width: 40, cursor: 'pointer', marginBottom: 4 }} src='/images/icon/editIcon.png' onClick={() => editShow(record.id)} />
                                        <DeleteButton style={{ border: 0 }} hideText size="large" recordItemId={record.id} />

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
                drawerProps={editDrawerProps}
                formProps={editFormProps}
                saveButtonProps={editSaveButtonProps}
            />

        </React.Fragment >
    );
};


