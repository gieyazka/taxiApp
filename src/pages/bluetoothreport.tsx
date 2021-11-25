

import {
    Button, Typography, Row, Col, Refine, useApiUrl, Authenticated, AuthProvider, LayoutWrapper, useSelect
    , DatePicker, Table, List, Tag
} from "@pankod/refine";
import React from 'react'
import {
    DailyOrders

} from "components/report";
import moment from 'moment'
import Swal from "sweetalert2";
import { ColumnsType } from 'antd/es/table';
import { json2csv } from "json-2-csv";
//@ts-ignore
import ReactExport from 'react-data-export';


interface driver {
    create_date: string;
    driver_license: string;
    id: string;
    picture: [];
    name: string;
    lastname: string;
    status: string;
    username: string
    length: number
}
interface driverState {
    startDate?: string;
    endDate?: string;
    data: any
}
const Bluetooth_Report = () => {
    const apiUrl = useApiUrl();
    const { Text, Title } = Typography
    const [driverState, setDriverState] = React.useState<driverState>()
    const [carState, setCarState] = React.useState<{ approve: number, block: number }>()
    const [dateState, setdateState] = React.useState<{ startDate?: string, endDate?: string }>()
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const [exportExcel, setExportExcel] = React.useState<{ status: boolean, data?: {}[] }>({ status: false });


    const genReport = (startDate: string | undefined, endDate: string | undefined) => {
        if (!startDate || startDate === 'Invalid date') {
            Swal.fire({
                icon: "info",
                title: "กรุณาเลือกวันที่เริ่มต้น",
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                // form.resetFields()

            });
            return null
        }
        if (!endDate || endDate === 'Invalid date') {
            Swal.fire({
                icon: "info",
                title: "กรุณาเลือกวันที่สิ้นสุด",
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                // form.resetFields()

            });
            return null
        }

        if (parseInt(startDate) > parseInt(endDate)) {
            Swal.fire({
                icon: "info",
                title: "วันที่ไม่ถูกต้อง",
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                // form.resetFields()

            });
            return null
        }
        fetch(`${apiUrl}/drivers?token=test01&create_date_gte=${startDate}&create_date_lte=${endDate}`)
            .then(response => response.json())
            .then((data: driver) => {
                setDriverState({
                    startDate: moment(startDate, 'YYYYMMDD').format('DD/MM/YYYY'),
                    endDate: moment(endDate, 'YYYYMMDD').format('DD/MM/YYYY'),
                    data: data
                });
                const borders = {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' },
                };
                const style = {
                    alignment: { horizontal: 'center' },
                    border: borders,
                    fill: { patternType: 'solid', fgColor: { rgb: '1D366D' } },
                    font: {
                        color: { rgb: 'ffffff' },
                    },
                };
                const styleNoColor = {
                    alignment: { horizontal: 'center' },
                    border: borders,
                };

                let destArr,
                    dest,
                    destData: any = [];
                let destLength;
                let maxDestLength = 0;
                /** find max dest length */
                // data.map((d) => {
                //     dest = JSON.parse(d.dest_place.split(','));

                //     if (dest.length > maxDestLength) {
                //         maxDestLength = dest.length;
                //     }
                // });
                let column = [
                    {
                        title: '#',
                        style: style,

                        width: { wpx: 200 },
                    },
                    {
                        title: 'ชื่อผู้ใช้',
                        style: style,

                        width: { wpx: 80 },
                    }, //pixels width
                    {
                        title: 'ชื่อ',
                        width: { wpx: 90 },
                        style: style,
                    }, //char width
                    {
                        title: 'นามสกุล',
                        width: { wpx: 90 },
                        style: style,
                    }, //char width

                    {
                        title: 'เลขที่ใบขับขี่',
                        width: { wpx: 90 },
                        style: style,
                    }, //char width 
                    {
                        title: 'เบอร์โทรศัพท์',
                        width: { wpx: 90 },
                        style: style,
                    }, //char width
                    {
                        title: 'วันที่บันทึก',
                        width: { wpx: 90 },
                        style: style,
                    }, //char width
                ]


                //@ts-ignore
                data.map((d, i) => {
                    destArr = [
                        { value: i + 1, style: styleNoColor },
                        { value: d.username, style: styleNoColor },
                        { value: d.name || '', style: styleNoColor },
                        { value: d.lastname || '', style: styleNoColor },
                        { value: d.driver_license || '', style: styleNoColor },
                        { value: d.tel || '', style: styleNoColor },
                        { value: moment(d.create_date, 'YYYYMMDD').format('DD/MM/YYYY') || '', style: styleNoColor },


                    ];


                    destData.push(destArr);




                    // return null;
                })

                const multiDataSet = [
                    {
                        columns: column,
                        data: destData,
                    },
                ];

                setExportExcel({ status: true, data: multiDataSet });

            });

    }

    React.useEffect(() => {
        if (exportExcel.status === true) {
            setExportExcel({ ...exportExcel, status: false });
        }
    }, [exportExcel]);
    return (
        <div style={{}}>
            <div style={{ display: 'flex', justifyContent: "end", marginRight: 12, marginBottom: 12 }}>
                <div style={{ marginRight: 12 }}>

                    <DatePicker
                        onChange={((date, dateString) => setdateState({ ...dateState, startDate: moment(dateString, 'YYYY-MM-DD').format('YYYYMMDD') })
                        )} />

                </div>
                <label style={{ marginRight: 12, marginTop: 6 }}>ถึง</label>
                <DatePicker
                    onChange={((date, dateString) => setdateState({ ...dateState, endDate: moment(dateString, 'YYYY-MM-DD').format('YYYYMMDD') })
                    )}
                />
                <Button style={{ marginLeft: 12 }} onClick={() => genReport(dateState?.startDate, dateState?.endDate)} type="primary">ค้นหา</Button>
            </div>
            <Row gutter={[0, 24]}>
                {driverState &&
                    <>
                        <Col span={24}>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginLeft: "auto", marginRight: 'auto', borderRadius: 20, padding: 24, backgroundColor: '#A7F3D0' }}>

                                <div>

                                    <Text style={{ fontSize: '1.5em' }}>รายการผู้ขับรถที่สมัครวันที่ {driverState?.startDate} - {driverState?.endDate}</Text> <br />

                                    <br />
                                    <Text style={{ fontSize: '2em', textAlign: 'left' }}>{driverState?.data.length}</Text>
                                    &nbsp;

                                </div>
                                <img style={{ width: '96px' }} src="/images/driver1.png" />

                            </div>
                        </Col>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Text style={{ fontSize: '1.5em' }}>ข้อมูลคนขับรถ</Text>
                            <ExcelFile
                                element={<Button style={{ marginLeft: 12 }}
                                    type="primary">ดาวน์โหลด</Button>}
                                filename="ข้อมูลการเพิ่มผู้ขับรถ"
                            >
                                <ExcelSheet
                                    dataSet={exportExcel.data}
                                    name="ข้อมูลการเพิ่มผู้ขับรถ"
                                ></ExcelSheet>
                            </ExcelFile>
                            {/* <Button style={{ marginLeft: 12 }}
                                onClick={() => dataExcel(driverState.data)}
                                type="primary">ดาวน์โหลด</Button> */}

                        </div>


                        <Col span={24}>
                            <Table<driver>

                                rowKey="id" dataSource={driverState.data} bordered={true}   >
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


                                />
                                <Table.Column dataIndex="username" title="ชื่อผู้ใช้งาน"
                                    render={(value) => value}


                                />
                                <Table.Column dataIndex="name" title="ชื่อ"
                                    render={(value) => value}


                                />
                                <Table.Column
                                    dataIndex="lastname"
                                    title="นามสกุล"
                                    render={(value) => value}

                                />
                                <Table.Column
                                    dataIndex="driver_license"
                                    title="เลขใบขับขี่"
                                    render={(value) => value}

                                />
                                <Table.Column
                                    dataIndex="tel"
                                    title="เบอร์โทรศัพท์"
                                    render={(value) => value}

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

                            </Table>
                        </Col>
                    </>
                }




            </Row>
        </div >
    )
}

export const BluetoothReport = () => {
    return (
        <Authenticated>
            <LayoutWrapper>
                <Bluetooth_Report />
            </LayoutWrapper>
        </Authenticated>
    );
};


