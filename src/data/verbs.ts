export interface Verb {
  lemma: string;
  conjugation: 1 | 2 | 3 | 4;
  isIoVerb: boolean; // for 3rd -io verbs
  principalParts: {
    presentActive: string; // 1st person singular
    infinitive: string;
    perfectActive: string; // 1st person singular
    supine: string;
  };
  englishMeaning: string;
}

export const VERBS: Verb[] = [
  {
    lemma: "amō",
    conjugation: 1,
    isIoVerb: false,
    principalParts: {
      presentActive: "amō",
      infinitive: "amāre",
      perfectActive: "amāvī",
      supine: "amātus",
    },
    englishMeaning: "to love",
  },
  {
    lemma: "moneō",
    conjugation: 2,
    isIoVerb: false,
    principalParts: {
      presentActive: "moneō",
      infinitive: "monēre",
      perfectActive: "monuī",
      supine: "monitus",
    },
    englishMeaning: "to warn",
  },
  {
    lemma: "mittō",
    conjugation: 3,
    isIoVerb: false,
    principalParts: {
      presentActive: "mittō",
      infinitive: "mittere",
      perfectActive: "mīsī",
      supine: "missus",
    },
    englishMeaning: "to send",
  },
  {
    lemma: "capiō",
    conjugation: 3,
    isIoVerb: true,
    principalParts: {
      presentActive: "capiō",
      infinitive: "capere",
      perfectActive: "cēpī",
      supine: "captus",
    },
    englishMeaning: "to take",
  },
  {
    lemma: "audiō",
    conjugation: 4,
    isIoVerb: false,
    principalParts: {
      presentActive: "audiō",
      infinitive: "audīre",
      perfectActive: "audīvī",
      supine: "audītus",
    },
    englishMeaning: "to hear",
  },
  {
    lemma: "ferō",
    conjugation: 3,
    isIoVerb: false,
    principalParts: {
      presentActive: "ferō",
      infinitive: "ferre",
      perfectActive: "tulī",
      supine: "lātus",
    },
    englishMeaning: "to carry",
  },
  {
    lemma: "ducō",
    conjugation: 3,
    isIoVerb: false,
    principalParts: {
      presentActive: "dūcō",
      infinitive: "dūcere",
      perfectActive: "dūxī",
      supine: "ductus",
    },
    englishMeaning: "to lead",
  },
  {
    lemma: "faciō",
    conjugation: 3,
    isIoVerb: true,
    principalParts: {
      presentActive: "faciō",
      infinitive: "facere",
      perfectActive: "fēcī",
      supine: "factus",
    },
    englishMeaning: "to make",
  },
];

export function getRandomVerb(): Verb {
  return VERBS[Math.floor(Math.random() * VERBS.length)];
}
