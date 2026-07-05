import "./MotionFrame.css";

export default function MotionFrame() {
  return (
    <div className="motion-frame" aria-hidden="true">
      <span className="motion-frame__line motion-frame__line--top" />
      <span className="motion-frame__line motion-frame__line--right" />
      <span className="motion-frame__line motion-frame__line--bottom" />
      <span className="motion-frame__line motion-frame__line--left" />

      <span className="motion-frame__corner motion-frame__corner--tl" />
      <span className="motion-frame__corner motion-frame__corner--tr" />
      <span className="motion-frame__corner motion-frame__corner--br" />
      <span className="motion-frame__corner motion-frame__corner--bl" />

      <span className="motion-frame__scan" />
      <span className="motion-frame__pulse motion-frame__pulse--one" />
      <span className="motion-frame__pulse motion-frame__pulse--two" />
    </div>
  );
}
