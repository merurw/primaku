export interface IconProps {
  size?: string
  color?: string
  rotate?: string
  style?: unknown
  width?: string
  height?: string
  select?: string
  onClick?: () => void
}

export interface IBreadcrumbs {
  href: string
  label: string
  isCurrent: boolean
}
