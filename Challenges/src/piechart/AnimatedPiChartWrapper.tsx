import React from 'react';
import AnimatedPieChart from './AnimatedPieChart';
import './AnimatedPiChart.css'

function AnimatedPiChartWrapper() {
  
    const Data = [
        { label: 'A', value: 30, color: '#FF6384' },
        { label: 'B', value: 50, color: '#36A2EB' },
        { label: 'C', value: 20, color: '#FFCE56' },
        { label: 'D', value: 40, color: '#4BC0C0' },
      ];
    
  
    return (
    <div className='pie-chart'>
      <AnimatedPieChart width={400}
      height={500}
      title="Sample Pie Chart"
      backgroundColor="#0E0F0E"
      labelColor="#333"
      titleColor="#1a1a1a"
      titleFontSize={28}
      margin="0px"
      padding="0px"
      data={Data}/>
    </div>
  )
}

export default AnimatedPiChartWrapper;