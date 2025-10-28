export type ServiceStatus = "Draft" | "In Review" | "Finalized";

export interface Verse {
  reference: string;
  text: string;
}

export interface ServiceSummary {
  id: string;
  title: string;
  date: string;
  status: ServiceStatus;
  theme: string;
  campus: string;
}

export interface TaskItem {
  id: string;
  description: string;
  owner: string;
  due: string;
  status: "Waiting" | "In Progress" | "Complete";
}

export interface CommentItem {
  id: string;
  author: string;
  role: string;
  excerpt: string;
  timeAgo: string;
}

export interface ServiceSegment {
  id: string;
  title: string;
  owner: string;
  duration: number;
  notes: string;
  volunteers: { role: string; name: string }[];
  status: "Planned" | "Confirmed" | "Live";
}

export interface SermonSection {
  id: string;
  title: string;
  summary: string;
  highlights: string[];
}

export interface SongItem {
  id: string;
  title: string;
  key: string;
  tempo: "Slow" | "Mid" | "Up";
  energy: "Reflective" | "Celebratory" | "Anthem";
  familiarity: "New" | "Known" | "Favorite";
  lastUsed: string;
}

export interface VolunteerAssignment {
  id: string;
  name: string;
  role: string;
  team: string;
  status: "Confirmed" | "Pending" | "Declined";
  contact: string;
  notes?: string;
}

export interface DigestSection {
  title: string;
  items: string[];
}

export const inspirationalVerse: Verse = {
  reference: "Psalm 46:10",
  text: "Be still, and know that I am God. I will be exalted among the nations, I will be exalted in the earth.",
};

export const focusSnapshot = {
  currentSeries: "Anchored Hope",
  currentWeek: "Week 3 — When the Storm Surrounds You",
  preparationProgress: 68,
};

export const upcomingServices: ServiceSummary[] = [
  {
    id: "svc-240922",
    title: "Anchored Hope",
    date: "Sun, Sept 22",
    status: "In Review",
    theme: "Peace in Uncertainty",
    campus: "Downtown",
  },
  {
    id: "svc-240929",
    title: "Anchored Hope",
    date: "Sun, Sept 29",
    status: "Draft",
    theme: "Faith that Steadies",
    campus: "Downtown",
  },
  {
    id: "svc-241006",
    title: "Anchored Hope",
    date: "Sun, Oct 6",
    status: "Draft",
    theme: "Carrying Light",
    campus: "East Campus",
  },
  {
    id: "svc-241013",
    title: "Harvest of Joy",
    date: "Sun, Oct 13",
    status: "Draft",
    theme: "Stories of Transformation",
    campus: "Downtown",
  },
];

export const outstandingTasks: TaskItem[] = [
  {
    id: "task-1",
    description: "Upload final slide deck for Week 3 sermon",
    owner: "Alicia (Communications)",
    due: "Thu, Sept 19",
    status: "In Progress",
  },
  {
    id: "task-2",
    description: "Confirm communion volunteers for second service",
    owner: "Marcus (Admin)",
    due: "Fri, Sept 20",
    status: "Waiting",
  },
  {
    id: "task-3",
    description: "Share worship rehearsal notes with band",
    owner: "Jamie (Worship)",
    due: "Wed, Sept 18",
    status: "Complete",
  },
];

export const recentComments: CommentItem[] = [
  {
    id: "comment-1",
    author: "Elena",
    role: "Associate Pastor",
    excerpt: "Love the anchor metaphor in point two—can we add a story from the Thompsons?",
    timeAgo: "2h ago",
  },
  {
    id: "comment-2",
    author: "Jamie",
    role: "Worship Leader",
    excerpt: "Adding strings pad swell on the transition into communion to keep the reflective tone.",
    timeAgo: "5h ago",
  },
  {
    id: "comment-3",
    author: "Marcus",
    role: "Administrator",
    excerpt: "Volunteer gap for kids check-in at 9am. Sent two backup invitations.",
    timeAgo: "Yesterday",
  },
];

