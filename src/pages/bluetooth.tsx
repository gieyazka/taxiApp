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
    HttpError, EditButton, useDrawerForm, DeleteButton, useDelete
} from "@pankod/refine";
import React from "react";
import { CreateBluetooth } from "components/bluetooth/create"
import { EditBluetooth } from "components/bluetooth/edit"
export const Bluetooth: React.FC = (props) => {
    const { RangePicker } = DatePicker;
    const { tableProps, searchFormProps } = useTable<DataType, HttpError, { name: string }>({
        onSearch: (params) => {

            const filters: CrudFilters = [];
            const { name } = params;
            filters.push(
                {
                    field: "name",
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
        resource: "bluetooths",
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
        resource: "bluetooths",
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
                                placeholder="name"
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
                            <Table.Column dataIndex="id" title="id"
                                render={(value) => value}
                                sorter

                            />
                            <Table.Column
                                dataIndex="plate"
                                title="plate"
                                render={(value) => value}
                                sorter
                            />
                            <Table.Column
                                dataIndex="mac_address"
                                title="mac_address"
                                render={(value) => value}
                                sorter
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
            <CreateBluetooth
                drawerProps={createDrawerProps}
                formProps={createFormProps}
                saveButtonProps={createSaveButtonProps}
            />
            <EditBluetooth
                drawerProps={editDrawerProps}
                formProps={editFormProps}
                saveButtonProps={editSaveButtonProps}
            />

        </React.Fragment>
    );
};


