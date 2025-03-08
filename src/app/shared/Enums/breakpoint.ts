export enum Breakpoint {
  XS = '395px',
  S = '480px',
  M = '768px',
  L = '1024px',
  XL = '1200px'
}

export enum MediaQuery {
  XS = `@media (width >= ${Breakpoint.XS})`,
  S = `@media (width >= ${Breakpoint.S})`,
  M = `@media (width >= ${Breakpoint.M})`,
  L = `@media (width >= ${Breakpoint.L})`,
  XL = `@media (width >= ${Breakpoint.XL})`
}

