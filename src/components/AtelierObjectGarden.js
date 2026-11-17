export default function AtelierObjectGarden({ className = "" }) {
  return (
    <div className={`atelier-object-garden ${className}`.trim()} aria-hidden="true">
      <span className="atelier-garden-orbit atelier-garden-orbit--one" />
      <span className="atelier-garden-orbit atelier-garden-orbit--two" />
      <span className="atelier-garden-ring" />
      <span className="atelier-garden-diamond atelier-garden-diamond--large" />
      <span className="atelier-garden-diamond atelier-garden-diamond--small" />
      <span className="atelier-garden-pearl atelier-garden-pearl--one" />
      <span className="atelier-garden-pearl atelier-garden-pearl--two" />
    </div>
  );
}
