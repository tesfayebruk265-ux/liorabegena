import { AiChatMessage, AiQuizQuestion } from '../../types';
import { ROLE_SYSTEM_PROMPTS } from './AiData';

export async function askAiAssistant(
  prompt: string,
  role: string = 'Student',
  history: AiChatMessage[] = []
): Promise<AiChatMessage> {
  const systemInstruction = ROLE_SYSTEM_PROMPTS[role] || ROLE_SYSTEM_PROMPTS.Student;

  try {
    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        role,
        systemInstruction,
        history: history.slice(-5).map((h) => ({ role: h.role, content: h.content })),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        id: `MSG-${Date.now()}`,
        role: 'assistant',
        content: data.text || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAiGenerated: true,
        confidence: data.confidence || 'High',
        sourceCitations: [
          { title: 'Abel Begena Traditional Music Curriculum', module: 'Verified Source' },
          { title: 'Ethiopian Orthodox Music Tradition - St. Yared', module: 'Liturgical Heritage' }
        ],
      };
    }
  } catch (e) {
    console.warn('Backend API request failed, using local AI engine fallback', e);
  }

  // Local fallback response generator
  return generateLocalAiResponse(prompt, role);
}

export async function fetchAiQuiz(
  topic: string,
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Adaptive' = 'Medium'
): Promise<AiQuizQuestion[]> {
  try {
    const res = await fetch('/api/ai/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, count: 3, difficulty }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.questions) && data.questions.length > 0) {
        return data.questions.map((q: any, index: number) => ({
          id: `QZ-GEN-${Date.now()}-${index}`,
          question: q.question || 'What is the primary function of the Begena Sera?',
          options: q.options || ['Leather Slider for Buzzing', 'Metal String', 'Peg Lock', 'Tuning Hammer'],
          correctAnswer: q.correctAnswer || 'Leather Slider for Buzzing',
          explanation: q.explanation || 'The Sera leather pieces adjust contact against the bridge to generate the characteristic buzzing sound.',
          type: 'Multiple Choice',
          difficulty: difficulty,
        }));
      }
    }
  } catch (e) {
    console.warn('Quiz API call failed, generating local quiz fallback', e);
  }

  return [
    {
      id: `QZ-LOCAL-1`,
      question: `[AI Generated] What is the primary role of the Begena 'Birama' (Bridge)?`,
      options: ['Supporting strings above the hide soundboard', 'Holding the pegs', 'Decorating the frame', 'Plucking the strings'],
      correctAnswer: 'Supporting strings above the hide soundboard',
      explanation: 'The Birama holds the strings above the stretched hide soundboard (Wag) and houses the Sera sliders.',
      type: 'Multiple Choice',
      difficulty: difficulty,
    },
    {
      id: `QZ-LOCAL-2`,
      question: `[AI Generated] True or False: In Begena technique, strings 1, 5, 6, and 10 are non-plucked pillar tones.`,
      options: ['True', 'False'],
      correctAnswer: 'True',
      explanation: 'Strings 1, 5, 6, and 10 function as spiritual anchor pillars during modal playing.',
      type: 'True/False',
      difficulty: difficulty,
    }
  ];
}

function generateLocalAiResponse(prompt: string, role: string): AiChatMessage {
  const lower = prompt.toLowerCase();
  let text = '';
  let citations = [
    { title: 'Abel Begena Student Handbook (Vol. 1)', module: 'School Policy & Curriculum' },
    { title: 'Heritage of King David Lyre', module: 'Cultural Archives' }
  ];

  if (lower.includes('practice') || lower.includes('plan') || lower.includes('today')) {
    text = `Here is your recommended **AI Practice Plan** for today:\n\n` +
      `1. **5 Mins Warm-Up:** Open string plucking on strings 1 to 10 at 60 BPM.\n` +
      `2. **10 Mins Technique:** Left-hand index muting to eliminate unwanted string ring.\n` +
      `3. **10 Mins Lesson Review:** Stanza 1 of "Kibre Yebal" with steady thumb rhythm.\n` +
      `4. **5 Mins Cool-Down:** Sustained bass note buzzing adjustment using the Sera leather sliders.`;
  } else if (lower.includes('explain') || lower.includes('simple') || lower.includes('sera') || lower.includes('tuning')) {
    text = `**Understanding Begena Tuning & Buzzing (Sera):**\n\n` +
      `• **What is Sera?** Small leather pieces positioned between the gut strings and the wide wooden bridge (Birama).\n` +
      `• **Why does it buzz?** When a string is plucked, it vibrates against the leather surface, creating a rich, buzzing, harmonic timbre.\n` +
      `• **Cultural Note:** This buzzing resonance is traditionally described as a meditative aura that aids spiritual contemplation.`;
  } else if (role === 'Founder') {
    text = `**Founder Strategic Intelligence Summary:**\n\n` +
      `• **Total Active Students:** 1,280 across Addis Ababa branches & Online Global Campus.\n` +
      `• **Top Performing Branch:** Bole Medhanealem (94% enrollment capacity).\n` +
      `• **Fastest Growing Course:** Online Diaspora Hybrid Begena Level 1 (+32% MoM).\n` +
      `• **Recommended Action:** Open 2 additional weekend evening sessions to capture waiting list demand.`;
  } else if (role === 'Teacher') {
    text = `**Teacher AI Helper:**\n\n` +
      `• **Students Needing Attention:** 3 students in Begena Level 1 missed the last homework deadline.\n` +
      `• **Draft Lesson Plan Available:** Topic "Mastering 10-String Octave Transitions".\n` +
      `• **Action:** Would you like me to draft personalized encouragement messages for your review?`;
  } else {
    text = `[AI Generated Response for ${role}]\n\n` +
      `Regarding "${prompt}":\n\n` +
      `The Abel Begena School emphasizes authentic traditional mastery paired with structured modern pedagogy. ` +
      `Our curriculum combines Ge'ez musical notation, hands-on instrument tuning, and liturgical heritage. ` +
      `Let me know if you would like me to generate a study summary, practice exercise, or quiz on this topic!`;
  }

  return {
    id: `MSG-${Date.now()}`,
    role: 'assistant',
    content: text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isAiGenerated: true,
    confidence: 'High',
    sourceCitations: citations,
  };
}

