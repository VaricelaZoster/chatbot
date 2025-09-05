import Bot from "../models/user.model.js"
import User from "../models/user.model.js"

export const Message = async (req, res) => {
    try {
        const text = req.body.text
        if (!text?.trim()) {
            return res.status(400).json({
                error: "Text cannot be empty"
            })
        }

        const user = await User.create({
            sender: "user",
            text
        })

        // Doctor database
        const doctors = {
            "dr. sharma": {
                specialization: "Cardiologist",
                availability: "Tuesday and Thursday"
            },
            "dr. patel": {
                specialization: "Dermatologist",
                availability: "Monday, Wednesday, and Friday"
            },
            "dr. mehta": {
                specialization: "General Physician",
                availability: "Saturday and Sunday"
            }
        }

        // Static responses
        const botResponses = {
            "hi": "Hello! Welcome to our clinic. How can I assist you today?",
            "hello": "Hi there! I'm here to help you with doctor info, appointments, or any queries.",
            "how are you?": "I'm just a bot, but I'm ready to help you anytime!",
            "what is your name?": "I'm MedBot, your virtual health assistant.",
            "thank you": "You're welcome! Wishing you good health.",
            "bye": "Goodbye! Take care and stay healthy.",

            "which doctors are available?": "We have Dr. Sharma (Cardiologist), Dr. Patel (Dermatologist), and Dr. Mehta (General Physician). Would you like to book with one of them?",

            "show my appointments": "You have an appointment with Dr. Mehta on Sep 6 at 11 AM. Do you want to keep or cancel it?",
            "cancel my appointment": "Your appointment with Dr. Mehta has been canceled. You can book a new one anytime.",

            "how do i pay?": "You can pay online via UPI, credit card, or net banking after confirming your appointment. Would you like me to send the payment link?",

            "i have skin rashes": "For skin-related concerns, a Dermatologist is the right choice. Would you like me to show available dermatologists?",

            "what time does the clinic open?": "Our clinic is open from 9 AM to 9 PM, Monday to Saturday.",
            "do you accept insurance?": "Yes, we accept health insurance. Please carry your card when visiting.",
            "how do i reach you?": "You can call us at +91-XXXXXXXXXX or email support@clinic.com."
        }

        const normalizedText = text.trim().toLowerCase()
        let botResponse = botResponses[normalizedText]

        // Dynamic doctor booking
        if (!botResponse && normalizedText.includes("book an appointment with")) {
            for (let doctor in doctors) {
                if (normalizedText.includes(doctor)) {
                    botResponse = `Sure! ${doctor.charAt(0).toUpperCase() + doctor.slice(1)} is available on ${doctors[doctor].availability}. Which day works best for you?`
                }
            }
        }

        // Fallback
        if (!botResponse) {
            botResponse = "Sorry, I don't understand that. Can you rephrase?"
        }

        const bot = await Bot.create({
            text: botResponse
        })

        return res.status(200).json({
            userMessage: user.text,
            botMessage: bot.text
        })

    } catch (err) {
        console.log("Error in message controller", err)
        return res.status(500).json({
            error: "Internal server error"
        })
    }
}
