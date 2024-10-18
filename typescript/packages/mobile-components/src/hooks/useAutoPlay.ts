import { useCallback, useEffect, useRef } from 'react'

const BASE_AUTO_PLAY_INTERVAL = 1000

export interface AutoPlayProps {
  autoPlay?: boolean
  autoPlayInterval?: number
  onStart: () => void
  onStop?: () => void
}

export const useAutoPlay = ({
  autoPlay = true,
  autoPlayInterval = BASE_AUTO_PLAY_INTERVAL,
  onStart,
  onStop
}: AutoPlayProps) => {
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const stopped = useRef<boolean>(!autoPlay)

  const play = useCallback(() => {
    stopped.current = false
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      onStart()
    }, autoPlayInterval)
  }, [autoPlayInterval, onStart])

  const stop = useCallback(() => {
    clearTimeout(timer.current)
    stopped.current = true
    if (onStop) onStop()
  }, [onStop])

  useEffect(() => {
    if (autoPlay) {
      play()
    }

    return stop
  }, [autoPlay, play, stop])

  return {
    play,
    stop
  }
}
