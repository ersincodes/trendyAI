/**
 * Static background layer component
 * Renders a fixed gradient background and overlay, no props
 */
const BackgroundLayer = () => {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-900/70 backdrop-blur-sm" />
    </>
  );
};

export default BackgroundLayer;
