export default function Modal({ isOpen, title, message, onClose, onConfirm, confirmText = 'OK', theme = 'default' }) {
  if (!isOpen) return null;

  // Theme classes
  const themeStyles = {
    default: {
      container: 'bg-gray-800 border-purple-500',
      title: 'text-white',
      message: 'text-gray-300',
      button: 'bg-purple-600 hover:bg-purple-700',
    },
    success: {
      container: 'bg-green-700 border-green-500',
      title: 'text-white',
      message: 'text-green-100',
      button: 'bg-green-600 hover:bg-green-700',
    },
  };
  const styles = themeStyles[theme] || themeStyles.default;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-lg p-6 max-w-sm w-full mx-4 border shadow-2xl ${styles.container}`}>
        <h2 className={`text-2xl font-bold mb-4 ${styles.title}`}>{title}</h2>
        <p className={`mb-6 ${styles.message}`}>{message}</p>
        <div className="flex gap-4">
          {onConfirm ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-2 text-white font-bold rounded-lg transition ${styles.button}`}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className={`w-full py-2 text-white font-bold rounded-lg transition ${styles.button}`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
