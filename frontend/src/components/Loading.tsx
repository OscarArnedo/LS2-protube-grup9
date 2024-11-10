function LoadingComponent() {
  return (
    <div className="flex items-center justify-center h-screen h-screen w-screen fixed top-0 left-0 z-50">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}

export default LoadingComponent;