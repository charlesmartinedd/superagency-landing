const { Document, Packer, Paragraph, TextRun, Header, Footer, PageNumber, AlignmentType, HeadingLevel, LevelFormat, PageBreak } = require('docx');
const fs = require('fs');

const chapters = [
  {
    title: "Chapter 1: Humanity Has Entered the Chat",
    questions: [
      { q: "When ChatGPT launched, did you feel more excited or anxious?", follow: "What does that gut reaction tell you about how you relate to new technology in general?" },
      { q: "Hoffman describes three camps: Gloomers (pessimists), Zoomers (accelerationists), and Bloomers (optimistic realists).", follow: "Which camp do most of your clients fall into - and how does that shape what we build for them?" },
      { q: "The book argues AI amplifies human capability like steam power amplified physical labor.", follow: "What's one routine task in your work that, if amplified 10x by AI, would fundamentally change what you could accomplish?" },
      { q: "OpenAI launched ChatGPT with \"zero hype\" - just a tweet saying \"try it.\"", follow: "Is there something to learn from that approach for how we introduce new tools or methods to resistant clients?" }
    ]
  },
  {
    title: "Chapter 2: Big Knowledge",
    questions: [
      { q: "Orwell's 1984 shaped 75 years of fear about surveillance technology - yet most of us voluntarily carry tracking devices everywhere.", follow: "Where's the line between \"creepy surveillance\" and \"useful personalization\" in the learning experiences we design?" },
      { q: "The chapter discusses \"iterative deployment\" - releasing technology in stages to build trust.", follow: "How might we apply that philosophy to rolling out AI-generated content or AI tutors in our client projects?" },
      { q: "In the 1960s, experts predicted mainframe computers would create mass unemployment. They were wrong.", follow: "What current AI predictions do you think we'll look back on as similarly overblown - or underestimated?" },
      { q: "Trust develops through \"consistency over time.\"", follow: "What would it take for your most skeptical client to trust AI-generated learning content as much as human-created content?" }
    ]
  },
  {
    title: "Chapter 3: What Could Possibly Go Right?",
    questions: [
      { q: "Hoffman coins \"problemism\" - the reflexive belief that technology is inherently harmful.", follow: "Have you ever killed a good idea because you focused on what could go wrong rather than what could go right?" },
      { q: "The book argues technology contributes 30-80% of solutions to major global challenges.", follow: "If you had to bet: Will AI make education more equitable in the next decade, or will it widen the gap?" },
      { q: "Mental health apps are cited as an example where AI could dramatically expand access to care.", follow: "What's the eLearning equivalent - an area where AI could help people who currently can't access quality training?" },
      { q: "\"Every precautionary delay that prevents harm also prevents benefit.\"", follow: "Think of a recent project decision: Did we err toward caution or speed? Was that the right call?" }
    ]
  },
  {
    title: "Chapter 4: The Triumph of the Private Commons",
    questions: [
      { q: "Critics say Big Tech extracts value from users like \"poaching elephants for ivory.\"", follow: "But billions keep coming back. What value are people actually getting that critics miss?" },
      { q: "The \"private commons\" concept: companies create shared resources (like GPS) that benefit everyone.", follow: "Is there an AI capability we use daily that we've stopped noticing because it just works?" },
      { q: "Hoffman argues the real question isn't whether tech companies profit, but whether the total pie grows.", follow: "In our industry, who's growing the pie - and who's just taking a bigger slice of the existing one?" },
      { q: "The book pushes back on the idea that automation always benefits only the few.", follow: "In your experience with eLearning automation, who actually benefits most - the company, the learners, or the designers?" }
    ]
  },
  {
    title: "Chapter 5: Testing, Testing 1, 2, \u221E",
    questions: [
      { q: "Media calls AI development an \"arms race\" - but Hoffman says it's more like a \"space race\" defined by rigorous testing.", follow: "Which framing do you instinctively believe, and why?" },
      { q: "AI developers test obsessively - hundreds of benchmarks measuring accuracy, safety, bias.", follow: "How does that compare to how we test learning experiences before releasing them to clients?" },
      { q: "Competition is described as a form of regulation - public benchmarks force transparency.", follow: "What would happen if eLearning vendors had to publish standardized effectiveness benchmarks?" },
      { q: "The Turing Test asked \"can machines think?\"", follow: "For our work: What would be the equivalent test for \"has this learner actually learned\"?" }
    ]
  },
  {
    title: "Chapter 6: Innovation Is Safety",
    questions: [
      { q: "The \"precautionary principle\" says new tech is \"guilty until proven innocent.\"", follow: "When has that mindset protected you - and when has it cost you an opportunity?" },
      { q: "Hoffman argues innovation IS safety - that rapid iteration with feedback is often safer than slow, closed development.", follow: "Does that logic apply to how we develop training, or is learning different?" },
      { q: "\"Maintaining America's AI lead means infusing these technologies with democratic values.\"", follow: "What values do we infuse into the learning experiences we create - consciously or unconsciously?" },
      { q: "Electric starters replaced dangerous hand-cranked engines because drivers voted with their purchases.", follow: "What's an instructional design practice that should die but persists because no one's offered a clearly better alternative?" }
    ]
  },
  {
    title: "Chapter 7: Informational GPS",
    questions: [
      { q: "GPS evolved from military tech to a $1.4 trillion public good.", follow: "What AI capability today feels military/enterprise-only but could become universally accessible in 5 years?" },
      { q: "The book frames LLMs as \"informational GPS\" - tools for navigating complex knowledge.", follow: "How might that metaphor change how we design learning journeys?" },
      { q: "Clinton's 2000 decision to give civilians full GPS access unlocked massive value.", follow: "What's locked up in our industry right now that, if opened, would create similar breakthroughs?" },
      { q: "GPS \"shrank the physical world to fit in our palms.\"", follow: "What would it mean to shrink a complex body of knowledge - like contract law or medical procedures - to fit in someone's palm?" }
    ]
  },
  {
    title: "Chapter 8: Law Is Code",
    questions: [
      { q: "Lessig's insight: \"Code is law\" - software architecture determines what's possible.", follow: "What rules are \"baked into\" the LMS platforms we use that constrain how we design learning?" },
      { q: "The DADSS example: cars that refuse to start if you're drunk.", follow: "Would you want a training system that refuses to let someone proceed until they've truly mastered the prerequisite? Why or why not?" },
      { q: "As AI embeds into everything, questions of consent and override rights become urgent.", follow: "Should learners be able to \"override\" an AI tutor's judgment about their readiness?" },
      { q: "The internet evolved from ungovernable to highly regulated.", follow: "Will AI-powered learning follow the same arc - and is that good or bad?" }
    ]
  },
  {
    title: "Chapter 9: Networked Autonomy",
    questions: [
      { q: "Self-driving cars may constrain some freedoms (no speeding) while enabling others (mobility for non-drivers).", follow: "What freedoms might AI tutors take away from learners - and what might they enable?" },
      { q: "Regulation made driving safer AND more accessible - not less free.", follow: "What's an example of a \"constraint\" in learning design that actually increases learner freedom?" },
      { q: "The chapter argues freedom is \"relational and contextual\" - it shifts with each technology.", follow: "How has your sense of professional freedom changed since AI tools became available?" },
      { q: "The Donner Party vs. modern road trips: 178 years of regulation transformed a deadly journey into a routine drive.", follow: "What's the eLearning equivalent of \"building the highway system\"?" }
    ]
  },
  {
    title: "Chapter 10: The United States of A(I)merica",
    questions: [
      { q: "Luddites vs. Donner Party: one group resisted change, the other embraced risk.", follow: "Which instinct dominates in our industry right now?" },
      { q: "The book imagines an alternate history where Britain froze technological progress in 1820.", follow: "If our industry froze in 2020, what innovations would we have missed?" },
      { q: "The Luddites weren't anti-technology per se - they opposed exploitation.", follow: "What legitimate concerns about AI in learning do we sometimes dismiss as \"Luddite\" thinking?" },
      { q: "American identity is defined by \"continuous adaptation, exploration, and self-improvement.\"", follow: "Does our company culture embody that, or are we more conservative than we admit?" }
    ]
  },
  {
    title: "Chapter 11: You Can Get There from Here",
    questions: [
      { q: "The book's core thesis: \"Design for human agency.\"", follow: "In the learning experiences we create, are we expanding learner agency or replacing it?" },
      { q: "Hoffman says the current moment is uniquely uncertain - \"everyone knows less than we've known in decades.\"", follow: "Is that terrifying or liberating for how you approach your work?" },
      { q: "\"Technology is a time-tested key to human flourishing.\"", follow: "Do you believe that? What would change your mind?" },
      { q: "The final principle: \"Steer toward better futures to make worse outcomes harder to achieve.\"", follow: "If Eccalon fully embraced AI, what \"better future\" are we steering toward - and what worse outcome are we trying to prevent?" }
    ]
  }
];

