export const features = [
  {
    title: '🎧 Upload or Link – Transcribe Anything. (Coming Soon...)',
    text: 'Whether it’s a local file, YouTube video, or podcast URL, Vido Note transcribes with high accuracy in seconds.',
  },
  {
    title: '🧩 Explore Entities',
    text: 'Discover important Entities automatically detected from your file, including names, places, organizations, dates, and more.',
  },
  {
    title: '🌐 Multilingual Support',
    text: 'Auto-detects and supports over 15+ languages for seamless global accessibility.',
  },
  {
    title: '🧠 Summarize Long Content Instantly',
    text: 'Skip the fluff — get crystal-clear AI-generated summaries of long podcasts, meetings, or lectures.',
  },
  {
    title: '👥 Speaker Identification',
    text: 'Automatically detects and separates speakers — perfect for interviews, meetings, and multi-host podcasts.',
  },
  {
    title: '📌 Chapters of podcast',
    text: 'Confidence score and chapters so you can trust and verify your transcript.',
  },
];


export const pricingPlans = [
  {
    planName: 'Free without Credit Card',
    description: 'Get started with 10 minutes free after signing up.',
    price: '$0',
    minutes: 10,
    perks: [
      '10 minutes of transcription',
      'Upload Audio File',
      'Entities detection (names, places, organizations)',
      'Multilingual transcription (15+ languages)',
      'AI-generated summaries',
      'Speaker identification',
      'Confidence scores & Chapters',
    ],
  },
  {
    planName: 'Quick 10',
    description: 'Perfect for short tasks or quick tests.',
    price: '$1',
    minutes: 10,
    perks: [
      '10 minutes of transcription',
      'All features included',
      'Upload files and URLs',
    ],
  },
  {
    planName: 'Standard',
    description: 'Ideal for casual creators and occasional users.',
    price: '$5',
    minutes: 60,
    perks: [
      '60 minutes of transcription',
      'Everything from Quick 10',
      'Faster processing',
    ],
  },
  {
    planName: 'Pro',
    description: 'Best value for consistent users.',
    price: '$9',
    minutes: 150,
    mostPopular: true,
    perks: [
      '150 minutes of transcription',
      'Everything from Standard',
      'Priority processing',
    ],
  },
  {
    planName: 'Power Pack',
    description: 'Bulk minutes at the best rate.',
    price: '$19',
    minutes: 360,
    perks: [
      '360 minutes of transcription',
      'Everything from Pro',
      'Best deal for teams, podcasts, and researchers',
    ],
  },
];


