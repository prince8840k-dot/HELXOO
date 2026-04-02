document.addEventListener('DOMContentLoaded', () => {
    const chatStream = document.getElementById('chat-stream');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    const emergencyModal = document.getElementById('emergency-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // --- Theme Management ---
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }
    }

    // Check system preference immediately (as fallback or initial set, 
    // though CSS handles system pref automatically without JS if data-theme is unset. 
    // By setting it here, we ensure icon state matches actual state)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = prefersDark ? 'dark' : 'light';
    setTheme(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(currentTheme);
    });

    // --- Chat System ---
    
    // Initial Disclaimer Array
    const initialMessages = [
        "Hello! I am your AI Health Assistant.",
        "Please note: I am an artificial intelligence, not a licensed medical professional. The information I provide is for educational purposes only. Always consult a real doctor for medical advice.",
        "How can I help you today? Please describe your symptoms."
    ];

    // Simple delay utility
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // Append a message to the chat
    function appendMessage(text, type, extraClass = '') {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type} ${extraClass}`;
        msgDiv.innerText = text;
        chatStream.appendChild(msgDiv);
        chatStream.scrollTop = chatStream.scrollHeight;
    }

    // Inject initialization messages
    async function initializeChat() {
        for (let i = 0; i < initialMessages.length; i++) {
            await delay(500); // Simulate typing delay
            let extraClass = i === 1 ? 'disclaimer-msg' : '';
            appendMessage(initialMessages[i], 'ai-msg', extraClass);
        }
    }

    initializeChat();

    // --- Keyword Logic & Emergency Protocol ---

    const emergencyKeywords = ['chest pain', 'breathing', 'heart attack', 'numbness', 'stroke', 'unconscious', 'bleeding heavily'];
    
    const ailments = {
        'headache': 'It sounds like you have a headache. Ensure you are well hydrated and consider resting in a quiet, dark room. If it is extraordinarily severe or accompanied by vision issues, please seek medical help.',
        'cold': 'You might be experiencing a common cold. Rest, stay hydrated, and try warm liquids to soothe your throat.',
        'stomach': 'Stomach issues can be uncomfortable. Stick to bland foods, drink plenty of water, and rest. If pain is severe or persists, see a doctor.',
        'fever': 'A fever is a sign your body is fighting off an infection. You can try over-the-counter fever reducers and get plenty of rest.',
        'cough': 'For a cough, honey and warm tea can be very soothing. If it lasts more than a few weeks or traces of blood appear, seek an in-person consultation.'
    };

    function processUserInput(input) {
        const lowerInput = input.toLowerCase();

        // 1. Check Emergency Protocol first
        let isEmergency = false;
        for (let word of emergencyKeywords) {
            if (lowerInput.includes(word)) {
                isEmergency = true;
                break;
            }
        }

        if (isEmergency) {
            triggerEmergencyProtocol();
            return;
        }

        // 2. Check for standard ailments
        let foundResponse = null;
        for (let key in ailments) {
            if (lowerInput.includes(key)) {
                foundResponse = ailments[key];
                break;
            }
        }

        if (foundResponse) {
            simulateAIResponse(foundResponse);
        } else {
            simulateAIResponse("I've noticed your symptoms, but this particular issue might require a healthcare professional's assessment. Can you provide any more details, or perhaps consult a doctor?");
        }
    }

    async function triggerEmergencyProtocol() {
        // Show high-visibility modal
        emergencyModal.classList.remove('hidden');
        
        // Append distinct warning in chat
        await delay(300);
        appendMessage(
            "⚠️ Potential Medical Emergency Detected ⚠️\nYour symptoms indicate a critical situation. Please seek immediate medical care or call 911/local emergency services right now.", 
            "ai-msg", 
            "emergency-msg"
        );
    }

    async function simulateAIResponse(text) {
        // Show a fake typing indicator or delay
        await delay(800 + Math.random() * 500);
        appendMessage(text, 'ai-msg');
    }

    // --- Event Listeners ---
    
    function handleSend() {
        const text = chatInput.value.trim();
        if (text === '') return;

        appendMessage(text, 'user-msg');
        chatInput.value = '';
        
        processUserInput(text);
    }

    sendBtn.addEventListener('click', handleSend);

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });

    closeModalBtn.addEventListener('click', () => {
        emergencyModal.classList.add('hidden');
    });
});
