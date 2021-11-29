

import {
    Button, Typography, Row, Col, Refine, useApiUrl, Authenticated, AuthProvider, LayoutWrapper, useSelect
    , DatePicker, Table, List, Tag, Select
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
import axios from 'axios'

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

    const { Option } = Select
    const [vehicleState, setVehicleState] = React.useState<{ province: string, plateNo: string, id: string, bluetooth?: { mac_address: string } }[]>()
    const [historyData, setHistoryData] = React.useState<{
        car: any,
        data: any
    }>()
    React.useMemo(async () => {
        await axios.get(apiUrl + `/vehicles?token=${localStorage.getItem('Token')}`).then(async res => {
            // res.data.map((d : any) => console.log(d.plateNo,d.bluetooth))

            setVehicleState(res.data);
            // setVehicleState(res.data);

        })
    }, [])

    const { Text, Title } = Typography
    const [driverState, setDriverState] = React.useState<driverState>()
    const [carState, setCarState] = React.useState<{ approve: number, block: number }>()
    const [dateState, setdateState] = React.useState<{ plate?: string, startDate?: string, endDate?: string }>()
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const [exportExcel, setExportExcel] = React.useState<{ status: boolean, data?: {}[] }>({ status: false });

    const genData = (plate: string | undefined, start: string | undefined, end: string | undefined) => {
        // console.log(plate, start, end);

        if (!plate) {
            Swal.fire({
                icon: "info",
                title: "กรุณาเลือกทะเบียนรถ",
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                // form.resetFields()

            });
            return null
        } else if (!start || start === 'Invalid date') {
            Swal.fire({
                icon: "info",
                title: "กรุณาเลือกวันที่เริ่มต้น",
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                // form.resetFields()

            });
            return null
        } else if (!end || end === 'Invalid date') {
            Swal.fire({
                icon: "info",
                title: "กรุณาเลือกวันที่สิ้นสุด",
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                // form.resetFields()

            });
            return null
        } else if (start > end) {
            Swal.fire({
                icon: "error",
                title: "วันที่ไม่ถูกต้อง",
                showConfirmButton: false,
                timer: 1500,
            })
            return null
        } else {
            var details: any = {
                'vehiclesID[]': plate,
                'start': moment(start, 'YYYYMMDD').format('YYYY-MM-DD 00:00:00'),
                'end': moment(end, 'YYYYMMDD').format('YYYY-MM-DD 00:00:00')
                // 'vehiclesID[]': 't1',

            };

            var formBody: any = [];
            for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");
            fetch('https://gps.powermap.live/api/taxitracker/get.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: formBody
            }).then(res => res.json()).then(data => {
                let logOutData = data[0].location.filter((d: { status: string }) => d.status === 'logout')
                let vehicle: { plateNo: string, province: string } | undefined = vehicleState?.find(d => (d.bluetooth?.mac_address === plate))
                console.log(logOutData);

                setHistoryData({ car: vehicle, data: logOutData })
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
                        title: 'วันที่',
                        style: style,

                        width: { wpx: 80 },
                    }, //pixels width
                    {
                        title: 'ทะเบียนรถ',
                        width: { wpx: 90 },
                        style: style,
                    }, //char width
                    {
                        title: 'จังหวัด',
                        width: { wpx: 90 },
                        style: style,
                    }, //char width

                    {
                        title: 'เวลาเริ่ม',
                        width: { wpx: 90 },
                        style: style,
                    }, //char width 
                    {
                        title: 'เวลาสิ้นสุด',
                        width: { wpx: 90 },
                        style: style,
                    }, //char width
                    {
                        title: 'ระยะเวลาที่ไม่แสดงตัวตน',
                        width: { wpx: 180 },
                        style: style,
                    }, //char width
                ]


                //@ts-ignore
                logOutData.map((d, i) => {

                    destArr = [
                        { value: i + 1, style: styleNoColor },
                        { value: d.start.split(" ")[0], style: styleNoColor },
                        { value: vehicle?.plateNo || '', style: styleNoColor },
                        { value: vehicle?.province || '', style: styleNoColor },
                        { value: d.start.split(" ")[1] || '', style: styleNoColor },
                        { value: d.stop.split(" ")[1] || '', style: styleNoColor },
                        { value: d.time || '', style: styleNoColor },


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
                    <Select
                        // mode='multiple'
                        showSearch
                        style={{ width: 200 }}
                        placeholder="เลือกทะเบียนรถ"
                        optionFilterProp="children"

                        filterOption={(input, option) =>
                            option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={(d: string) => setdateState({ ...dateState, plate: d })

                        }
                    >
                        {
                            vehicleState?.map((d: { plateNo: string, bluetooth?: { mac_address: string } }) =>

                                d.bluetooth && <Option value={d.bluetooth?.mac_address}>{d.plateNo}</Option>

                            )
                        }

                    </Select>
                </div>
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
                <Button style={{ marginLeft: 12 }}
                    onClick={() => genData(dateState?.plate, dateState?.startDate, dateState?.endDate)}
                    type="primary">ค้นหา</Button>
            </div>
            <Row gutter={[0, 24]}>
                {historyData &&
                    <>
                        {/* <Col span={24}>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginLeft: "auto", marginRight: 'auto', borderRadius: 20, padding: 24, backgroundColor: '#A7F3D0' }}>

                                <div>

                                    <Text style={{ fontSize: '1.5em' }}>รายการผู้ขับรถที่สมัครวันที่ {driverState?.startDate} - {driverState?.endDate}</Text> <br />

                                    <br />
                                    <Text style={{ fontSize: '2em', textAlign: 'left' }}>{driverState?.data.length}</Text>
                                    &nbsp;

                                </div>
                                <img style={{ width: '96px' }} src="/images/driver1.png" />

                            </div>
                        </Col> */}
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

                                rowKey="id" dataSource={historyData.data} bordered={true}   >

                                <Table.Column dataIndex="start" title="วันที่"
                                    render={(value) => moment(value, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY')}


                                />
                                <Table.Column title="ทะเบียนรถ"
                                    render={() => historyData.car?.plateNo}


                                />
                                <Table.Column title="ทะเบียนรถ"
                                    render={() => historyData.car?.province}


                                />
                                <Table.Column
                                    dataIndex="start"
                                    title="เวลาเริ่ม"
                                    render={(value) => moment(value, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss')}

                                />
                                <Table.Column
                                    dataIndex="stop"
                                    title="เวลาสิ้นสุด"
                                    render={(value) => moment(value, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss')}

                                />
                                <Table.Column
                                    dataIndex="time"
                                    title="ระยะเวลาที่ไม่แสดงตัว"
                                    render={(value) => {
                                        let date = value.split(" ")[0]
                                        let year = parseInt(date.split("-")[0])
                                        let month = parseInt(date.split("-")[1])
                                        let day = parseInt(date.split("-")[2])
                                        let time = value.split(" ")[1]

                                        let hr = parseInt(time.split(':')[0])
                                        let min = parseInt(time.split(':')[1])
                                        let sec = parseInt(time.split(':')[2])

                                        let newStr: string = ""
                                        if (year !== 0) {
                                            newStr = year + " ปี "
                                        }
                                        if (month !== 0) {
                                            newStr = month + " เดือน "
                                        }
                                        if (day !== 0) {
                                            newStr = day + " วัน "
                                        }
                                        if (hr !== 0) {
                                            newStr = hr + " ชั่วโมง "
                                        }
                                        if (min !== 0) {
                                            newStr = min + " นาที "
                                        }
                                        if (sec !== 0) {
                                            newStr = sec + " วินาที "
                                        }
                                        return newStr
                                    }}

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


