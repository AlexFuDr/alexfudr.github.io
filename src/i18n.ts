export type Locale = "nl" | "en";

export const ui = {
  nl: {
    brand: "Acupunctuur helder uitgelegd",
    navEducation: "Educatie",
    navAbout: "Over mij",
    consultation: "Consultatie",
    languageLabel: "Taal",
    footerNote: "Onafhankelijke educatie over acupunctuur en wetenschappelijk bewijs.",
  },
  en: {
    brand: "Acupuncture, clearly explained",
    navEducation: "Education",
    navAbout: "About me",
    consultation: "Consultation",
    languageLabel: "Language",
    footerNote: "Independent education about acupuncture and scientific evidence.",
  },
} as const;

export const localizedPaths = {
  home: { nl: "/nl/", en: "/en/" },
  articles: { nl: "/nl/artikelen/", en: "/en/articles/" },
  about: { nl: "/nl/over-mij/", en: "/en/about/" },
} as const;
