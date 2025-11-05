// Email Service Configuration
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_cjljvsm',          // EmailJS Service ID
    TEMPLATE_ID_COIN_TRANSFER: 'template_wc0x76f', // Template ID for coin transfers
    PUBLIC_KEY: 'imeF22271UN2bcGWD'         // EmailJS Public Key
};

// Initialize EmailJS
(function() {
    try {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('EmailJS inicializado com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar EmailJS:', error);
    }
})();

class EmailService {
    static async sendCoinTransferEmail(recipientName, recipientEmail, senderName, coinAmount, reason, isStudent = false) {
        const time = new Date().toLocaleString();
        
        try {
            // Validar email
            if (!recipientEmail || !recipientEmail.includes('@')) {
                throw new Error(`Email inválido: ${recipientEmail}`);
            }

            console.log('Enviando email com os dados:', {
                recipientName,
                recipientEmail,
                senderName,
                coinAmount,
                reason,
                isStudent
            });

            const templateParams = {
                to_email: recipientEmail, // Este é o campo mais importante - define para onde o email será enviado
                recipientName,  // Nome de quem recebe o email
                coinAmount,     // Quantidade de moedas
                reason,        // Motivo da transferência
                time,         // Data/hora
                title: isStudent ? `Recebimento de Moedas` : `Confirmação de Envio de Moedas`,
                message: isStudent 
                    ? `Você recebeu ${coinAmount} moedas do professor ${senderName}.`
                    : `Você enviou ${coinAmount} moedas para ${senderName}.`
            };

            console.log('Parâmetros do template:', templateParams);

            const response = await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID_COIN_TRANSFER,
                templateParams
            );
            
            console.log('Email enviado com sucesso:', response);
            return { success: true };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error };
        }
    }

    static async sendCoinTransferNotification(data) {
        const { professorName, professorEmail, studentName, studentEmail, coinAmount, reason } = data;

        try {
            // Send notification to professor
            const professorNotification = await this.sendCoinTransferEmail(
                professorName, 
                professorEmail, 
                studentName, 
                coinAmount, 
                reason, 
                false
            );

            // Send notification to student
            const studentNotification = await this.sendCoinTransferEmail(
                studentName, 
                studentEmail, 
                professorName, 
                coinAmount, 
                reason, 
                true
            );

            if (!professorNotification.success || !studentNotification.success) {
                throw new Error('Failed to send one or more notifications');
            }

            return { success: true };
        } catch (error) {
            console.error('Error in coin transfer notification:', error);
            return { success: false, error };
        }
    }
}

// Example usage:
// const form = document.getElementById('contact-form');
// form.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const formData = {
//         name: form.querySelector('[name="name"]').value,
//         email: form.querySelector('[name="email"]').value,
//         message: form.querySelector('[name="message"]').value
//     };
//     
//     const result = await EmailService.sendContactForm(formData);
//     if (result.success) {
//         alert('Message sent successfully!');
//         form.reset();
//     } else {
//         alert('Failed to send message. Please try again.');
//     }
// });
