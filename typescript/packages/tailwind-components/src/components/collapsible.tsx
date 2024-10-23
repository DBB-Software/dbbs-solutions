'use client'

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'

const Collapsible = CollapsiblePrimitive.Root
// @ts-expect-error overrides bundled name of the function from package. Required for storybook.
Collapsible.name = CollapsiblePrimitive.Root.displayName

const { CollapsibleTrigger } = CollapsiblePrimitive

const { CollapsibleContent } = CollapsiblePrimitive

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
