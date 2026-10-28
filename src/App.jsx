import { useEffect, useRef, useState } from "react";

import "./App.css";

import howlingWolf from "./assets/home/howling-wolf.jpg";

// Vite discovers local artwork in src/assets and bundles it safely.
const localImages = import.meta.glob("./assets/**/*.{jpg,jpeg,png,webp,jpeg,JPG,JPEG,PNG,WEBP}", { eager: true, query: "?url", import: "default" });
const normalizedLocalImages = Object.entries(localImages).map(([path, url]) => ({
  path,
  normalized: path.toLowerCase().replace(/[^a-z0-9]/g, ""),
  url
}));
function getLocalImage(folder, filename) {
  if (!filename) return "";
  const targetPath = `./assets/${folder}/${filename}`.toLowerCase();
  const exact = localImages[targetPath];
  if (exact) return exact;

  // Match case/spacing differences in Windows asset filenames.
  const target = targetPath.replace(/[^a-z0-9]/g, "");
  const sameFolder = normalizedLocalImages.filter((item) =>
    item.path.toLowerCase().includes(`/assets/${folder.toLowerCase()}/`)
  );
  const targetStem = target.replace(/(jpg|jpeg|png|webp)$/g, "");
  const targetName = targetStem.split(folder.toLowerCase().replace(/[^a-z0-9]/g, "")).pop() || targetStem;
  const match = sameFolder.find((item) => item.normalized === target)
    || sameFolder.find((item) => item.normalized.includes(targetStem))
    || sameFolder.find((item) => targetStem.includes(item.normalized.replace(/(jpg|jpeg|png|webp)$/g, "")))
    || sameFolder.find((item) => {
      const fileStem = item.normalized.split(folder.toLowerCase().replace(/[^a-z0-9]/g, "")).pop() || item.normalized;
      return fileStem.replace(/(jpg|jpeg|png|webp)$/g, "").includes(targetName.replace(/(jpg|jpeg|png|webp)$/g, ""));
    });
  return match?.url || "";
}




const characters = [

  { name: "Scott McCall", imageFile: "scott-mccall.jpg", role: "The True Alpha", pack: "McCall Pack", detail: "Scott begins as an ordinary Beacon Hills teenager whose life changes after a werewolf bite. As he learns to live with heightened senses, strength, healing, and the responsibilities of the supernatural world, he repeatedly chooses compassion over cruelty. His defining achievement is becoming a True Alpha through the strength of his character rather than by taking another Alpha’s power. Scott’s leadership is built on protecting his friends, giving people a chance to change, and refusing to abandon the people who depend on him.", symbol: "♜", tag: "TRUE ALPHA" },
  { name: "Stiles Stilinski", imageFile: "stiles-stilinski.jpg", role: "The Strategist", pack: "McCall Pack", detail: "Stiles is Scott’s oldest friend and one of the pack’s sharpest investigators. Human in a world of werewolves and other supernatural threats, he relies on quick thinking, relentless curiosity, humor, and an ability to connect clues others overlook. His loyalty often pushes him into danger, but his intelligence and determination repeatedly help the pack survive. Beneath the sarcasm is a deeply caring friend who refuses to let fear decide what is right.", symbol: "✦", tag: "HUMAN" },
  { name: "Derek Hale", imageFile: "derek-hale.jpg", role: "The Reluctant Mentor", pack: "Hale Legacy", detail: "Derek is a werewolf shaped by loss, family history, and the destruction of the Hale home. Guarded and often severe, he initially approaches Scott as a difficult student who must learn the rules of a dangerous world. Over time, his choices reveal a protective side and a complicated sense of responsibility. Derek’s journey explores the burden of legacy, the cost of trust, and the difference between using strength to dominate and using it to protect.", symbol: "◈", tag: "WEREWOLF" },
  { name: "Lydia Martin", imageFile: "lydia-martin.jpg", role: "The Banshee", pack: "McCall Pack", detail: "Lydia begins as a brilliant, socially confident student whose intelligence is often underestimated. Her growing connection to death reveals her banshee abilities, allowing her to sense supernatural danger and recognize patterns hidden from others. She studies her experiences instead of surrendering to them, becoming an essential researcher and problem-solver. Lydia’s story is about discovering that her mind and her unusual abilities are powerful, and that she can define herself beyond other people’s expectations.", symbol: "◉", tag: "BANSHEE" },
  { name: "Malia Hale-Tate", imageFile: "malia-hale-tate.jpg", role: "The Werecoyote", pack: "McCall Pack", detail: "Malia spends years disconnected from ordinary human life after a traumatic transformation leaves her living as a coyote. Returning to the human world requires patience, practice, and a willingness to understand emotions and relationships that do not come naturally to her at first. She is direct, resourceful, fiercely loyal, and unafraid to act when others hesitate. Her growth is not about losing her instincts; it is about learning how to combine those instincts with trust, choice, and belonging.", symbol: "⌁", tag: "WERECOYOTE" },
  { name: "Liam Dunbar", imageFile: "liam-dunbar.jpg", role: "Scott’s First Beta", pack: "McCall Pack", detail: "Liam is a talented athlete whose anger and impulsiveness make controlling his new werewolf abilities especially difficult. After Scott bites him to save his life, Liam must learn to manage heightened emotions alongside heightened strength and senses. He can be stubborn and reckless, but he also has courage, empathy, and a strong desire to protect his friends. His relationship with Scott becomes a demanding lesson in mentorship, accountability, and learning to lead without losing control.", symbol: "〄", tag: "BETA" },
  { name: "Allison Argent", imageFile: "allison-argent.jpg", role: "The Argent Archer", pack: "Argent Family", detail: "Allison is a skilled archer raised within a family tradition of hunting supernatural creatures. As she discovers that the world is more complicated than the rules she inherited, she must decide which parts of that legacy deserve to continue. Her courage, discipline, and compassion often place her between the people she loves and the danger they face. Allison’s story examines loyalty, moral choice, and the possibility of shaping a different future from the one a family history seems to demand.", symbol: "➶", tag: "HUNTER" },
  { name: "Kira Yukimura", imageFile: "kira-yukimura.jpg", role: "The Thunder Kitsune", pack: "McCall Pack", detail: "Kira arrives in Beacon Hills as a thoughtful, sometimes awkward student who gradually discovers her connection to kitsune spirits. Her abilities include extraordinary sword skill and powerful electrical energy, but understanding those gifts requires discipline and self-knowledge. Kira approaches the supernatural world with courage and curiosity, supporting her friends while learning to respect the history and power she carries. Her arc is about finding confidence without losing her kindness or sense of self.", symbol: "ϟ", tag: "KITSUNE" },
  { name: "Chris Argent", imageFile: "chris-argent.jpg", role: "The Veteran Hunter", pack: "Argent Family", detail: "Chris Argent is a highly trained hunter who begins with a strict understanding of the family code. His experiences in Beacon Hills force him to reconsider the line between protecting people and treating every supernatural being as an enemy. Pragmatic, disciplined, and deeply protective of Allison, Chris gradually becomes an important ally to those who prove they can use their abilities responsibly. His story is one of hard choices, grief, and a code that must evolve when old rules cause harm.", symbol: "➶", tag: "HUNTER" },
  { name: "Deucalion", imageFile: "deucalion.jpg", role: "The Demon Wolf", pack: "Alpha Pack", detail: "Deucalion is a formidable Alpha whose pursuit of power transforms him into a feared leader. Intelligent and calculating, he believes strength should determine the shape of the supernatural world, and he uses the Alpha Pack to impose that philosophy. His history also reveals the damage caused by betrayal, loss, and a worldview narrowed by vengeance. Deucalion represents the dangerous possibility of leadership without empathy—and the difficult work of confronting the person one has become.", symbol: "♜", tag: "ALPHA" },
  { name: "Isaac Lahey", imageFile: "issac-lahey.jpg", role: "The Survivor", pack: "McCall Pack", detail: "Isaac’s early life is marked by fear and mistreatment, leaving him guarded and uncertain whom to trust. Becoming a werewolf gives him strength, but it does not instantly erase the effects of his past. Under Derek and later through his connection with Scott’s pack, Isaac begins to understand loyalty as something different from control. His wit, courage, and growing compassion help him build a sense of family chosen by trust rather than imposed by fear.", symbol: "◈", tag: "BETA" },
  { name: "Jackson Whittemore", imageFile: "jackson-whittemore.jpg", role: "The Kanima", pack: "Independent", detail: "Jackson is ambitious, competitive, and desperate to understand the power he believes will make him complete. His supernatural transformation into the Kanima exposes the insecurity and unresolved pain beneath his confident exterior. The creature’s search for a master reflects Jackson’s struggle with identity and control. His story explores how fear of vulnerability can become dangerous, and how self-understanding is necessary before power can be used responsibly.", symbol: "〄", tag: "SHAPESHIFTER" },
  { name: "Jordan Parrish", imageFile: "jordan-parish.jpg", role: "The Hellhound", pack: "Beacon Hills", detail: "Jordan Parrish arrives as a capable deputy who cannot explain why he survives events that should be impossible. His connection to the supernatural gradually reveals him as a Hellhound, a guardian linked to fire, death, and the boundary between worlds. Parrish is calm and duty-driven, yet he must learn what his abilities mean and how to control them. His role bridges ordinary law enforcement and the hidden dangers surrounding Beacon Hills.", symbol: "♨", tag: "HELLHOUND" },
  { name: "Ethan and Aiden", imageFile: "ethan and aiden.jpg", role: "The Alpha Twins", pack: "Alpha Pack", detail: "Ethan and Aiden are twin werewolves whose ability to combine into a single, more powerful form makes them formidable members of the Alpha Pack. Initially defined by competition, intimidation, and loyalty to Deucalion, their time in Beacon Hills challenges their assumptions about strength and belonging. Their relationship is complicated by shared history and individual choices. Together, they illustrate how people raised to value dominance can still face the difficult decision to change sides.", symbol: "♜", tag: "ALPHA TWINS" },
  { name: "Peter Hale", imageFile: "peter-hale.jpg", role: "The Ambitious Alpha", pack: "Hale Legacy", detail: "Peter Hale is clever, persuasive, and often guided by self-interest. The tragedy of the Hale family and his own pursuit of power make him one of Beacon Hills’ most unpredictable figures. He can offer useful knowledge or assistance, but his motives are rarely simple, and trust must be earned cautiously. Peter’s history connects the town’s present conflicts to older family wounds, showing how ambition and resentment can keep the past alive.", symbol: "◈", tag: "ALPHA / HALE" },
  { name: "Noah Stilinski", imageFile: "noah-stilinski.jpg", role: "The Sheriff", pack: "Stilinski Family", detail: "Sheriff Noah Stilinski works to keep Beacon Hills safe while raising his son, Stiles, largely through his own sense of responsibility and humor. Strange cases gradually force him to accept that the town’s dangers are not always ordinary crimes. Noah relies on persistence, empathy, and a willingness to listen when the evidence no longer fits familiar explanations. He becomes a steady adult presence for the pack, proving that courage does not require supernatural powers.", symbol: "✦", tag: "SHERIFF" },
  { name: "Theo Raeken", imageFile: "theo-raken.jpg", role: "The Manipulator", pack: "Chimera", detail: "Theo returns to Beacon Hills with a carefully constructed image and a plan shaped by ambition. Skilled at reading people’s fears and exploiting their vulnerabilities, he attempts to build influence by turning allies against one another. His history reveals a character who has learned to treat trust as a tool rather than a bond. Theo’s presence tests the pack’s unity and raises questions about responsibility, manipulation, and whether meaningful change can follow serious betrayal.", symbol: "⌁", tag: "CHIMERA" },

];



