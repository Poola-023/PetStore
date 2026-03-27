import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const PageNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Do not show navigation breadcrumbs on the main Dashboard/Home page
    if (location.pathname === '/') return null;

    // Split the URL path into array (e.g., "/vendor-profile/123" -> ["vendor-profile", "123"])
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <div style={styles.container}>
            {/* 1. Back Button */}
            <button onClick={() => navigate(-1)} style={styles.backBtn} className="hover-lift">
                <span style={styles.arrow}>←</span> Go Back
            </button>

            {/* 2. Breadcrumb Trail */}
            <div style={styles.breadcrumb}>
                <Link to="/" style={styles.link}>Home</Link>

                {pathnames.map((value, index) => {
                    const isLast = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                    // Format the URL text to look nice (e.g., "vendor-profile" -> "Vendor Profile")
                    const formattedText = value
                        .replace(/-/g, ' ')
                        .replace(/\b\w/g, char => char.toUpperCase());

                    // If it's a long MongoDB/UUID string, shorten it for UI purposes
                    const displayText = formattedText.length > 20
                        ? formattedText.substring(0, 8) + '...'
                        : formattedText;

                    return (
                        <span key={to} style={styles.crumbSpan}>
                            <span style={styles.separator}>/</span>
                            {isLast ? (
                                <span style={styles.activeText}>{displayText}</span>
                            ) : (
                                <Link to={to} style={styles.link}>{displayText}</Link>
                            )}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px 6%',
        backgroundColor: '#fff',
        borderBottom: '1px solid #EAEAEA',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
    },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#F9FAFB',
        border: '1px solid #EAEAEA',
        color: '#131921',
        padding: '8px 16px',
        borderRadius: '10px',
        fontWeight: '800',
        fontSize: '0.85rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    arrow: { fontSize: '1.1rem', color: '#FF9900' },
    breadcrumb: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#64748b'
    },
    link: {
        color: '#64748b',
        textDecoration: 'none',
        transition: 'color 0.2s ease'
    },
    crumbSpan: {
        display: 'flex',
        alignItems: 'center'
    },
    separator: {
        margin: '0 10px',
        color: '#cbd5e1',
        fontSize: '0.8rem'
    },
    activeText: {
        color: '#FF9900',
        fontWeight: '800'
    }
};

export default PageNavigation;