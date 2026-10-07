/* GMIT ERP - GMIT AI Conversational Assistant Module (Flask Powered) */

import { queryAuraAIChat as queryGMITAIChat } from '../data/aiData.js';

let chatHistory = [
  {
    sender: 'bot',
    text: `👋 **Greetings! I am GMIT AI Assistant**, connected directly to the **GM Institute of Technology ERP Backend Server** (` + '`http://127.0.0.1:5000`' + `).\n\nI monitor real-time academic records, QR attendance, VTU exam schedules, and department performance.\n\nHow can I assist your department today?`
  }
];

export function renderAIChatbotModule() {
  return `
    <div class="chat-window">
      <div class="chat-header">
        <div class="chat-bot-info">
          <div class="bot-avatar-glow">
            <i class="fa-solid fa-brain"></i>
          </div>
          <div>
            <h3 style="font-family: var(--font-heading); font-weight: 700;">GMIT AI Campus Co-Pilot</h3>
            <span style="font-size: 0.72rem; color: var(--ai-cyan); font-weight: 600;">GM Institute of Technology, Davangere • Python Flask AI Sync</span>
          </div>
        </div>
        <button class="btn btn-secondary" id="btn-clear-chat" style="padding: 4px 10px; font-size: 0.75rem;">
          <i class="fa-solid fa-trash"></i> Clear Chat
        </button>
      </div>

      <!-- Quick Prompt Chips -->
      <div class="quick-prompts">
        <span class="prompt-chip" data-prompt="Which students are currently at academic risk?"><i class="fa-solid fa-triangle-exclamation text-amber"></i> Flagged At-Risk Students</span>
        <span class="prompt-chip" data-prompt="What is the current tuition fee collection status?"><i class="fa-solid fa-wallet text-emerald"></i> Tuition Fee Report</span>
        <span class="prompt-chip" data-prompt="Show upcoming semester exam timetable"><i class="fa-solid fa-calendar text-cyan"></i> Final Exam Schedule</span>
        <span class="prompt-chip" data-prompt="How many placement offers were made by Google DeepMind?"><i class="fa-solid fa-briefcase text-indigo"></i> Placement Drive Stats</span>
      </div>

      <!-- Messages Area -->
      <div class="chat-messages" id="chat-messages-container">
        ${renderChatMessages()}
      </div>

      <!-- Chat Input Bar -->
      <div class="chat-input-area">
        <input type="text" id="chat-user-input" class="chat-input-field" placeholder="Ask GMIT AI anything about university stats, student risk, fees, exams..." autocomplete="off">
        <button class="btn btn-primary" id="chat-send-btn" style="border-radius: 30px; width: 44px; height: 44px; padding: 0;">
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  `;
}

function renderChatMessages() {
  return chatHistory.map(m => `
    <div class="msg-bubble ${m.sender}">
      <div class="msg-author">
        ${m.sender === 'bot' ? '<i class="fa-solid fa-atom text-cyan"></i> GMIT AI' : '<i class="fa-solid fa-user"></i> You'}
      </div>
      <div>${m.text.replace(/\n/g, '<br>')}</div>
    </div>
  `).join('');
}

export function bindAIChatbotEvents() {
  const container = document.getElementById('chat-messages-container');
  const input = document.getElementById('chat-user-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const clearBtn = document.getElementById('btn-clear-chat');

  const scrollToBottom = () => {
    if (container) container.scrollTop = container.scrollHeight;
  };

  const handleSend = async (textOverride) => {
    const userText = textOverride || (input ? input.value.trim() : '');
    if (!userText) return;

    // Add user message
    chatHistory.push({ sender: 'user', text: userText });
    if (input) input.value = '';
    
    if (container) container.innerHTML = renderChatMessages();
    scrollToBottom();

    // Show bot typing placeholder
    chatHistory.push({ sender: 'bot', text: '🤖 *Flask Python Backend AI is querying database...*' });
    if (container) container.innerHTML = renderChatMessages();
    scrollToBottom();

    // Fetch from Flask REST API
    const aiResponse = await queryGMITAIChat(userText);
    
    // Replace typing placeholder with AI response
    chatHistory.pop();
    chatHistory.push({ sender: 'bot', text: aiResponse.text });

    if (container) container.innerHTML = renderChatMessages();
    scrollToBottom();
  };

  if (sendBtn) sendBtn.onclick = () => handleSend();
  if (input) {
    input.onkeypress = (e) => {
      if (e.key === 'Enter') handleSend();
    };
  }

  if (clearBtn) {
    clearBtn.onclick = () => {
      chatHistory = [chatHistory[0]];
      if (container) container.innerHTML = renderChatMessages();
    };
  }

  // Quick Prompt Chips click binding
  document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.onclick = (e) => {
      const prompt = e.currentTarget.getAttribute('data-prompt');
      handleSend(prompt);
    };
  });

  scrollToBottom();
}