// Build document content
const children = [];

// Title
children.push(new Paragraph({
  heading: HeadingLevel.TITLE,
  spacing: { after: 400 },
  children: [new TextRun({ text: "Superagency", size: 56, bold: true })]
}));

children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 },
  children: [new TextRun({ text: "Innovation Book Club Discussion Questions", size: 32, color: "444444" })]
}));

children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 400 },
  children: [new TextRun({ text: "By Reid Hoffman & Greg Beato | Prepared for Eccalon", size: 24, italics: true, color: "666666" })]
}));

// Intro paragraph
children.push(new Paragraph({
  spacing: { after: 300 },
  children: [new TextRun({
    text: "These questions are designed to spark engaging discussion even if participants haven't read the chapter. Each question connects the book's themes to our daily work in eLearning and instructional design.",
    size: 22
  })]
}));

children.push(new Paragraph({ children: [new PageBreak()] }));

// Chapters
chapters.forEach((chapter, idx) => {
  if (idx > 0) {
    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  children.push(new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 200, after: 300 },
    children: [new TextRun({ text: chapter.title, size: 28, bold: true })]
  }));

  chapter.questions.forEach((item, qIdx) => {
    children.push(new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({ text: `${qIdx + 1}. `, bold: true, size: 24 }),
        new TextRun({ text: item.q, bold: true, size: 24 })
      ]
    }));

    children.push(new Paragraph({
      spacing: { after: 200 },
      indent: { left: 360 },
      children: [new TextRun({ text: item.follow, size: 22, italics: true, color: "555555" })]
    }));
  });
});

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 56, bold: true, font: "Arial" },
        paragraph: { spacing: { after: 240 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: "1a5276", font: "Arial" },
        paragraph: { spacing: { before: 240, after: 120 } } }
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "Superagency Book Club | Eccalon", size: 18, color: "888888" })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "Page ", size: 18, color: "888888" }),
          new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "888888" }),
          new TextRun({ text: " of ", size: 18, color: "888888" }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: "888888" })
        ]
      })] })
    },
    children: children
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("Superagency-Discussion-Questions.docx", buffer);
  console.log("Document created: Superagency-Discussion-Questions.docx");
});
