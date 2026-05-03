/**
 * VoteGuide AI - Election Process Education Assistant
 * Main client-side application logic
 */
(function() {
  'use strict';

  // ── State ──
  const state = {
    chatHistory: [],
    quizQuestions: [],
    quizAnswers: {},
    quizResults: {},
    currentQuestion: 0,
    isLoading: false,
  };

  // ── Init ──
  document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavigation();
    initStats();
    initTimeline();
    initChat();
    initChecklist();
    initQuiz();
    initFAQ();
    initScrollAnimations();
  });

  // ── Particles ──
  function initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (10 + Math.random() * 20) + 's';
      p.style.animationDelay = Math.random() * 15 + 's';
      container.appendChild(p);
    }
  }

  // ── Navigation ──
  function initNavigation() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', links.classList.contains('open'));
      });
    }
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
      });
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + current);
      });
      // Close mobile nav on scroll
      if (links) links.classList.remove('open');
    });
    // Close mobile nav on link click
    navLinks.forEach(l => l.addEventListener('click', () => {
      if (links) links.classList.remove('open');
    }));
  }

  // ── Stats ──
  function initStats() {
    const container = document.getElementById('hero-stats');
    if (!container) return;
    fetch('/api/stats').then(r => r.json()).then(data => {
      if (!data.success) return;
      container.innerHTML = data.data.map(s =>
        `<div class="stat-card" role="listitem"><div class="stat-icon">${s.icon}</div><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div>`
      ).join('');
    }).catch(() => {
      container.innerHTML = [
        { icon: '👥', value: '97 Cr+', label: 'Registered Voters' },
        { icon: '🏛️', value: '10.5L+', label: 'Polling Stations' },
        { icon: '💺', value: '543', label: 'Lok Sabha Seats' },
        { icon: '🏢', value: '28', label: 'State Assemblies' },
      ].map(s => `<div class="stat-card" role="listitem"><div class="stat-icon">${s.icon}</div><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div>`).join('');
    });
  }

  // ── Timeline ──
  function initTimeline() {
    const container = document.getElementById('timeline-container');
    if (!container) return;
    fetch('/api/timeline').then(r => r.json()).then(data => {
      if (!data.success) return;
      container.innerHTML = data.data.map((item, i) =>
        `<div class="timeline-item" role="listitem" data-index="${i}">
          <div class="timeline-dot" style="border-color:${item.color}">${item.icon}</div>
          <div class="timeline-card" tabindex="0" role="button" aria-label="View details: ${item.title}" data-id="${item.id}">
            <h3>${item.title}</h3>
            <div class="phase-duration">${item.duration}</div>
            <p>${item.shortDescription}</p>
            <span class="view-details">View details →</span>
          </div>
        </div>`
      ).join('');
      // Click handlers
      container.querySelectorAll('.timeline-card').forEach(card => {
        const handler = () => openTimelineModal(card.dataset.id, data.data);
        card.addEventListener('click', handler);
        card.addEventListener('keydown', e => { if (e.key === 'Enter') handler(); });
      });
      // Animate on scroll
      observeElements(container.querySelectorAll('.timeline-item'));
    }).catch(console.error);
  }

  function openTimelineModal(id, data) {
    const item = data.find(d => d.id === id);
    if (!item) return;
    const modal = document.getElementById('timeline-modal');
    document.getElementById('modal-icon').textContent = item.icon;
    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-duration').textContent = item.duration;
    document.getElementById('modal-description').textContent = item.description;
    document.getElementById('modal-points').innerHTML = item.keyPoints.map(p => `<li>${p}</li>`).join('');
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('active'));
    // Close handlers
    const close = () => { modal.classList.remove('active'); setTimeout(() => { modal.hidden = true; }, 300); };
    document.getElementById('modal-close').onclick = close;
    modal.onclick = e => { if (e.target === modal) close(); };
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
  }

  // ── Chat ──
  function initChat() {
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const suggestionsEl = document.getElementById('chat-suggestions');
    if (!form || !input) return;

    input.addEventListener('input', () => { sendBtn.disabled = !input.value.trim(); });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const msg = input.value.trim();
      if (!msg || state.isLoading) return;
      sendMessage(msg);
      input.value = '';
      sendBtn.disabled = true;
    });

    // Load suggestions
    fetch('/api/assistant/suggestions').then(r => r.json()).then(data => {
      if (!data.success || !suggestionsEl) return;
      suggestionsEl.innerHTML = data.data.map(s =>
        `<button class="suggestion-chip" role="listitem" data-text="${escapeHtml(s.text)}">${s.icon} ${s.text}</button>`
      ).join('');
      suggestionsEl.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => sendMessage(chip.dataset.text));
      });
    }).catch(() => {});
  }

  function sendMessage(text) {
    const messages = document.getElementById('chat-messages');
    const suggestions = document.getElementById('chat-suggestions');
    if (!messages) return;
    // Hide welcome & suggestions
    const welcome = messages.querySelector('.chat-welcome');
    if (welcome) welcome.style.display = 'none';
    if (suggestions) suggestions.style.display = 'none';

    // Add user bubble
    addBubble(messages, text, 'user');
    state.chatHistory.push({ role: 'user', content: text });

    // Typing indicator
    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    typing.setAttribute('aria-label', 'Assistant is typing');
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    state.isLoading = true;
    fetch('/api/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: state.chatHistory.slice(-10) }),
    })
    .then(r => r.json())
    .then(data => {
      typing.remove();
      const response = data.success ? data.data.response : 'Sorry, something went wrong. Please try again.';
      addBubble(messages, response, 'assistant');
      state.chatHistory.push({ role: 'assistant', content: response });
    })
    .catch(() => {
      typing.remove();
      addBubble(messages, 'Connection error. Please check your network and try again.', 'assistant');
    })
    .finally(() => { state.isLoading = false; });
  }

  function addBubble(container, text, role) {
    const div = document.createElement('div');
    div.className = `chat-bubble ${role}`;
    div.innerHTML = role === 'assistant' ? parseMarkdown(text) : escapeHtml(text);
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  // ── Checklist ──
  function initChecklist() {
    const container = document.getElementById('checklist-container');
    if (!container) return;
    fetch('/api/checklist').then(r => r.json()).then(data => {
      if (!data.success) return;
      container.innerHTML = data.data.map((item, i) =>
        `<div class="checklist-item" role="listitem" style="transition-delay: ${i * 0.1}s">
          <div class="checklist-icon">${item.icon}</div>
          <div><h3>${item.title}</h3><p>${item.description}</p></div>
        </div>`
      ).join('');
      observeElements(container.querySelectorAll('.checklist-item'));
    }).catch(console.error);
  }

  // ── Quiz ──
  function initQuiz() {
    document.getElementById('btn-start-quiz')?.addEventListener('click', startQuiz);
    document.getElementById('btn-next-question')?.addEventListener('click', nextQuestion);
    document.getElementById('btn-prev-question')?.addEventListener('click', prevQuestion);
    document.getElementById('btn-retake-quiz')?.addEventListener('click', startQuiz);
  }

  function startQuiz() {
    state.quizAnswers = {};
    state.quizResults = {};
    state.currentQuestion = 0;
    fetch('/api/quiz').then(r => r.json()).then(data => {
      if (!data.success) return;
      state.quizQuestions = data.data;
      document.getElementById('quiz-start').hidden = true;
      document.getElementById('quiz-results').hidden = true;
      document.getElementById('quiz-question-container').hidden = false;
      showQuestion();
    }).catch(console.error);
  }

  function showQuestion() {
    const q = state.quizQuestions[state.currentQuestion];
    if (!q) return;
    const total = state.quizQuestions.length;
    const progress = ((state.currentQuestion + 1) / total) * 100;
    document.getElementById('quiz-progress-bar').style.width = progress + '%';
    document.getElementById('quiz-counter').textContent = `Question ${state.currentQuestion + 1} of ${total}`;
    document.getElementById('quiz-question-text').textContent = q.question;

    const isAnswered = state.quizResults[q.id] !== undefined;
    const result = state.quizResults[q.id];

    const optionsEl = document.getElementById('quiz-options');
    optionsEl.innerHTML = q.options.map((opt, i) => {
      let className = '';
      if (isAnswered) {
         if (i === result.correctAnswer) className = 'correct';
         else if (i === state.quizAnswers[q.id] && !result.correct) className = 'wrong';
      }
      return `<div class="quiz-option ${className}" role="radio" aria-checked="${state.quizAnswers[q.id] === i}" tabindex="${isAnswered ? -1 : 0}" data-index="${i}">
        <div class="quiz-option-marker">${String.fromCharCode(65 + i)}</div>
        <span>${opt}</span>
      </div>`;
    }).join('');

    let expEl = document.getElementById('quiz-explanation');
    if (!expEl) {
      expEl = document.createElement('div');
      expEl.id = 'quiz-explanation';
      optionsEl.parentNode.insertBefore(expEl, optionsEl.nextSibling);
    }
    
    if (isAnswered) {
       expEl.innerHTML = `<div class="quiz-explanation-box ${result.correct ? 'success' : 'error'}">
         <strong>${result.correct ? '✅ Correct!' : '❌ Incorrect.'}</strong>
         <p>${result.explanation}</p>
       </div>`;
       expEl.style.display = 'block';
    } else {
       expEl.innerHTML = '';
       expEl.style.display = 'none';
    }

    if (!isAnswered) {
      optionsEl.querySelectorAll('.quiz-option').forEach(opt => {
        const handler = () => {
          if (state.quizResults[q.id]) return; // already answered
          state.quizAnswers[q.id] = parseInt(opt.dataset.index);
          checkAnswer(q.id, state.quizAnswers[q.id]);
        };
        opt.addEventListener('click', handler);
        opt.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
      });
    }

    document.getElementById('btn-prev-question').disabled = state.currentQuestion === 0;
    const nextBtn = document.getElementById('btn-next-question');
    nextBtn.disabled = !isAnswered;
    nextBtn.textContent = state.currentQuestion === total - 1 ? 'See Final Results' : 'Next';
  }

  function checkAnswer(questionId, selectedOption) {
    fetch('/api/quiz/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: [{ questionId, selectedOption }] }),
    }).then(r => r.json()).then(data => {
      if (!data.success) return;
      state.quizResults[questionId] = data.data.results[0];
      showQuestion(); 
    }).catch(console.error);
  }

  function nextQuestion() {
    if (state.currentQuestion < state.quizQuestions.length - 1) {
      state.currentQuestion++;
      showQuestion();
    } else {
      submitQuiz();
    }
  }

  function prevQuestion() {
    if (state.currentQuestion > 0) { state.currentQuestion--; showQuestion(); }
  }

  function submitQuiz() {
    const results = Object.values(state.quizResults);
    const score = results.filter(r => r.correct).length;
    const total = state.quizQuestions.length;
    const percentage = Math.round((score / total) * 100);

    let grade, message;
    if (percentage >= 90) { grade = 'A+'; message = '🎉 Outstanding! You\'re an election expert!'; }
    else if (percentage >= 70) { grade = 'A'; message = '👏 Great job! You know your elections well!'; }
    else if (percentage >= 50) { grade = 'B'; message = '👍 Good effort! Keep learning about democracy.'; }
    else { grade = 'C'; message = '📚 Keep exploring! Democracy is worth understanding.'; }

    document.getElementById('quiz-question-container').hidden = true;
    document.getElementById('quiz-results').hidden = false;

    // Animate score circle
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (percentage / 100) * circumference;
    document.getElementById('score-text').textContent = percentage + '%';
    setTimeout(() => { document.getElementById('score-fill').style.strokeDashoffset = offset; }, 100);

    document.getElementById('quiz-grade').textContent = `Grade: ${grade} (${score}/${total})`;
    document.getElementById('quiz-message').textContent = message;

    // Review
    const reviewEl = document.getElementById('quiz-review');
    reviewEl.innerHTML = results.map((r, i) => {
      const q = state.quizQuestions.find(qq => qq.id === r.questionId);
      return `<div class="review-item ${r.correct ? '' : 'wrong'}" role="listitem">
        <h4>${r.correct ? '✅' : '❌'} ${q ? q.question : 'Question ' + (i+1)}</h4>
        <p>${r.explanation}</p>
      </div>`;
    }).join('');
  }

  // ── FAQ ──
  function initFAQ() {
    const list = document.getElementById('faq-list');
    const filters = document.getElementById('faq-filters');
    if (!list) return;

    fetch('/api/faq').then(r => r.json()).then(data => {
      if (!data.success) return;
      renderFAQs(list, data.data);
      // Filters
      if (filters) {
        filters.querySelectorAll('.faq-filter').forEach(btn => {
          btn.addEventListener('click', () => {
            filters.querySelectorAll('.faq-filter').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            const cat = btn.dataset.category;
            const filtered = cat === 'all' ? data.data : data.data.filter(f => f.category === cat);
            renderFAQs(list, filtered);
          });
        });
      }
    }).catch(console.error);
  }

  function renderFAQs(container, faqs) {
    container.innerHTML = faqs.map((f, i) =>
      `<div class="faq-item" id="faq-${f.id}" style="transition-delay: ${i * 0.05}s">
        <button class="faq-question" aria-expanded="false" aria-controls="answer-${f.id}">
          <span>${f.question}</span>
          <span class="faq-toggle" aria-hidden="true">▼</span>
        </button>
        <div class="faq-answer" id="answer-${f.id}" role="region">
          <div class="faq-answer-inner">${f.answer}</div>
        </div>
      </div>`
    ).join('');
    container.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        // Close all
        container.querySelectorAll('.faq-item').forEach(i => { i.classList.remove('open'); i.querySelector('.faq-question').setAttribute('aria-expanded', 'false'); });
        if (!isOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
      });
    });
    observeElements(container.querySelectorAll('.faq-item'));
  }

  // ── Scroll Animations ──
  function initScrollAnimations() {
    observeElements(document.querySelectorAll('.section-header, .stat-card'));
  }

  function observeElements(elements) {
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    elements.forEach(el => observer.observe(el));
  }

  // ── Utilities ──
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function parseMarkdown(text) {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
      .replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n{2,}/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }
})();
