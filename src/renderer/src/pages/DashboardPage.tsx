import { FC } from 'react'
import Dropdown from '../components/Dropdown'
import { NavigateButton } from '@renderer/components/NavigateButton'
import {
  RedBreathingCircle,
  YellowBreathingCircle,
  GreenBreathingCircle
} from '@renderer/components/BreathingCircle'
import { Button } from '@renderer/components/Button'
import StatusIndicator from '@renderer/components/StatusIndicator'

const DashboardPage: FC = () => {
  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">训练过程热图</h1>
        <p className="text-gray-500 mb-4">
          展示训练过程中每一步输出的概率分布演化（颜色越深代表概率越高）
        </p>
      </div>
      <Dropdown title="untitiled">
        <h1>123</h1>
        <p>456</p>
        <p>789</p>
        <p>101112</p>
      </Dropdown>

      <NavigateButton title="Button" />
      <RedBreathingCircle />
      <YellowBreathingCircle />
      <GreenBreathingCircle />
      <Button title="默认按钮" />
      <Button title="禁用按钮" lock />
      <Button title="切换按钮" toggle />
      
      <StatusIndicator status="ok" />
    </>
  )
}

export default DashboardPage
