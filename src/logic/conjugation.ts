import type { Verb } from "../data/verbs";

export type Person = 1 | 2 | 3;
export type Number = "sg" | "pl";
export type Voice = "active" | "passive";
export type Mood = "indicative" | "subjunctive" | "imperative" | "infinitive";
export type Tense =
  | "present"
  | "imperfect"
  | "future"
  | "perfect"
  | "pluperfect"
  | "futurePerfect";

interface StemInfo {
  presentStem: string;
  perfectStem: string;
  supineStem: string;
}

function getStemInfo(verb: Verb): StemInfo {
  const { infinitive, perfectActive, supine } = verb.principalParts;

  let presentStem = "";

  // Present stem: remove the infinitive ending
  if (verb.conjugation === 1) {
    presentStem = infinitive.slice(0, -3); // amāre -> amā
  } else if (verb.conjugation === 2) {
    presentStem = infinitive.slice(0, -3); // monēre -> monē
  } else if (verb.conjugation === 3) {
    presentStem = infinitive.slice(0, -3); // mittere -> mitt / capere -> cap
  } else if (verb.conjugation === 4) {
    presentStem = infinitive.slice(0, -3); // audīre -> audī
  }

  // Perfect stem
  const perfectStem = perfectActive.slice(0, -1); // Remove final ī/ū

  // Supine stem
  const supineStem = supine.slice(0, -2); // Remove -um ending

  return { presentStem, perfectStem, supineStem };
}

// Indicative present active endings
function getIndicativePresentActiveEnding(
  person: Person,
  number: Number,
  conjugation: number,
  isIoVerb: boolean
): string {
  if (conjugation === 1) {
    if (person === 1 && number === "sg") return "ō";
    if (person === 2 && number === "sg") return "ās";
    if (person === 3 && number === "sg") return "at";
    if (person === 1 && number === "pl") return "āmus";
    if (person === 2 && number === "pl") return "ātis";
    if (person === 3 && number === "pl") return "ant";
  } else if (conjugation === 2) {
    if (person === 1 && number === "sg") return "eō";
    if (person === 2 && number === "sg") return "ēs";
    if (person === 3 && number === "sg") return "et";
    if (person === 1 && number === "pl") return "ēmus";
    if (person === 2 && number === "pl") return "ētis";
    if (person === 3 && number === "pl") return "ent";
  } else if (conjugation === 3) {
    if (isIoVerb) {
      if (person === 1 && number === "sg") return "iō";
      if (person === 2 && number === "sg") return "is";
      if (person === 3 && number === "sg") return "it";
      if (person === 1 && number === "pl") return "imus";
      if (person === 2 && number === "pl") return "itis";
      if (person === 3 && number === "pl") return "iunt";
    } else {
      if (person === 1 && number === "sg") return "ō";
      if (person === 2 && number === "sg") return "is";
      if (person === 3 && number === "sg") return "it";
      if (person === 1 && number === "pl") return "imus";
      if (person === 2 && number === "pl") return "itis";
      if (person === 3 && number === "pl") return "unt";
    }
  } else if (conjugation === 4) {
    if (person === 1 && number === "sg") return "ō";
    if (person === 2 && number === "sg") return "īs";
    if (person === 3 && number === "sg") return "it";
    if (person === 1 && number === "pl") return "īmus";
    if (person === 2 && number === "pl") return "ītis";
    if (person === 3 && number === "pl") return "iunt";
  }
  return "";
}

// Indicative imperfect active endings
function getIndicativeImperfectActiveEnding(
  person: Person,
  number: Number
): string {
  if (person === 1 && number === "sg") return "bam";
  if (person === 2 && number === "sg") return "bās";
  if (person === 3 && number === "sg") return "bat";
  if (person === 1 && number === "pl") return "bāmus";
  if (person === 2 && number === "pl") return "bātis";
  if (person === 3 && number === "pl") return "bant";
  return "";
}