export const quickActions = [
  {
    id: "qa-1",
    label: "Start new sermon series",
    description: "Spin up templates for a fresh narrative arc.",
  },
  {
    id: "qa-2",
    label: "Add worship set",
    description: "Build a setlist aligned to the weekly theme.",
  },
  {
    id: "qa-3",
    label: "Assign volunteers",
    description: "Fill open roles with available team members.",
  },
  {
    id: "qa-4",
    label: "Share weekly digest",
    description: "Send the latest plan to stakeholders.",
  },
];

export const serviceSegments: ServiceSegment[] = [
  {
    id: "seg-1",
    title: "Countdown & Welcome",
    owner: "Host Team",
    duration: 7,
    notes: "Welcome video features stories from last week's baptisms.",
    volunteers: [
      { role: "Host", name: "Carmen" },
      { role: "Producer", name: "Liam" },
    ],
    status: "Confirmed",
  },
  {
    id: "seg-2",
    title: "Worship Set",
    owner: "Jamie",
    duration: 20,
    notes: "Add scripture reading between second and third songs.",
    volunteers: [
      { role: "Lead Vocal", name: "Jamie" },
      { role: "Electric Guitar", name: "Ezra" },
      { role: "Drums", name: "Sasha" },
      { role: "Keys", name: "Micah" },
    ],
    status: "Confirmed",
  },
  {
    id: "seg-3",
    title: "Message",
    owner: "Pastor Daniel",
    duration: 32,
    notes: "Illustration: Anchor rope with frayed edges (bring prop).",
    volunteers: [
      { role: "Slides", name: "Alicia" },
      { role: "Audio", name: "Noah" },
    ],
    status: "Planned",
  },
  {
    id: "seg-4",
    title: "Communion",
    owner: "Care Team",
    duration: 10,
    notes: "Invite campus pastors forward for prayer stations.",
    volunteers: [
      { role: "Prayer Lead", name: "Grace" },
      { role: "Communion Prep", name: "Ian" },
    ],
    status: "Planned",
  },
  {
    id: "seg-5",
    title: "Sending",
    owner: "Host Team",
    duration: 6,
    notes: "Highlight upcoming serve day and small group launches.",
    volunteers: [
      { role: "Host", name: "Carmen" },
      { role: "Lighting", name: "Theo" },
    ],
    status: "Planned",
  },
];

export const rehearsalChecklist = [
  "Confirm click track tempo adjustments",
  "Load scripture reading slides into ProPresenter",
  "Soundcheck strings pad and bass DI",
  "Print volunteer run sheet for Sunday",
];

export const sermonSeries = {
  title: "Anchored Hope",
  description:
    "A four-week journey through the promises of God that hold us steady when life feels uncertain.",
  scriptureFocus: "Hebrews 6:19",
  approvalStatus: "Awaiting Lead Pastor Review",
  attachments: [
    { name: "Series Overview.pdf", size: "1.2 MB" },
    { name: "Graphics Pack.zip", size: "14.3 MB" },
  ],
};

export const sermonSections: SermonSection[] = [
  {
    id: "section-1",
    title: "Big Idea",
    summary:
      "When we practice stillness in the storm, we discover that hope is not the absence of trouble but the presence of Christ.",
    highlights: [
      "Open with the story of Paul on the ship in Acts 27",
      "Contrast frantic striving with anchored peace",
      "Invite the church to a week of guided silence",
    ],
  },
  {
    id: "section-2",
    title: "Scripture",
    summary: "Hebrews 6:19, Mark 4:35-41, Psalm 46",
    highlights: [
      "Highlight the anchor imagery in Hebrews",
      "Connect Jesus calming the storm to our personal anxieties",
    ],
  },
  {
    id: "section-3",
    title: "Application",
    summary:
      "Encourage three rhythms: breath prayer, community check-in, and practical acts of hope.",
    highlights: [
      "Provide printable practice guide for small groups",
      "Share testimony video from the Thompson family",
    ],
  },
  {
    id: "section-4",
    title: "Key Quotes",
    summary: "\"Hope is the rope that fastens us to the shore\" — Unknown",
    highlights: [
      "Quote from Eugene Peterson on patient endurance",
      "Include lyric from 'Living Hope' in worship transition",
    ],
  },
];

