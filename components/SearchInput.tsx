import classnames from "classnames"
import * as React from "react"
import { useImperativeHandle, useRef, useState } from "react"

export interface SearchInputRefProps {
  focus(): void
  addKeyword(value: string): void
}

export interface SearchInputProps {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  onChange?: (value: string[]) => void
  placeholder?: string
  onPressEnter?: () => void
  className?: string
}

const SearchInput: React.ForwardRefRenderFunction<
  SearchInputRefProps,
  SearchInputProps
> = (
  { prefix, suffix, placeholder, onPressEnter, onChange, className },
  ref
) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<string[]>([])
  const [focus, setFocus] = useState(false)
  const [inputValue, setInputValue] = useState("")

  // Expose focus and addKeyword to parent component via ref
  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus()
    },
    addKeyword(keyword) {
      if (!value.includes(keyword)) {
        setValue((prev) => [...prev, keyword])
        onChange?.([...value, keyword])
      }
    }
  }))

  // Input change handler
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value
    setInputValue(newInputValue)
  }

  // Add or remove keyword when pressing Enter
  const handleEnterEvent = (inputValue: string) => {
    if (!inputValue.trim()) return
    const newValue = value.includes(inputValue)
      ? value.filter((item) => item !== inputValue)
      : [...value, inputValue]
    setValue(newValue)
    onChange?.(newValue)
    setInputValue("") // Reset input after action
  }

  // Delete the last keyword when pressing Backspace
  const handleDeleteEvent = () => {
    if (!inputValue) {
      const newValue = value.slice(0, -1)
      setValue(newValue)
      onChange?.(newValue)
    }
  }

  // Handle focus and blur events
  const onFocus = () => setFocus(true)
  const onBlur = () => {
    setFocus(false)
    handleEnterEvent(inputValue) // Save changes when losing focus
  }

  // Handle container click to focus input
  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  // Delete a specific keyword
  const deleteItem = (itemValue: string) => {
    const newValue = value.filter((item) => item !== itemValue)
    setValue(newValue)
    onChange?.(newValue)
  }

  // Edit a keyword
  const editItem = (itemValue: string) => {
    setValue(value.filter((item) => item !== itemValue))
    setInputValue(itemValue) // Set the item to input for editing
  }

  return (
    <div
      onClick={handleContainerClick}
      className={classnames("flex", className)}>
      <div className="mr-1 flex items-center">{prefix}</div>
      <div className="flex flex-1">
        <div className="flex">
          {value.map((item) => (
            <div
              key={item}
              className="pr-2 pl-3 my-1 mr-1 bg-[#0000000f] rounded-[12px] flex justify-center items-center text-nowrap">
              <span
                onClick={() => editItem(item)}
                className="max-w-[200px] ellipsis">
                {item}
              </span>
              <button onClick={() => deleteItem(item)}>✕</button>
            </div>
          ))}
        </div>
        <input
          autoFocus
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={onInputChange}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleEnterEvent(inputValue)
              onPressEnter?.()
            }
            if (e.key === "Backspace") {
              handleDeleteEvent()
            }
          }}
          placeholder={placeholder}
          className="border-none outline-none text-[14px] w-full"
        />
      </div>
      {suffix}
    </div>
  )
}

export default React.forwardRef(SearchInput)
