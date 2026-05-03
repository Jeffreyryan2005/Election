/**
 * Election Data Module
 * 
 * Comprehensive, structured data about the Indian election process
 * including timelines, phases, FAQs, and educational content.
 * 
 * @module data/electionData
 */

const electionTimeline = [
  {
    id: 'announcement',
    phase: 1,
    title: 'Election Announcement',
    icon: '📢',
    shortDescription: 'ECI announces election dates and schedule',
    description: 'The Election Commission of India (ECI) announces the election schedule, including dates for nominations, scrutiny, withdrawal, polling, and counting. The Model Code of Conduct (MCC) comes into immediate effect from this announcement.',
    keyPoints: [
      'ECI press conference to announce dates',
      'Model Code of Conduct activated immediately',
      'Government cannot announce new policies or schemes',
      'Election observers are deployed',
    ],
    duration: 'Day 0',
    color: '#6366f1',
  },
  {
    id: 'nomination',
    phase: 2,
    title: 'Nomination Filing',
    icon: '📝',
    shortDescription: 'Candidates file their nomination papers',
    description: 'Eligible candidates file their nomination papers with the Returning Officer of their constituency. They must submit required documents, a security deposit, and declare their assets and criminal records (if any).',
    keyPoints: [
      'Candidates file Form 2A/2B with Returning Officer',
      'Security deposit: ₹25,000 (General), ₹12,500 (SC/ST)',
      'Mandatory disclosure of criminal cases, assets, and education',
      'Affidavit submission required',
    ],
    duration: 'Day 1 – Day 7',
    color: '#8b5cf6',
  },
  {
    id: 'scrutiny',
    phase: 3,
    title: 'Scrutiny of Nominations',
    icon: '🔍',
    shortDescription: 'Nominations examined for validity',
    description: 'The Returning Officer examines each nomination paper for completeness and validity. Nominations may be rejected if the candidate is not eligible, documents are incomplete, or the security deposit was not paid.',
    keyPoints: [
      'Returning Officer checks eligibility criteria',
      'Verification of documents and signatures',
      'Candidates can be present during scrutiny',
      'Invalid nominations are rejected with reasons',
    ],
    duration: 'Day 8',
    color: '#a855f7',
  },
  {
    id: 'withdrawal',
    phase: 4,
    title: 'Withdrawal of Candidature',
    icon: '🚫',
    shortDescription: 'Last date to withdraw from the election',
    description: 'Candidates who filed nominations can withdraw their candidature before the deadline. After this date, the final list of contesting candidates is prepared and symbols are allotted.',
    keyPoints: [
      'Candidates may withdraw in writing to Returning Officer',
      'Final list of candidates prepared after deadline',
      'Election symbols officially allotted',
      'Candidate list published for public',
    ],
    duration: 'Day 10',
    color: '#c084fc',
  },
  {
    id: 'campaigning',
    phase: 5,
    title: 'Election Campaign',
    icon: '📣',
    shortDescription: 'Political campaigns and voter outreach',
    description: 'Political parties and candidates campaign to win votes through rallies, door-to-door canvassing, media advertisements, and social media. Campaigning must follow MCC guidelines and must stop 48 hours before polling.',
    keyPoints: [
      'Rallies, roadshows, and public meetings',
      'Media advertisements (print, TV, digital)',
      'Door-to-door canvassing by party workers',
      'Campaign silence period: 48 hours before polling',
      'Expenditure limits monitored by ECI',
    ],
    duration: 'Day 10 – Day 26',
    color: '#f59e0b',
  },
  {
    id: 'polling',
    phase: 6,
    title: 'Polling Day',
    icon: '🗳️',
    shortDescription: 'Citizens cast their votes at polling stations',
    description: 'On polling day, registered voters visit their assigned polling stations to cast their votes using Electronic Voting Machines (EVMs). The process includes identity verification, inking, and VVPAT verification.',
    keyPoints: [
      'Polling hours typically 7:00 AM to 6:00 PM',
      'Identity verified against electoral roll',
      'Indelible ink applied to left index finger',
      'Vote cast on EVM, verified by VVPAT slip',
      'Polling station within 2 km of every voter',
    ],
    duration: 'Day 28',
    color: '#10b981',
  },
  {
    id: 'counting',
    phase: 7,
    title: 'Counting & Results',
    icon: '📊',
    shortDescription: 'Votes counted and results declared',
    description: 'On counting day, EVMs are brought from strongrooms and votes are counted in the presence of the Returning Officer, candidates, and their agents. Results are declared constituency-wise using the First-Past-The-Post system.',
    keyPoints: [
      'EVMs retrieved from secured strongrooms',
      'Postal ballots counted first',
      'EVM counting starts 30 minutes later',
      '5 random VVPAT machines verified per segment',
      'Winner declared by Returning Officer',
    ],
    duration: 'Day 31',
    color: '#ef4444',
  },
];

