import { useState, useEffect } from 'react'
import { SymbolIcon } from '@radix-ui/react-icons'
import {
  RedBreathingCircle,
  YellowBreathingCircle,
  GreenBreathingCircle,
} from '@renderer/components/BreathingCircle'

type Status = 'error' | 'warning' | 'ok'

type Props = {
  status: Status
}

const StatusIndicator = ({ status }: Props) => {
  const [bursting, setBursting] = useState(false)

  const handleClick = () => {
    setBursting(true)
  }

  useEffect(() => {
    if (bursting) {
      const timer = setTimeout(() => setBursting(false), 600)
      return () => clearTimeout(timer)
    }
  }, [bursting])

  const renderCircle = () => {
    switch (status) {
      case 'error':
        return <RedBreathingCircle />
      case 'warning':
        return <YellowBreathingCircle />
      case 'ok':
        return <GreenBreathingCircle />
      default:
        return null
    }
  }

  return (
    <>
      {/* 自定义动画 */}
      <style>{`
        @keyframes burst-spin {
          0%   { transform: scale(1) rotate(0deg);    opacity: 1; }
          50%   { transform: scale(1) rotate(540deg);    opacity: 1; }
          100% { transform: scale(1) rotate(1080);   opacity: 1; }
        }
      `}</style>

      <div className="flex items-center space-x-2">
        {renderCircle()}
        <div
          onClick={handleClick}
          className={`cursor-pointer transition-transform ${
            bursting ? 'animate-[burst-spin_0.6s_cubic-bezier(0.4,0,0.2,1)]' : ''
          }`}
        >
          <SymbolIcon
            className="w-2.3 h-2.3 text-dark"
          />
        </div>
      </div>
    </>
  )
}

export default StatusIndicator
