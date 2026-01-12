export default function Modal({ isOpen, title, message, children, onClose, onConfirm, confirmText = 'OK', theme = 'default', confirmDisabled = false }) {
  if (!isOpen) return null;

  // Theme classes
  const themeStyles = {
    default: {
      container: 'bg-surface-600 border-secondary-400',
      title: 'text-text-primary',
      message: 'text-text-secondary',
      button: 'bg-primary-500 hover:bg-primary-600',
    },
    success: {
      container: 'bg-semantic-success/20 border-semantic-success',
      title: 'text-text-primary',
      message: 'text-text-secondary',
      button: 'bg-semantic-success hover:bg-semantic-success/80',
    },
  };
  const styles = themeStyles[theme] || themeStyles.default;

  return (
    <div
      onClick={() => onClose && onClose()}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`rounded-lg p-4 max-w-sm w-full mx-4 border shadow-2xl ${styles.container}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className={`text-xl font-bold ${styles.title}`}>{title}</h2>
            {message && <p className={`text-sm ${styles.message}`}>{message}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="ml-4 p-1 rounded hover:bg-surface-500 text-text-secondary"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">{children}</div>

        <div className="flex justify-end gap-4 mt-2">
          {onConfirm ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={confirmDisabled}
                className={`px-4 py-2 text-white font-semibold rounded-lg transition ${styles.button} ${confirmDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className={`px-4 py-2 text-white font-semibold rounded-lg transition ${styles.button}`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