export const songLibrary: SongItem[] = [
  {
    id: "song-1",
    title: "Living Hope",
    key: "B",
    tempo: "Mid",
    energy: "Anthem",
    familiarity: "Favorite",
    lastUsed: "Sep 1",
  },
  {
    id: "song-2",
    title: "Firm Foundation",
    key: "C",
    tempo: "Mid",
    energy: "Celebratory",
    familiarity: "Known",
    lastUsed: "Aug 25",
  },
  {
    id: "song-3",
    title: "Still",
    key: "A",
    tempo: "Slow",
    energy: "Reflective",
    familiarity: "Known",
    lastUsed: "Jul 28",
  },
  {
    id: "song-4",
    title: "Build My Life",
    key: "G",
    tempo: "Mid",
    energy: "Anthem",
    familiarity: "Favorite",
    lastUsed: "Sep 8",
  },
  {
    id: "song-5",
    title: "New Wine",
    key: "F",
    tempo: "Slow",
    energy: "Reflective",
    familiarity: "New",
    lastUsed: "Jun 30",
  },
];

export const suggestedSongs = [
  {
    id: "sug-1",
    title: "Peace Be Still",
    reason: "Echoes the stillness theme in Mark 4.",
  },
  {
    id: "sug-2",
    title: "Way Maker",
    reason: "Encourages faith in God's presence during uncertainty.",
  },
  {
    id: "sug-3",
    title: "Anchor",
    reason: "Directly connects with the series metaphor.",
  },
];

export const volunteerAssignments: VolunteerAssignment[] = [
  {
    id: "vol-1",
    name: "Carmen Diaz",
    role: "Host Team Lead",
    team: "Hospitality",
    status: "Confirmed",
    contact: "carmen@gracecity.church",
    notes: "Will arrive 45 minutes early for run-through.",
  },
  {
    id: "vol-2",
    name: "Ezra Blake",
    role: "Electric Guitar",
    team: "Worship",
    status: "Confirmed",
    contact: "ezra@gracecity.church",
  },
  {
    id: "vol-3",
    name: "Sasha Kim",
    role: "Drums",
    team: "Worship",
    status: "Pending",
    contact: "sasha@gracecity.church",
    notes: "Awaiting confirmation after shift swap.",
  },
  {
    id: "vol-4",
    name: "Grace Patel",
    role: "Prayer Lead",
    team: "Care",
    status: "Confirmed",
    contact: "grace@gracecity.church",
  },
  {
    id: "vol-5",
    name: "Ian O'Connell",
    role: "Communion Prep",
    team: "Care",
    status: "Pending",
    contact: "ian@gracecity.church",
  },
];

export const volunteerAnnouncements = [
  "Serve Day sign-ups open this Sunday—encourage your teams to register.",
  "Background check renewals due for kids team by October 1.",
  "Reminder: Worship night rehearsal moved to Thursday at 7pm.",
];

export const weeklyDigest: DigestSection[] = [
  {
    title: "Sermon Focus",
    items: [
      "Big Idea: Hope is discovered in stillness, not certainty.",
      "Key Scripture: Hebrews 6:19",
      "Action Step: Practice daily breath prayers.",
    ],
  },
  {
    title: "Worship Moments",
    items: [
      "Setlist: Living Hope, Firm Foundation, Still, Build My Life",
      "Add scripture reading of Psalm 46 between songs two and three.",
      "Encourage team to rehearse new pad swell dynamics.",
    ],
  },
  {
    title: "Logistics",
    items: [
      "Communion supplies restocked and ready for both services.",
      "Volunteer gaps: Kids check-in 9am, Communion prep 11am.",
      "Send final service plan to campus pastors by Friday noon.",
    ],
  },
];

export const analyticsHighlights = [
  {
    label: "Series Completion",
    value: "68%",
    description: "Preparation progress for Anchored Hope",
  },
  {
    label: "Volunteer Health",
    value: "92%",
    description: "Confirmed roles for this Sunday",
  },
  {
    label: "Song Diversity",
    value: "74%",
    description: "Unique songs used across last 12 weeks",
  },
];
