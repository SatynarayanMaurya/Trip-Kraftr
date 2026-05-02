

import React from "react";
const PINK = '#ED5F8D';
const BLUE = '#18305C';



const StepperTab = ({ steps, activeStep, onStepClick }) => {
    // console.log("steps, activeStep, onStepClick  : ",steps, activeStep )
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: '#FDE8EF',
        borderRadius: '16px',
        padding: '16px 24px',
        marginBottom: '24px',
        overflowX: 'auto',
      }}>
        {steps.map((step, i) => {
          const stepNum = i + 1;
          const isActive = activeStep === stepNum;
          const isCompleted = activeStep > stepNum;
          const isLast = i === steps.length - 1;
  
          const circleStyle = {
            width: '40px',
            height: '40px',
            minWidth: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: isActive ? PINK : isCompleted ? BLUE : 'white',
            color: isActive || isCompleted ? 'white' : '#ccc',
            border: isActive || isCompleted ? 'none' : '1.5px solid #ddd',
          };
  
          return (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={circleStyle} onClick={() => {
                    onStepClick && onStepClick(i+1)}
                    }>
                  {stepNum}
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? PINK : isCompleted ? BLUE : '#999',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                }}>
                  {step}
                </span>
              </div>
              {!isLast && (
                <div style={{
                  flex: 1,
                  borderTop: '2px dashed #ccc',
                  margin: '0 8px',
                  marginBottom: '24px', // offset for label below
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };


  export default StepperTab