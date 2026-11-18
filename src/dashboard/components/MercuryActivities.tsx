import { Fragment, useRef, useState } from "react";
import { DraggableChoice } from "./DraggableChoice";
import {
  coloringShapes,
  groupObjects,
  groupQuestions,
  sequenceQuestions,
  comparisonPairs,
  sortingSets,
} from "../data/mercury";
export function ColoringActivity({
  target,
  shape,
  colored,
  checked,
  toggle,
}: {
  target: number;
  shape: (typeof coloringShapes)[number];
  colored: number[];
  checked: boolean;
  toggle: (index: number) => void;
}) {
  return (
    <>
      <div className="target-number">{target}</div>
      <div
        className="star-grid"
        role="group"
        aria-label={`Chọn các ${shape.name} để tô màu`}
      >
        {Array.from({ length: 10 }, (_, index) => (
          <button
            key={index}
            type="button"
            className="star-button"
            aria-label={`${shape.name} ${index + 1}`}
            aria-pressed={colored.includes(index)}
            onClick={() => {
              if (!checked) toggle(index);
            }}
          >
            <img
              src={shape.image}
              alt=""
              width="96"
              height="96"
              draggable={false}
            />
          </button>
        ))}
      </div>
      <p id="selected-count" className="selection-count">
        Đã tô {colored.length} {shape.name}
      </p>
    </>
  );
}
export function GroupActivity({
  question,
  selection,
  checked,
  choose,
}: {
  question: number;
  selection: string | number | null;
  checked: boolean;
  choose: (value: number) => void;
}) {
  const item = groupQuestions[question];
  return (
    <>
      <div className="target-number">{item.target}</div>
      <div
        className="answer-options group-options"
        role="group"
        aria-label="Chọn một nhóm hình"
      >
        {item.counts.map((count, index) => (
          <button
            key={index}
            type="button"
            className="choice-button group-choice"
            data-count={count}
            aria-label={`Nhóm ${index + 1}: ${count} ${groupObjects[index].name}`}
            aria-pressed={selection === count}
            onClick={() => {
              if (!checked) choose(count);
            }}
          >
            <span className="group-pictures">
              {Array.from({ length: count }, (_, n) => (
                <img
                  key={n}
                  src={groupObjects[index].image}
                  alt=""
                  width="88"
                  height="88"
                  draggable={false}
                />
              ))}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
const signLabels: Record<string, string> = {
  ">": "Lớn hơn",
  "<": "Bé hơn",
  "=": "Bằng nhau",
};
export function FillActivity({
  comparison,
  question,
  selection,
  checked,
  wrong,
  slotValue,
  choose,
  submit,
  empty,
}: {
  comparison: boolean;
  question: number;
  selection: string | number | null;
  checked: boolean;
  wrong: boolean;
  slotValue: string | number | null;
  choose: (value: string | number) => void;
  submit: (value: string | number) => void;
  empty: () => void;
}) {
  const drop = useRef<HTMLButtonElement>(null);
  const [over, setOver] = useState(false);
  const sequence = sequenceQuestions[question],
    pair = comparisonPairs[question];
  const answer = sequence.start + sequence.blank;
  const values: (string | number)[] = comparison
    ? [">", "<", "="]
    : [(answer + 8) % 11, (answer + 3) % 11];
  if (!comparison)
    values.splice([0, 2, 1, 2, 0, 1, 0, 2, 1, 0][question], 0, answer);
  const prefix = comparison ? "comparison" : "sequence";
  const slot = (
    <button
      ref={drop}
      type="button"
      className={`${comparison ? "comparison-slot" : "sequence-box sequence-drop"}${over ? " is-over" : ""}${wrong ? " is-wrong" : ""}${checked ? " is-filled" : ""}`}
      disabled={checked}
      aria-label={
        checked
          ? comparison
            ? `Đã điền đúng dấu ${signLabels[String(slotValue)].toLowerCase()}`
            : `Đã điền đúng số ${slotValue}`
          : comparison
            ? "Ô trống. Chọn một dấu rồi nhấn vào đây để điền."
            : `Ô trống ở vị trí ${sequence.blank + 1}. Chọn một số rồi nhấn vào đây để điền.`
      }
      onClick={() => {
        if (selection === null) empty();
        else submit(selection);
      }}
    >
      {slotValue ?? "?"}
    </button>
  );
  return (
    <>
      <div
        className={`${prefix}-row`}
        role="group"
        aria-label={
          comparison
            ? `So sánh số ${pair[0]} và số ${pair[1]}`
            : "Dãy số tăng dần, mỗi số hơn số trước 1 đơn vị"
        }
      >
        {comparison ? (
          <>
            <span className="comparison-number">{pair[0]}</span>
            {slot}
            <span className="comparison-number">{pair[1]}</span>
          </>
        ) : (
          Array.from({ length: 5 }, (_, index) =>
            index === sequence.blank ? (
              <Fragment key={index}>{slot}</Fragment>
            ) : (
              <span key={index} className="sequence-box">
                {sequence.start + index}
              </span>
            ),
          )
        )}
      </div>
      <p className={`${prefix}-alternative`}>
        Bé cũng có thể chọn một {comparison ? "dấu" : "số"} rồi bấm vào ô trống.
      </p>
      <div
        className={`answer-options ${prefix}-options`}
        role="group"
        aria-label={
          comparison ? "Chọn dấu so sánh" : "Các số có thể kéo vào ô trống"
        }
      >
        {values.map((value) => (
          <DraggableChoice
            key={value}
            value={value}
            drop={drop}
            disabled={checked}
            selected={selection === value}
            className={comparison ? "choice-button" : "number-tile"}
            label={`${comparison ? signLabels[value] : `Số ${value}`}. Kéo vào ô trống hoặc nhấn để chọn.`}
            choose={choose}
            submit={submit}
            hover={setOver}
          />
        ))}
      </div>
    </>
  );
}
export function SortingActivity({
  question,
  ordered,
  checked,
  choose,
}: {
  question: number;
  ordered: number[];
  checked: boolean;
  choose: (value: number) => void;
}) {
  return (
    <>
      <p id="sort-answer" className="sort-answer" aria-live="polite">
        {ordered.join("  ") || "…"}
      </p>
      <div className="answer-options">
        {sortingSets[question].map((value) => (
          <button
            key={value}
            type="button"
            className="choice-button"
            aria-pressed={ordered.includes(value)}
            onClick={() => {
              if (!checked) choose(value);
            }}
          >
            {value}
          </button>
        ))}
      </div>
    </>
  );
}
export function MercuryHint({
  type,
  question,
  shape,
}: {
  type: number;
  question: number;
  shape: (typeof coloringShapes)[number];
}) {
  const [expanded, setExpanded] = useState(false);
  const comparison = type === 3,
    prefix = comparison ? "comparison" : "sequence";
  const item = sequenceQuestions[question],
    answer = item.start + item.blank,
    [a, b] = comparisonPairs[question];
  const detail = comparison
    ? a === b
      ? `Hai số đều là ${a}. Khi hai số bằng nhau, bé dùng dấu = nhé!`
      : `Số ${a} ${a < b ? "bé hơn" : "lớn hơn"} ${b}. Miệng rộng của dấu luôn quay về phía số lớn hơn nhé!`
    : item.blank === 0
      ? `Ô trống đứng ngay trước số ${item.start + 1}. Bé hãy tìm số bé hơn số đó 1 đơn vị.`
      : `Ô trống đứng ngay sau số ${answer - 1}. Bé hãy đếm thêm 1 để tìm số tiếp theo.`;
  return (
    <>
      <div className="hint-stars" aria-hidden="true">
        {type === 0
          ? Array.from({ length: 5 }, (_, i) => (
              <img
                key={i}
                className={`hint-shape${i < 3 ? " is-colored" : ""}`}
                src={shape.image}
                alt=""
                width="48"
                height="48"
              />
            ))
          : type === 1
            ? groupObjects.map((object) => (
                <img
                  key={object.name}
                  src={object.image}
                  alt=""
                  width="76"
                  height="76"
                />
              ))
            : "★ ★ ★ ☆ ☆"}
      </div>
      <div id="hint">
        {type === 0 ? (
          `Bấm vào ${shape.name} để tô màu. Bấm lại để bỏ màu. Đếm đủ số hình bằng số ở trên nhé!`
        ) : type === 1 ? (
          <ul className="group-hint-steps">
            {[
              "Đếm số hình trong từng nhóm.",
              "Chọn nhóm có số lượng bằng với số ở trên.",
              "Sau đó bấm Kiểm tra.",
            ].map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        ) : type === 2 || type === 3 ? (
          <>
            <p className={`${prefix}-hint-intro`}>
              {comparison
                ? "Bé hãy quan sát số bên trái và số bên phải rồi chọn dấu thích hợp nhé!"
                : "Bé hãy quan sát các số đứng trước và sau ô trống nhé!"}
            </p>
            <button
              type="button"
              className={`${prefix}-hint-toggle`}
              aria-expanded={expanded}
              aria-controls={`${prefix}-hint-detail`}
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? "Ẩn gợi ý ‹" : "Xem gợi ý ›"}
            </button>
            <p
              id={`${prefix}-hint-detail`}
              className={`${prefix}-hint-detail`}
              hidden={!expanded}
            >
              {detail}
            </p>
            <ul className="group-hint-steps">
              {(comparison
                ? [
                    "Chọn > nếu số bên trái lớn hơn, < nếu bé hơn, = nếu bằng nhau.",
                    "Kéo dấu thích hợp vào ô trống để biết kết quả ngay.",
                    "Bấm Xem gợi ý nếu bé cần thêm trợ giúp.",
                  ]
                : [
                    "Các số đang tăng dần, mỗi số hơn số trước 1 đơn vị.",
                    "Kéo số thích hợp vào ô trống để biết kết quả ngay.",
                    "Bấm Xem gợi ý nếu bé cần thêm trợ giúp.",
                  ]
              ).map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </>
        ) : (
          "Bấm lần lượt các số từ bé đến lớn. Bấm số đã chọn để bỏ chọn."
        )}
      </div>
    </>
  );
}