const seasons = [

  { number: "01", title: "The Awakening", imageFile: "season 1.jpg", years: "Season 1", description: "A mysterious bite transforms Scott McCall’s life, pulling him into a hidden world of werewolves, hunters, and dangerous secrets. He must learn what he has become while protecting his friends and keeping his identity hidden.", mood: "THE FIRST HUNT" },
  { number: "02", title: "The Kanima", imageFile: "season 2.jpg", years: "Season 2", description: "A new shapeshifter terrorizes Beacon Hills, and the pack must uncover the identity of the Kanima and the person controlling it. Trust, loyalty, and the danger of unchecked power move to the centre of the story.", mood: "TRUST NO SHADOW" },
  { number: "03A", title: "The Alpha Pack", imageFile: "season 3A.jpg", years: "Season 3A", description: "A ruthless group of Alphas arrives in Beacon Hills and challenges Derek’s pack. Scott’s growing leadership is tested as old supernatural forces, dangerous bargains, and escalating threats put everyone at risk.", mood: "POWER HAS A PRICE" },
  { number: "03B", title: "The Nogitsune", imageFile: "season 3B.jpg", years: "Season 3B", description: "A dark fox spirit brings deception and chaos into the lives of the pack. Psychological games blur the line between friend and enemy, forcing Scott and his friends to fight for one another in ways they never expected.", mood: "CHAOS IN THE SHADOWS" },
  { number: "04", title: "Deadly Games", imageFile: "season 4.jpg", years: "Season 4", description: "A mysterious dead-pool list puts supernatural residents of Beacon Hills in danger. The pack faces professional assassins, new allies, and difficult decisions about how to protect their own without losing their humanity.", mood: "EVERY NAME MATTERS" },
  { number: "05A", title: "The Dread Doctors", imageFile: "season 5A.jpg", years: "Season 5A", description: "The Dread Doctors conduct terrifying experiments that create chimeras and destabilize the town. Suspicion and fear begin to divide the pack just as the group needs its trust and teamwork most.", mood: "FEAR THE UNKNOWN" },
  { number: "05B", title: "The Beast of Gévaudan", imageFile: "season 5B.jpg", years: "Season 5B", description: "The consequences of the Doctors’ experiments intensify as the Beast emerges as a threat to the entire town. The pack must piece together a buried history while trying to reunite before fear pulls them apart.", mood: "THE MONSTER WITHIN" },
  { number: "06A", title: "The Wild Hunt", imageFile: "season 6A.jpg", years: "Season 6A", description: "The Ghost Riders erase people from existence, leaving memories and relationships at risk of disappearing. The pack must hold on to the truth of one another while confronting a force that makes people forget those they love.", mood: "REMEMBER THE PACK" },
  { number: "06B", title: "The Final Hunt", imageFile: "season 6B.jpg", years: "Season 6B", description: "A new threat fuels fear of the supernatural and places Beacon Hills on the edge of conflict. Scott and his allies must protect their community, bring people together, and decide what kind of future the pack will leave behind.", mood: "STAND TOGETHER" },

];



