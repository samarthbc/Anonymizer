// // CSVPreview.jsx
// const CSVPreview = ({ tableData }) => (
//     tableData.length > 0 && (
//         <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">CSV Preview</h3>
//             <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                     <tr>
//                         {tableData[0].map((header, index) => (
//                             <th key={index} className="font-bold px-6 py-3 text-left text-xs font-medium tracking-wider">
//                                 {header}
//                             </th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                     {tableData.slice(1).map((row, rowIndex) => (
//                         <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                             {row.map((cell, cellIndex) => (
//                                 <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                     {cell}
//                                 </td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     )
// );

// export default CSVPreview;


import React from 'react';

const CSVPreview = ({ tableData }) => (
    tableData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">CSV Preview</h3>
            
            {/* Container with fixed height and overflow in both directions */}
            <div className="overflow-x-auto overflow-y-auto max-h-96 border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            {tableData[0].map((header, index) => (
                                <th key={index} className="font-bold px-6 py-3 text-left text-xs font-medium tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tableData.slice(1).map((row, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
);

export default CSVPreview;