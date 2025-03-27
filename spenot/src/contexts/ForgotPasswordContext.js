import React, { useState, useEffect, createContext, useContext } from 'react';
import { myAxios } from '../api/axios';
import useButtonContext from '../contexts/ButtonContext';

const ForgotPasswordContext = createContext();

export const ForgotPasswordProvider = ({ children }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const { setShowModal } = useButtonContext();

    useEffect(() => {
        // Laravel CSRF cookie inicializálása
        myAxios.get('/sanctum/csrf-cookie');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const emailRegex = /^(?=.*\..{2,}).+$/; // kell benne lennie egy pontnak, és utánna kötelező 2 karakter, a többit ellenorzi a form
        if (!emailRegex.test(email)) {
            alert("Kérlek, adj meg egy érvényes email címet!\nLegyen a végén pont és 2 karakter utánna!");
            return;
        }

        setShowModal(true);
        try {
            const response = await myAxios.post('/api/forgot-password', { email });
            setMessage(response.data.message);
            setShowModal(false);
        } catch (error) {
            if (error.response?.data?.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Hiba történt a kérés feldolgozása közben.');
            }
            setShowModal(false);
        }
    };

    return (
        <ForgotPasswordContext.Provider value={{ email, setEmail, message, setMessage, handleSubmit }}>
            {children}
        </ForgotPasswordContext.Provider>
    );
};

export const useForgotPassword = () => {
    const context = useContext(ForgotPasswordContext);
    if (!context) {
        throw new Error("useForgotPassword must be used within a ForgotPasswordProvider");
    }
    return context;
};
