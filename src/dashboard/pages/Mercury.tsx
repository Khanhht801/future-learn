import { useEffect, useRef, useState } from "react";
import {
  coloringShapes,
  coloringTargets,
  comparisonPairs,
  groupQuestions,
  sequenceQuestions,
  sortingSets,
  titles,
} from "../data/mercury";
import {
  ColoringActivity,
  FillActivity,
  GroupActivity,
  MercuryHint,
  SortingActivity,
} from "../components/MercuryActivities";
import { mercuryKey, readMercuryScores } from "../lib/mercury-progress";

function MissionNavigation({
  scores,
  mission,
  choose,
}: {
  scores: number[];
  mission: number;
  choose: (index: number) => void;
}) {
  return (
    <>
      {titles.map((title, index) => {
        const locked = index > 0 && scores[index - 1] < 10;
        return (
          <button
            key={title}
            type="button"
            className={`mission-button${index === mission ? " is-current" : ""}`}
            disabled={locked}
            aria-current={index === mission ? "step" : undefined}
            onClick={() => choose(index)}
          >
            <span className="mission-number">{index + 1}</span>
            <span className="mission-icon" aria-hidden="true">
              {index === 0 ? (
                <img
                  src="./assets/chibi-star.webp"
                  alt=""
                  width="36"
                  height="36"
                />
              ) : (
                ["", "💎", "🧩", "≶", "🔢", "🏆"][index]
              )}
            </span>
            <span>{title}</span>
            <span className="mission-status">
              {locked
                ? "🔒"
                : scores[index] === 10
                  ? "✓"
                  : `${scores[index]}/10`}
            </span>
          </button>
        );
      })}
    </>
  );
}
export function useMercury() {
  const [scores, setScores] = useState(readMercuryScores);
  const [mission, setMission] = useState(() =>
    Math.max(
      0,
      scores.findIndex((score) => score < 10),
    ),
  );
  const [question, setQuestion] = useState(() =>
    scores[mission] === 10 ? 0 : scores[mission],
  );
  const [selection, setSelection] = useState<string | number | null>(null),
    [colored, setColored] = useState<number[]>([]),
    [ordered, setOrdered] = useState<number[]>([]);
  const [checked, setChecked] = useState(false),
    [wrong, setWrong] = useState(false),
    [slotValue, setSlotValue] = useState<string | number | null>(null);
  const [feedback, setFeedback] = useState(""),
    [storageNote, setStorageNote] = useState(
      "Tiến độ được lưu trên trình duyệt này.",
    );
  const checkButton = useRef<HTMLButtonElement>(null),
    heading = useRef<HTMLHeadingElement>(null);
  const type = mission === 5 ? question % 5 : mission;
  const shape =
    coloringShapes[
      (mission === 5 ? Math.floor(question / 5) : question) %
        coloringShapes.length
    ];
  const target =
    type === 1 ? groupQuestions[question].target : coloringTargets[question];
  const reset = () => {
    setSelection(null);
    setColored([]);
    setOrdered([]);
    setChecked(false);
    setWrong(false);
    setSlotValue(null);
    setFeedback("");
  };
  const chooseMission = (next: number) => {
    if (next > 0 && scores[next - 1] < 10) return;
    setMission(next);
    setQuestion(scores[next] === 10 ? 0 : scores[next]);
    reset();
  };
  const accept = () => {
    if (checked) return;
    const next = scores.map((score, index) =>
      index === mission ? Math.max(score, question + 1) : score,
    );
    setScores(next);
    setChecked(true);
    setWrong(false);
    try {
      localStorage.setItem(mercuryKey, JSON.stringify(next));
    } catch {
      setStorageNote(
        "Trình duyệt chưa lưu được tiến độ. Bé vẫn có thể tiếp tục học trong lượt này.",
      );
    }
    setFeedback(
      question === 9
        ? mission === 5
          ? "Tuyệt vời! Bé đã chinh phục cả 6 nhiệm vụ Sao Thủy! 🏆"
          : "Giỏi lắm! Bé đã hoàn thành nhiệm vụ này! ★"
        : "Chính xác! Bé làm tốt lắm! ★",
    );
  };
  const choose = (value: string | number) => {
    if (checked) return;
    setSelection(value);
    setWrong(false);
    setFeedback(
      type === 2
        ? "Bấm vào ô trống để điền số đã chọn."
        : type === 3
          ? "Bấm vào ô trống để điền dấu đã chọn."
          : "",
    );
  };
  const submit = (value: string | number) => {
    if (checked) return;
    const [a, b] = comparisonPairs[question];
    const answer =
      type === 2
        ? sequenceQuestions[question].start + sequenceQuestions[question].blank
        : a < b
          ? "<"
          : a > b
            ? ">"
            : "=";
    if (value !== answer) {
      setSlotValue(type === 3 ? value : null);
      setWrong(true);
      setSelection(null);
      setFeedback(
        type === 2
          ? "Chưa đúng rồi. Bé đếm lần lượt các số và thử lại nhé!"
          : "Chưa đúng rồi. Bé so sánh hai số và thử lại nhé!",
      );
      return;
    }
    setSlotValue(value);
    setSelection(value);
    accept();
  };
  const check = () => {
    if (checked) {
      if (question === 9) {
        const next = mission < 5 ? mission + 1 : 0;
        setMission(next);
        setQuestion(mission < 5 && scores[next] < 10 ? scores[next] : 0);
      } else setQuestion((value) => value + 1);
      reset();
      return;
    }
    const correct =
      type === 0
        ? colored.length === target
        : type === 1
          ? selection === target
          : type === 4
            ? ordered.join(",") ===
              [...sortingSets[question]].sort((a, b) => a - b).join(",")
            : false;
    if (correct) accept();
    else
      setFeedback(
        selection === null && type !== 0 && type !== 4
          ? type === 1
            ? "Bé hãy chọn một nhóm hình nhé!"
            : "Bé hãy chọn một đáp án nhé!"
          : "Chưa đúng rồi. Bé xem gợi ý và thử lại nhé!",
      );
  };
  useEffect(() => {
    if (checked && (type === 2 || type === 3))
      checkButton.current?.focus({ preventScroll: true });
  }, [checked, type]);
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) heading.current?.focus();
    mounted.current = true;
  }, [mission, question]);
  const classSuffix =
    type === 1
      ? "group"
      : type === 2
        ? "sequence"
        : type === 3
          ? "comparison"
          : null;
  const title =
    type === 0
      ? `Hãy tô màu số ${shape.name} tương ứng với số:`
      : [
          "",
          "Hãy chọn nhóm có số lượng tương ứng với số:",
          "Hãy hoàn thiện dãy số:",
          "Hãy so sánh hai số:",
          "Sắp xếp các số từ bé đến lớn",
        ][type];
  const activity =
    type === 0 ? (
      <ColoringActivity
        target={target}
        shape={shape}
        colored={colored}
        checked={checked}
        toggle={(index) => {
          setColored((values) =>
            values.includes(index)
              ? values.filter((value) => value !== index)
              : [...values, index],
          );
          setFeedback("");
        }}
      />
    ) : type === 1 ? (
      <GroupActivity
        question={question}
        selection={selection}
        checked={checked}
        choose={choose}
      />
    ) : type === 2 || type === 3 ? (
      <FillActivity
        key={`${mission}-${question}`}
        comparison={type === 3}
        question={question}
        selection={selection}
        checked={checked}
        wrong={wrong}
        slotValue={slotValue}
        choose={choose}
        submit={submit}
        empty={() =>
          setFeedback(
            type === 2
              ? "Bé chọn một số rồi bấm vào ô trống nhé!"
              : "Bé chọn một dấu rồi bấm vào ô trống nhé!",
          )
        }
      />
    ) : (
      <SortingActivity
        question={question}
        ordered={ordered}
        checked={checked}
        choose={(value) => {
          setOrdered((values) =>
            values.includes(value)
              ? values.filter((item) => item !== value)
              : [...values, value],
          );
          setFeedback("");
        }}
      />
    );
  return {
    missions: (
      <MissionNavigation
        scores={scores}
        mission={mission}
        choose={chooseMission}
      />
    ),
    title,
    heading,
    missionLabel: `Nhiệm vụ ${mission + 1}/6`,
    questionCount: `Câu ${question + 1}/10`,
    instruction:
      type === 0
        ? target === 0
          ? `Số 0 nghĩa là không có ${shape.name} nào được tô màu.`
          : `Chạm vào từng ${shape.name} để tô màu nhé!`
        : type === 2
          ? "Kéo số thích hợp vào ô trống nhé!"
          : type === 3
            ? "Kéo dấu thích hợp vào ô trống nhé!"
            : type === 4
              ? "Bấm các số theo thứ tự. Bấm lại để bỏ chọn."
              : "",
    activity,
    feedback,
    checked,
    check,
    checkButton,
    checkHidden: !checked && (type === 2 || type === 3),
    checkLabel: checked
      ? question === 9
        ? mission === 5
          ? "Ôn tập từ đầu"
          : "Nhiệm vụ tiếp theo"
        : "Câu tiếp theo"
      : "Kiểm tra",
    exerciseClass: `exercise-panel${classSuffix ? ` is-${classSuffix}-exercise` : ""}`,
    hintClass: `support-panel hint-panel${classSuffix ? ` is-${classSuffix}-hint` : ""}`,
    score: scores[mission],
    progressNote:
      scores[mission] === 10
        ? "Đã hoàn thành! Bé có thể chơi lại để ôn tập."
        : "Hoàn thành 10 câu để mở khóa nhiệm vụ tiếp theo nhé!",
    journeyCount: `Đã hoàn thành ${scores.filter((score) => score === 10).length}/6 nhiệm vụ`,
    hint: (
      <MercuryHint
        key={`${mission}-${question}`}
        type={type}
        question={question}
        shape={shape}
      />
    ),
    showRobot: type >= 1 && type <= 3,
    storageNote,
  };
}
