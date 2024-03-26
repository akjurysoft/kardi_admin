import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
];

const LineChart1 = ({ getCustomerData }) => {
    return (
        <div className='w-[100%] flex justify-center bg-[#f7f9fb] rounded-[20px]'>
            {/* <LineChart width={500} height={400} data={data} className='rounded-[15px] bg-[#f7f9fb] p-[15px]'>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
            <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
        </LineChart> */}
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                    data={getCustomerData.map(customer => ({
                        createdAt: new Date(customer.createdAt).toLocaleDateString()
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="createdAt" />
                    <YAxis />
                    <CartesianGrid stroke="#f5f5f5" />
                    <Tooltip />
                    <Area type="monotone" dataKey="createdAt" stroke="#ff7300" yAxisId={0} />
                </AreaChart>

            </ResponsiveContainer>
        </div>
    )
}

export default LineChart1