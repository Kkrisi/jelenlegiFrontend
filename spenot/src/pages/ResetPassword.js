import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { myAxios } from '../api/axios';
import { useEffect } from 'react';

const ResetPassword = () => {
    const { token } = useParams();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        myAxios.get('/sanctum/csrf-cookie')
            
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await myAxios.post('/api/reset-password', {
                token,
                email,
                password: newPassword, // Laravel ezt várja
                password_confirmation: confirmPassword, // Laravel ezt is várja
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Hiba történt.');
        }
    };

    return (
        <div className="studentsmanagement">
            <article>
                <h2>Jelszó visszaállítása</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Új jelszó"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Jelszó megerősítése"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button id="resetBtn" type="submit">Jelszó visszaállítása</button>
                </form>
                {message && <p>{message}</p>}
            </article>
        </div>
    );
};

export default ResetPassword;
