import React, { useEffect, useState } from 'react';
import { EditIcon, PlusIcon, EyeIcon, WhatsAppIcon,PencilIcon } from '../../Icons/Icons';
import AddParticipant from './AddParticipant';
import { Avatar, ParticipantCard, StatusBadge } from './ParticipantsHelper';
import { useGroupTripHooks } from '../../../hooks/useGroupTripHooks';
import { useParams } from 'react-router-dom';
import EditParticipant from '../Edit Group Trip/EditParticipant';

const PINK = '#ED5F8D';
const BLUE = '#18305C';




// ─── Table header cell ────────────────────────────────────────────────────────
const TH = ({ children, align = 'left', minW }) => (
    <th style={{
        padding: '14px 16px', fontSize: '13px', fontWeight: '600',
        color: '#555', textAlign: align, whiteSpace: 'nowrap',
        borderBottom: '1.5px solid #f0f0f0', minWidth: minW,
        background: 'white',
    }}>
        {children}
    </th>
);

// ─── Table data cell ──────────────────────────────────────────────────────────
const TD = ({ children, align = 'left' }) => (
    <td style={{
        padding: '16px 16px', fontSize: '13px', color: '#444',
        textAlign: align, borderBottom: '1px solid #f5f5f5', verticalAlign: 'middle',
    }}>
        {children}
    </td>
);

// ─── Mobile card view ─────────────────────────────────────────────────────────


const actionBtnStyle = {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
};

// ─── Main component ───────────────────────────────────────────────────────────
function Participants() {
    const {getGroupTripParticipantsById} = useGroupTripHooks()
    const [isMobile, setIsMobile] = useState(false);
    const [isAddParticipant, setIsAddParticipant] = useState(false)
    const [isEditParticipant, setIsEditParticipant] = useState(false)
    const [participants, setParticipants] = useState([])
    const [fetchLoading, setFetchLoading] = useState(false)
    const [selectedParticipant, setSelectedParticipant] = useState(null)
    const {groupTripId} = useParams()
    const [isUpdated,setIsUpdated] = useState(false)

    React.useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const handleEdit     = (p) => {
        setSelectedParticipant(p)
        setIsEditParticipant(true)
    };
    const handleView     = (p) => console.log('View',      p);
    const handleWhatsApp = (p) => window.open(`https://wa.me/${p.contact}`, '_blank');
    const handleAdd      = ()  => setIsAddParticipant(true);
    // const handleAdd      = ()  => console.log("Add");


    const fetchParticipants = async()=>{
        try{
            setFetchLoading(true)
            const response = await getGroupTripParticipantsById(groupTripId)
            setParticipants(response?.data?.allParticipants)
        }
        catch(error){
          if (!isProduction) {
            console.log("========= ERROR DEBUG START =========");
            console.log("Error:", error);
            console.log("Response:", error?.response);
            console.log("========= ERROR DEBUG END =========");
          }
          toast.error(error?.response?.data?.message || error?.message || "Error in adding the admin")
        }
        finally{
            setFetchLoading(false)
        }
    }

    useEffect(()=>{
        if(groupTripId){
            fetchParticipants()
        }
    },[groupTripId,isUpdated])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* ── Section header ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: BLUE, margin: 0 }}>Participants</h2>
                <button
                    onClick={handleAdd}
                    style={{
                        background: PINK, color: 'white', border: 'none',
                        borderRadius: '8px', padding: '9px 18px',
                        fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                    }}
                >
                    <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span> Add Participants
                </button>
            </div>

            {/* ── Desktop table ── */}
            {!isMobile && (
                <div style={{
                    background: 'white', borderRadius: '12px',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                    overflowX: 'auto',
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr>
                                <TH minW="200px">Name</TH>
                                <TH>Contact</TH>
                                <TH>Dietary</TH>
                                <TH>Occupancy</TH>
                                <TH align="right">Sale Amount</TH>
                                <TH align="right">Paid Amount</TH>
                                <TH align="center">Status</TH>
                                <TH align="center">Actions</TH>
                            </tr>
                        </thead>
                        <tbody>
                            {participants?.map((p) => (
                                <tr key={p?._id} style={{ transition: 'background 0.1s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                >
                                    {/* Name cell */}
                                    <TD>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Avatar name={p?.travellerName || p?.enquiryId?.accountId?.fullName||p?.enquiryId?.accountId?.businessName} />
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '700', color: BLUE }}>{p?.travellerName || p?.enquiryId?.accountId?.fullName||p?.enquiryId?.accountId?.businessName}</div>
                                                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>Member : {p?.totalMembers}</div>
                                            </div>
                                        </div>
                                    </TD>

                                    <TD><span style={{ color: '#555' }}>{p.contact}</span></TD>

                                    <TD><span style={{ color: p.dietary === 'None' ? '#aaa' : '#444' }}>{p?.dietaryPreference}</span></TD>

                                    <TD>{p?.occupancy}</TD>

                                    {/* Sale Amount */}
                                    <TD align="right">
                                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                            <span style={{ fontSize: '13px', color: '#555' }}>₹</span>
                                            <span style={{ fontWeight: '600', color: BLUE }}>{p.saleAmount?.toLocaleString()}</span>
                                        </span>
                                    </TD>

                                    {/* Paid Amount */}
                                    <TD align="right">
                                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                            <span style={{ fontSize: '13px', color: '#555' }}>₹</span>
                                            <span style={{ fontWeight: '600', color: BLUE }}>{p.paidAmount?.toLocaleString()}</span>
                                        </span>
                                    </TD>

                                    {/* Status */}
                                    <TD align="center">
                                        <StatusBadge status={p?.status} />
                                    </TD>

                                    {/* Actions */}
                                    <TD align="center">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                            <button onClick={() => handleEdit(p)} style={actionBtnStyle} title="Edit">
                                                <PencilIcon />
                                            </button>
                                            {/* <button onClick={() => handleView(p)} style={actionBtnStyle} title="View">
                                                <EyeIcon />
                                            </button> */}
                                            <button onClick={() => handleWhatsApp(p)} style={actionBtnStyle} title="WhatsApp">
                                                <WhatsAppIcon />
                                            </button>
                                        </div>
                                    </TD>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {participants.length === 0 && (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#bbb' }}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
                            <div style={{ fontSize: '15px', fontWeight: '600' }}>No participants yet</div>
                            <div style={{ fontSize: '13px', marginTop: '4px' }}>Add participants to get started</div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Mobile card grid ── */}
            {isMobile && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {participants.length === 0 ? (
                        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#bbb' }}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
                            <div style={{ fontSize: '15px', fontWeight: '600' }}>No participants yet</div>
                        </div>
                    ) : participants.map(p => (
                        <ParticipantCard
                            key={p.id}
                            p={p}
                            onEdit={handleEdit}
                            onView={handleView}
                            onWhatsApp={handleWhatsApp}
                        />
                    ))}
                </div>
            )}

            {/* Add Participant */}
            <>
                {
                    isAddParticipant && 
                    <AddParticipant closeModal = {()=>setIsAddParticipant(false)} setIsUpdated={()=>{setIsUpdated(!isUpdated)}}/>
                }
            </>

            {/* Edit Participant */}
            <>
                {
                    isEditParticipant && 
                    <EditParticipant closeModal = {()=>setIsEditParticipant(false)} selectedParticipant={selectedParticipant}  setIsUpdated={()=>{setIsUpdated(!isUpdated)}}/>
                }
            </>
        </div>
    );
}

export default Participants;