// Indicative future active endings (1st/2nd conjugation)
function getIndicativeFutureActiveEnding12(
  person: Person,
  number: Number
): string {
  if (person === 1 && number === "sg") return "bō";
  if (person === 2 && number === "sg") return "bis";
  if (person === 3 && number === "sg") return "bit";
  if (person === 1 && number === "pl") return "bimus";
  if (person === 2 && number === "pl") return "bitis";
  if (person === 3 && number === "pl") return "bunt";
  return "";
}

// Indicative future active endings (3rd/4th conjugation)
function getIndicativeFutureActiveEnding34(
  person: Person,
  number: Number
): string {
  if (person === 1 && number === "sg") return "am";
  if (person === 2 && number === "sg") return "ēs";
  if (person === 3 && number === "sg") return "et";
  if (person === 1 && number === "pl") return "ēmus";
  if (person === 2 && number === "pl") return "ētis";
  if (person === 3 && number === "pl") return "ent";
  return "";
}

export function conjugateIndicativeActive(
  verb: Verb,
  tense: Tense,
  person: Person,
  number: Number
): string {
  const stems = getStemInfo(verb);

  if (tense === "present") {
    const ending = getIndicativePresentActiveEnding(
      person,
      number,
      verb.conjugation,
      verb.isIoVerb
    );
    return stems.presentStem + ending;
  } else if (tense === "imperfect") {
    const ending = getIndicativeImperfectActiveEnding(person, number);
    return stems.presentStem + ending;
  } else if (tense === "future") {
    let ending: string;
    if (verb.conjugation === 1 || verb.conjugation === 2) {
      ending = getIndicativeFutureActiveEnding12(person, number);
    } else {
      ending = getIndicativeFutureActiveEnding34(person, number);
    }
    return stems.presentStem + ending;
  } else if (tense === "perfect") {
    if (person === 1 && number === "sg") return stems.perfectStem + "ī";
    if (person === 2 && number === "sg") return stems.perfectStem + "istī";
    if (person === 3 && number === "sg") return stems.perfectStem + "it";
    if (person === 1 && number === "pl") return stems.perfectStem + "imus";
    if (person === 2 && number === "pl") return stems.perfectStem + "istis";
    if (person === 3 && number === "pl") return stems.perfectStem + "ērunt";
  } else if (tense === "pluperfect") {
    if (person === 1 && number === "sg") return stems.perfectStem + "eram";
    if (person === 2 && number === "sg") return stems.perfectStem + "erās";
    if (person === 3 && number === "sg") return stems.perfectStem + "erat";
    if (person === 1 && number === "pl") return stems.perfectStem + "erāmus";
    if (person === 2 && number === "pl") return stems.perfectStem + "erātis";
    if (person === 3 && number === "pl") return stems.perfectStem + "erant";
  } else if (tense === "futurePerfect") {
    if (person === 1 && number === "sg") return stems.perfectStem + "erō";
    if (person === 2 && number === "sg") return stems.perfectStem + "eris";
    if (person === 3 && number === "sg") return stems.perfectStem + "erit";
    if (person === 1 && number === "pl") return stems.perfectStem + "erimus";
    if (person === 2 && number === "pl") return stems.perfectStem + "eritis";
    if (person === 3 && number === "pl") return stems.perfectStem + "erunt";
  }

  return "";
}

export function conjugateIndicativePassive(
  verb: Verb,
  tense: Tense,
  person: Person,
  number: Number
): string {
  const stems = getStemInfo(verb);

  if (tense === "present") {
    const ending = getIndicativePresentPassiveEnding(
      person,
      number,
      verb.conjugation,
      verb.isIoVerb
    );
    return stems.presentStem + ending;
  } else if (tense === "imperfect") {
    const ending = getIndicativeImperfectPassiveEnding(person, number);
    return stems.presentStem + ending;
  } else if (tense === "future") {
    const ending = getIndicativeFuturePassiveEnding(
      person,
      number,
      verb.conjugation
    );
    return stems.presentStem + ending;
  } else if (tense === "perfect") {
    // Perfect passive uses perfect participle + sum
    const participle = getParticiple(verb, "perfect", number);
    const sumForm = conjugateSum(person, number, tense);
    return participle + " " + sumForm;
  } else if (tense === "pluperfect") {
    const participle = getParticiple(verb, "perfect", number);
    const eramForm = conjugateSum(person, number, tense);
    return participle + " " + eramForm;
  } else if (tense === "futurePerfect") {
    const participle = getParticiple(verb, "perfect", number);
    const eroForm = conjugateSum(person, number, tense);
    return participle + " " + eroForm;
  }

  return "";
}

