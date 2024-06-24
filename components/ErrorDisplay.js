export default function ErrorDisplay({ message }) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error: {message}
      </div>
    );
  }