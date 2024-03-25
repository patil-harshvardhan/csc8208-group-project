const OnlineDot = () => {
  return <span className="flex w-3 h-3 me-3 bg-green-500 rounded-full"></span>;
};
const OfflineDot = () => {
  return (
    <span className="flex w-3 h-3 me-3 bg-gray-900 rounded-full dark:bg-gray-700"></span>
  );
};
export { OnlineDot, OfflineDot };