const creatures = [

  { name: "Anuk-Ite", imageFile: "anuk-ite.jpg", type: "FEAR ENTITY", danger: "EXTREME", description: "A dangerous supernatural being whose influence turns fear into a weapon. Its power makes people vulnerable to panic and distrust, threatening to turn neighbours and allies against one another. Facing it requires clear thinking and the ability to resist the terror it creates." },
  { name: "Banshee", imageFile: "banshee.jpg", type: "SUPERNATURAL", danger: "MYSTERIOUS", description: "A person with a supernatural connection to death, often sensing tragedy before others can understand what is happening. Banshee abilities may emerge through screams, visions, and an uncanny awareness of places where death has left a mark." },
  { name: "The Beast", imageFile: "beast.jpg", type: "ANCIENT SHAPESHIFTER", danger: "EXTREME", description: "A legendary creature associated with extraordinary strength and a history that reaches far beyond Beacon Hills. Its return forces the pack to investigate old records and confront a threat whose identity is as important as its destructive power." },
  { name: "Dark Druid", imageFile: "dark-druid.jpg", type: "RITUAL PRACTITIONER", danger: "HIGH", description: "A practitioner who uses dark rituals and supernatural knowledge to manipulate life, death, and the balance of power. Such figures are dangerous not only because of their abilities, but because they understand how to turn the town’s supernatural rules against its residents." },
  { name: "Dread Doctors", imageFile: "dread-doctors.jpg", type: "EXPERIMENTAL", danger: "EXTREME", description: "Mysterious masked figures who combine scientific experimentation with occult methods. Their work alters bodies and creates chimeras, treating living subjects as pieces in a larger design. Their methods leave the pack struggling to understand what is natural, what has been engineered, and how to stop the experiments." },
  { name: "Ghost Riders", imageFile: "ghost-riders.jpg", type: "WILD HUNT", danger: "EXTREME", description: "Supernatural riders connected to the Wild Hunt, capable of removing people from the world and erasing the memories that would prove they existed. Their threat attacks the bonds between friends and family as much as it attacks individuals, making memory and recognition essential to resistance." },
  { name: "Hellhound", imageFile: "hellhound.jpg", type: "SUPERNATURAL GUARDIAN", danger: "EXTREME", description: "A powerful supernatural being linked to fire and the boundary between life and death. A Hellhound’s role can involve confronting dangerous supernatural forces and guarding places where ordinary rules no longer apply. Its abilities are formidable, but understanding its purpose is as important as controlling its strength." },
  { name: "Kanima", imageFile: "kanima.jpg", type: "SHAPESHIFTER", danger: "EXTREME", description: "A reptilian shapeshifter whose venom can paralyze its victims. Unlike a typical werewolf, the Kanima’s transformation is connected to unresolved identity and a search for a master. Understanding the person behind the creature is crucial to discovering how it can be stopped." },
  { name: "Kitsune", imageFile: "kitsune.jpg", type: "SPIRITUAL", danger: "VARIABLE", description: "A fox spirit associated with ancient supernatural traditions. Kitsune abilities vary, and may involve electricity, illusion, elemental forces, or unusual perception. Their power is tied to heritage and self-understanding, so learning to guide it safely is part of the journey." },
  { name: "Nogitsune", imageFile: "nogitsune.jpg", type: "DARK FOX SPIRIT", danger: "EXTREME", description: "A dark fox spirit that feeds on chaos, conflict, and suffering. It manipulates perception and exploits the fears and vulnerabilities of those around it, making it difficult to know whom to trust. Resisting the Nogitsune requires unity, careful reasoning, and a refusal to let fear define the group." },
  { name: "Werecoyote", imageFile: "werecoyote.jpg", type: "SHAPESHIFTER", danger: "HIGH", description: "A shapeshifter with coyote traits, heightened instincts, and powerful physical abilities. The transition between animal instinct and human life can be difficult, but learning to understand both sides can create a strong and resourceful ally." },
  { name: "Werewolf", imageFile: "werewolf.jpg", type: "SHAPESHIFTER", danger: "HIGH", description: "A shapeshifter with heightened senses, strength, speed, healing, and claws. Becoming a werewolf changes everyday life, but power alone does not determine whether someone becomes a threat. Training, emotional control, community, and personal choices shape how the abilities are used." },

];



const packs = [

  { name: "Alpha Pack", imageFile: "alpha-pack.jpg", mark: "A", kind: "POWER THROUGH DOMINANCE", description: "A dangerous group of powerful Alphas led by Deucalion. Their philosophy prizes dominance and strength, and their arrival challenges the existing supernatural order in Beacon Hills. The pack’s unity is built around ambition and intimidation rather than the trust that defines Scott’s group." },
  { name: "Argent Hunters", imageFile: "argent-hunters.jpg", mark: "✦", kind: "HUNTER LEGACY", description: "The Argent family represents a long tradition of tracking and fighting supernatural creatures. Its members are trained, disciplined, and guided by a code that is tested as they learn that not every supernatural being is an enemy. Their legacy raises questions about duty, change, and choosing what is right over what is familiar." },
  { name: "Hale Legacy", imageFile: "hale-legacy.jpg", mark: "H", kind: "ANCIENT BLOODLINE", description: "The Hale family’s history is woven into the supernatural life of Beacon Hills. Their past includes loss, inherited responsibility, and secrets that continue to affect the next generation. The legacy is more than a bloodline: it is a reminder that the choices made by one generation can shape the lives of those who follow." },
  { name: "The Pack", imageFile: "the-pack.jpg", mark: "M", kind: "FOUND FAMILY", description: "Scott’s pack brings together werewolves, hunters, banshees, kitsune, humans, and other allies. Their strength comes from loyalty, trust, and a shared decision to protect people rather than rule them. Every member contributes a different skill, and their relationships help them face threats no one person could overcome alone." },

];