function getIndicativePresentPassiveEnding(
  person: Person,
  number: Number,
  conjugation: number,
  isIoVerb: boolean
): string {
  if (conjugation === 1) {
    if (person === 1 && number === "sg") return "or";
    if (person === 2 && number === "sg") return "āris";
    if (person === 3 && number === "sg") return "ātur";
    if (person === 1 && number === "pl") return "āmur";
    if (person === 2 && number === "pl") return "āminī";
    if (person === 3 && number === "pl") return "antur";
  } else if (conjugation === 2) {
    if (person === 1 && number === "sg") return "eor";
    if (person === 2 && number === "sg") return "ēris";
    if (person === 3 && number === "sg") return "ētur";
    if (person === 1 && number === "pl") return "ēmur";
    if (person === 2 && number === "pl") return "ēminī";
    if (person === 3 && number === "pl") return "entur";
  } else if (conjugation === 3) {
    if (isIoVerb) {
      if (person === 1 && number === "sg") return "ior";
      if (person === 2 && number === "sg") return "eris";
      if (person === 3 && number === "sg") return "itur";
      if (person === 1 && number === "pl") return "imur";
      if (person === 2 && number === "pl") return "iminī";
      if (person === 3 && number === "pl") return "iuntur";
    } else {
      if (person === 1 && number === "sg") return "or";
      if (person === 2 && number === "sg") return "eris";
      if (person === 3 && number === "sg") return "itur";
      if (person === 1 && number === "pl") return "imur";
      if (person === 2 && number === "pl") return "iminī";
      if (person === 3 && number === "pl") return "untur";
    }
  } else if (conjugation === 4) {
    if (person === 1 && number === "sg") return "or";
    if (person === 2 && number === "sg") return "īris";
    if (person === 3 && number === "sg") return "ītur";
    if (person === 1 && number === "pl") return "īmur";
    if (person === 2 && number === "pl") return "īminī";
    if (person === 3 && number === "pl") return "iuntur";
  }
  return "";
}

function getIndicativeImperfectPassiveEnding(
  person: Person,
  number: Number
): string {
  if (person === 1 && number === "sg") return "bar";
  if (person === 2 && number === "sg") return "bāris";
  if (person === 3 && number === "sg") return "bātur";
  if (person === 1 && number === "pl") return "bāmur";
  if (person === 2 && number === "pl") return "bāminī";
  if (person === 3 && number === "pl") return "bantur";
  return "";
}

function getIndicativeFuturePassiveEnding(
  person: Person,
  number: Number,
  conjugation: number
): string {
  if (conjugation === 1 || conjugation === 2) {
    if (person === 1 && number === "sg") return "bor";
    if (person === 2 && number === "sg") return "beris";
    if (person === 3 && number === "sg") return "bitur";
    if (person === 1 && number === "pl") return "bimur";
    if (person === 2 && number === "pl") return "biminī";
    if (person === 3 && number === "pl") return "buntur";
  } else {
    if (person === 1 && number === "sg") return "ar";
    if (person === 2 && number === "sg") return "ēris";
    if (person === 3 && number === "sg") return "ētur";
    if (person === 1 && number === "pl") return "ēmur";
    if (person === 2 && number === "pl") return "ēminī";
    if (person === 3 && number === "pl") return "entur";
  }
  return "";
}

