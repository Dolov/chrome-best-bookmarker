import React, { Fragment } from "react"

export interface ModalProps {
  width?: number | string
  visible: boolean
  onOk?: () => void
  title?: string
  onClose?: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = (props) => {
  const { visible, onClose, onOk, children, title, width } = props
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
      <div
        style={{ width, maxWidth: width }}
        className="modal-box flex flex-col">
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

/**
 * HOC to control the visibility of a component
 * @param WrappedComponent - The component to be wrapped
 */
function withVisibility<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  return function (props: T & ModalProps) {
    const { visible } = props

    const rendered = React.useRef(visible)

    React.useEffect(() => {
      if (visible) {
        rendered.current = true
      }
    }, [visible])

    if (!visible && !rendered.current) {
      return null
    }

    if (visible) {
      return <WrappedComponent {...props} />
    }

    return <WrappedComponent {...props} />
  }
}

export default withVisibility(Modal)
