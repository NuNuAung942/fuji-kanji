/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import HanziWriter from "hanzi-writer";

interface KanjiStrokeWriterProps {
  kanji: string;
  width?: number;
  height?: number;
  strokeColor?: string;
}

const KanjiStrokeWriter = forwardRef((props: KanjiStrokeWriterProps, ref) => {
  const { kanji, width = 160, height = 160, strokeColor = "#6366f1" } = props;
  const writerRef = useRef<HTMLDivElement>(null);
  const writerInstance = useRef<any>(null);

  useEffect(() => {
    if (writerRef.current) {
      writerRef.current.innerHTML = "";
      writerInstance.current = HanziWriter.create(writerRef.current, kanji, {
        width,
        height,
        padding: 5,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 200,
        strokeColor,
        outlineColor: "#e2e8f0",
        showOutline: true,
      });
      writerInstance.current.animateCharacter();
    }
  }, [kanji, width, height, strokeColor]);

  useImperativeHandle(ref, () => ({
    replay() {
      if (writerInstance.current) {
        writerInstance.current.animateCharacter();
      }
    },
  }));

  return (
    <div
      ref={writerRef}
      className="bg-slate-50 rounded-2xl p-3 border border-slate-100 shadow-inner inline-block"
    />
  );
});

export default KanjiStrokeWriter;
