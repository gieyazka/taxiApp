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
    HttpError, EditButton, useDrawerForm, DeleteButton, useDelete, Tag
} from "@pankod/refine";
import React from "react";
import { CreateUser } from "components/user/create"
import { EditUser } from "components/user/edit"
export const UserList: React.FC = (props) => {
    const { RangePicker } = DatePicker;
    const { tableProps, searchFormProps } = useTable<DataType, HttpError, { name: string }>({
        onSearch: (params) => {

            const filters: CrudFilters = [];
            const { name } = params;

            filters.push(
                {
                    field: "username",
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
        close: handleCreateClose
    } = useDrawerForm<DataType>({
        action: "create",
        resource: "users",
        redirect: false,
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
        resource: "users",
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
                    <Form style={{ justifyContent: 'end' }} layout="inline"  {...searchFormProps}>
                        <Form.Item name="name">
                            <Input
                                placeholder="ค้นหาผู้ใช้งาน"
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
                    <List pageHeaderProps={{ title: "ข้อมูลผู้ใช้งาน", extra: <CreateButton children={'เพิ่มผู้ใช้งาน'} style={{ backgroundColor: '#1d336d', color: 'white' }} onClick={() => createShow()} /> }}>
                        <Table rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }} {...tableProps} rowKey="id">
                            <Table.Column dataIndex="username" title="ชื่อผู้ใช้"
                                render={(value) => value}
                                sorter

                            />
                            <Table.Column
                                dataIndex="email"
                                title="อีเมลล์"
                                render={(value) => value}
                                sorter
                            />
                            <Table.Column
                                dataIndex="name"
                                title="ชื่อ"
                                render={(value) => value}
                                sorter
                            />
                            <Table.Column
                                dataIndex="lastname"
                                title="นามสกุล"
                                render={(value) => value}
                                sorter
                            />
                            <Table.Column
                                dataIndex="tel"
                                title="เบอร์โทรศัพท์"
                                render={(value) => value}
                                sorter
                            />
                            <Table.Column
                                dataIndex="user_role"
                                title="บทบาท"
                                render={(value) => value}
                                sorter
                            />
                            <Table.Column
                                dataIndex="blocked"
                                title="สถานะ"
                                render={(value) => value ? <Tag color="error">บล็อค</Tag> : <Tag color="success">อนุมัติ</Tag>}
                                sorter
                            />
                            <Table.Column
                                dataIndex="createdAt"
                                title="วันที่บันทึก"
                                render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
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
            <CreateUser
                close={handleCreateClose}
                drawerProps={createDrawerProps}
                formProps={createFormProps}
                saveButtonProps={createSaveButtonProps}
            />
            <EditUser
                close={handleClose}
                drawerProps={editDrawerProps}
                formProps={editFormProps}
                saveButtonProps={editSaveButtonProps}
            />

        </React.Fragment>
    );
};


