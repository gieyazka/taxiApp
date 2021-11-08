import {
    List,
    TextField,
    TagField,
    DateField,
    Table,
    useTable,
} from "@pankod/refine";
import React from "react";
interface IPost {
    id: string;
    title: string;
    status: "published" | "draft" | "rejected";
    createdAt: string;
}
export const BookingList: React.FC = (props) => {

    const { tableProps,searchFormProps  } = useTable<IPost>();
    console.log(tableProps);

    return (
        <React.Fragment>


            <List>
                <Table {...tableProps} rowKey="id" >
                    
                    <Table.Column dataIndex="title" title="title" />
                    <Table.Column
                        dataIndex="startTime"
                        title="เวลา"
                        render={(value) => <p >{value}</p>}
                        sorter
                    />
                    <Table.Column
                        dataIndex="createdAt"
                        title="createdAt"
                        render={(value) => <DateField format="LLL" value={value} />}
                    />
                </Table>
            </List>
        </React.Fragment>
    );
};