
const PINK = '#ED5F8D';
const LIGHT_PINK = '#FFF6F9';
const BLUE = '#18305C';
export const gridTwo = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px 24px',
    marginBottom: '20px',
};

export const chevronIcon = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    pointerEvents: 'none',
};

export const searchIcon = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
};


export const spinnerStyle = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '16px',
    height: '16px',
    border: `2px solid #f3f4f6`,
    borderTop: `2px solid ${PINK}`,
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
};

export const suggestionBox = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'white',
    border: '1.5px solid #e5e7eb',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    zIndex: 100,
    maxHeight: '220px',
    overflowY: 'auto',
    marginTop: '4px',
};

export const suggestionItem = {
    padding: '10px 14px',
    cursor: 'pointer',
    fontSize: '13px',
    color: BLUE,
    background: 'white',
    transition: 'background 0.15s',
    borderBottom: '1px solid #f3f4f6',
};

export const destTag = {
    display: 'inline-flex',
    alignItems: 'center',
    background: LIGHT_PINK,
    color: PINK,
    border: `1px solid #f9a8c3`,
    borderRadius: '20px',
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: '600',
};

export const cancelBtn = {
    padding: '10px 22px',
    border: '1.5px solid #e5e7eb',
    borderRadius: '8px',
    background: 'white',
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
};

export const saveBtn = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 22px',
    border: 'none',
    borderRadius: '8px',
    background: PINK,
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
};

// Card-specific: label is small grey, value is bold dark blue — matching the image
export const cardLabelStyle = {
    display: 'flex',
    alignItems: "center",
    gap: 2,
    fontSize: '14px',
    fontWeight: '500',
    color: BLUE,
    marginBottom: '4px',
};

export const cardValueStyle = {
    width: '100%',
    padding: '0',
    border: 'none',
    borderRadius: '0',
    fontSize: '14px',
    fontWeight: '500',
    color: BLUE,
    background: 'transparent',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'default',
};
