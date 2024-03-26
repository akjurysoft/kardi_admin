import axios from '../../../axios';
import React, { useCallback, useEffect, useState } from 'react'
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

const PieChart1 = ({allOrdersData , statusColors}) => {

    const getStatusCounts = (orders) => {
        const statusCounts = orders.reduce((counts, status) => {
            counts[status] = (counts[status] || 0) + 1;
            return counts;
        }, {});

        const data = Object.keys(statusCounts).map((status) => ({
            name: status,
            value: statusCounts[status],
        }));

        return data;
    };

    const data = getStatusCounts(allOrdersData.map(order => order.order_status.status_name));

    return (
        <div className='w-[100%] flex justify-center bg-[#f7f9fb] rounded-[20px]'>
            <PieChart width={400} height={400}>
                <Pie
                    dataKey="value"
                    data={data}
                    cx={200}
                    cy={200}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={statusColors[entry.name]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    )
}

export default PieChart1