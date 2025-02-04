import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { myAxios } from '../api/axios';

const ResetPassword = () => {
    const { token } = useParams();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await myAxios.post('/api/reset-password', {
                token,
                email,
                newPassword,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div>
            <h2>Jelszó visszaállítása</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Új jelszó"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit">Jelszó visszaállítása</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;