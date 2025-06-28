import { useState } from 'react'
import type { FC } from 'react'

interface ButtonProps {
  title: string
  lock?: boolean      // 锁定：灰色 + 不可点击 + 条纹
  toggle?: boolean    // 是否支持按下切换状态
}

export const Button: FC<ButtonProps> = ({ title, lock = false, toggle = false }) => {
  const [pressed, setPressed] = useState(false)

  const handleClick = () => {
    if (lock) return
    if (toggle) setPressed(prev => !prev)
  }

  const base =
    'box-border w-28 h-12 text-center font-bold text-sm transition-all duration-200 border-2'

  const normal =
    'text-white bg-secondary border-secondary hover:bg-transparent hover:text-secondary hover:border-secondary active:bg-transparent active:text-primary active:border-primary'

  const locked =
    'text-white bg-gray-400 border-gray-400 cursor-not-allowed bg-[repeating-linear-gradient(45deg,_#ccc_0,_#ccc_10px,_#bbb_10px,_#bbb_20px)] bg-opacity-30'

  const pressedStyle = 'text-primary bg-transparent border-primary'

  const finalClassName =
    base +
    ' ' +
    (lock
      ? locked
      : toggle && pressed
        ? pressedStyle
        : normal)

  return (
    <button
      className={finalClassName}
      onClick={handleClick}
      disabled={lock}
    >
      {title}
    </button>
  )
}