const voterChecklist = [
  {
    id: 'check-registration',
    title: 'Check Your Registration',
    description: 'Verify your name on the electoral roll at voters.eci.gov.in or via the Voter Helpline App',
    icon: '✅',
    link: 'https://voters.eci.gov.in',
  },
  {
    id: 'find-polling-station',
    title: 'Find Your Polling Station',
    description: 'Locate your assigned polling station using the Voter Helpline App or ECI website',
    icon: '📍',
    link: 'https://voters.eci.gov.in',
  },
  {
    id: 'carry-id',
    title: 'Carry Valid Photo ID',
    description: 'Bring your EPIC (Voter ID) or any approved government photo ID',
    icon: '🪪',
  },
  {
    id: 'know-candidates',
    title: 'Know Your Candidates',
    description: 'Research candidates, their backgrounds, and party manifestos before voting',
    icon: '👤',
  },
  {
    id: 'voting-day',
    title: 'Vote on Polling Day',
    description: 'Visit your polling station during voting hours (typically 7 AM – 6 PM)',
    icon: '🗳️',
  },
  {
    id: 'verify-vvpat',
    title: 'Verify VVPAT Slip',
    description: 'Check the VVPAT paper slip to confirm your vote was recorded correctly',
    icon: '🔍',
  },
];

const frequentlyAskedQuestions = [
  {
    id: 'faq-1',
    question: 'Who can vote in Indian elections?',
    answer: 'Any Indian citizen who is 18 years or older as of the qualifying date (January 1, April 1, July 1, or October 1) and is an ordinary resident of a constituency can vote, provided their name is on the electoral roll.',
    category: 'eligibility',
  },
  {
    id: 'faq-2',
    question: 'How do I register as a voter?',
    answer: 'You can register online at voters.eci.gov.in, through the Voter Helpline App (1950), or by submitting Form 6 to your local Electoral Registration Officer or Booth Level Officer (BLO). You\'ll need proof of age, identity, and address.',
    category: 'registration',
  },
  {
    id: 'faq-3',
    question: 'What is an EVM and how does it work?',
    answer: 'An Electronic Voting Machine (EVM) is a battery-operated device used for casting votes. It has a ballot unit with candidate names and symbols. You press the button next to your chosen candidate to cast your vote. EVMs are tamper-proof and do not require electricity.',
    category: 'voting',
  },
  {
    id: 'faq-4',
    question: 'What is VVPAT?',
    answer: 'Voter Verifiable Paper Audit Trail (VVPAT) is a machine attached to the EVM that prints a paper slip showing the candidate\'s name, symbol, and serial number. The slip is visible for 7 seconds through a transparent window before it drops into a sealed box, allowing you to verify your vote.',
    category: 'voting',
  },
  {
    id: 'faq-5',
    question: 'What is NOTA?',
    answer: 'NOTA (None of the Above) is an option on the EVM that allows voters to reject all candidates. Introduced in 2013 by Supreme Court directive, it lets you exercise your right to vote while expressing dissatisfaction with available candidates. However, even if NOTA gets the most votes, the candidate with the highest votes wins.',
    category: 'voting',
  },
  {
    id: 'faq-6',
    question: 'What is the Model Code of Conduct?',
    answer: 'The Model Code of Conduct (MCC) is a set of guidelines issued by the ECI that comes into effect from the announcement of election dates. It regulates the behavior of political parties, candidates, and the government to ensure free and fair elections. Key rules include no use of government resources for campaigning and a ban on communal appeals.',
    category: 'rules',
  },
  {
    id: 'faq-7',
    question: 'Can NRIs vote in Indian elections?',
    answer: 'Yes! Non-Resident Indians (NRIs) can register as overseas voters using Form 6A. They can vote in person at the polling station in their registered constituency. The ECI has been exploring postal ballot and e-voting options for overseas voters.',
    category: 'eligibility',
  },
  {
    id: 'faq-8',
    question: 'What happens if my Voter ID is lost?',
    answer: 'You can still vote if your name is on the electoral roll. Carry any government-issued photo ID (Aadhaar, Passport, PAN Card, Driving License, etc.) as an alternative. To get a replacement EPIC, submit Form 8 to your Electoral Registration Officer.',
    category: 'registration',
  },
  {
    id: 'faq-9',
    question: 'How are election results declared?',
    answer: 'On counting day, EVMs are brought from secured strongrooms. Postal ballots are counted first, followed by EVM counting 30 minutes later. Results are announced round by round. The candidate with the most votes in each constituency is declared the winner under the First-Past-The-Post (FPTP) system.',
    category: 'counting',
  },
  {
    id: 'faq-10',
    question: 'What facilities are available for voters with disabilities?',
    answer: 'The ECI ensures accessible voting through: Braille-enabled EVMs, wheelchair ramps at polling stations, volunteer assistance, priority entry, home voting for PwD voters and citizens aged 85+, and specially trained polling personnel.',
    category: 'accessibility',
  },
];

