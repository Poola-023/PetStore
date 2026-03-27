import React, { useState } from 'react';
import Navbar from './Navbar';
import SubFooter from './SubFooter';

const ServiceBooking = ({ user, setUser, cart }) => {
    const [bookingData, setBookingData] = useState({
        serviceType: 'Grooming', petName: '', date: '', time: '', notes: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally POST to your backend (e.g., /api/bookings)
        setIsSubmitted(true);
    };

    return (
        <div style={styles.page}>
            <Navbar user={user} setUser={setUser} cart={cart} />

            <div style={styles.header}>
                <h1 style={styles.title}>Boutique Pet Services</h1>
                <p style={styles.subtitle}>Professional grooming, expert training, and premium vet care.</p>
            </div>

            <div style={styles.container}>
                {isSubmitted ? (
                    <div style={styles.successBox}>
                        <div style={styles.successIcon}>✨</div>
                        <h2>Booking Confirmed!</h2>
                        <p>Your {bookingData.serviceType} appointment for {bookingData.petName} is scheduled for {bookingData.date} at {bookingData.time}.</p>
                        <button style={styles.btn} onClick={() => setIsSubmitted(false)}>Book Another Service</button>
                    </div>
                ) : (
                    <form style={styles.formCard} onSubmit={handleSubmit}>
                        <div style={styles.serviceSelector}>
                            {['Grooming', 'Training', 'Vet Consultation'].map(service => (
                                <div
                                    key={service}
                                    style={bookingData.serviceType === service ? styles.serviceTabActive : styles.serviceTab}
                                    onClick={() => setBookingData({...bookingData, serviceType: service})}
                                >
                                    {service === 'Grooming' ? '✂️' : service === 'Training' ? '🦴' : '🩺'} {service}
                                </div>
                            ))}
                        </div>

                        <div style={styles.grid}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Pet's Name</label>
                                <input required style={styles.input} type="text" placeholder="e.g. Max" value={bookingData.petName} onChange={(e) => setBookingData({...bookingData, petName: e.target.value})} />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Select Date</label>
                                <input required style={styles.input} type="date" value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Select Time</label>
                                <select required style={styles.input} value={bookingData.time} onChange={(e) => setBookingData({...bookingData, time: e.target.value})}>
                                    <option value="">Choose a slot...</option>
                                    <option value="10:00 AM">10:00 AM</option>
                                    <option value="01:00 PM">01:00 PM</option>
                                    <option value="04:00 PM">04:00 PM</option>
                                </select>
                            </div>
                            <div style={styles.inputGroupFull}>
                                <label style={styles.label}>Special Instructions</label>
                                <textarea style={styles.textarea} rows="3" placeholder="Any allergies or special requests?" value={bookingData.notes} onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}></textarea>
                            </div>
                        </div>

                        <button type="submit" style={styles.submitBtn}>Confirm Booking</button>
                    </form>
                )}
            </div>
            <SubFooter />
        </div>
    );
};

const styles = {
    page: { backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" },
    header: { backgroundColor: '#131921', padding: '60px 20px', textAlign: 'center', color: '#fff' },
    title: { fontSize: '2.5rem', fontWeight: '900', margin: '0 0 10px 0' },
    subtitle: { color: '#9CA3AF', fontSize: '1.1rem', margin: 0 },
    container: { maxWidth: '800px', margin: '-30px auto 50px', padding: '0 20px' },

    formCard: { backgroundColor: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
    serviceSelector: { display: 'flex', gap: '15px', marginBottom: '30px' },
    serviceTab: { flex: 1, padding: '15px', textAlign: 'center', borderRadius: '16px', border: '2px solid #EAEAEA', cursor: 'pointer', fontWeight: '800', color: '#6B7280', transition: '0.2s' },
    serviceTabActive: { flex: 1, padding: '15px', textAlign: 'center', borderRadius: '16px', border: '2px solid #FF9900', backgroundColor: '#FFF7ED', cursor: 'pointer', fontWeight: '900', color: '#FF9900' },

    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    inputGroupFull: { gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '0.85rem', fontWeight: '800', color: '#131921', textTransform: 'uppercase' },
    input: { padding: '15px', borderRadius: '12px', border: '1.5px solid #EAEAEA', fontSize: '1rem', outline: 'none', fontFamily: 'inherit' },
    textarea: { padding: '15px', borderRadius: '12px', border: '1.5px solid #EAEAEA', fontSize: '1rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical' },
    submitBtn: { width: '100%', padding: '18px', backgroundColor: '#FF9900', color: '#131921', border: 'none', borderRadius: '16px', fontSize: '1.1rem', fontWeight: '900', marginTop: '30px', cursor: 'pointer' },

    successBox: { backgroundColor: '#fff', padding: '60px 40px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
    successIcon: { fontSize: '4rem', marginBottom: '20px' },
    btn: { padding: '12px 24px', backgroundColor: '#131921', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', marginTop: '20px', cursor: 'pointer' }
};

export default ServiceBooking;