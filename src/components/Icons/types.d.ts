import { IconProps } from '@/src/utils/types/globals'
import { Color } from '@/styles/color'

export interface IconSelect {
  select?: string
}

interface Mode {
  mode?: 'light' | 'dark' | 'none' | 'rounded' | 'circle'
  backgroundColor?: Color | 'none'
}

export type IconProps = IconProps & IconSelect
export type BoxIconProps = Mode & IconProps