const locations = [

  { name: "Animal Clinic", imageFile: "animal-clinic.jpg", label: "THE PACK’S SAFE HAVEN", text: "The animal clinic is a familiar refuge where Scott and his friends seek help, supplies, and a moment to regroup. Its ordinary public purpose hides how often it becomes a meeting point for extraordinary problems. It connects everyday Beacon Hills life with the secret work of protecting the supernatural community." },
  { name: "Beacon Hills Preserve", imageFile: "beacon-hills-preserve.jpg", label: "THE WILDERNESS", text: "The preserve’s dark trails and dense trees conceal evidence, danger, and discoveries that repeatedly draw the pack into the woods. It is where the story’s first mystery begins and where the natural landscape becomes a reminder that Beacon Hills holds secrets beyond the reach of ordinary explanations." },
  { name: "Eichen House", imageFile: "eichen-house.jpg", label: "RESTRICTED FACILITY", text: "Eichen House is a psychiatric institution associated with unsettling supernatural events and secrets hidden behind its walls. Its isolation, strict security, and disturbing history make it a place the pack approaches with caution. It represents the danger of institutions that fail to understand the unusual people in their care." },
  { name: "Hale House", imageFile: "hale-house.jpg", label: "FAMILY HISTORY", text: "The Hale home is a physical reminder of the family’s tragedy and the legacy left behind. Its ruins and memories connect present-day conflicts to the past, revealing how grief and old decisions continue to shape Derek, Peter, and the wider supernatural community." },
  { name: "Beacon Hills High School", imageFile: "high-school.jpg", label: "WHERE IT BEGAN", text: "Beacon Hills High looks like an ordinary school, but it is the centre of the friendships and rivalries that anchor the series. Classes, sports, and teenage life continue alongside supernatural emergencies, making the school a place where the characters must balance normal responsibilities with extraordinary secrets." },
  { name: "Beacon Hills Hospital", imageFile: "hospital.jpg", label: "AFTER HOURS", text: "The hospital is where unexplained injuries, urgent treatment, and supernatural emergencies often converge. It brings together medical staff, families, and members of the pack when the cost of a confrontation becomes impossible to hide. Its corridors are a reminder that even supernatural strength cannot prevent every injury." },
  { name: "The Nemeton", imageFile: "nemeton.jpg", label: "ANCIENT POWER", text: "The Nemeton is an ancient tree stump and a powerful supernatural focal point. It can draw energy, attract dangerous forces, and connect events that might otherwise seem unrelated. Its presence gives Beacon Hills a deeper history and makes the surrounding woods important to the balance of supernatural power." },
  { name: "Sheriff’s Station", imageFile: "sheriff-station.jpg", label: "LAW & ORDER", text: "The Beacon Hills Sheriff’s Station is the centre of local investigations and Sheriff Stilinski’s efforts to protect the town. Many cases begin as ordinary reports before revealing clues that point toward supernatural activity. The station links the human world to the pack’s work, especially as the sheriff learns to face evidence that does not fit normal explanations." },

];



const relationships = [

  { title: "Scott & Stiles", imageFile: "stiles-scott-bestfriends.jpg", subtitle: "BROTHERS BY CHOICE", text: "Scott and Stiles’ friendship is the emotional centre of the pack. They have known one another long before the supernatural world enters their lives, and that history gives them a rare kind of honesty. Stiles provides quick thinking and determination; Scott brings compassion and a steady belief in people. They argue, worry, and make mistakes, but their bond repeatedly proves that family can be chosen and strengthened through action." },
  { title: "Scott & Derek", imageFile: "scott-derek-brothers.jpg", subtitle: "MENTORSHIP & RESPECT", text: "Scott and Derek begin with sharply different ideas about how a werewolf should survive. Derek is guarded and shaped by tragedy, while Scott refuses to believe that power must be used through fear. Their disagreements slowly develop into a hard-won respect. Derek teaches Scott about the dangers of the supernatural world, while Scott challenges Derek to imagine a form of leadership based on trust and protection." },
  { title: "Scott & Allison", imageFile: "allison-scott.jpg", subtitle: "LOVE & LOYALTY", text: "Scott and Allison’s relationship begins with genuine affection but is complicated by the hidden worlds they each inherit. Scott’s werewolf identity clashes with Allison’s family history as hunters, forcing them to confront loyalty, honesty, and difficult choices. Their bond remains important because it asks whether love can survive conflicting expectations and whether people can choose their own values instead of simply following family rules." },
  { title: "Scott & Kira", imageFile: "kira-scott.jpg", subtitle: "TRUST & DISCOVERY", text: "Scott and Kira’s connection grows as they support one another through unfamiliar supernatural changes. Kira’s discovery of her kitsune heritage parallels Scott’s ongoing responsibility as a True Alpha: both must learn what their power means and how to use it well. Their relationship is built around patience, shared danger, and the freedom to discover who they are without being reduced to their supernatural abilities." },
  { title: "Allison & Isaac", imageFile: "allison-issac.jpg", subtitle: "GRIEF & CONNECTION", text: "Allison and Isaac develop a bond while each is carrying difficult history and uncertainty about the future. Their connection emerges from shared experiences with the supernatural world and from understanding how grief can change a person. Their story is complicated by the relationships around them, but it highlights the need for honesty, empathy, and room to make personal choices even when loyalty to friends and family is at stake." },
  { title: "Lydia & Stiles", imageFile: "lydia-stiles.jpg", subtitle: "AN UNEXPECTED BOND", text: "Lydia and Stiles’ connection develops over time, moving beyond first impressions and long-held assumptions. Stiles sees Lydia’s intelligence and courage, while Lydia comes to understand the depth of his loyalty and insight. Their friendship and affection grow through danger, vulnerability, and the realization that people often carry far more than they show on the surface." },
  { title: "Malia & Stiles", imageFile: "malia-stiles.jpg", subtitle: "INSTINCT & UNDERSTANDING", text: "Malia and Stiles approach problems in very different ways: Malia is direct and instinctive, while Stiles analyses, questions, and plans. Their connection grows as they help one another navigate the human and supernatural worlds. Together they learn that trust does not require being alike; it requires listening, respecting differences, and choosing to show up when it matters." },

];



const quizQuestions = [

  { question: "What is Scott McCall's supernatural rank?", options: ["Omega", "True Alpha", "Dread Doctor", "Hellhound"], answer: "True Alpha" },

  { question: "Which character is known as a banshee?", options: ["Malia Tate", "Kira Yukimura", "Lydia Martin", "Allison Argent"], answer: "Lydia Martin" },

  { question: "What is the name of the town?", options: ["Riverdale", "Mystic Falls", "Beacon Hills", "Sunnydale"], answer: "Beacon Hills" },

  { question: "Which character is Scott's closest childhood friend?", options: ["Stiles Stilinski", "Derek Hale", "Liam Dunbar", "Chris Argent"], answer: "Stiles Stilinski" },

];



const pages = [

  ["HOME", "home"],

  ["CHARACTERS", "characters"],

  ["SEASONS", "seasons"],

  ["BESTIARY", "bestiary"],

  ["PACKS", "packs"],

  ["LOCATIONS", "locations"],

  ["RELATIONSHIPS", "relationships"],

  ["THE FILM", "film"],

  ["IDENTITY", "identity"],

  ["QUIZ", "quiz"],

  ["CLASSIFIED", "classified"],

];



function SectionHeading({ eyebrow, title, description }) {

  return (

    <div className="section-heading">

      <p className="eyebrow">{eyebrow}</p>

      <h2>{title}</h2>

      {description && <p className="section-description">{description}</p>}

      <span className="heading-line" />

    </div>

  );

}



function Card({ children, className = "", onClick, detailLabel = "Open details" }) {
  if (onClick) {
    return (
      <button type="button" className={`wolf-card card-button ${className}`} onClick={onClick} aria-label={detailLabel}>
        {children}
        <span className="card-interaction-hint" aria-hidden="true">OPEN FILE ↗</span>
      </button>
    );
  }
  return <article className={`wolf-card ${className}`}>{children}</article>;
}


