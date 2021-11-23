import {
    List,
    TextField,
    TagField,
    DateField,
    Table,
    useTable, Input, Form, useEditableTable,
    Icons, Button,
    DatePicker, Row, Tag,
    Col,
    CrudFilters, FormProps, CreateButton,
    HttpError, EditButton, useDrawerForm, DeleteButton, useDelete, useApiUrl
} from "@pankod/refine";
import React from "react";
import { CreateDriver } from "components/driver/create"
import { EditDriver } from "components/driver/edit"
import moment from 'moment'
export const PostList: React.FC = (props) => {
    const apiUrl = useApiUrl();
    const { RangePicker } = DatePicker;
    const { tableProps, searchFormProps } = useTable<DataType, HttpError, { name: string }>({
        onSearch: (params) => {

            const filters: CrudFilters = [];
            const { name } = params;
            filters.push(
                {
                    field: "name",
                    operator: "contains",
                    value: name,
                },

            );

            return filters;
        }
    });
    interface DataType {
        role: string;
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
        resource: "drivers",
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
        resource: "drivers",
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
        })
    };
    const [selectionType, setSelectionType] = React.useState<'checkbox' | 'radio'>('checkbox');

    return (
        <React.Fragment>
            <Row gutter={[16, 16]}>
                <Col span={24}>

                    <Form style={{ justifyContent: 'end' }} layout="inline" {...searchFormProps}>

                        <Form.Item name="name">
                            <Input
                                placeholder="ค้นหาผู้ขับรถ"
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
                    <List pageHeaderProps={{ title: 'ข้อมูลผู้ขับรถ', extra: <CreateButton children={'เพิ่มข้อมูลผู้ขับ'} style={{ backgroundColor: '#1d336d', color: 'white' }} onClick={() => createShow()} /> }}>
                        <Table
                            // rowSelection={{
                            //     type: selectionType,
                            //     ...rowSelection,
                            // }} 
                            {...tableProps} dataSource={tableProps.dataSource?.filter(d => d.role === 'driver')} rowKey="id">

                            <Table.Column dataIndex="picture" title="รูปภาพ"
                                render={(value) => {
                                    if (value) {
                                        // console.log();
                                        return <img style={{ width: '48px', height: '48px' }} src={apiUrl + value[value.length - 1].response[0].url} />
                                        // console.log(value.length);

                                    } else
                                        return <div>

                                            <img style={{ width: '48px', height: '48px' }} src='/images/default_user.png' />
                                        </div>
                                }

                                }
                                sorter

                            />
                                  <Table.Column dataIndex="username" title="ชื่อผู้ใช้งาน"
                                render={(value) => value}
                                sorter

                            />
                            <Table.Column dataIndex="name" title="ชื่อ"
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
                                dataIndex="driver_license"
                                title="เลขใบขับขี่"
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
                                dataIndex="create_date"
                                title="วันที่บันทึก"
                                render={(value) => moment(value, 'YYYYMMDD').format('DD/MM/YYYY')}
                            />
                            <Table.Column
                                dataIndex="status"
                                title="สถานะ"
                                render={(value) => value === 'block' ? <Tag color="error">บล็อค</Tag> : value === 'approve' ? <Tag color="success">อนุมัติ</Tag> : <Tag color="default">ยกเลิก</Tag>}

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
            <CreateDriver
                close={handleCreateClose}
                drawerProps={createDrawerProps}
                formProps={createFormProps}
                saveButtonProps={createSaveButtonProps}
            />
            <EditDriver
                close={handleClose}
                drawerProps={editDrawerProps}
                formProps={editFormProps}
                saveButtonProps={editSaveButtonProps}
            />

        </React.Fragment>
    );
};