const electionStats = [
  { label: 'Registered Voters', value: '97 Crore+', icon: '👥' },
  { label: 'Polling Stations', value: '10.5 Lakh+', icon: '🏛️' },
  { label: 'Lok Sabha Seats', value: '543', icon: '💺' },
  { label: 'State Assemblies', value: '28', icon: '🏢' },
];

const quizQuestions = [
  {
    id: 'q1',
    question: 'What is the minimum age to vote in India?',
    options: ['16 years', '18 years', '21 years', '25 years'],
    correct: 1,
    explanation: 'The minimum voting age in India is 18 years, as per the 61st Constitutional Amendment Act of 1988.',
  },
  {
    id: 'q2',
    question: 'Which body conducts elections in India?',
    options: ['Supreme Court', 'Parliament', 'Election Commission of India', 'President of India'],
    correct: 2,
    explanation: 'The Election Commission of India (ECI), established under Article 324, is the autonomous constitutional body responsible for conducting elections.',
  },
  {
    id: 'q3',
    question: 'What does VVPAT stand for?',
    options: [
      'Voter Verification Paper Audit Trail',
      'Voter Verifiable Paper Audit Trail',
      'Vote Verified Paper Authentication Trail',
      'Voting Verification Print Audit Technology',
    ],
    correct: 1,
    explanation: 'VVPAT stands for Voter Verifiable Paper Audit Trail — a machine that prints a paper slip confirming the voter\'s choice.',
  },
  {
    id: 'q4',
    question: 'When does the Model Code of Conduct come into effect?',
    options: [
      'On polling day',
      'One month before elections',
      'When election dates are announced',
      'After nominations are filed',
    ],
    correct: 2,
    explanation: 'The MCC comes into effect immediately when the ECI announces the election schedule, not on any fixed date before polling.',
  },
  {
    id: 'q5',
    question: 'How long before polling must campaigning stop?',
    options: ['24 hours', '48 hours', '72 hours', '1 week'],
    correct: 1,
    explanation: 'Campaigning must cease 48 hours before the polling begins. This "silence period" allows voters to make their decision peacefully.',
  },
  {
    id: 'q6',
    question: 'What is NOTA?',
    options: [
      'National Online Testing Assessment',
      'None of the Above — option to reject all candidates',
      'New Online Voting Application',
      'National Oversight for Transparent Administration',
    ],
    correct: 1,
    explanation: 'NOTA (None of the Above) is an option on the EVM since 2013 that allows voters to formally reject all candidates.',
  },
  {
    id: 'q7',
    question: 'Which form is used for new voter registration?',
    options: ['Form 2', 'Form 6', 'Form 8', 'Form 10'],
    correct: 1,
    explanation: 'Form 6 is used for new voter registration. Form 8 is for corrections/changes, and Form 6A is for NRI voters.',
  },
  {
    id: 'q8',
    question: 'How many Lok Sabha seats are there in India?',
    options: ['245', '443', '543', '643'],
    correct: 2,
    explanation: 'There are 543 elected seats in the Lok Sabha (House of the People), plus 2 nominated Anglo-Indian members (provision discontinued in 2020).',
  },
  {
    id: 'q9',
    question: 'What voting system does India use for general elections?',
    options: [
      'Proportional Representation',
      'First-Past-The-Post (FPTP)',
      'Ranked Choice Voting',
      'Two-Round System',
    ],
    correct: 1,
    explanation: 'India uses the First-Past-The-Post (FPTP) system where the candidate with the most votes in each constituency wins, regardless of majority.',
  },
  {
    id: 'q10',
    question: 'For how many seconds is the VVPAT slip visible to the voter?',
    options: ['3 seconds', '5 seconds', '7 seconds', '10 seconds'],
    correct: 2,
    explanation: 'The VVPAT paper slip is displayed for 7 seconds through a transparent window before dropping into a sealed box.',
  },
];

module.exports = {
  electionTimeline,
  voterChecklist,
  frequentlyAskedQuestions,
  electionStats,
  quizQuestions,
};
