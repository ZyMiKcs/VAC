import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const supabaseUrl = 'https://zzvggeewmclyffuouvpe.supabase.co';
const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dmdnZWV3bWNseWZmdW91dnBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI1MzY1ODksImV4cCI6MjAxODExMjU4OX0.khTQysOlq1Zd8zLggQyQJaVQn4ermq3P3CNfeCRthM0';
const supabase = createClient(supabaseUrl, supabaseKey);

const targetTable = 'my_custom_users';

const salt = 'vlaznev';

// Регистрация нового пользователя
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const lowerCaseUsername = username.toLowerCase() + salt;

    try {
        const userId = uuidv4();

        // bcrypt
        const hashedUsername = await bcrypt.hash(
            lowerCaseUsername,
            '$2b$10$abcdefghijklmnopqrstuvwxyz0123'
        );
        // const match = await bcrypt.compare(
        //     lowerCaseUsername + salt,
        //     data.username
        // );

        // SHA-256
        const hashedPassword = crypto
            .createHash('sha256')
            .update(password + salt)
            .digest('hex');
        // SHA-512
        // const hashedPassword = crypto
        //     .createHash('sha512')
        //     .update(password + salt)
        //     .digest('hex');
        // MD5
        // const hashedUsername = crypto
        //     .createHash('md5')
        //     .update(lowerCaseUsername)
        //     .digest('hex');

        const { data, error } = await supabase.from(targetTable).upsert([
            {
                id: userId,
                username: hashedUsername,
                password: hashedPassword,
                role: 'reader',
            },
        ]);

        if (error) {
            console.error('Supabase registration error:', error.message);
            res.status(500).json({
                message: 'duplicate key value violates unique constraint',
            });
        } else {
            console.log('User registered successfully:', data);
            res.status(200).json({ message: 'User registered successfully' });
        }
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Аутентификация пользователя
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const lowerCaseUsername = username.toLowerCase() + salt;
    // const hashedUsername = crypto
    //     .createHash('md5')
    //     .update(lowerCaseUsername)
    //     .digest('hex');

    const hashedUsername = await bcrypt.hash(
        lowerCaseUsername,
        '$2b$10$abcdefghijklmnopqrstuvwxyz0123'
    );

    try {
        // Получение данных пользователя по имени
        const { data, error } = await supabase
            .from(targetTable)
            .select('id, username, password, role')
            .eq('username', hashedUsername)
            .single();

        if (error) {
            console.error('Supabase login error:', error.message);
            return res.status(500).json({ message: 'Error during login' });
        }

        // Проверка пароля (bcrypt)
        // const match = await bcrypt.compare(password, data.password);
        // SHA-256
        const match =
            crypto
                .createHash('sha256')
                .update(password + salt)
                .digest('hex') === data.password;
        // SHA-512
        // const match =
        //     crypto
        //         .createHash('sha512')
        //         .update(password + salt)
        //         .digest('hex') === data.password;
        // MD5
        // const match = crypto.createHash('md5').update(password).digest('hex') === data.password;

        if (match) {
            // Передача информации о пользователе
            res.status(200).json({
                message: 'Login successful',
                user: { id: data.id, username: data.username, role: data.role },
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Error during login' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
