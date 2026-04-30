import React, { useState, useCallback, useMemo } from "react";
import { getRandomVerb } from "./data/verbs";
import type { Verb } from "./data/verbs";
import {
  conjugateIndicativeActive,
  conjugateIndicativePassive,
  conjugateSubjunctiveActive,
  conjugateSubjunctivePassive,
  getInfinitive,
  getImperative,
  getParticiple,
  validateAnswer,
} from "./logic/conjugation";
import type { Person, Number, Voice } from "./logic/conjugation";
import { InputCell } from "./components/InputCell";
import "./App.css";

interface CellState {
  value: string;
  revealed: boolean;
}

interface AnswerState {
  [key: string]: CellState;
}

const App: React.FC = () => {
  const [currentVerb, setCurrentVerb] = useState<Verb>(getRandomVerb());
  const [userName, setUserName] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<Person>(3);
  const [selectedNumber, setSelectedNumber] = useState<Number>("sg");
  const [answers, setAnswers] = useState<AnswerState>({});

  const handleRandomVerb = useCallback(() => {
    setCurrentVerb(getRandomVerb());
    setAnswers({});
  }, []);

  const getCorrectAnswer = useCallback(
    (section: string, type: string, voice: Voice): string => {
      switch (section) {
        case "infinitive": {
          const tense = type.split("-")[0] as "present" | "perfect" | "future";
          return getInfinitive(currentVerb, tense, voice);
        }
        case "imperative": {
          return getImperative(
            currentVerb,
            voice === "active" ? selectedNumber : selectedNumber,
            voice
          );
        }
        case "participle": {
          const participleType = type.split("-")[0] as
            | "present"
            | "perfect"
            | "future";
          return getParticiple(currentVerb, participleType, selectedNumber);
        }
        case "indicative": {
          const tense = type.split("-")[0] as
            | "present"
            | "imperfect"
            | "future"
            | "perfect"
            | "pluperfect"
            | "futurePerfect";
          if (voice === "active") {
            return conjugateIndicativeActive(
              currentVerb,
              tense,
              selectedPerson,
              selectedNumber
            );
          } else {
            return conjugateIndicativePassive(
              currentVerb,
              tense,
              selectedPerson,
              selectedNumber
            );
          }
        }
        case "subjunctive": {
          const tense = type.split("-")[0] as
            | "present"
            | "imperfect"
            | "perfect"
            | "pluperfect";
          if (voice === "active") {
            return conjugateSubjunctiveActive(
              currentVerb,
              tense,
              selectedPerson,
              selectedNumber
            );
          } else {
            return conjugateSubjunctivePassive(
              currentVerb,
              tense,
              selectedPerson,
              selectedNumber
            );
          }
        }
        default:
          return "";
      }
    },
    [currentVerb, selectedPerson, selectedNumber]
  );

  const cellKey = (section: string, type: string, voice: Voice) =>
    `${section}-${type}-${voice}`;

  const handleCellChange = (
    section: string,
    type: string,
    voice: Voice,
    value: string
  ) => {
    const key = cellKey(section, type, voice);
    setAnswers((prev) => ({
      ...prev,
      [key]: {
        value,
        revealed: prev[key]?.revealed || false,
      },
    }));
  };

  const handleCellReveal = (section: string, type: string, voice: Voice) => {
    const key = cellKey(section, type, voice);
    setAnswers((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        revealed: true,
      },
    }));
  };

  const getCellState = (section: string, type: string, voice: Voice) => {
    const key = cellKey(section, type, voice);
    return answers[key] || { value: "", revealed: false };
  };

  const isCellCorrect = (section: string, type: string, voice: Voice) => {
    const key = cellKey(section, type, voice);
    const state = answers[key];
    if (!state || !state.value) return false;
    const correctAnswer = getCorrectAnswer(section, type, voice);
    return validateAnswer(correctAnswer, state.value);
  };

  const progressStats = useMemo(() => {
    let correct = 0;
    let total = 0;

    if (answers) {
      Object.keys(answers).forEach((key) => {
        const [section, type, voice] = key.split("-");
        if (answers[key].value) {
          total++;
          if (isCellCorrect(section, type, voice as Voice)) {
            correct++;
          }
        }
      });
    }

    return { correct, total };
  }, [answers, isCellCorrect]);

  const handleReset = () => {
    setAnswers({});
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Latin Verb Synopsis Practice</h1>

        <div className="header-section">
          <div className="input-group">
            <label>Nomen tibi:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="dropdown-group">
            <label>Persona:</label>
            <select
              value={selectedPerson}
              onChange={(e) => setSelectedPerson(parseInt(e.target.value) as Person)}
            >
              <option value={1}>1st</option>
              <option value={2}>2nd</option>
              <option value={3}>3rd</option>
            </select>
          </div>

          <div className="dropdown-group">
            <label>Numerus:</label>
            <select
              value={selectedNumber}
              onChange={(e) => setSelectedNumber(e.target.value as Number)}
            >
              <option value="sg">Singular</option>
              <option value="pl">Plural</option>
            </select>
          </div>
        </div>

        <div className="verb-section">
          <div className="partes-principales">
            <h3>Partes Principalēs</h3>
            <div className="parts-display">
              <div>
                <strong>{currentVerb.principalParts.presentActive}</strong>
                <small>Present Active</small>
              </div>
              <div>
                <strong>{currentVerb.principalParts.infinitive}</strong>
                <small>Infinitive</small>
              </div>
              <div>
                <strong>{currentVerb.principalParts.perfectActive}</strong>
                <small>Perfect Active</small>
              </div>
              <div>
                <strong>{currentVerb.principalParts.supine}</strong>
                <small>Supine</small>
              </div>
            </div>
            <p className="meaning">{currentVerb.englishMeaning}</p>
          </div>

          <div className="verb-controls">
            <button className="btn-random" onClick={handleRandomVerb}>
              🎲 Random Verb
            </button>
            <button className="btn-reset" onClick={handleReset}>
              🔄 Reset Answers
            </button>
          </div>
        </div>

        <div className="progress">
          <span>{progressStats.correct}/{progressStats.total} correct</span>
        </div>
      </header>

      <main className="synopsis-table">
        {/* ==================== MODUS INFINITIVUS ==================== */}
        <section className="table-section">
          <h2>Modus Infinitivus</h2>
          <div className="section-table">
            <div className="row">
              <div className="label-cell">
                <strong>Present</strong>
                <small>Present Infinitive</small>
              </div>
              <InputCell
                value={getCellState("infinitive", "present-active", "active").value}
                correctAnswer={getCorrectAnswer("infinitive", "present-active", "active")}
                isCorrect={isCellCorrect("infinitive", "present-active", "active")}
                isRevealed={getCellState("infinitive", "present-active", "active").revealed}
                onChange={(v) => handleCellChange("infinitive", "present-active", "active", v)}
                onReveal={() => handleCellReveal("infinitive", "present-active", "active")}
                disabled={getCellState("infinitive", "present-active", "active").revealed}
              />
              <InputCell
                value={getCellState("infinitive", "present-passive", "passive").value}
                correctAnswer={getCorrectAnswer("infinitive", "present-passive", "passive")}
                isCorrect={isCellCorrect("infinitive", "present-passive", "passive")}
                isRevealed={getCellState("infinitive", "present-passive", "passive").revealed}
                onChange={(v) => handleCellChange("infinitive", "present-passive", "passive", v)}
                onReveal={() => handleCellReveal("infinitive", "present-passive", "passive")}
                disabled={getCellState("infinitive", "present-passive", "passive").revealed}
              />
            </div>
            <div className="row">
              <div className="label-cell">
                <strong>Perfect</strong>
                <small>Perfect Infinitive</small>
              </div>
              <InputCell
                value={getCellState("infinitive", "perfect-active", "active").value}
                correctAnswer={getCorrectAnswer("infinitive", "perfect-active", "active")}
                isCorrect={isCellCorrect("infinitive", "perfect-active", "active")}
                isRevealed={getCellState("infinitive", "perfect-active", "active").revealed}
                onChange={(v) => handleCellChange("infinitive", "perfect-active", "active", v)}
                onReveal={() => handleCellReveal("infinitive", "perfect-active", "active")}
                disabled={getCellState("infinitive", "perfect-active", "active").revealed}
              />
              <InputCell
                value={getCellState("infinitive", "perfect-passive", "passive").value}
                correctAnswer={getCorrectAnswer("infinitive", "perfect-passive", "passive")}
                isCorrect={isCellCorrect("infinitive", "perfect-passive", "passive")}
                isRevealed={getCellState("infinitive", "perfect-passive", "passive").revealed}
                onChange={(v) => handleCellChange("infinitive", "perfect-passive", "passive", v)}
                onReveal={() => handleCellReveal("infinitive", "perfect-passive", "passive")}
                disabled={getCellState("infinitive", "perfect-passive", "passive").revealed}
              />
            </div>
            <div className="row">
              <div className="label-cell">
                <strong>Future</strong>
                <small>Future Infinitive</small>
              </div>
              <InputCell
                value={getCellState("infinitive", "future-active", "active").value}
                correctAnswer={getCorrectAnswer("infinitive", "future-active", "active")}
                isCorrect={isCellCorrect("infinitive", "future-active", "active")}
                isRevealed={getCellState("infinitive", "future-active", "active").revealed}
                onChange={(v) => handleCellChange("infinitive", "future-active", "active", v)}
                onReveal={() => handleCellReveal("infinitive", "future-active", "active")}
                disabled={getCellState("infinitive", "future-active", "active").revealed}
              />
              <InputCell
                value={getCellState("infinitive", "future-passive", "passive").value}
                correctAnswer={getCorrectAnswer("infinitive", "future-passive", "passive")}
                isCorrect={isCellCorrect("infinitive", "future-passive", "passive")}
                isRevealed={getCellState("infinitive", "future-passive", "passive").revealed}
                onChange={(v) => handleCellChange("infinitive", "future-passive", "passive", v)}
                onReveal={() => handleCellReveal("infinitive", "future-passive", "passive")}
                disabled={getCellState("infinitive", "future-passive", "passive").revealed}
              />
            </div>
          </div>
        </section>

        {/* ==================== MODUS IMPERATIVUS ==================== */}
        <section className="table-section">
          <h2>Modus Imperativus (Prāesēns)</h2>
          <div className="section-table">
            <div className="row">
              <div className="label-cell">
                <strong>Singular</strong>
                <small>Singular Imperative</small>
              </div>
              <InputCell
                value={getCellState("imperative", "sg-active", "active").value}
                correctAnswer={getCorrectAnswer("imperative", "sg-active", "active")}
                isCorrect={isCellCorrect("imperative", "sg-active", "active")}
                isRevealed={getCellState("imperative", "sg-active", "active").revealed}
                onChange={(v) => handleCellChange("imperative", "sg-active", "active", v)}
                onReveal={() => handleCellReveal("imperative", "sg-active", "active")}
                disabled={getCellState("imperative", "sg-active", "active").revealed}
              />
              <InputCell
                value={getCellState("imperative", "sg-passive", "passive").value}
                correctAnswer={getCorrectAnswer("imperative", "sg-passive", "passive")}
                isCorrect={isCellCorrect("imperative", "sg-passive", "passive")}
                isRevealed={getCellState("imperative", "sg-passive", "passive").revealed}
                onChange={(v) => handleCellChange("imperative", "sg-passive", "passive", v)}
                onReveal={() => handleCellReveal("imperative", "sg-passive", "passive")}
                disabled={getCellState("imperative", "sg-passive", "passive").revealed}
              />
            </div>
            <div className="row">
              <div className="label-cell">
                <strong>Plural</strong>
                <small>Plural Imperative</small>
              </div>
              <InputCell
                value={getCellState("imperative", "pl-active", "active").value}
                correctAnswer={getCorrectAnswer("imperative", "pl-active", "active")}
                isCorrect={isCellCorrect("imperative", "pl-active", "active")}
                isRevealed={getCellState("imperative", "pl-active", "active").revealed}
                onChange={(v) => handleCellChange("imperative", "pl-active", "active", v)}
                onReveal={() => handleCellReveal("imperative", "pl-active", "active")}
                disabled={getCellState("imperative", "pl-active", "active").revealed}
              />
              <InputCell
                value={getCellState("imperative", "pl-passive", "passive").value}
                correctAnswer={getCorrectAnswer("imperative", "pl-passive", "passive")}
                isCorrect={isCellCorrect("imperative", "pl-passive", "passive")}
                isRevealed={getCellState("imperative", "pl-passive", "passive").revealed}
                onChange={(v) => handleCellChange("imperative", "pl-passive", "passive", v)}
                onReveal={() => handleCellReveal("imperative", "pl-passive", "passive")}
                disabled={getCellState("imperative", "pl-passive", "passive").revealed}
              />
            </div>
          </div>
        </section>

        {/* ==================== PARTICIPIA ==================== */}
        <section className="table-section">
          <h2>Participia</h2>
          <div className="section-table">
            <div className="row">
              <div className="label-cell">
                <strong>Present</strong>
                <small>Present Participle</small>
              </div>
              <InputCell
                value={getCellState("participle", "present-active", "active").value}
                correctAnswer={getCorrectAnswer("participle", "present-active", "active")}
                isCorrect={isCellCorrect("participle", "present-active", "active")}
                isRevealed={getCellState("participle", "present-active", "active").revealed}
                onChange={(v) => handleCellChange("participle", "present-active", "active", v)}
                onReveal={() => handleCellReveal("participle", "present-active", "active")}
                disabled={getCellState("participle", "present-active", "active").revealed}
              />
              <div className="cell-placeholder">—</div>
            </div>
            <div className="row">
              <div className="label-cell">
                <strong>Perfect</strong>
                <small>Perfect Participle</small>
              </div>
              <div className="cell-placeholder">—</div>
              <InputCell
                value={getCellState("participle", "perfect-passive", "passive").value}
                correctAnswer={getCorrectAnswer("participle", "perfect-passive", "passive")}
                isCorrect={isCellCorrect("participle", "perfect-passive", "passive")}
                isRevealed={getCellState("participle", "perfect-passive", "passive").revealed}
                onChange={(v) => handleCellChange("participle", "perfect-passive", "passive", v)}
                onReveal={() => handleCellReveal("participle", "perfect-passive", "passive")}
                disabled={getCellState("participle", "perfect-passive", "passive").revealed}
              />
            </div>
            <div className="row">
              <div className="label-cell">
                <strong>Future</strong>
                <small>Future Participle</small>
              </div>
              <InputCell
                value={getCellState("participle", "future-active", "active").value}
                correctAnswer={getCorrectAnswer("participle", "future-active", "active")}
                isCorrect={isCellCorrect("participle", "future-active", "active")}
                isRevealed={getCellState("participle", "future-active", "active").revealed}
                onChange={(v) => handleCellChange("participle", "future-active", "active", v)}
                onReveal={() => handleCellReveal("participle", "future-active", "active")}
                disabled={getCellState("participle", "future-active", "active").revealed}
              />
              <div className="cell-placeholder">—</div>
            </div>
          </div>
        </section>

        {/* ==================== MODUS INDICATIVUS ==================== */}
        <section className="table-section">
          <h2>Modus Indicativus</h2>
          {(["present", "imperfect", "future", "perfect", "pluperfect", "futurePerfect"] as const).map(
            (tense) => (
              <div key={tense} className="tense-subsection">
                <h3>{formatTenseName(tense)}</h3>
                <div className="row">
                  <div className="label-cell">
                    <small>{formatTenseName(tense)}</small>
                  </div>
                  <InputCell
                    value={getCellState("indicative", tense + "-active", "active").value}
                    correctAnswer={getCorrectAnswer("indicative", tense + "-active", "active")}
                    isCorrect={isCellCorrect("indicative", tense + "-active", "active")}
                    isRevealed={getCellState("indicative", tense + "-active", "active").revealed}
                    onChange={(v) => handleCellChange("indicative", tense + "-active", "active", v)}
                    onReveal={() => handleCellReveal("indicative", tense + "-active", "active")}
                    disabled={getCellState("indicative", tense + "-active", "active").revealed}
                  />
                  <InputCell
                    value={getCellState("indicative", tense + "-passive", "passive").value}
                    correctAnswer={getCorrectAnswer("indicative", tense + "-passive", "passive")}
                    isCorrect={isCellCorrect("indicative", tense + "-passive", "passive")}
                    isRevealed={getCellState("indicative", tense + "-passive", "passive").revealed}
                    onChange={(v) => handleCellChange("indicative", tense + "-passive", "passive", v)}
                    onReveal={() => handleCellReveal("indicative", tense + "-passive", "passive")}
                    disabled={getCellState("indicative", tense + "-passive", "passive").revealed}
                  />
                </div>
              </div>
            )
          )}
        </section>

        {/* ==================== MODUS CONIUNCTIVUS ==================== */}
        <section className="table-section">
          <h2>Modus Coniunctivus</h2>
          {(["present", "imperfect", "perfect", "pluperfect"] as const).map(
            (tense) => (
              <div key={tense} className="tense-subsection">
                <h3>Subjunctive {formatTenseName(tense)}</h3>
                <div className="row">
                  <div className="label-cell">
                    <small>{formatTenseName(tense)}</small>
                  </div>
                  <InputCell
                    value={getCellState("subjunctive", tense + "-active", "active").value}
                    correctAnswer={getCorrectAnswer("subjunctive", tense + "-active", "active")}
                    isCorrect={isCellCorrect("subjunctive", tense + "-active", "active")}
                    isRevealed={getCellState("subjunctive", tense + "-active", "active").revealed}
                    onChange={(v) => handleCellChange("subjunctive", tense + "-active", "active", v)}
                    onReveal={() => handleCellReveal("subjunctive", tense + "-active", "active")}
                    disabled={getCellState("subjunctive", tense + "-active", "active").revealed}
                  />
                  <InputCell
                    value={getCellState("subjunctive", tense + "-passive", "passive").value}
                    correctAnswer={getCorrectAnswer("subjunctive", tense + "-passive", "passive")}
                    isCorrect={isCellCorrect("subjunctive", tense + "-passive", "passive")}
                    isRevealed={getCellState("subjunctive", tense + "-passive", "passive").revealed}
                    onChange={(v) => handleCellChange("subjunctive", tense + "-passive", "passive", v)}
                    onReveal={() => handleCellReveal("subjunctive", tense + "-passive", "passive")}
                    disabled={getCellState("subjunctive", tense + "-passive", "passive").revealed}
                  />
                </div>
              </div>
            )
          )}
        </section>
      </main>

      <footer className="footer">
        <p>
          Practice Latin verb forms • Select Person & Number above to focus on different conjugations
        </p>
      </footer>
    </div>
  );
};

function formatTenseName(tense: string): string {
  const names: { [key: string]: string } = {
    present: "Present",
    imperfect: "Imperfect",
    future: "Future",
    perfect: "Perfect",
    pluperfect: "Pluperfect",
    futurePerfect: "Future Perfect",
  };
  return names[tense] || tense;
}

export default App;
