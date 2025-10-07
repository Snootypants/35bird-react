import type { DockMenuDynamicResolver } from '../types/dockMenu'
import type { DockMenuRuntimeContext } from '../types/dockMenu'

export const createDynamicProp = <T>(resolver: (context: DockMenuRuntimeContext) => T): DockMenuDynamicResolver<T> => ({
  resolve: resolver,
})