export function conjugateSum(
  person: Person,
  number: Number,
  tense: Tense
): string {
  if (tense === "perfect") {
    if (person === 1 && number === "sg") return "fuī";
    if (person === 2 && number === "sg") return "fuistī";
    if (person === 3 && number === "sg") return "fuit";
    if (person === 1 && number === "pl") return "fuimus";
    if (person === 2 && number === "pl") return "fuistis";
    if (person === 3 && number === "pl") return "fuērunt";
  } else if (tense === "pluperfect") {
    if (person === 1 && number === "sg") return "fueram";
    if (person === 2 && number === "sg") return "fuerās";
    if (person === 3 && number === "sg") return "fuerat";
    if (person === 1 && number === "pl") return "fuerāmus";
    if (person === 2 && number === "pl") return "fuerātis";
    if (person === 3 && number === "pl") return "fuerant";
  } else if (tense === "futurePerfect") {
    if (person === 1 && number === "sg") return "fuerō";
    if (person === 2 && number === "sg") return "fueris";
    if (person === 3 && number === "sg") return "fuerit";
    if (person === 1 && number === "pl") return "fuerimus";
    if (person === 2 && number === "pl") return "fueritis";
    if (person === 3 && number === "pl") return "fuerint";
  }
  return "";
}

export function getParticiple(
  verb: Verb,
  type: "present" | "perfect" | "future",
  number: Number
): string {
  const stems = getStemInfo(verb);

  if (type === "present") {
    // Present participle active
    if (verb.conjugation === 1) {
      return stems.presentStem + (number === "sg" ? "āns" : "antēs");
    } else if (verb.conjugation === 2) {
      return stems.presentStem + (number === "sg" ? "ēns" : "entēs");
    } else {
      return stems.presentStem + (number === "sg" ? "ēns" : "entēs");
    }
  } else if (type === "perfect") {
    // Perfect participle (passive)
    // This uses supine stem with gender/number agreement
    if (number === "sg") {
      return stems.supineStem + "us";
    } else {
      return stems.supineStem + "ī";
    }
  } else if (type === "future") {
    // Future participle active (using -urus)
    if (number === "sg") {
      return stems.supineStem + "ūrus";
    } else {
      return stems.supineStem + "ūrī";
    }
  }

  return "";
}

export function conjugateSubjunctiveActive(
  verb: Verb,
  tense: Tense,
  person: Person,
  number: Number
): string {
  const stems = getStemInfo(verb);

  if (tense === "present") {
    // Present subjunctive active - theme vowel + ending
    if (verb.conjugation === 1) {
      const theme = "e";
      if (person === 1 && number === "sg") return stems.presentStem + theme + "m";
      if (person === 2 && number === "sg") return stems.presentStem + theme + "s";
      if (person === 3 && number === "sg") return stems.presentStem + theme + "t";
      if (person === 1 && number === "pl") return stems.presentStem + theme + "mus";
      if (person === 2 && number === "pl") return stems.presentStem + theme + "tis";
      if (person === 3 && number === "pl") return stems.presentStem + theme + "nt";
    } else if (verb.conjugation === 2) {
      const theme = "e";
      if (person === 1 && number === "sg") return stems.presentStem + theme + "m";
      if (person === 2 && number === "sg") return stems.presentStem + theme + "s";
      if (person === 3 && number === "sg") return stems.presentStem + theme + "t";
      if (person === 1 && number === "pl") return stems.presentStem + theme + "mus";
      if (person === 2 && number === "pl") return stems.presentStem + theme + "tis";
      if (person === 3 && number === "pl") return stems.presentStem + theme + "nt";
    } else if (verb.conjugation === 3) {
      const theme = "a";
      if (person === 1 && number === "sg") return stems.presentStem + theme + "m";
      if (person === 2 && number === "sg") return stems.presentStem + theme + "s";
      if (person === 3 && number === "sg") return stems.presentStem + theme + "t";
      if (person === 1 && number === "pl") return stems.presentStem + theme + "mus";
      if (person === 2 && number === "pl") return stems.presentStem + theme + "tis";
      if (person === 3 && number === "pl") return stems.presentStem + theme + "nt";
    } else if (verb.conjugation === 4) {
      const theme = "i";
      if (person === 1 && number === "sg") return stems.presentStem + theme + "m";
      if (person === 2 && number === "sg") return stems.presentStem + theme + "s";
      if (person === 3 && number === "sg") return stems.presentStem + theme + "t";
      if (person === 1 && number === "pl") return stems.presentStem + theme + "mus";
      if (person === 2 && number === "pl") return stems.presentStem + theme + "tis";
      if (person === 3 && number === "pl") return stems.presentStem + theme + "nt";
    }
  } else if (tense === "imperfect") {
    const infStem = verb.principalParts.infinitive; // e.g., "amāre"
    if (person === 1 && number === "sg") return infStem + "m";
    if (person === 2 && number === "sg") return infStem + "s";
    if (person === 3 && number === "sg") return infStem + "t";
    if (person === 1 && number === "pl") return infStem + "mus";
    if (person === 2 && number === "pl") return infStem + "tis";
    if (person === 3 && number === "pl") return infStem + "nt";
  } else if (tense === "perfect") {
    if (person === 1 && number === "sg") return stems.perfectStem + "erim";
    if (person === 2 && number === "sg") return stems.perfectStem + "eris";
    if (person === 3 && number === "sg") return stems. perfectStem + "erit";
    if (person === 1 && number === "pl") return stems.perfectStem + "erimus";
    if (person === 2 && number === "pl") return stems.perfectStem + "eritis";
    if (person === 3 && number === "pl") return stems.perfectStem + "erint";
  } else if (tense === "pluperfect") {
    if (person === 1 && number === "sg") return stems.perfectStem + "issem";
    if (person === 2 && number === "sg") return stems.perfectStem + "issēs";
    if (person === 3 && number === "sg") return stems.perfectStem + "isset";
    if (person === 1 && number === "pl") return stems.perfectStem + "issēmus";
    if (person === 2 && number === "pl") return stems.perfectStem + "issētis";
    if (person === 3 && number === "pl") return stems.perfectStem + "issent";
  }

  return "";
}

