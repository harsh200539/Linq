"use client";
import { useState, useEffect } from 'react';
import { fetchAllJobs, deleteResource, REMOTE_BASE_URL } from '../lib/api';

const JobManager = () => {
    const [jobs, setJobs] = useState([]);
    const [editingJob, setEditingJob] = useState(null);
    const [qualifications, setQualifications] = useState(['']);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const [canEdit, setCanEdit] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('adminUser');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setCanEdit(user.is_superadmin || user.permissions?.includes('jobs_edit'));
            } catch (e) {
                setCanEdit(false);
            }
        }
    }, []);

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        if (editingJob) {
            setQualifications(Array.isArray(editingJob.qualifications) ? (editingJob.qualifications.length > 0 ? editingJob.qualifications : ['']) : ['']);
        } else {
            setQualifications(['']);
        }
    }, [editingJob]);

    const fetchJobs = () => {
        fetchAllJobs()
            .then(data => setJobs(data))
            .catch(err => console.error(err));
    };

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // Process qualifications array
        data.qualifications = qualifications.filter(q => q.trim() !== '');

        // Map status and set status_color
        if (data.status === 'Active') {
            data.status_color = '#10b981'; // Green
        } else {
            data.status_color = '#ef4444'; // Red
        }

        const url = editingJob?.id ? `${REMOTE_BASE_URL}/job-openings/${editingJob.id}/` : `${REMOTE_BASE_URL}/job-openings/`;
        const method = editingJob?.id ? 'PATCH' : 'POST';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
            .then(async res => {
                if (res.ok) {
                    fetchJobs();
                    setEditingJob(null);
                    showToast(`Job ${editingJob?.id ? 'updated' : 'created'} successfully!`);
                } else {
                    const errText = await res.text();
                    try {
                        const errData = JSON.parse(errText);
                        showToast('Error: ' + (errData.detail || 'Failed to save'), 'error');
                    } catch (e) {
                        showToast('Error: ' + errText, 'error');
                    }
                }
            })
            .catch(err => {
                console.error(err);
                showToast('Network error', 'error');
            });
    };

    const addQualification = () => setQualifications([...qualifications, '']);
    const removeQualification = (index) => setQualifications(qualifications.filter((_, i) => i !== index));
    const handleQualificationChange = (index, value) => {
        const newQuals = [...qualifications];
        newQuals[index] = value;
        setQualifications(newQuals);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this job opening?')) return;
        try {
            const res = await deleteResource('job-openings', id);
            if (res) {
                fetchJobs();
                showToast('Job deleted successfully!');
            } else {
                showToast('Failed to delete job', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Error deleting job', 'error');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', position: 'relative' }}>
            {/* Custom Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    backgroundColor: toast.type === 'error' ? '#ff4d4f' : '#10b981',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 10000,
                    animation: 'slideIn 0.3s ease-out',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: '500'
                }}>
                    {toast.type === 'error' ? '✕' : '✓'} {toast.message}
                    <style>{`
                        @keyframes slideIn {
                            from { transform: translateX(100%); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                    `}</style>
                </div>
            )}

            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0 }}>Job Openings</h4>
                {canEdit && !editingJob && (
                    <button
                        onClick={() => setEditingJob({ 
                            title: '', 
                            short_description: '', 
                            full_description: '', 
                            location: 'Vadodara', 
                            employment_type: 'Full Time', 
                            qualifications: [], 
                            status: 'Active', 
                            status_color: '#10b981', 
                            application_email: '',
                            context: '',
                            reporting_to: ''
                        })}
                        className="admin-login-btn" style={{ width: 'auto', padding: '8px 20px' }}
                    >
                        + Add New Job
                    </button>
                )}
            </div>

            {editingJob && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-wrapper" style={{ maxWidth: '800px' }}>
                        <div className="admin-modal-header">
                            <h4>{editingJob.id ? 'Edit Job' : 'New Job'}</h4>
                            <button className="admin-modal-close" onClick={() => setEditingJob(null)}>×</button>
                        </div>
                        <form key={editingJob.id || 'new'} onSubmit={handleSave} style={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: '10px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div className="admin-form-group">
                                    <label>Job Title</label>
                                    <input name="title" defaultValue={editingJob.title} required style={{ width: '100%' }} />
                                </div>
                                <div className="admin-form-group">
                                    <label>Location</label>
                                    <input name="location" defaultValue={editingJob.location || 'Vadodara'} required style={{ width: '100%' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
                                <div className="admin-form-group">
                                    <label>Employment Type</label>
                                    <select name="employment_type" defaultValue={editingJob.employment_type} style={{ width: '100%', padding: '8px' }}>
                                        <option value="Full Time">Full Time</option>
                                        <option value="Part Time">Part Time</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Contract">Contract</option>
                                    </select>
                                </div>
                                <div className="admin-form-group">
                                    <label>Status Label</label>
                                    <select name="status" defaultValue={editingJob.status} required style={{ width: '100%', padding: '8px' }}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
                                <div className="admin-form-group">
                                    <label>Application Email</label>
                                    <input type="email" name="application_email" defaultValue={editingJob.application_email} placeholder="hr@example.com" style={{ width: '100%' }} />
                                </div>
                                <div className="admin-form-group">
                                    <label>Reporting To</label>
                                    <input name="reporting_to" defaultValue={editingJob.reporting_to} placeholder="e.g. Operations Manager" style={{ width: '100%' }} />
                                </div>
                            </div>

                            <div className="admin-form-group" style={{ marginTop: '10px' }}>
                                <label>Role Context (Optional)</label>
                                <textarea name="context" defaultValue={editingJob.context} placeholder="Context about the team or project..." style={{ width: '100%', minHeight: '60px', padding: '10px' }} />
                            </div>

                            <div className="admin-form-group" style={{ marginTop: '10px' }}>
                                <label>Qualifications & Requirements</label>
                                {qualifications.map((qual, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                                        <input
                                            value={qual}
                                            onChange={(e) => handleQualificationChange(index, e.target.value)}
                                            placeholder="Requirement..."
                                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                        />
                                        {qualifications.length > 1 && (
                                            <button type="button" onClick={() => removeQualification(index)} style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '0 10px', borderRadius: '4px', cursor: 'pointer' }}>✕</button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addQualification} style={{ background: '#0e224e', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', fontSize: '12px', marginTop: '5px', cursor: 'pointer' }}>+ Add Requirement</button>
                            </div>

                            <div className="admin-form-group" style={{ marginTop: '10px' }}>
                                <label>Short Description (Limit: 300) - For Card View</label>
                                <textarea name="short_description" defaultValue={editingJob.short_description || editingJob.description} required maxLength={300} style={{ width: '100%', minHeight: '80px', padding: '10px' }} />
                            </div>

                            <div className="admin-form-group" style={{ marginTop: '10px' }}>
                                <label>Full Description - For Detail Page</label>
                                <textarea name="full_description" defaultValue={editingJob.full_description || editingJob.description} required style={{ width: '100%', minHeight: '150px', padding: '10px' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', paddingBottom: '10px' }}>
                                <button type="submit" className="admin-login-btn" style={{ width: 'auto', padding: '10px 30px' }}>Save Job Opening</button>
                                <button type="button" onClick={() => setEditingJob(null)} style={{ background: '#eee', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="admin-card" style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '10px' }}>Title</th>
                            <th style={{ padding: '10px' }}>Short Description</th>
                            <th style={{ padding: '10px' }}>Location</th>
                            <th style={{ padding: '10px' }}>Type</th>
                            <th style={{ padding: '10px' }}>Status</th>
                            {canEdit && <th style={{ padding: '10px' }}>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                <td style={{ padding: '10px', fontWeight: '600' }}>{job.title}</td>
                                <td style={{ padding: '10px', fontSize: '12px', color: '#666' }}>
                                    {(job.short_description || job.description) ? 
                                        ((job.short_description || job.description).length > 60 ? (job.short_description || job.description).substring(0, 60) + '...' : (job.short_description || job.description)) 
                                        : 'N/A'}
                                </td>
                                <td style={{ padding: '10px' }}>{job.location}</td>
                                <td style={{ padding: '10px' }}>{job.employment_type || job.job_type}</td>
                                <td style={{ padding: '10px' }}>
                                    <span style={{ 
                                        color: job.status_color || (job.status === 'Active' ? '#10b981' : '#ef4444'),
                                        fontSize: '12px',
                                        fontWeight: '700'
                                    }}>
                                        {job.status}
                                    </span>
                                </td>
                                {canEdit && (
                                    <td style={{ padding: '10px' }}>
                                        <button onClick={() => setEditingJob(job)} style={{ background: '#0e224e', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', marginRight: '5px', cursor: 'pointer' }}>Edit</button>
                                        <button onClick={() => handleDelete(job.id)} style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>Delete</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobManager;
