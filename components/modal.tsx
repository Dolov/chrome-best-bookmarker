import React, { Fragment } from "react"

const Modal: React.FC<{
  visible: boolean
  onOk?: () => void
  title?: string
  onClose?: () => void
  children: React.ReactNode
}> = (props) => {
  const { visible, onClose, onOk, children, title } = props
  const id = React.useMemo(() => "modal_" + Date.now(), [])

  React.useEffect(() => {
    const dialog = document.getElementById(id) as HTMLDialogElement
    if (visible) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [visible])

  React.useEffect(() => {
    const dialog = document.getElementById(id) as HTMLDialogElement
    dialog.addEventListener("close", handleClose)
    return () => {
      dialog.removeEventListener("close", handleClose)
    }
  }, [id])

  const handleClose = React.useCallback(() => {
    onClose && onClose()
  }, [])

  const handleConfirm = () => {
    onOk && onOk()
  }

  return (
    <dialog id={id} className="modal">
      <div className="modal-box flex flex-col">
        <h3 className="font-bold text-lg pb-4">{title}</h3>
        <div className="flex flex-col flex-1 overflow-auto">{children}</div>
        <div className="modal-action">
          <button className="btn btn-neutral mr-2" onClick={handleConfirm}>
            Confirm
          </button>
          <button className="btn" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

export default Modal