export function conjugateSubjunctivePassive(
  verb: Verb,
  tense: Tense,
  person: Person,
  number: Number
): string {
  // Passive subjunctive follows similar patterns but with passive endings
  // For simplicity in this tool, we'll use participle + sum forms
  if (tense === "perfect") {
    const participle = getParticiple(verb, "perfect", number);
    const subjForm = conjugateSubjunctiveSum(person, number, tense);
    return participle + " " + subjForm;
  } else if (tense === "pluperfect") {
    const participle = getParticiple(verb, "perfect", number);
    const subjForm = conjugateSubjunctiveSum(person, number, tense);
    return participle + " " + subjForm;
  } else {
    // Present and imperfect subjunctive passive use participle theme
    if (tense === "present") {
      const stems = getStemInfo(verb);
      if (verb.conjugation === 1) {
        const theme = "e";
        if (person === 1 && number === "sg") return stems.presentStem + theme + "r";
        if (person === 2 && number === "sg") return stems.presentStem + theme + "ris";
        if (person === 3 && number === "sg") return stems.presentStem + theme + "tur";
        if (person === 1 && number === "pl") return stems.presentStem + theme + "mur";
        if (person === 2 && number === "pl") return stems.presentStem + theme + "minī";
        if (person === 3 && number === "pl") return stems.presentStem + theme + "ntur";
      }
    } else if (tense === "imperfect") {
      const infStem = verb.principalParts.infinitive;
      if (person === 1 && number === "sg") return infStem + "r";
      if (person === 2 && number === "sg") return infStem + "ris";
      if (person === 3 && number === "sg") return infStem + "tur";
      if (person === 1 && number === "pl") return infStem + "mur";
      if (person === 2 && number === "pl") return infStem + "minī";
      if (person === 3 && number === "pl") return infStem + "ntur";
    }
  }

  return "";
}

