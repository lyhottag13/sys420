import nodemailer from 'nodemailer';
import fs from 'fs';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { email, contentBuffer, fileName } = req.body;

            // Guarda el archivo localmente para prueba
            const buffer = Buffer.from(contentBuffer, 'base64');
            fs.writeFileSync('test.xlsx', buffer);

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Reporte de Resultados',
                text: 'Aquí tienes el reporte solicitado.',
                attachments: [
                    {
                        filename: fileName,
                        content: buffer,
                        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    }
                ]
            };

            const result = await transporter.sendMail(mailOptions);
            console.log('Email sent:', result);
            res.status(200).send('Email sent');
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Error sending email');
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
    }
}