function App() {

  const [entered, setEntered] = useState(false);

  const [page, setPage] = useState("home");

  const [musicOn, setMusicOn] = useState(false);

  const [showEntryTriskelion, setShowEntryTriskelion] = useState(false);

  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const characterDetailRef = useRef(null);
  const archiveDetailRef = useRef(null);

  useEffect(() => {
    if (selectedCharacter) requestAnimationFrame(() => characterDetailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [selectedCharacter]);

  useEffect(() => {
    if (selectedArchive) requestAnimationFrame(() => archiveDetailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, [selectedArchive]);
  const characterDragStart = useRef(0);

  const [identity, setIdentity] = useState(() => {

    try { return JSON.parse(localStorage.getItem("teenWolfIdentity") || "null"); }

    catch { return null; }

  });

  const [identityName, setIdentityName] = useState(() => localStorage.getItem("teenWolfName") || "");

  const [questionIndex, setQuestionIndex] = useState(0);

  const [quizScore, setQuizScore] = useState(0);

  const [quizFinished, setQuizFinished] = useState(false);

  const [classifiedOpen, setClassifiedOpen] = useState(false);

  const audioRef = useRef(null);



  useEffect(() => {

    document.title = "Wolf Verse | Beacon Hills";



    // Play the opening verse and first "ooh" refrain, then loop that section.

    // The full song stays in public/audio/ava.mp3.

    const AUDIO_START_SECONDS = 0;

    const AUDIO_END_SECONDS = 75;



    const audio = new Audio("/audio/ava.mp3");

    audio.preload = "auto";

    audio.loop = false;

    audio.volume = 0.35;



    const loopRequestedSection = () => {

      if (audio.currentTime >= AUDIO_END_SECONDS) {

        audio.currentTime = AUDIO_START_SECONDS;

        if (!audio.paused) {

          const resume = audio.play();

          if (resume && typeof resume.catch === "function") resume.catch(() => {});

        }

      }

    };



    audio.addEventListener("timeupdate", loopRequestedSection);

    audioRef.current = audio;



    return () => {

      audio.pause();

      audio.removeEventListener("timeupdate", loopRequestedSection);

      audio.src = "";

      audioRef.current = null;

    };

  }, []);



  const enterBeaconHills = async () => {

    setShowEntryTriskelion(true);

    setEntered(true);

    const audio = audioRef.current;

    if (!audio) return;



    try {

      audio.currentTime = 0;

      audio.volume = 0.35;

      await audio.play();

      setMusicOn(true);

    } catch {

      setMusicOn(false);

    }

  };



  const toggleMusic = async () => {

    const audio = audioRef.current;

    if (!audio) return;



    if (musicOn) {

      audio.pause();

      setMusicOn(false);

    } else {

      try {

        // Restart the requested section if playback is outside it.

        if (audio.currentTime >= 75 || audio.ended) {

          audio.currentTime = 0;

        }

        await audio.play();

        setMusicOn(true);

      } catch {

        setMusicOn(false);

      }

    }

  };



  // Keep browser Back inside the website. Every section can return to Home,

  // and pressing Back on Home stays on Home rather than leaving the site.

  useEffect(() => {

    if (!entered) return;



    const keepHomeInHistory = () => {

      window.history.pushState({ teenWolfHomeGuard: true }, "", window.location.href);

      setPage((currentPage) => {

        if (currentPage !== "home") return "home";

        return "home";

      });

      setSelectedCharacter(null);
      setSelectedArchive(null);

      window.scrollTo({ top: 0, behavior: "smooth" });

    };



    window.history.pushState({ teenWolfHomeGuard: true }, "", window.location.href);

    window.addEventListener("popstate", keepHomeInHistory);

    return () => window.removeEventListener("popstate", keepHomeInHistory);

  }, [entered]);



  const navigate = (nextPage) => {

    setPage(nextPage);

    setSelectedCharacter(null);
    setSelectedArchive(null);

    window.history.pushState({ teenWolfPage: nextPage }, "", window.location.href);

    window.scrollTo({ top: 0, behavior: "smooth" });

  };



  const createIdentity = (event) => {

    if (event) event.preventDefault();

    const displayName = identityName.trim().replace(/\s+/g, " ");

    if (!displayName) return;



    const normalizedName = displayName.toLowerCase();

    const trueAlphaNames = new Set(["nitin", "nitin devkar", "sachin", "sachin devkar", "nisha"]);

    const knownProfile = trueAlphaNames.has(normalizedName)

      ? {

          name: "THE TRUE ALPHA",

          creature: "Werewolf",

          rank: "TRUE ALPHA",

          symbol: "ᛟ",

          strength: "Leadership",

          trait: "Your loyalty and courage put your pack before yourself."

        }

      : null;



    let profile = knownProfile;

    if (!profile) {

      const savedKey = `teenWolfProfile:${normalizedName}`;

      try {

        profile = JSON.parse(localStorage.getItem(savedKey) || "null");

      } catch {

        profile = null;

      }

      if (!profile) {

        const assignedTypes = [

          { name: "THE BETA", creature: "Werewolf", rank: "BETA", symbol: "〄", strength: "Loyalty", trait: "Steady, brave, and strongest when standing beside your pack." },

          { name: "THE OMEGA", creature: "Lone Wolf", rank: "OMEGA", symbol: "☾", strength: "Independence", trait: "Resilient and self-reliant, you find your own path through the dark." },

          { name: "THE KITSUNE", creature: "Kitsune", rank: "KITSUNE", symbol: "狐", strength: "Adaptability", trait: "Clever, observant, and full of unexpected energy." }

        ];

        profile = assignedTypes[Math.floor(Math.random() * assignedTypes.length)];

        localStorage.setItem(savedKey, JSON.stringify(profile));

      }

    }



    const completeProfile = { ...profile, enteredName: displayName };

    setIdentity(completeProfile);

    localStorage.setItem("teenWolfName", displayName);

    localStorage.setItem("teenWolfIdentity", JSON.stringify(completeProfile));

  };



  const answerQuiz = (option) => {

    if (option === quizQuestions[questionIndex].answer) setQuizScore((score) => score + 1);

    if (questionIndex + 1 >= quizQuestions.length) {

      setQuizFinished(true);

    } else {

      setQuestionIndex((index) => index + 1);

    }

  };



  const restartQuiz = () => {

    setQuestionIndex(0);

    setQuizScore(0);

    setQuizFinished(false);

  };



  const renderPage = () => {

    switch (page) {

      case "home":

        return (

          <>

            <section

              className="home-hero"

              style={{

                backgroundImage: `linear-gradient(90deg, rgba(2,2,3,.86) 0%, rgba(2,2,3,.48) 48%, rgba(2,2,3,.12) 100%), linear-gradient(0deg, #020203 0%, transparent 24%, transparent 78%, #020203 100%), url(${howlingWolf})`,

              }}

            >

              <div className="hero-moon" />

              <div className="hero-forest" />

              <div className="hero-content">

                <p className="eyebrow">SOME SECRETS NEVER STAY BURIED</p>

                <h1>WELCOME TO<br /><span>BEACON HILLS</span></h1>

                <p className="hero-copy">Every town has a story. This one has claws.</p>

                <div className="hero-actions">

                  <button className="button button-red" onClick={() => navigate("characters")}>MEET THE PACK <span>↗</span></button>

                  <button className="button button-outline" onClick={() => navigate("bestiary")}>OPEN THE BESTIARY</button>

                </div>

              </div>

              <div className="vertical-note">BEACON HILLS · CALIFORNIA</div>

              <div className="hero-bottom-line"><span>THE SUPERNATURAL IS CLOSER THAN YOU THINK</span></div>

            </section>



            <section className="content-section">

              <SectionHeading eyebrow="THE TOWN HAS CHANGED" title="AFTER DARK" description="Beneath the ordinary streets of Beacon Hills lies a world of supernatural secrets." />

              <div className="feature-grid">

                <Card className="feature-card feature-large">

                  <span className="card-number">01 / THE PACK</span>

                  <div className="feature-symbol">◈</div>

                  <h3>Stronger Together</h3>

                  <p>Heroes aren't always born. Sometimes they're found in the people who refuse to leave you behind.</p>

                  <button className="text-link" onClick={() => navigate("packs")}>EXPLORE THE PACKS ↗</button>

                </Card>

                <Card className="feature-card">

                  <span className="card-number">02 / THE UNKNOWN</span>

                  <div className="feature-symbol">☾</div>

                  <h3>Things in the Dark</h3>

                  <p>Not everything that hunts in the forest is a wolf.</p>

                  <button className="text-link" onClick={() => navigate("bestiary")}>IDENTIFY A CREATURE ↗</button>

                </Card>

                <Card className="feature-card">

                  <span className="card-number">03 / THE ARCHIVE</span>

                  <div className="feature-symbol">⌕</div>

                  <h3>Hidden Records</h3>

                  <p>Open the files. Discover the stories buried beneath the town.</p>

                  <button className="text-link" onClick={() => navigate("classified")}>ACCESS THE FILES ↗</button>

                </Card>

              </div>

            </section>



            <section className="red-strip">

              <span className="strip-mark">✳</span>

              <p>WHEN YOU BECOME A PACK, YOU NEVER FIGHT ALONE.</p>

              <span className="strip-mark">✳</span>

            </section>



            <section className="content-section">

              <SectionHeading eyebrow="THE PEOPLE WHO CHANGED EVERYTHING" title="MEET THE PACK" description="Every member has a story. Every story leaves a mark." />

              <div className="character-grid">

                {characters.slice(0, 4).map((character) => (

                  <button className="character-card" key={character.name} onClick={() => { setSelectedCharacter(character); navigate("characters"); }}>

                    <div className="character-art" style={{ backgroundImage: `linear-gradient(0deg, rgba(4,4,5,.92), rgba(4,4,5,.12)), url(${getLocalImage("characters", character.imageFile)})` }}><i>{character.tag}</i></div>

                    <div className="character-info"><h3>{character.name}</h3><p>{character.role}</p><span className="card-arrow">↗</span></div>

                  </button>

                ))}

              </div>

              <div className="center-action"><button className="button button-outline" onClick={() => navigate("characters")}>VIEW ALL CHARACTERS</button></div>

            </section>



            <section className="moon-quote">

              <div className="quote-moon" />

              <p className="eyebrow">A BEACON HILLS REMINDER</p>

              <blockquote>“Sometimes the people who seem the most human are the ones hiding the most.”</blockquote>

              <span>— THE PACK ARCHIVES</span>

            </section>

          </>

        );



      case "characters":

        return (

          <section className="page-wrap">

            <SectionHeading eyebrow="PERSONNEL DATABASE / 001" title="THE PACK" description="Meet the humans, shapeshifters, and supernatural allies whose lives are connected to Beacon Hills." />

            <div className="character-grid full-grid">

              {characters.map((character, index) => (

                <button className="character-card" key={character.name} onClick={() => setSelectedCharacter(character)}>

                  <div className={`character-art art-${index % 4}`} role="img" aria-label={character.name} style={{ backgroundImage: `linear-gradient(0deg, rgba(4,4,5,.04), rgba(4,4,5,.02)), url("${getLocalImage("characters", character.imageFile)}")` }}></div>
                  <div className="character-info"><p className="character-card-role">{character.role}</p><h3>{character.name}</h3><span className="character-card-action">VIEW PROFILE ↗</span></div>
                </button>

              ))}

            </div>

            

          </section>

        );



      case "seasons":

        return (

          <section className="page-wrap">

            <SectionHeading eyebrow="EPISODE ARCHIVE / 002" title="THE STORY SO FAR" description="Explore the six-season journey from a mysterious bite to the final hunt." />

            <div className="season-list">

              {seasons.map((season) => (

                <Card className="season-row" key={season.number} onClick={() => setSelectedArchive({ eyebrow: `${season.years} · ${season.mood}`, title: season.title, description: season.description, image: getLocalImage("seasons", season.imageFile), meta: `SEASON FILE / ${season.number}` })} detailLabel={`Open ${season.title} details`}>

                  <div className="season-art" style={{ backgroundImage: `linear-gradient(0deg, rgba(4,4,5,.76), rgba(4,4,5,.12)), url(${getLocalImage("seasons", season.imageFile)})` }} aria-hidden="true" /><span className="season-number">{season.number}</span>

                  <div><p className="eyebrow">{season.years} · {season.mood}</p><h3>{season.title}</h3><p>{season.description}</p></div>

                  <span className="season-mark">↗</span>

                </Card>

              ))}

            </div>

            <p className="small-note">Episode details are summaries, not a full episode guide.</p>

          </section>

        );



      case "bestiary":

        return (

          <section className="page-wrap">

            <SectionHeading eyebrow="SUPERNATURAL FIELD GUIDE / 003" title="THE BESTIARY" description="A field guide to the creatures and forces reported around Beacon Hills." />

            <div className="creature-grid">

              {creatures.map((creature, index) => (

                <Card className="creature-card" key={creature.name} onClick={() => setSelectedArchive({ eyebrow: `${creature.type} · THREAT ${creature.danger}`, title: creature.name, description: creature.description, image: getLocalImage("bestiary", creature.imageFile), meta: `FIELD FILE / BH-${String(index + 11).padStart(3, "0")}` })} detailLabel={`Open ${creature.name} field file`}>

                  <div className={`creature-sigil sigil-${index % 4}`} style={{ backgroundImage: `linear-gradient(0deg, rgba(4,4,5,.8), rgba(4,4,5,.12)), url(${getLocalImage("bestiary", creature.imageFile)})` }}></div>

                  <div className="creature-meta"><span>{creature.type}</span><span className={creature.danger === "EXTREME" ? "danger danger-high" : "danger"}>{creature.danger}</span></div>

                  <h3>{creature.name}</h3>

                  <p>{creature.description}</p>

                  <span className="file-code">FIELD FILE / BH-{String(index + 11).padStart(3, "0")}</span>

                </Card>

              ))}

            </div>

          </section>

        );



      case "packs":

        return (

          <section className="page-wrap">

            <SectionHeading eyebrow="ALLIANCE RECORDS / 004" title="PACKS & LEGACIES" description="Power means different things to different groups. Discover where loyalty and ambition collide." />

            <div className="pack-grid">

              {packs.map((pack, index) => (

                <Card className="pack-card" key={pack.name} onClick={() => setSelectedArchive({ eyebrow: pack.kind, title: pack.name, description: pack.description, image: getLocalImage("packs", pack.imageFile), meta: `GROUP RECORD / 0${index + 1}` })} detailLabel={`Open ${pack.name} details`}>

                  <div className={`pack-emblem emblem-${index}`} style={{ backgroundImage: `linear-gradient(0deg, rgba(4,4,5,.82), rgba(4,4,5,.18)), url(${getLocalImage("packs", pack.imageFile)})` }}></div>

                  <p className="eyebrow">{pack.kind}</p>

                  <h3>{pack.name}</h3>

                  <p className="pack-card-summary">{pack.description.split(/(?<=[.!?])\s+/)[0]}</p>

                  <div className="pack-line" />

                  <span className="file-code">GROUP RECORD / 0{index + 1}</span>

                </Card>

              ))}

            </div>

          </section>

        );



      case "locations":

        return (

          <section className="page-wrap">

            <SectionHeading eyebrow="LOCAL MAP / 005" title="BEACON HILLS" description="Some places look ordinary until you know what happened there." />

            <div className="location-grid">

              {locations.map((location, index) => (

                <Card className="location-card" key={location.name} onClick={() => setSelectedArchive({ eyebrow: location.label, title: location.name, description: location.text, image: getLocalImage("locations", location.imageFile), meta: `BEACON HILLS LOCATION / 0${index + 1}` })} detailLabel={`Open ${location.name} location file`}>

                  <div className={`location-scene scene-${index % 4}`} style={{ backgroundImage: `linear-gradient(0deg, rgba(4,4,5,.82), rgba(4,4,5,.16)), url(${getLocalImage("locations", location.imageFile)})` }}><span>BH / 0{index + 1}</span></div>

                  <p className="eyebrow">{location.label}</p>

                  <h3>{location.name}</h3>

                  <p>{location.text}</p>

                </Card>

              ))}

            </div>

          </section>

        );



      case "relationships":

        return (

          <section className="page-wrap">

            <SectionHeading eyebrow="CONNECTIONS DATABASE / 006" title="BONDS & BETRAYALS" description="In Beacon Hills, trust can be the strongest weapon — or the greatest risk." />

            <div className="relationship-list">

              {relationships.map((relationship, index) => (

                <Card className="relationship-card" key={relationship.title} onClick={() => setSelectedArchive({ eyebrow: relationship.subtitle, title: relationship.title, description: relationship.text, image: getLocalImage("relationships", relationship.imageFile), meta: `CONNECTIONS RECORD / 0${index + 1}` })} detailLabel={`Open ${relationship.title} relationship details`}>

                  <div className="relationship-art" style={{ backgroundImage: `linear-gradient(0deg, rgba(4,4,5,.72), rgba(4,4,5,.12)), url(${getLocalImage("relationships", relationship.imageFile)})` }} aria-hidden="true" /><span className="relationship-index">0{index + 1}</span>

                  <div><p className="eyebrow">{relationship.subtitle}</p><h3>{relationship.title}</h3><p>{relationship.text}</p></div>

                  <span className="relationship-icon">↗</span>

                </Card>

              ))}

            </div>

          </section>

        );



      case "film":

        return (

          <section className="film-page">

            <div className="film-backdrop" style={{ backgroundImage: `linear-gradient(90deg, rgba(2,2,3,.94), rgba(2,2,3,.36)), url(${getLocalImage("the movie", "the-movie.jpg")})` }}></div>

            <div className="film-content">

              <p className="eyebrow">THE STORY CONTINUES</p>

              <h1>TEEN WOLF:<br /><span>THE MOVIE</span></h1>

              <p>Beacon Hills faces a new threat, bringing familiar faces back into a world that never truly left them behind.</p>

              <div className="film-facts"><span>SUPERNATURAL DRAMA</span><span>THE PACK RETURNS</span></div>

              <button className="button button-red" onClick={() => navigate("characters")}>REVISIT THE PACK ↗</button>

              <p className="small-note">This page is a fan-made overview, not an official streaming page.</p>

            </div>

          </section>

        );



      case "identity":

        return (

          <section className="page-wrap identity-page">

            <SectionHeading eyebrow="PACK REGISTRY / 008" title="TEST YOUR WOLF IDENTITY" description="Discover your place in the supernatural world of Beacon Hills." />

            <div className="identity-console">

              <div className="scanner-circle" aria-label="Beacon Hills triskelion emblem">
                <img
                  src={getLocalImage("identity", "bh-triskelion.jpg")}
                  alt="Teen Wolf Alpha, Beta and Omega triskelion symbol"
                />
              </div>

              <h3 className="wolf-identity-title">TEST YOUR WOLF IDENTITY</h3>

              <form className="identity-name-form" onSubmit={createIdentity}>

                <label htmlFor="pack-member-name">PACK MEMBER NAME</label>

                <input id="pack-member-name" value={identityName} onChange={(event) => setIdentityName(event.target.value)} placeholder="Enter name..." autoComplete="off" maxLength={60} />

                <button className="button button-red" type="submit">REGISTER IDENTITY ↗</button>

              </form>

              {identity && (

                <div className="identity-result">

                  <p className="eyebrow">IDENTITY ASSIGNED</p>

                  <div className="identity-symbol" aria-hidden="true">{identity.symbol || "◈"}</div>

                  <p className="identity-member">PACK MEMBER: <strong>{identity.enteredName || identityName}</strong></p>

                  <h2>{identity.name}</h2>

                  <p className="identity-rank">{identity.rank || identity.name.replaceAll("THE ", "")}</p>

                  <div className="identity-facts"><span>TYPE<strong>{identity.creature}</strong></span><span>STRENGTH<strong>{identity.strength}</strong></span></div>

                  <p>{identity.trait}</p>

                  <p className="small-note">This identity is saved in this browser for the same name.</p>

                </div>

              )}

            </div>

          </section>

        );



      case "quiz":

        return (

          <section className="page-wrap quiz-page">

            <SectionHeading eyebrow="KNOWLEDGE TEST / 009" title="HOW WELL DO YOU KNOW THE PACK?" description="Four questions. One Beacon Hills expert. See how much you remember." />

            <div className="quiz-box">

              {!quizFinished ? (

                <>

                  <div className="quiz-top"><span>QUESTION {questionIndex + 1} / {quizQuestions.length}</span><span>SCORE: {quizScore}</span></div>

                  <div className="quiz-progress"><span style={{ width: `${((questionIndex + 1) / quizQuestions.length) * 100}%` }} /></div>

                  <h3>{quizQuestions[questionIndex].question}</h3>

                  <div className="quiz-options">

                    {quizQuestions[questionIndex].options.map((option, index) => (

                      <button key={option} onClick={() => answerQuiz(option)}><span>0{index + 1}</span>{option}<i>↗</i></button>

                    ))}

                  </div>

                </>

              ) : (

                <div className="quiz-result">

                  <p className="eyebrow">TEST COMPLETE</p>

                  <h2>{quizScore} / {quizQuestions.length}</h2>

                  <p>{quizScore === 4 ? "Pack legend. You know Beacon Hills inside out." : quizScore >= 2 ? "Good instincts. There's more to discover in the archives." : "Your training has just begun. Time to explore the files."}</p>

                  <button className="button button-red" onClick={restartQuiz}>TRY AGAIN ↗</button>

                </div>

              )}

            </div>

          </section>

        );



      case "classified":

        return (

          <section className="page-wrap classified-page">

            <SectionHeading eyebrow="RESTRICTED ACCESS / 010" title="CLASSIFIED FILES" description="Some information was never meant to leave the archives." />

            <div className="classified-folder">

              <div className="folder-top"><span>BEACON HILLS SHERIFF'S DEPARTMENT</span><span>ACCESS: RESTRICTED</span></div>

              <div className="folder-stamp">CLASSIFIED</div>

              <p className="eyebrow">ARCHIVE NO. BH-0001</p>

              <h2>THE BEACON HILLS INCIDENTS</h2>

              <p>Reports of unexplained events, unidentified creatures, unusual injuries, and other strange occurrences have been compiled into this archive.</p>

              {!classifiedOpen ? (

                <button className="button button-red" onClick={() => setClassifiedOpen(true)}>REQUEST ACCESS ↗</button>

              ) : (

                <div className="classified-content">

                  <p className="redacted-label">ARCHIVE STATUS: UNSEALED</p>

                  <ul>

                    <li>CASE 001 — Unusual activity reported in the preserve.</li>

                    <li>CASE 002 — Multiple reports involving unexplained animal behaviour.</li>

                    <li>CASE 003 — Recurring symbols documented across local incidents.</li>

                    <li>CASE 004 — Further records withheld from public access.</li>

                  </ul>

                  <p className="small-note">Fictional fan-made archive inspired by the series.</p>

                </div>

              )}

            </div>

          </section>

        );



      default:

        return null;

    }

  };



  if (!entered) {

    return (

      <main className="intro-screen">

        <div className="intro-content">

          <p className="intro-overline">THE NIGHT IS CALLING</p>

          <div className="intro-sigil triskelion-sigil" role="img" aria-label="Triskelion symbol">

            <svg viewBox="0 0 120 120" aria-hidden="true">

              <circle className="triskelion-ring" cx="60" cy="60" r="52" />

              <g className="triskelion-arms" transform="translate(60 60)">

                <path d="M0 -8 C-8 -18 -22 -18 -25 -7 C-28 4 -17 11 -8 5 C-2 1 -5 -7 -11 -6 C-15 -5 -14 0 -11 1" />

                <path d="M0 -8 C-8 -18 -22 -18 -25 -7 C-28 4 -17 11 -8 5 C-2 1 -5 -7 -11 -6 C-15 -5 -14 0 -11 1" transform="rotate(120)" />

                <path d="M0 -8 C-8 -18 -22 -18 -25 -7 C-28 4 -17 11 -8 5 C-2 1 -5 -7 -11 -6 C-15 -5 -14 0 -11 1" transform="rotate(240)" />

              </g>

              <circle className="triskelion-core" cx="60" cy="60" r="4" />

            </svg>

          </div>

          <h1 className="wolf-verse-title"><span className="wolf-word">WOLF</span> <span className="verse-word">VERSE</span></h1>

          <p className="intro-subtitle">EVERY LEGEND BEGINS IN THE DARK</p>

          <button className="enter-button" onClick={enterBeaconHills}><span>ENTER BEACON HILLS</span><i>↗</i></button>

        </div>

      </main>

    );

  }



  return (

    <div className="site-shell">

      {showEntryTriskelion && (

        <div className="entry-triskelion-overlay" aria-hidden="true" onAnimationEnd={() => setShowEntryTriskelion(false)}>

          <svg viewBox="0 0 120 120">

            <circle className="entry-triskelion-ring" cx="60" cy="60" r="52" />

            <g className="entry-triskelion-arms" transform="translate(60 60)">

              <path d="M0 -8 C-8 -18 -22 -18 -25 -7 C-28 4 -17 11 -8 5 C-2 1 -5 -7 -11 -6 C-15 -5 -14 0 -11 1" />

              <path d="M0 -8 C-8 -18 -22 -18 -25 -7 C-28 4 -17 11 -8 5 C-2 1 -5 -7 -11 -6 C-15 -5 -14 0 -11 1" transform="rotate(120)" />

              <path d="M0 -8 C-8 -18 -22 -18 -25 -7 C-28 4 -17 11 -8 5 C-2 1 -5 -7 -11 -6 C-15 -5 -14 0 -11 1" transform="rotate(240)" />

            </g>

            <circle className="entry-triskelion-core" cx="60" cy="60" r="4" />

          </svg>

        </div>

      )}

      <header className="site-header">

        <button className="brand" onClick={() => navigate("home")} aria-label="Teen Wolf Universe home">

          <span className="brand-mark">ᛟ</span>

          <span className="brand-text">TEEN WOLF<small>UNIVERSE / BEACON HILLS</small></span>

        </button>

        <nav className="main-nav" aria-label="Main navigation">

          {pages.map(([label, target]) => (

            <button key={target} className={`nav-link ${page === target ? "active" : ""}`} onClick={() => navigate(target)}>{label}</button>

          ))}

        </nav>

        <button className={`music-toggle ${musicOn ? "music-active" : ""}`} onClick={toggleMusic} aria-label={musicOn ? "Turn music off" : "Turn music on"}>

          <span className="music-bars"><i /><i /><i /><i /></span><span>{musicOn ? "MUSIC ON" : "MUSIC OFF"}</span>

        </button>

      </header>



      <main className="main-content" key={page}>
        {renderPage()}
      </main>

      {selectedCharacter && (
        <section className="selected-detail-section character-detail-section" ref={characterDetailRef} aria-live="polite">
          <div className="selected-detail-inner">
            <p className="eyebrow">WOLF VERSE / PERSONNEL FILE</p>
            <div className="selected-detail-layout">
              <img className="selected-detail-image" src={getLocalImage("characters", selectedCharacter.imageFile)} alt={selectedCharacter.name} />
              <div className="selected-detail-copy">
                <p className="character-profile-tag">{selectedCharacter.tag}</p>
                <h2>{selectedCharacter.name}</h2>
                <p className="character-profile-role">{selectedCharacter.role}</p>
                <p className="character-profile-description">{selectedCharacter.detail}</p>
                <div className="selected-detail-facts"><span>ALLEGIANCE</span><strong>{selectedCharacter.pack}</strong></div>
                <button className="button button-outline" type="button" onClick={() => setSelectedCharacter(null)}>CLOSE DETAILS</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {selectedArchive && (
        <section className="selected-detail-section archive-detail-section" ref={archiveDetailRef} aria-live="polite">
          <div className="selected-detail-inner">
            <p className="eyebrow">{selectedArchive.eyebrow}</p>
            <div className="selected-detail-layout">
              {selectedArchive.image && <img className="selected-detail-image" src={selectedArchive.image} alt={selectedArchive.title} />}
              <div className="selected-detail-copy">
                <h2>{selectedArchive.title}</h2>
                <p className="character-profile-description">{selectedArchive.description}</p>
                <span className="file-code">{selectedArchive.meta}</span>
                <button className="button button-outline" type="button" onClick={() => setSelectedArchive(null)}>CLOSE DETAILS</button>
              </div>
            </div>
          </div>
        </section>
      )}


      <footer className="site-footer">

        <div className="footer-brand"><span className="brand-mark">ᛟ</span><div><strong>TEEN WOLF UNIVERSE</strong><p>THE NIGHT BELONGS TO THE PACK.</p></div></div>

        <div className="footer-links">

          <button onClick={() => navigate("characters")}>THE PACK</button>

          <button onClick={() => navigate("bestiary")}>BESTIARY</button>

          <button onClick={() => navigate("classified")}>ARCHIVES</button>

        </div>

        <p className="footer-copy">MADE BY NITIN DEVKAR - TEEN WOLF UNIVERSE</p>

      </footer>

    </div>

  );

}



export default App;