function conjugateSubjunctiveSum(
  person: Person,
  number: Number,
  tense: Tense
): string {
  if (tense === "perfect") {
    if (person === 1 && number === "sg") return "fuerim";
    if (person === 2 && number === "sg") return "fueris";
    if (person === 3 && number === "sg") return "fuerit";
    if (person === 1 && number === "pl") return "fuerimus";
    if (person === 2 && number === "pl") return "fueritis";
    if (person === 3 && number === "pl") return "fuerint";
  } else if (tense === "pluperfect") {
    if (person === 1 && number === "sg") return "fuissem";
    if (person === 2 && number === "sg") return "fuissēs";
    if (person === 3 && number === "sg") return "fuisset";
    if (person === 1 && number === "pl") return "fuissēmus";
    if (person === 2 && number === "pl") return "fuissētis";
    if (person === 3 && number === "pl") return "fuissent";
  }
  return "";
}

export function getInfinitive(
  verb: Verb,
  tense: "present" | "perfect" | "future",
  voice: Voice
): string {
  const stems = getStemInfo(verb);

  if (tense === "present") {
    if (voice === "active") {
      return verb.principalParts.infinitive;
    } else {
      // Present passive infinitive
      if (verb.conjugation === 1) {
        return stems.presentStem + "ārī";
      } else if (verb.conjugation === 2) {
        return stems.presentStem + "ērī";
      } else if (verb.conjugation === 3) {
        return stems.presentStem + "ī";
      } else if (verb.conjugation === 4) {
        return stems.presentStem + "īrī";
      }
    }
  } else if (tense === "perfect") {
    if (voice === "active") {
      return stems.perfectStem + "isse";
    } else {
      // Perfect passive infinitive: participle + esse
      return stems.supineStem + "um esse";
    }
  } else if (tense === "future") {
    if (voice === "active") {
      // Future active infinitive: future participle + esse
      return stems.supineStem + "ūrum esse";
    } else {
      // Future passive infinitive (rare)
      return stems.supineStem + "um īrī";
    }
  }

  return "";
}

export function getImperative(
  verb: Verb,
  number: Number,
  voice: Voice
): string {
  const stems = getStemInfo(verb);

  if (voice === "active") {
    if (number === "sg") {
      if (verb.conjugation === 1) {
        return stems.presentStem + "ā";
      } else if (verb.conjugation === 2) {
        return stems.presentStem + "ē";
      } else if (verb.conjugation === 3) {
        return stems.presentStem;
      } else if (verb.conjugation === 4) {
        return stems.presentStem + "ī";
      }
    } else {
      if (verb.conjugation === 1) {
        return stems.presentStem + "āte";
      } else if (verb.conjugation === 2) {
        return stems.presentStem + "ēte";
      } else if (verb.conjugation === 3) {
        return stems.presentStem + "ite";
      } else if (verb.conjugation === 4) {
        return stems.presentStem + "īte";
      }
    }
  } else {
    // Passive imperative
    if (number === "sg") {
      if (verb.conjugation === 1) {
        return stems.presentStem + "āre";
      } else if (verb.conjugation === 2) {
        return stems.presentStem + "ēre";
      } else if (verb.conjugation === 3) {
        return stems.presentStem + "ere";
      } else if (verb.conjugation === 4) {
        return stems.presentStem + "īre";
      }
    } else {
      if (verb.conjugation === 1) {
        return stems.presentStem + "āminī";
      } else if (verb.conjugation === 2) {
        return stems.presentStem + "ēminī";
      } else if (verb.conjugation === 3) {
        return stems.presentStem + "iminī";
      } else if (verb.conjugation === 4) {
        return stems.presentStem + "īminī";
      }
    }
  }

  return "";
}

// Helper function to normalize user input (remove macrons for comparison)
export function normalizeLatin(text: string): string {
  const macronMap: { [key: string]: string } = {
    ā: "a",
    ē: "e",
    ī: "i",
    ō: "o",
    ū: "u",
    ȳ: "y",
    Ā: "A",
    Ē: "E",
    Ī: "I",
    Ō: "O",
    Ū: "U",
    Ȳ: "Y",
  };

  return text.replace(/./g, (char) => macronMap[char] || char);
}

export function validateAnswer(correct: string, userInput: string): boolean {
  // Strict comparison: macrons are significant. Compare lowercased, trimmed strings without
  // removing macrons so missing macrons are treated as incorrect.
  return correct.trim().toLowerCase() === userInput.trim().toLowerCase();
}
