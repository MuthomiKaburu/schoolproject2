import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { Pencil, CheckCircle, AlertCircle } from 'lucide-react';
import './UserProfile.css';
import Navbar from './Navbar';
import defaultAvatar from '../assets/default-avatar.png';

export default function UserProfile() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({
        firstName: '',
        secondName: '',
        age: '',
        gender: '',
        bio: '',
        avatar_url: '',
    });
    const [editing, setEditing] = useState(true);
    const [saved, setSaved] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id);

                if (!error && data.length === 1) {
                    const p = data[0];
                    setProfile({
                        firstName: p.first_name || '',
                        secondName: p.second_name || '',
                        age: p.age || '',
                        gender: p.gender || '',
                        bio: p.bio || '',
                        avatar_url: p.avatar_url || '',
                    });
                }
            }
        };

        fetchUserProfile();
    }, []);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user) return;

        // Sanitize file name to prevent %20 issues
        const sanitizedFilename = file.name.replace(/\s+/g, '-');
        const filePath = `private/${user.id}/${sanitizedFilename}`;

        const { error } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true });

        if (!error) {
            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath); // OR use createSignedUrl if private
            setProfile((prev) => ({ ...prev, avatar_url: data.publicUrl }));
        } else {
            console.error('Upload error:', error.message);
        }
    }

    const handleSave = async () => {
        if (!user) return;

        const { error } = await supabase.from('profiles').upsert({
            id: user.id,
            first_name: profile.firstName,
            second_name: profile.secondName,
            age: parseInt(profile.age),
            gender: profile.gender,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
        });

        if (!error) {
            setSaved(true);
            setEditing(false);
        }
    };

    const updateField = (key, value) => {
        setProfile((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="profile-page">
            <Navbar />
            <div className="user-profile-container">
                <div className="name-avatar-row">
                    <div className="profile-fields name-fields">
                        <label>First Name</label>
                        <input
                            type="text"
                            value={profile.firstName}
                            disabled={!editing}
                            onChange={(e) => updateField('firstName', e.target.value)}
                        />
                        <label>Second Name</label>
                        <input
                            type="text"
                            value={profile.secondName}
                            disabled={!editing}
                            onChange={(e) => updateField('secondName', e.target.value)}
                        />
                    </div>
                    <div className="avatar-section">
                        <img
                            src={profile.avatar_url || defaultAvatar}
                            alt="Profile"
                            className="profile-pic"
                            onClick={() => editing && fileInputRef.current.click()}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleUpload}
                        />
                    </div>
                </div>

                <div className="profile-fields">
                    <label>Age</label>
                    <input
                        type="number"
                        value={profile.age}
                        disabled={!editing}
                        onChange={(e) => updateField('age', e.target.value)}
                    />

                    <label>Gender</label>
                    <select
                        value={profile.gender}
                        disabled={!editing}
                        onChange={(e) => updateField('gender', e.target.value)}
                    >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    <label>Bio</label>
                    <textarea
                        value={profile.bio}
                        disabled={!editing}
                        onChange={(e) => updateField('bio', e.target.value)}
                    />
                </div>

                <div className="profile-buttons">
                    <button onClick={() => setEditing(true)} className="btn edit">
                        <Pencil size={16} /> Edit
                    </button>
                    <button onClick={handleSave} className="btn save">
                        <CheckCircle size={16} /> Save
                    </button>
                </div>

                {saved ? (
                    <div className="alert success">
                        <CheckCircle size={18} /> Profile saved successfully!
                    </div>
                ) : !editing ? (
                    <div className="alert error">
                        <AlertCircle size={18} /> Please complete all fields and upload a profile image.
                    </div>
                ) : null}
            </div>
        </div>
    );
}