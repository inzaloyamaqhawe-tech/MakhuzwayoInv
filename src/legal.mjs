import { article, link } from './ui.mjs';

export const legalPages = [
  {
    url: '/privacy/', title: 'Privacy Policy', description: 'Draft information on how website visits and future enquiries may involve personal information.',
    content: article('Visiting this website', '<p>This phase contains static public pages and local form previews. The previews do not send entries, create accounts, set tracking cookies or save details in website storage. Hosting may generate access and security logs, for example request time and IP address. The final policy will identify applicable hosting practices and retention.</p>') +
      article('Future enquiry information', '<p>When services open, information may include contact details, project or investor interest summaries, account details where applicable and correspondence. Intended purposes include enquiry assessment, follow-up, service administration and compliance. Sharing would be limited to appropriate authorised recipients and lawful purposes under an approved policy.</p>') +
      article('Retention, choices and rights', '<p>Retention periods, contact preferences, applicable lawful processing grounds, relevant service providers and the privacy contact will be confirmed before data intake begins. POPIA provides qualified rights relating to access, correction, deletion and objection. The Information Regulator publishes relevant request and complaint forms.</p>' +
      '<p>' + link('https://inforegulator.org.za/popia-forms/', 'Information Regulator POPIA forms') + '</p>') +
      '<article class="article" id="cookies"><h2>Cookie Information</h2><p>This frontend sets no cookies and runs no analytics. Future account sessions or optional analytics would be covered by updated information and applicable preference controls before activation.</p></article>',
  },
  {
    url: '/terms/', title: 'Terms of Use', description: 'Draft website use and responsible participation information.',
    content: article('Purpose of this website', '<p>The public pages explain the organisation’s proposed approach to innovation development and collaboration. Information is general. Project illustrations and sample form workflows are provided for preparation.</p>') +
      article('Responsible use', '<p>Use the website lawfully and respect other people’s information and rights. Use fictional details in previews. Future circumstances may require separate eligibility rules and written agreements.</p>') +
      article('Investment and due diligence', '<p>Any future project-specific opportunity would require due diligence, consideration of conflicts of interest, and agreement on responsibilities and risk. The site currently provides general information and accepts no funds. Applicable South African financial-services and other regulatory requirements must be reviewed before such features open.</p>'),
  },
  {
    url: '/idea-submission-terms/', title: 'Idea Submission Terms', description: 'Draft conditions for future non-confidential idea enquiries and project review.',
    content: article('Preparing a summary', '<p>Provide accurate information you are entitled to share. Keep proprietary code, trade secrets, patentable details and third-party personal information out of an initial summary. The form is a preview and live submission is closed.</p>') +
      article('Review and possible next steps', '<p>Future enquiries may be screened for relevance and feasibility. A submission does not guarantee acceptance, funding, technical support or commercial success. The final process will explain permitted review and any published eligibility requirements.</p>') +
      article('Confidentiality and attribution', '<p>A summary does not establish a confidentiality agreement or automatically transfer ownership. Specific confidentiality, recognition, ownership and commercial terms can be discussed and documented separately.</p><p>' + link('/intellectual-property/', 'Read the Intellectual Property Guide') + '</p>'),
  },
  {
    url: '/intellectual-property/', title: 'Intellectual Property', description: 'Prepare a non-confidential idea summary and understand the proposed approach to recognition and ownership.',
    content: article('Share only what is needed', '<p>Describe the problem, intended users and broad approach. Keep patentable mechanisms, unpublished designs and trade secrets private. Consider obtaining independent professional advice before disclosure where protection may matter.</p>') +
      article('Recognising contributions', '<p>Makhuzwayo Investors aims to recognise original innovators and distinguish their contributions from those of advisers, collaborators and later development partners. Public recognition and any future showcase would require appropriate permission and a lawful basis.</p>') +
      article('Agree ownership and confidentiality in writing', '<p>Before substantial development, discuss existing intellectual property, new outputs, ownership, licences, confidentiality, milestones and responsibilities. Document the terms for the specific project. Registration, patent protection, ownership outcomes and commercial terms depend on the facts and applicable law.</p>'),
  },
];
